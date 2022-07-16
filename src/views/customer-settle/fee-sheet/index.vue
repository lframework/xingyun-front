<template>
  <div>
    <div v-show="visible" v-permission="['settle:fee-sheet:query']" class="app-container">
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
            <j-form @collapse="$refs.grid.refreshColumn()">
              <j-form-item label="单据号">
                <a-input v-model="searchFormData.code" allow-clear />
              </j-form-item>
              <j-form-item label="客户">
                <customer-selector
                  v-model="searchFormData.customer"
                />
              </j-form-item>
              <j-form-item label="操作人">
                <user-selector
                  v-model="searchFormData.createBy"
                />
              </j-form-item>
              <j-form-item label="操作日期" :content-nest="false">
                <div class="date-range-container">
                  <a-date-picker
                    v-model="searchFormData.createStartTime"
                    placeholder=""
                    value-format="YYYY-MM-DD 00:00:00"
                  />
                  <span class="date-split">至</span>
                  <a-date-picker
                    v-model="searchFormData.createEndTime"
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
              <j-form-item label="审核日期" :content-nest="false">
                <div class="date-range-container">
                  <a-date-picker
                    v-model="searchFormData.approveStartTime"
                    placeholder=""
                    value-format="YYYY-MM-DD 00:00:00"
                  />
                  <span class="date-split">至</span>
                  <a-date-picker
                    v-model="searchFormData.approveEndTime"
                    placeholder=""
                    value-format="YYYY-MM-DD 23:59:59"
                  />
                </div>
              </j-form-item>
              <j-form-item label="状态">
                <a-select v-model="searchFormData.status" placeholder="全部" allow-clear>
                  <a-select-option v-for="item in $enums.CUSTOMER_SETTLE_FEE_SHEET_STATUS.values()" :key="item.code" :value="item.code">{{ item.desc }}</a-select-option>
                </a-select>
              </j-form-item>
              <j-form-item label="结算状态">
                <a-select v-model="searchFormData.settleStatus" placeholder="全部" allow-clear>
                  <a-select-option v-for="item in $enums.SETTLE_STATUS.values()" :key="item.code" :value="item.code">{{ item.desc }}</a-select-option>
                </a-select>
              </j-form-item>
            </j-form>
          </j-border>
        </template>
        <!-- 工具栏 -->
        <template v-slot:toolbar_buttons>
          <a-space>
            <a-button type="primary" icon="search" @click="search">查询</a-button>
            <a-button v-permission="['settle:fee-sheet:add']" type="primary" icon="plus" @click="e => {visible = false; $refs.addDialog.openDialog()}">新增</a-button>
            <a-button v-permission="['settle:fee-sheet:approve']" icon="check" @click="batchApprovePass">审核通过</a-button>
            <a-button v-permission="['settle:fee-sheet:approve']" icon="close" @click="batchApproveRefuse">审核拒绝</a-button>
            <a-button v-permission="['settle:fee-sheet:delete']" type="danger" icon="delete" @click="batchDelete">批量删除</a-button>
            <a-button v-permission="['settle:fee-sheet:export']" icon="download" @click="exportList">导出</a-button>
          </a-space>
        </template>

        <!-- 操作 列自定义内容 -->
        <template v-slot:action_default="{ row }">
          <a-button v-permission="['settle:fee-sheet:query']" type="link" @click="e => { id = row.id;$nextTick(() => $refs.viewDialog.openDialog()) }">查看</a-button>
          <a-button v-if="$enums.CUSTOMER_SETTLE_FEE_SHEET_STATUS.CREATED.equalsCode(row.status) || $enums.CUSTOMER_SETTLE_FEE_SHEET_STATUS.APPROVE_REFUSE.equalsCode(row.status)" v-permission="['settle:fee-sheet:approve']" type="link" @click="e => { id = row.id;visible=false;$nextTick(() => $refs.approveDialog.openDialog()) }">审核</a-button>
          <a-button v-if="$enums.CUSTOMER_SETTLE_FEE_SHEET_STATUS.CREATED.equalsCode(row.status) || $enums.CUSTOMER_SETTLE_FEE_SHEET_STATUS.APPROVE_REFUSE.equalsCode(row.status)" v-permission="['settle:fee-sheet:modify']" type="link" @click="e => { id = row.id;visible = false;$nextTick(() => $refs.modifyDialog.openDialog()) }">修改</a-button>
          <a-button v-if="$enums.CUSTOMER_SETTLE_FEE_SHEET_STATUS.CREATED.equalsCode(row.status) || $enums.CUSTOMER_SETTLE_FEE_SHEET_STATUS.APPROVE_REFUSE.equalsCode(row.status)" v-permission="['settle:fee-sheet:delete']" type="link" class="ant-btn-link-danger" @click="deleteOrder(row)">删除</a-button>
        </template>
      </vxe-grid>

      <!-- 查看窗口 -->
      <detail :id="id" ref="viewDialog" />

      <approve-refuse ref="approveRefuseDialog" @confirm="doApproveRefuse" />
    </div>
    <!-- 新增窗口 -->
    <add ref="addDialog" @confirm="search" @close="visible = true" />
    <!-- 修改窗口 -->
    <modify :id="id" ref="modifyDialog" @confirm="search" @close="visible = true" />
    <!-- 审核窗口 -->
    <approve :id="id" ref="approveDialog" @confirm="search" @close="visible = true" />
  </div>
