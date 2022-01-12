<template>
  <div>
    <div v-show="visible" class="app-container">
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
          <el-form :model="searchFormData" label-width="60px" :inline="true">
            <el-form-item label="编号">
              <el-input v-model="searchFormData.code" clearable />
            </el-form-item>
            <el-form-item label="名称">
              <el-input v-model="searchFormData.name" clearable />
            </el-form-item>
            <el-form-item label="类型">
              <el-select v-model="searchFormData.type" placeholder="全部" clearable>
                <el-option v-for="item in $enums.DATAOBJECT_TYPE.values()" :key="item.code" :label="item.desc" :value="item.code" />
              </el-select>
            </el-form-item>
            <el-form-item label="状态">
              <el-select v-model="searchFormData.available" placeholder="全部" clearable>
                <el-option v-for="item in $enums.AVAILABLE.values()" :key="item.code" :label="item.desc" :value="item.code" />
              </el-select>
            </el-form-item>
          </el-form>
        </template>
        <!-- 工具栏 -->
        <template v-slot:toolbar_buttons>
          <el-form :inline="true">
            <el-form-item>
              <el-button type="primary" icon="el-icon-search" @click="search">搜索</el-button>
            </el-form-item>
            <el-form-item v-permission="['development:data:add']">
              <el-button type="primary" icon="el-icon-plus" @click="addDialogVisible = true">新增</el-button>
            </el-form-item>
            <el-form-item v-permission="['development:data:delete']">
              <el-button icon="el-icon-delete" @click="batchDelete">批量删除</el-button>
            </el-form-item>
            <el-form-item v-permission="['system:menu:modify']">
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
          <el-button v-permission="['system:menu:query']" type="text" icon="el-icon-view" @click="e => { currentRow = row;viewDialogVisible = true }">查看</el-button>
          <el-button v-permission="['system:menu:modify']" type="text" icon="el-icon-edit" @click="e => { currentRow = row;updateDialogVisible = true }">修改</el-button>
          <el-button v-if="!row.hasColumns" v-permission="['system:menu:modify']" type="text" icon="el-icon-setting" @click="e => { currentRow = row;settingsDialogVisible = true }">设置</el-button>
          <el-button v-if="row.hasColumns" v-permission="['system:menu:modify']" type="text" icon="el-icon-setting" @click="e => { currentRow = row;visible=false;$nextTick(() => $refs.generateDialog.openDialog()) }">生成</el-button>
          <el-button v-if="row.hasColumns" v-permission="['system:menu:modify']" type="text" icon="el-icon-setting" @click="e => { currentRow = row;visible=false;$nextTick(() => $refs.previewDialog.openDialog()) }">预览</el-button>
          <el-button v-permission="['system:menu:delete']" type="text" icon="el-icon-delete" @click="e => { deleteRow(row) }">删除</el-button>
        </template>
      </vxe-grid>

      <!-- 新增窗口 -->
      <el-dialog :visible.sync="addDialogVisible" :close-on-click-modal="false" width="30%" title="新增" top="5vh">
        <template v-slot>
          <add @confirm="e => {addDialogVisible = false;search()}" @close="addDialogVisible = false" />
        </template>
      </el-dialog>

      <!-- 修改窗口 -->
      <el-dialog :visible.sync="updateDialogVisible" :close-on-click-modal="false" width="30%" title="修改" top="5vh" @open="$nextTick(() => $refs.updateDialog.open())">
        <template v-slot>
          <modify :id="currentRow.id || ''" ref="updateDialog" @confirm="e => {updateDialogVisible = false;search()}" @close="updateDialogVisible = false" />
        </template>
      </el-dialog>

      <!-- 查看窗口 -->
      <el-dialog :visible.sync="viewDialogVisible" :close-on-click-modal="false" width="30%" title="查看" top="5vh" @open="$nextTick(() => $refs.viewDialog.open())">
        <template v-slot>
          <detail :id="currentRow.id || ''" ref="viewDialog" @confirm="e => viewDialogVisible = false" @close="viewDialogVisible = false" />
        </template>
      </el-dialog>

      <!-- 设置窗口 -->
      <el-dialog :visible.sync="settingsDialogVisible" :close-on-click-modal="false" width="30%" title="设置" top="5vh" @open="$nextTick(() => $refs.settingsDialog.open())">
        <template v-slot>
          <settings :id="currentRow.id || ''" ref="settingsDialog" :type="currentRow.type" @confirm="e => {settingsDialogVisible = false;search()}" @close="settingsDialogVisible = false" />
        </template>
      </el-dialog>
    </div>
    <generate :id="currentRow.id || ''" ref="generateDialog" @confirm="search" @close="visible = true" />
    <preview :id="currentRow.id || ''" ref="previewDialog" @close="visible = true" />
  </div>
