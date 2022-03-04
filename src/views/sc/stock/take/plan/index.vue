<template>
  <div>
    <div v-permission="['stock:take:plan:query']" class="app-container">
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
        :height="$defaultTableHeight"
      >
        <template v-slot:form>
          <j-border>
            <j-form label-width="80px" @collapse="$refs.grid.refreshColumn()">
              <j-form-item label="业务单据号">
                <el-input v-model="searchFormData.code" clearable />
              </j-form-item>
              <j-form-item label="仓库">
                <store-center-selector
                  v-model="searchFormData.sc"
                />
              </j-form-item>
              <j-form-item label="盘点状态">
                <el-select v-model="searchFormData.takeStatus" placeholder="全部" clearable>
                  <el-option v-for="item in $enums.TAKE_STOCK_PLAN_STATUS.values()" :key="item.code" :label="item.desc" :value="item.code" />
                </el-select>
              </j-form-item>

              <j-form-item label="创建日期" :content-nest="false">
                <el-date-picker
                  v-model="searchFormData.createTimeStart"
                  type="date"
                  value-format="yyyy-MM-dd 00:00:00"
                />
                <span class="date-split">至</span>
                <el-date-picker
                  v-model="searchFormData.createTimeEnd"
                  type="date"
                  value-format="yyyy-MM-dd 23:59:59"
                />
              </j-form-item>

              <j-form-item label="创建人">
                <user-selector
                  v-model="searchFormData.createBy"
                />
              </j-form-item>

              <j-form-item label="操作日期" :content-nest="false">
                <el-date-picker
                  v-model="searchFormData.updateTimeStart"
                  type="date"
                  value-format="yyyy-MM-dd 00:00:00"
                />
                <span class="date-split">至</span>
                <el-date-picker
                  v-model="searchFormData.updateTimeEnd"
                  type="date"
                  value-format="yyyy-MM-dd 23:59:59"
                />
              </j-form-item>

              <j-form-item label="操作人">
                <user-selector
                  v-model="searchFormData.updateBy"
                />
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
            <el-form-item v-permission="['stock:take:plan:add']">
              <el-button type="primary" icon="el-icon-plus" @click="$refs.addDialog.openDialog()">新增</el-button>
            </el-form-item>
            <el-form-item v-permission="['stock:take:plan:export']">
              <el-button icon="el-icon-download" @click="exportList">导出</el-button>
            </el-form-item>
          </el-form>
        </template>

        <!-- 操作 列自定义内容 -->
        <template v-slot:action_default="{ row }">
          <el-button v-permission="['stock:take:plan:query']" type="text" icon="el-icon-view" @click="e => { id = row.id;$refs.viewDialog.openDialog() }">查看</el-button>
          <el-button v-if="$enums.TAKE_STOCK_PLAN_STATUS.CREATED.equalsCode(row.takeStatus)" v-permission="['stock:take:plan:create-diff']" type="text" icon="el-icon-s-check" @click="e => { id = row.id;$refs.diffDialog.openDialog() }">差异生成</el-button>
          <el-button v-if="$enums.TAKE_STOCK_PLAN_STATUS.DIFF_CREATED.equalsCode(row.takeStatus)" v-permission="['stock:take:plan:handle-diff']" type="text" icon="el-icon-s-check" @click="e => { id = row.id;$refs.handleDialog.openDialog() }">差异处理</el-button>
          <el-button v-if="$enums.TAKE_STOCK_PLAN_STATUS.CREATED.equalsCode(row.takeStatus) || $enums.TAKE_STOCK_PLAN_STATUS.DIFF_CREATED.equalsCode(row.takeStatus)" v-permission="['stock:take:plan:cancel']" type="text" icon="el-icon-circle-close" @click="e => { cancelRow(row) }">作废</el-button>
          <el-button v-if="$enums.TAKE_STOCK_PLAN_STATUS.CANCELED.equalsCode(row.takeStatus)" v-permission="['stock:take:plan:delete']" type="text" icon="el-icon-delete" @click="e => { deleteRow(row) }">删除</el-button>
        </template>
      </vxe-grid>
    </div>
    <!-- 新增窗口 -->
    <add ref="addDialog" @confirm="search" />

    <!-- 差异生成窗口 -->
    <diff :id="id" ref="diffDialog" @confirm="search" />

    <!-- 差异处理窗口 -->
    <handle :id="id" ref="handleDialog" @confirm="search" />

    <!-- 查看窗口 -->
    <detail :id="id" ref="viewDialog" />

  </div>
