<template>
  <el-dialog :visible.sync="visible" :close-on-click-modal="false" :append-to-body="true" :modal="false" width="80%" title="销售属性管理" top="5vh" @open="open">
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
        :pager-config="pagerConfig"
        :loading="loading"
      >
        <template v-slot:form>
          <j-border>
            <j-form>
              <j-form-item label="销售属性编号" :span="6">
                <el-input v-model="searchFormData.code" clearable />
              </j-form-item>
              <j-form-item label="销售属性名称" :span="6">
                <el-input v-model="searchFormData.name" clearable />
              </j-form-item>
              <j-form-item label="状态" :span="6">
                <el-select v-model="searchFormData.available" placeholder="全部" clearable>
                  <el-option v-for="item in $enums.AVAILABLE.values()" :key="item.code" :label="item.desc" :value="item.code" />
                </el-select>
              </j-form-item>
            </j-form>
          </j-border>
        </template>
        <!-- 工具栏 -->
        <template v-slot:toolbar_buttons>
          <el-form :inline="true">
            <el-form-item>
              <el-button type="primary" icon="el-icon-search" @click="search">搜索</el-button>
            </el-form-item>
            <el-form-item v-permission="['base-data:product:saleprop-item:add']">
              <el-button type="primary" icon="el-icon-plus" @click="$refs.addDialog.openDialog()">新增</el-button>
            </el-form-item>
          </el-form>
        </template>

        <!-- 状态 列自定义内容 -->
        <template v-slot:available_default="{ row }">
          <available-tag :available="row.available" />
        </template>

        <!-- 操作 列自定义内容 -->
        <template v-slot:action_default="{ row }">
          <el-button v-permission="['base-data:product:saleprop-item:modify']" type="text" icon="el-icon-edit" @click="e => { id = row.id;$refs.updateDialog.openDialog() }">修改</el-button>
        </template>
      </vxe-grid>

      <!-- 新增窗口 -->
      <add ref="addDialog" :group-id="groupId" @confirm="search" />

      <!-- 修改窗口 -->
      <modify ref="updateDialog" :group-id="groupId" :item-id="id" @confirm="search" />
    </div>
  </el-dialog>
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
        available: true
      },
      // 分页配置
      pagerConfig: {
        // 默认每页条数
        pageSize: 20,
        // 可选每页条数
        pageSizes: [5, 15, 20, 50, 100, 200, 500, 1000]
      },
      // 工具栏配置
      toolbarConfig: {
        // 右侧是否显示刷新按钮
        refresh: true,
        // 自定义左侧工具栏
        slots: {
          buttons: 'toolbar_buttons'
        }
      },
      // 列表数据配置
      tableColumn: [
        { type: 'checkbox', width: 40 },
        { field: 'code', title: '销售属性编号', width: 120 },
        { field: 'name', title: '销售属性名称', minWidth: 160 },
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
