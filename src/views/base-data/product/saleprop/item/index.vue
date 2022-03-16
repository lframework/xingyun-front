<template>
  <a-modal v-model="visible" :mask-closable="false" width="80%" title="销售属性管理" :dialog-style="{ top: '20px' }" :footer="null">
    <div v-if="visible" v-permission="['base-data:product:saleprop-item:query']">
      <!-- 数据列表 -->
      <vxe-grid
        ref="grid"
        resizable
        show-overflow
        highlight-hover-row
        keep-source
        row-id="id"
        :proxy-config="proxyConfig"
        :columns="tableColumn"
        :toolbar-config="toolbarConfig"
        :pager-config="{}"
        :loading="loading"
      >
        <template v-slot:form>
          <j-border>
            <j-form label-width="80px" @collapse="$refs.grid.refreshColumn()">
              <j-form-item label="编号">
                <a-input v-model="searchFormData.code" allow-clear />
              </j-form-item>
              <j-form-item label="名称">
                <a-input v-model="searchFormData.name" allow-clear />
              </j-form-item>
              <j-form-item label="状态">
                <a-select v-model="searchFormData.available" placeholder="全部" allow-clear>
                  <a-select-option v-for="item in $enums.AVAILABLE.values()" :key="item.code" :value="item.code">{{ item.desc }}</a-select-option>
                </a-select>
              </j-form-item>
            </j-form>
          </j-border>
        </template>
        <!-- 工具栏 -->
        <template v-slot:toolbar_buttons>
          <a-space>
            <a-button type="primary" icon="search" @click="search">查询</a-button>
            <a-button v-permission="['base-data:product:saleprop-item:add']" type="primary" icon="plus" @click="$refs.addDialog.openDialog()">新增</a-button>
          </a-space>
        </template>

        <!-- 状态 列自定义内容 -->
        <template v-slot:available_default="{ row }">
          <available-tag :available="row.available" />
        </template>

        <!-- 操作 列自定义内容 -->
        <template v-slot:action_default="{ row }">
          <a-button v-permission="['base-data:product:saleprop-item:modify']" type="link" @click="e => { id = row.id;$nextTick(() => $refs.updateDialog.openDialog()) }">修改</a-button>
        </template>
      </vxe-grid>

      <!-- 新增窗口 -->
      <add ref="addDialog" :group-id="groupId" @confirm="search" />

      <!-- 修改窗口 -->
      <modify ref="updateDialog" :group-id="groupId" :item-id="id" @confirm="search" />
    </div>
  </a-modal>
</template>
<script>
import AvailableTag from '@/components/Tag/Available'
import Add from './add'
import Modify from './modify'

export default {
  components: {
    Modify,
    AvailableTag, Add
  },
  props: {
    groupId: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      // 是否可见
      visible: false,
      // 是否显示加载框
      loading: false,
      id: '',
      // 查询列表的查询条件
      searchFormData: {
        code: '',
        name: '',
        available: this.$enums.AVAILABLE.ENABLE.code
      },
      // 工具栏配置
      toolbarConfig: {
        // 自定义左侧工具栏
        slots: {
          buttons: 'toolbar_buttons'
        }
      },
      // 列表数据配置
      tableColumn: [
        { type: 'checkbox', width: 40 },
        { field: 'code', title: '编号', width: 120 },
        { field: 'name', title: '名称', minWidth: 160 },
        { field: 'available', title: '状态', width: 80, slots: { default: 'available_default' }},
        { field: 'description', title: '备注', minWidth: 160 },
        { title: '操作', width: 70, fixed: 'right', slots: { default: 'action_default' }}
      ],
      // 请求接口配置
      proxyConfig: {
        props: {
          // 响应结果列表字段
          result: 'datas',
          // 响应结果总条数字段
          total: 'totalCount'
        },
        ajax: {
          // 查询接口
          query: ({ page, sorts, filters }) => {
            return this.$api.baseData.product.salePropItem.query(this.buildQueryParams(page))
          }
        }
      }
    }
  },
  computed: {
  },
  created() {
  },
  methods: {
    // 打开对话框 由父页面触发
    openDialog() {
      this.visible = true

      this.open()
    },
    // 关闭对话框
    closeDialog() {
      this.visible = false
      this.$emit('close')
    },
    // 列表发生查询时的事件
    search() {
      this.$refs.grid.commitProxy('reload')
    },
    // 查询前构建查询参数结构
    buildQueryParams(page) {
      return Object.assign({
        pageIndex: page.currentPage,
        pageSize: page.pageSize
      }, this.buildSearchFormData())
    },
    // 查询前构建具体的查询参数
    buildSearchFormData() {
      return Object.assign({ groupId: this.groupId }, this.searchFormData)
    },
    // 页面显示时触发
    open() {
    }
  }
}
</script>