</template>

<script>
import Add from './add'
import Diff from './diff'
import Handle from './handle'
import Detail from './detail'
import moment from 'moment'
import StoreCenterSelector from '@/components/Selector/StoreCenterSelector'
import UserSelector from '@/components/Selector/UserSelector'

export default {
  name: 'TakeStockPlan',
  components: {
    Add, Diff, Handle, Detail, StoreCenterSelector, UserSelector
  },
  data() {
    return {
      loading: false,
      // 当前行数据
      id: '',
      // 查询列表的查询条件
      searchFormData: {
        code: '',
        sc: {},
        takeStatus: '',
        createBy: {},
        createTimeStart: this.$utils.formatDateTime(this.$utils.getDateTimeWithMinTime(moment().subtract(1, 'M'))),
        createTimeEnd: this.$utils.formatDateTime(this.$utils.getDateTimeWithMaxTime(moment())),
        updateBy: {},
        updateTimeStart: '',
        updateTimeEnd: ''
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
        { field: 'code', title: '业务单据号', width: 180 },
        { field: 'scCode', title: '仓库编号', width: 100 },
        { field: 'scName', title: '仓库名称', width: 120 },
        { field: 'takeType', title: '盘点类别', width: 100, formatter: ({ cellValue }) => { return this.$enums.TAKE_STOCK_PLAN_TYPE.getDesc(cellValue) } },
        { field: 'bizName', title: '盘点内容', width: 120 },
        { field: 'takeStatus', title: '盘点状态', width: 120, formatter: ({ cellValue }) => { return this.$enums.TAKE_STOCK_PLAN_STATUS.getDesc(cellValue) } },
        { field: 'createTime', title: '创建时间', width: 170 },
        { field: 'createBy', title: '创建人', width: 100 },
        { field: 'updateTime', title: '操作时间', width: 170 },
        { field: 'updateBy', title: '操作人', width: 100 },
        { field: 'description', title: '备注', minWidth: 200 },
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
            return this.$api.sc.stock.take.takeStockPlan.query(this.buildQueryParams(page))
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
      const params = Object.assign({}, this.searchFormData)
      params.scId = params.sc.id
      params.createBy = params.createBy.id
      params.updateBy = params.updateBy.id

      delete params.sc

      return params
    },
    cancelRow(row) {
      this.$msg.confirm('对选中的盘点任务执行作废操作？').then(() => {
        this.loading = true
        this.$api.sc.stock.take.takeStockPlan.cancel(row.id).then(res => {
          this.$msg.success('作废成功！')
          this.search()
        }).finally(() => {
          this.loading = false
        })
      })
    },
    deleteRow(row) {
      this.$msg.confirm('对选中的预先盘点单执行删除操作？注：关联此盘点任务的库存盘点单均会删除。').then(() => {
        this.loading = true
        this.$api.sc.stock.take.takeStockPlan.deleteById(row.id).then(res => {
          this.$msg.success('删除成功！')
          this.search()
        }).finally(() => {
          this.loading = false
        })
      })
    },
    exportList() {
      this.loading = true
      this.$api.sc.stock.take.takeStockPlan.exportList(this.buildQueryParams({})).then(() => {
        this.$msg.success('导出成功！')
      }).finally(() => {
        this.loading = false
      })
    }
  }
}
</script>
<style scoped>
</style>
