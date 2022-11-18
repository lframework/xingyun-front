<template>
  <a-modal v-model="visible" :mask-closable="false" width="80%" :dialog-style="{ top: '20px' }" title="字典值管理" :footer="null">
    <div v-if="visible" v-permission="['system.dic:query']">
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
            </j-form>
          </j-border>
        </template>
        <!-- 工具栏 -->
        <template v-slot:toolbar_buttons>
          <a-space>
            <a-button type="primary" icon="search" @click="search">查询</a-button>
            <a-button v-permission="['system.dic-item:add']" type="primary" icon="plus" @click="$refs.addDialog.openDialog()">新增</a-button>
          </a-space>
        </template>

        <!-- 操作 列自定义内容 -->
        <template v-slot:action_default="{ row }">
          <a-button v-permission="['system.dic-item:modify']" type="link" @click="e => { id = row.id;$nextTick(() => $refs.updateDialog.openDialog()) }">修改</a-button>
          <a-button v-permission="['system.dic-item:delete']" type="link" class="ant-btn-link-danger" @click="deleteRow(row)">删除</a-button>
        </template>
      </vxe-grid>

      <!-- 新增窗口 -->
      <add ref="addDialog" :dic-id="dicId" @confirm="search" />

      <!-- 修改窗口 -->
      <modify ref="updateDialog" :item-id="id" @confirm="search" />
    </div>
  </a-modal>
</template>
<script>
import Add from './add'
import Modify from './modify'

export default {
  components: {
    Modify,
    Add
  },
  props: {
    dicId: {
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
        name: ''
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
        { type: 'seq', width: 40 },
        { field: 'code', title: '编号', width: 120 },
        { field: 'name', title: '名称', minWidth: 160 },
        { field: 'orderNo', title: '排序', width: 80, align: 'right' },
        { title: '操作', width: 120, fixed: 'right', slots: { default: 'action_default' }}
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
            return this.$api.system.dic.queryItem(this.buildQueryParams(page))
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

      this.$nextTick(() => this.open())
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
      return Object.assign({ dicId: this.dicId }, this.searchFormData)
    },
    // 页面显示时触发
    open() {
    },
    deleteRow(row) {
      this.$msg.confirm('是否确认删除此数据字典值？').then(() => {
        this.$api.system.dic.removeItem(row.id).then(() => {
          this.$msg.success('删除成功！')
          this.search()
        })
      })
    }
  }
}
</script>
