<template>
  <div>
    <div v-show="visible" v-permission="['stock:take:sheet:query']" class="app-container">
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
            <j-form label-width="110px" @collapse="$refs.grid.refreshColumn()">
              <j-form-item label="单据号">
                <a-input v-model="searchFormData.code" allow-clear />
              </j-form-item>
              <j-form-item label="关联盘点任务号">
                <a-input v-model="searchFormData.planCode" allow-clear />
              </j-form-item>
              <j-form-item label="仓库">
                <store-center-selector
                  v-model="searchFormData.sc"
                />
              </j-form-item>
              <j-form-item label="盘点状态">
                <a-select v-model="searchFormData.takeStatus" placeholder="全部" allow-clear>
                  <a-select-option v-for="item in $enums.TAKE_STOCK_PLAN_STATUS.values()" :key="item.code" :value="item.code">{{ item.desc }}</a-select-option>
                </a-select>
              </j-form-item>
              <j-form-item label="状态">
                <a-select v-model="searchFormData.status" placeholder="全部" allow-clear>
                  <a-select-option v-for="item in $enums.TAKE_STOCK_SHEET_STATUS.values()" :key="item.code" :value="item.code">{{ item.desc }}</a-select-option>
                </a-select>
              </j-form-item>
              <j-form-item label="操作时间" :content-nest="false">
                <div class="date-range-container">
                  <a-date-picker
                    v-model="searchFormData.updateTimeStart"
                    placeholder=""
                    value-format="YYYY-MM-DD 00:00:00"
                  />
                  <span class="date-split">至</span>
                  <a-date-picker
                    v-model="searchFormData.updateTimeEnd"
                    placeholder=""
                    value-format="YYYY-MM-DD 23:59:59"
                  />
                </div>
              </j-form-item>
              <j-form-item label="操作人">
                <user-selector
                  v-model="searchFormData.updateBy"
                />
              </j-form-item>
              <j-form-item label="审核时间" :content-nest="false">
                <div class="date-range-container">
                  <a-date-picker
                    v-model="searchFormData.approveTimeStart"
                    placeholder=""
                    value-format="YYYY-MM-DD 00:00:00"
                  />
                  <span class="date-split">至</span>
                  <a-date-picker
                    v-model="searchFormData.approveTimeEnd"
                    placeholder=""
                    value-format="YYYY-MM-DD 23:59:59"
                  />
                </div>
              </j-form-item>
              <j-form-item label="审核人">
                <user-selector
                  v-model="searchFormData.approveBy"
                />
              </j-form-item>
            </j-form>
          </j-border>
        </template>
        <!-- 工具栏 -->
        <template v-slot:toolbar_buttons>
          <a-space>
            <a-button type="primary" icon="search" @click="search">查询</a-button>
            <a-button v-permission="['stock:take:sheet:add']" type="primary" icon="plus" @click="visible = false; $refs.addDialog.openDialog();">新增</a-button>
            <a-button v-permission="['stock:take:sheet:approve']" icon="check" @click="batchApprovePass">审核通过</a-button>
            <a-button v-permission="['stock:take:sheet:approve']" icon="close" @click="batchApproveRefuse">审核拒绝</a-button>
            <a-button v-permission="['stock:take:sheet:delete']" type="danger" icon="delete" @click="batchDelete">批量删除</a-button>
            <a-button v-permission="['stock:take:sheet:export']" icon="download" @click="exportList">导出</a-button>
          </a-space>
        </template>

        <!-- 操作 列自定义内容 -->
        <template v-slot:action_default="{ row }">
          <a-button v-permission="['stock:take:sheet:query']" type="link" @click="e => { id = row.id;$nextTick(() => $refs.viewDialog.openDialog()) }">查看</a-button>
          <a-button v-if="($enums.TAKE_STOCK_SHEET_STATUS.CREATED.equalsCode(row.status) || $enums.TAKE_STOCK_SHEET_STATUS.APPROVE_REFUSE.equalsCode(row.status)) && $enums.TAKE_STOCK_PLAN_STATUS.CREATED.equalsCode(row.takeStatus)" v-permission="['stock:take:sheet:modify']" type="link" @click="e => { id = row.id; visible= false; $nextTick(() => $refs.updateDialog.openDialog()) }">修改</a-button>
          <a-button v-if="($enums.TAKE_STOCK_SHEET_STATUS.CREATED.equalsCode(row.status) || $enums.TAKE_STOCK_SHEET_STATUS.APPROVE_REFUSE.equalsCode(row.status)) && $enums.TAKE_STOCK_PLAN_STATUS.CREATED.equalsCode(row.takeStatus)" v-permission="['stock:take:sheet:approve']" type="link" @click="e => { id = row.id; visible= false; $nextTick(() => $refs.approveDialog.openDialog()) }">审核</a-button>
          <a-button v-if="$enums.TAKE_STOCK_SHEET_STATUS.APPROVE_PASS.equalsCode(row.status) && $enums.TAKE_STOCK_PLAN_STATUS.CREATED.equalsCode(row.takeStatus)" v-permission="['stock:take:sheet:cancel-approve']" type="link" @click="e => { cancelApprove(row.id) }">取消审核</a-button>
          <a-button v-if="$enums.TAKE_STOCK_SHEET_STATUS.CREATED.equalsCode(row.status) || $enums.TAKE_STOCK_SHEET_STATUS.APPROVE_REFUSE.equalsCode(row.status)" v-permission="['stock:take:sheet:delete']" type="link" class="ant-btn-link-danger" @click="e => { deleteRow(row.id) }">删除</a-button>
        </template>
      </vxe-grid>
    </div>
    <!-- 新增窗口 -->
    <add ref="addDialog" @confirm="search" @close="visible = true" />

    <!-- 修改窗口 -->
    <modify :id="id" ref="updateDialog" @confirm="search" @close="visible = true" />

    <!-- 审核窗口 -->
    <approve :id="id" ref="approveDialog" @confirm="search" @close="visible = true" />

    <!-- 查看窗口 -->
    <detail :id="id" ref="viewDialog" />

    <approve-refuse ref="approveRefuseDialog" @confirm="doApproveRefuse" />

  </div>