</template>

<script>
import Add from './add'
import Modify from './modify'
import Detail from './detail'
import Approve from './approve'
import UserSelector from '@/components/Selector/UserSelector'
import CustomerSelector from '@/components/Selector/CustomerSelector'
import ApproveRefuse from '@/components/ApproveRefuse'
import moment from 'moment'
export default {
  name: 'CustomerSettleFeeSheet',
  components: {
    Add, Modify, Detail, Approve, UserSelector, ApproveRefuse, CustomerSelector
  },
  data() {
    return {
      loading: false,
      visible: true,
      // 当前行数据
      id: '',
      // 查询列表的查询条件
      searchFormData: {
        code: '',
        customer: {},
        createBy: {},
        createStartTime: this.$utils.formatDateTime(this.$utils.getDateTimeWithMinTime(moment().subtract(1, 'M'))),
        createEndTime: this.$utils.formatDateTime(this.$utils.getDateTimeWithMaxTime(moment())),
        approveBy: {},
        approveStartTime: '',
        approveEndTime: '',
        status: undefined,
        saler: {}
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
        // 自定义左侧工具栏
        slots: {
          buttons: 'toolbar_buttons'
        }
      },
      // 列表数据配置
      tableColumn: [
        { type: 'checkbox', width: 40 },
        { field: 'code', title: '单据号', width: 180 },
        { field: 'customerCode', title: '客户编号', width: 100 },
        { field: 'customerName', title: '客户名称', width: 120 },
        { field: 'totalAmount', title: '单据总金额', align: 'right', width: 100 },
        { field: 'createTime', title: '操作时间', width: 170 },
        { field: 'createBy', title: '操作人', width: 100 },
        { field: 'status', title: '状态', width: 100, formatter: ({ cellValue }) => { return this.$enums.CUSTOMER_SETTLE_FEE_SHEET_STATUS.getDesc(cellValue) } },
        { field: 'approveTime', title: '审核时间', width: 170 },
        { field: 'approveBy', title: '审核人', width: 100 },
        { field: 'settleStatus', title: '结算状态', width: 100, formatter: ({ cellValue }) => { return this.$enums.SETTLE_STATUS.getDesc(cellValue) } },
        { field: 'description', title: '备注', width: 200 },
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
            return this.$api.customerSettle.feeSheet.query(this.buildQueryParams(page))
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
      return {
        code: this.searchFormData.code,
        customerId: this.searchFormData.customer.id,
        createBy: this.searchFormData.createBy.id,
        createStartTime: this.searchFormData.createStartTime,
        createEndTime: this.searchFormData.createEndTime,
        approveBy: this.searchFormData.approveBy.id,
        approveStartTime: this.searchFormData.approveStartTime,
        approveEndTime: this.searchFormData.approveEndTime,
        status: this.searchFormData.status,
        settleStatus: this.searchFormData.settleStatus
      }
    },
    // 删除订单
    deleteOrder(row) {
      this.$msg.confirm('对选中的费用单执行删除操作？').then(() => {
        this.loading = true
        this.$api.customerSettle.feeSheet.deleteOrder({
          id: row.id
        }).then(() => {
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
        this.$msg.error('请选择要执行操作的费用单！')
        return
      }

      for (let i = 0; i < records.length; i++) {
        if (this.$enums.CUSTOMER_SETTLE_FEE_SHEET_STATUS.APPROVE_PASS.equalsCode(records[i].status)) {
          this.$msg.error('第' + (i + 1) + '个费用单已审核通过，不允许执行删除操作！')
          return
        }
      }

      this.$msg.confirm('对选中的费用单执行批量删除操作？').then(valid => {
        if (valid) {
          this.loading = true
          this.$api.customerSettle.feeSheet.batchDeleteOrder(records.map(item => item.id)).then(() => {
            this.$msg.success('删除成功！')
            this.search()
          }).finally(() => {
            this.loading = false
          })
        }
      })
    },
    // 批量审核通过
    batchApprovePass() {
      const records = this.$refs.grid.getCheckboxRecords()
      if (this.$utils.isEmpty(records)) {
        this.$msg.error('请选择要执行操作的费用单！')
        return
      }

      for (let i = 0; i < records.length; i++) {
        if (this.$enums.CUSTOMER_SETTLE_FEE_SHEET_STATUS.APPROVE_PASS.equalsCode(records[i].status)) {
          this.$msg.error('第' + (i + 1) + '个费用单已审核通过，不允许继续执行审核！')
          return
        }
      }

      this.$msg.confirm('对选中的费用单执行审核通过操作？').then(valid => {
        if (valid) {
          this.loading = true
          this.$api.customerSettle.feeSheet.batchApprovePassOrder({
            ids: records.map(item => item.id)
          }).then(() => {
            this.$msg.success('审核通过！')
            this.search()
          }).finally(() => {
            this.loading = false
          })
        }
      })
    },
    // 批量审核拒绝
    batchApproveRefuse() {
      const records = this.$refs.grid.getCheckboxRecords()
      if (this.$utils.isEmpty(records)) {
        this.$msg.error('请选择要执行操作的费用单！')
        return
      }

      for (let i = 0; i < records.length; i++) {
        if (this.$enums.CUSTOMER_SETTLE_FEE_SHEET_STATUS.APPROVE_PASS.equalsCode(records[i].status)) {
          this.$msg.error('第' + (i + 1) + '个费用单已审核通过，不允许继续执行审核！')
          return
        }

        if (this.$enums.CUSTOMER_SETTLE_FEE_SHEET_STATUS.APPROVE_REFUSE.equalsCode(records[i].status)) {
          this.$msg.error('第' + (i + 1) + '个费用单已审核拒绝，不允许继续执行审核！')
          return
        }
      }

      this.$refs.approveRefuseDialog.openDialog()
    },
    doApproveRefuse(reason) {
      const records = this.$refs.grid.getCheckboxRecords()

      this.loading = true
      this.$api.customerSettle.feeSheet.batchApproveRefuseOrder({
        ids: records.map(item => item.id),
        refuseReason: reason
      }).then(() => {
        this.$msg.success('审核拒绝！')
        this.search()
      }).finally(() => {
        this.loading = false
      })
    },
    exportList() {
      this.loading = true
      this.$api.customerSettle.feeSheet.exportList(this.buildQueryParams({})).then(() => {
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
