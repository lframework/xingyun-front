<template>
  <div v-permission="['base-data:product:saleprop-group:query']" class="app-container">

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
      :max-height="$defaultTableHeight"
    >
      <template v-slot:form>
        <j-border>
          <j-form label-width="120px">
            <j-form-item label="编号" :span="6">
              <el-input v-model="searchFormData.code" clearable />
            </j-form-item>
            <j-form-item label="名称" :span="6">
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
          <el-form-item v-permission="['base-data:product:saleprop-group:add']">
            <el-button type="primary" icon="el-icon-plus" @click="$refs.addDialog.openDialog()">新增</el-button>
          </el-form-item>
          <el-form-item v-permission="['base-data:product:saleprop-group:modify']">
            <el-dropdown trigger="click" @command="handleCommand">
              <el-button>
                更多<i class="el-icon-more el-icon--right" />
              </el-button>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="batchEnable"><i class="el-icon-check" />批量启用</el-dropdown-item>
                <el-dropdown-item command="batchUnable"><i class="el-icon-s-release" />批量停用</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </el-form-item>
        </el-form>
      </template>

      <!-- 状态 列自定义内容 -->
      <template v-slot:available_default="{ row }">
        <available-tag :available="row.available" />
      </template>

      <!-- 操作 列自定义内容 -->
      <template v-slot:action_default="{ row }">
        <el-button v-permission="['base-data:product:saleprop-item:query']" type="text" icon="el-icon-setting" @click="e => { id = row.id;$refs.itemDialog.openDialog() }">销售属性管理</el-button>
        <el-button v-permission="['base-data:product:saleprop-group:modify']" type="text" icon="el-icon-edit" @click="e => { id = row.id;$refs.updateDialog.openDialog() }">修改</el-button>
      </template>
    </vxe-grid>

    <!-- 新增窗口 -->
    <add ref="addDialog" @confirm="search" />

    <!-- 修改窗口 -->
    <modify :id="id" ref="updateDialog" @confirm="search" />

    <!-- 销售属性窗口 -->
    <item ref="itemDialog" :group-id="id" />
  </div>
</template>

<script>
import AvailableTag from '@/components/Tag/Available'
import Add from './add'
import Modify from './modify'
import Item from './item/index'

export default {
  name: 'ProductSalePropGroup',
  components: {
    Add, Modify, Item, AvailableTag
  },
  data() {
    return {
      loading: false,
      // 当前行数据
      id: '',
      ids: [],
      // 查询列表的查询条件
      searchFormData: {
        code: '',
        name: '',
        available: this.$enums.AVAILABLE.ENABLE.code
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
        { field: 'code', title: '编号', width: 120 },
        { field: 'name', title: '名称', minWidth: 160 },
        { field: 'available', title: '状态', width: 80, slots: { default: 'available_default' }},
        { field: 'description', title: '备注', minWidth: 160 },
        { title: '操作', width: 210, fixed: 'right', slots: { default: 'action_default' }}
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
            return this.$api.baseData.product.salePropGroup.query(this.buildQueryParams(page))
          }
        }
      }
    }
  },
  created() {
  },
  methods: {
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
      return Object.assign({ }, this.searchFormData)
    },
    handleCommand(command) {
      if (command === 'batchEnable') {
        this.batchEnable()
      } else if (command === 'batchUnable') {
        this.batchUnable()
      }
    },
    // 批量停用
    batchUnable() {
      const records = this.$refs.grid.getCheckboxRecords()

      if (this.$utils.isEmpty(records)) {
        this.$msg.error('请选择要停用的销售属性组！')
        return
      }

      this.$msg.confirm('是否确定停用选择的销售属性组？').then(() => {
        this.loading = true
        const ids = records.map(t => t.id)
        this.$api.baseData.product.salePropGroup.batchUnable(ids).then(data => {
          this.$msg.success('停用成功！')
          this.search()
        }).finally(() => {
          this.loading = false
        })
      })
    },
    // 批量启用
    batchEnable() {
      const records = this.$refs.grid.getCheckboxRecords()

      if (this.$utils.isEmpty(records)) {
        this.$msg.error('请选择要启用的销售属性组！')
        return
      }

      this.$msg.confirm('是否确定启用选择的销售属性组？').then(() => {
        this.loading = true
        const ids = records.map(t => t.id)
        this.$api.baseData.product.salePropGroup.batchEnable(ids).then(data => {
          this.$msg.success('启用成功！')
          this.search()
        }).finally(() => {
          this.loading = false
        })
      })
    }
  }
}
</script>
<style scoped>
</style>