</template>

<script>
import AvailableTag from '@/components/Tag/Available'
import Add from './add'
import Modify from './modify'
import Detail from './detail'
import Settings from './settings'
import Generate from './generate'
import Preview from './preview'

export default {
  name: 'DataObject',
  // 使用组件
  components: {
    AvailableTag, Add, Modify, Detail, Settings, Generate, Preview
  },
  data() {
    return {
      // 当前行数据
      currentRow: {},
      // 是否显示加载框
      loading: false,
      visible: true,
      // 是否显示新增窗口
      addDialogVisible: false,
      // 是否显示修改窗口
      updateDialogVisible: false,
      // 是否显示详情窗口
      viewDialogVisible: false,
      // 是否显示设置窗口
      settingsDialogVisible: false,
      // 查询列表的查询条件
      searchFormData: {},
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
        { field: 'code', title: '编号', width: 100 },
        { field: 'name', title: '名称', minWidth: 180 },
        { field: 'type', title: '类型', width: 100, formatter: ({ cellValue }) => { return this.$enums.DATAOBJECT_TYPE.getDesc(cellValue) } },
        { field: 'available', title: '状态', width: 80, slots: { default: 'available_default' }},
        { field: 'description', title: '备注', minWidth: 200 },
        { field: 'createBy', title: '创建人', width: 100 },
        { field: 'createTime', title: '创建时间', width: 150 },
        { field: 'updateBy', title: '修改人', width: 100 },
        { field: 'updateTime', title: '修改时间', width: 150 },
        { title: '操作', width: 270, fixed: 'right', slots: { default: 'action_default' }}
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
            return this.$api.development.data.query(this.buildQueryParams(page))
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
        this.$msg.error('请选择要停用的数据对象！')
        return
      }

      this.$msg.confirm('是否确定停用选择的数据对象？').then(() => {
        this.loading = true
        const ids = records.map(t => t.id)
        this.$api.development.data.batchUnable(ids).then(data => {
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
        this.$msg.error('请选择要启用的数据对象！')
        return
      }

      this.$msg.confirm('是否确定启用选择的数据对象？').then(() => {
        this.loading = true
        const ids = records.map(t => t.id)
        this.$api.development.data.batchEnable(ids).then(data => {
          this.$msg.success('启用成功！')
          this.search()
        }).finally(() => {
          this.loading = false
        })
      })
    },
    // 删除
    deleteRow(row) {
      this.$msg.confirm('是否确定删除该数据对象？').then(() => {
        this.loading = true
        this.$api.development.data.deleteById(row.id).then(() => {
          this.$msg.success('删除成功！')
          this.search()
        }).finally(() => {
          this.loading = false
        })
      })
    },
    // 批量删除
    batchDelete() {
      const records = this.$refs.grid.getCheckboxRecords()

      if (this.$utils.isEmpty(records)) {
        this.$msg.error('请选择要删除的数据对象！')
        return
      }

      this.$msg.confirm('是否确定删除选择的数据对象？').then(() => {
        this.loading = true
        const ids = records.map(t => t.id)
        this.$api.development.data.batchDelete(ids).then(data => {
          this.$msg.success('删除成功！')
          this.search()
        }).finally(() => {
          this.loading = false
        })
      })
    }
  }
}
</script>