</template>

<script>
import Add from './add'
import Modify from './modify'
import Detail from './detail'
import Approve from './approve'
import StoreCenterSelector from '@/components/Selector/StoreCenterSelector'
import UserSelector from '@/components/Selector/UserSelector'
import moment from 'moment'
import ApproveRefuse from '@/components/ApproveRefuse'

export default {
  name: 'TakeStockSheet',
  components: {
    Add, Modify, Detail, Approve, StoreCenterSelector, UserSelector, ApproveRefuse
  },
  data() {
    return {
      visible: true,
      loading: false,
      // 当前行数据
      id: '',
      // 查询列表的查询条件
      searchFormData: {
        code: '',
        planCode: '',
        sc: {},
        takeStatus: undefined,
        status: undefined,
        updateBy: {},
        updateTimeStart: this.$utils.formatDateTime(this.$utils.getDateTimeWithMinTime(moment().subtract(1, 'M'))),
        updateTimeEnd: this.$utils.formatDateTime(this.$utils.getDateTimeWithMaxTime(moment())),
        approveBy: {},
        approveTimeStart: '',
        approveTimeEnd: ''
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
        { field: 'code', title: '单据号', width: 180 },
        { field: 'planCode', title: '关联盘点任务', width: 180 },
        { field: 'takeStatus', title: '盘点状态', width: 110, formatter: ({ cellValue }) => { return this.$enums.TAKE_STOCK_PLAN_STATUS.getDesc(cellValue) } },
        { field: 'scCode', title: '仓库编号', width: 100 },
        { field: 'scName', title: '仓库名称', width: 120 },
        { field: 'takeType', title: '盘点类别', width: 100, formatter: ({ cellValue }) => { return this.$enums.TAKE_STOCK_PLAN_TYPE.getDesc(cellValue) } },
        { field: 'status', title: '状态', width: 100, formatter: ({ cellValue }) => { return this.$enums.TAKE_STOCK_SHEET_STATUS.getDesc(cellValue) } },
        { field: 'updateTime', title: '操作时间', width: 170 },
        { field: 'updateBy', title: '操作人', width: 100 },
        { field: 'approveTime', title: '审核时间', width: 170 },
        { field: 'approveBy', title: '审核人', width: 100 },
        { field: 'description', title: '备注', minWidth: 200 },
        { title: '操作', width: 200, fixed: 'right', slots: { default: 'action_default' }}
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
            return this.$api.sc.stock.take.takeStockSheet.query(this.buildQueryParams(page))
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
      const params = Object.assign({ }, this.searchFormData)
      params.scId = params.sc.id
      params.updateBy = params.updateBy.id
      params.approveBy = params.approveBy.id

      delete params.sc

      return params
    },
    // 取消审核
    cancelApprove(id) {
      this.$msg.confirm('确认对此库存盘点单进行取消审核操作？').then(() => {
        this.loading = true
        this.$api.sc.stock.take.takeStockSheet.cancelApprove({
          id: id
        }).then(res => {
          this.$msg.success('取消审核成功！')
          this.search()
        }).finally(() => {
          this.loading = false
        })
      })
    },
    batchApprovePass() {
      const records = this.$refs.grid.getCheckboxRecords()
      if (this.$utils.isEmpty(records)) {
        this.$msg.error('请选择要执行操作的库存盘点单！')
        return
      }

      for (let i = 0; i < records.length; i++) {
        const record = records[i]
        if (this.$enums.TAKE_STOCK_SHEET_STATUS.APPROVE_PASS.equalsCode(record.status)) {
          this.$msg.error('第' + (i + 1) + '个库存盘点单已审核通过，不允许继续执行审核！')
          return
        }

        const takeStatus = this.$enums.TAKE_STOCK_PLAN_STATUS.getByCode(record.takeStatus)
        if (takeStatus !== this.$enums.TAKE_STOCK_PLAN_STATUS.CREATED) {
          this.$msg.error('第' + (i + 1) + '个库存盘点单的盘点状态为【' + takeStatus.desc + '】，不允许继续执行审核！')
          return
        }
      }

      this.$msg.confirm('对选中的库存盘点单执行审核通过操作？').then(() => {
        this.loading = true
        this.$api.sc.stock.take.takeStockSheet.batchApprovePass({
          ids: records.map(item => item.id)
        }).then(() => {
          this.$msg.success('审核通过！')
          this.search()
        }).finally(() => {
          this.loading = false
        })
      })
    },
    batchApproveRefuse() {
      const records = this.$refs.grid.getCheckboxRecords()
      if (this.$utils.isEmpty(records)) {
        this.$msg.error('请选择要执行操作的库存盘点单！')
        return
      }

      for (let i = 0; i < records.length; i++) {
        const record = records[i]
        if (this.$enums.TAKE_STOCK_SHEET_STATUS.APPROVE_PASS.equalsCode(record.status)) {
          this.$msg.error('第' + (i + 1) + '个库存盘点单已审核通过，不允许继续执行审核！')
          return
        }

        if (this.$enums.TAKE_STOCK_SHEET_STATUS.APPROVE_REFUSE.equalsCode(record.status)) {
          this.$msg.error('第' + (i + 1) + '个库存盘点单已审核拒绝，不允许继续执行审核！')
          return
        }

        const takeStatus = this.$enums.TAKE_STOCK_PLAN_STATUS.getByCode(record.takeStatus)
        if (takeStatus !== this.$enums.TAKE_STOCK_PLAN_STATUS.CREATED) {
          this.$msg.error('第' + (i + 1) + '个库存盘点单的盘点状态为【' + takeStatus.desc + '】，不允许继续执行审核！')
          return
        }
      }

      this.$refs.approveRefuseDialog.openDialog()
    },
    doApproveRefuse(reason) {
      const records = this.$refs.grid.getCheckboxRecords()
      if (this.$utils.isEmpty(records)) {
        this.$msg.error('请选择要执行操作的库存盘点单！')
        return
      }

      this.loading = true
      this.$api.sc.stock.take.takeStockSheet.batchApproveRefuse({
        ids: records.map(item => item.id),
        refuseReason: reason
      }).then(() => {
        this.$msg.success('审核拒绝！')
        this.search()
      }).finally(() => {
        this.loading = false
      })
    },
    // 删除
    deleteRow(id) {
      this.$msg.confirm('对选中的库存盘点单执行删除操作？').then(() => {
        this.loading = true
        this.$api.sc.stock.take.takeStockSheet.deleteById(id).then(() => {
          this.$msg.success('删除成功！')
          this.search()
        }).finally(() => {
          this.loading = false
        })
      })
    },
    batchDelete() {
      const records = this.$refs.grid.getCheckboxRecords()
      if (this.$utils.isEmpty(records)) {
        this.$msg.error('请选择要执行操作的库存盘点单！')
        return
      }

      for (let i = 0; i < records.length; i++) {
        const record = records[i]
        if (this.$enums.TAKE_STOCK_SHEET_STATUS.APPROVE_PASS.equalsCode(record.status)) {
          this.$msg.error('第' + (i + 1) + '个库存盘点单已审核通过，不允许执行删除操作！')
          return
        }
      }

      this.$msg.confirm('对选中的库存盘点单执行批量删除操作？').then(() => {
        this.loading = true
        this.$api.sc.stock.take.takeStockSheet.batchDelete(records.map(item => item.id)).then(() => {
          this.$msg.success('删除成功！')
          this.search()
        }).finally(() => {
          this.loading = false
        })
      })
    },
    exportList() {
      this.loading = true
      this.$api.sc.stock.take.takeStockSheet.exportList(this.buildQueryParams({})).then(() => {
        this.$msg.successTip('导出成功！')
      }).finally(() => {
        this.loading = false
      })
    }
  }
}
</script>
<style scoped>
</style>
