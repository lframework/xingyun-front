<template>
  <div>
    <div v-show="visible" v-permission="['sale:return:query']" class="app-container">
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

              <j-form-item label="仓库">
                <store-center-selector
                  v-model="searchFormData.sc"
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
                  <a-select-option v-for="item in $enums.SALE_RETURN_STATUS.values()" :key="item.code" :value="item.code">{{ item.desc }}</a-select-option>
                </a-select>
              </j-form-item>

              <j-form-item label="销售员">
                <user-selector
                  v-model="searchFormData.saler"
                />
              </j-form-item>

              <j-form-item label="销售出库单号">
                <a-input v-model="searchFormData.outSheetCode" allow-clear />
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
            <a-button v-permission="['sale:return:add']" type="primary" icon="plus" @click="openAddDialog">新增</a-button>
            <a-button v-permission="['sale:return:approve']" icon="check" @click="batchApprovePass">审核通过</a-button>
            <a-button v-permission="['sale:return:approve']" icon="close" @click="batchApproveRefuse">审核拒绝</a-button>
            <a-button v-permission="['sale:return:delete']" type="danger" icon="delete" @click="batchDelete">批量删除</a-button>
            <a-button v-permission="['sale:return:export']" icon="download" @click="exportList">导出</a-button>
          </a-space>
        </template>

        <!-- 销售出库单号 列自定义内容 -->
        <template v-slot:outSheetCode_default="{ row }">
          <span v-if="$utils.isEmpty(row.outSheetCode)">-</span>
          <span v-else>
            <a v-permission="['sale:out:query']" @click="viewOutSheetDetail(row.outSheetId)">{{ row.outSheetCode }}</a>
            <span v-no-permission="['sale:out:query']">{{ row.outSheetCode }}</span>
          </span>
        </template>

        <!-- 操作 列自定义内容 -->
        <template v-slot:action_default="{ row }">
          <a-button v-permission="['sale:return:query']" type="link" @click="e => { id = row.id;$nextTick(() => $refs.viewDialog.openDialog()) }">查看</a-button>
          <a-button v-if="$enums.PURCHASE_ORDER_STATUS.CREATED.equalsCode(row.status) || $enums.PURCHASE_ORDER_STATUS.APPROVE_REFUSE.equalsCode(row.status)" v-permission="['sale:return:approve']" type="link" @click="e => { id = row.id;visible=false;$nextTick(() => $refs.approveDialog.openDialog()) }">审核</a-button>
          <a-button v-if="$enums.PURCHASE_ORDER_STATUS.CREATED.equalsCode(row.status) || $enums.PURCHASE_ORDER_STATUS.APPROVE_REFUSE.equalsCode(row.status)" v-permission="['sale:return:modify']" type="link" @click="openModifyDialog(row)">修改</a-button>
          <a-button v-if="$enums.PURCHASE_ORDER_STATUS.CREATED.equalsCode(row.status) || $enums.PURCHASE_ORDER_STATUS.APPROVE_REFUSE.equalsCode(row.status)" v-permission="['sale:return:delete']" type="link" class="ant-btn-link-danger" @click="deleteOrder(row)">删除</a-button>
        </template>
      </vxe-grid>

      <!-- 查看窗口 -->
      <detail :id="id" ref="viewDialog" />

      <approve-refuse ref="approveRefuseDialog" @confirm="doApproveRefuse" />

      <!-- 采购收货查看窗口 -->
      <out-sheet-detail :id="outSheetId" ref="viewOutSheetDetailDialog" />
    </div>
    <!-- 新增窗口 -->
    <add-require ref="addRequireDialog" @confirm="search" @close="visible = true" />
    <add-un-require ref="addUnRequireDialog" @confirm="search" @close="visible = true" />
    <!-- 修改窗口 -->
    <modify-require :id="id" ref="modifyRequireDialog" @confirm="search" @close="visible = true" />
    <modify-un-require :id="id" ref="modifyUnRequireDialog" @confirm="search" @close="visible = true" />
    <!-- 审核窗口 -->
    <approve :id="id" ref="approveDialog" @confirm="search" @close="visible = true" />
  </div>
</template>

<script>
import AddRequire from './add-require'
import AddUnRequire from './add-un-require'
import ModifyRequire from './modify-require'
import ModifyUnRequire from './modify-un-require'
import Detail from './detail'
import Approve from './approve'
import StoreCenterSelector from '@/components/Selector/StoreCenterSelector'
import CustomerSelector from '@/components/Selector/CustomerSelector'
import UserSelector from '@/components/Selector/UserSelector'
import ApproveRefuse from '@/components/ApproveRefuse'
import moment from 'moment'
import OutSheetDetail from '@/views/sc/sale/out/detail'

export default {
  name: 'SaleReturn',
  components: {
    AddRequire, AddUnRequire, ModifyRequire, ModifyUnRequire, Detail, Approve, StoreCenterSelector, CustomerSelector, UserSelector, ApproveRefuse, OutSheetDetail
  },
  data() {
    return {
      loading: false,
      visible: true,
      // 当前行数据
      id: '',
      outSheetId: '',
      // 查询列表的查询条件
      searchFormData: {
        code: '',
        sc: {},
        customer: {},
        createBy: {},
        createStartTime: this.$utils.formatDateTime(this.$utils.getDateTimeWithMinTime(moment().subtract(1, 'M'))),
        createEndTime: this.$utils.formatDateTime(this.$utils.getDateTimeWithMaxTime(moment())),
        approveBy: {},
        approveStartTime: '',
        approveEndTime: '',
        status: undefined,
        saler: {},
        outSheetCode: '',
        settleStatus: undefined
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
        { field: 'scCode', title: '仓库编号', width: 100 },
        { field: 'scName', title: '仓库名称', width: 120 },
        { field: 'customerCode', title: '客户编号', width: 100 },
        { field: 'customerName', title: '客户名称', width: 120 },
        { field: 'salerName', title: '销售员', width: 100 },
        { field: 'totalAmount', title: '单据总金额', align: 'right', width: 100 },
        { field: 'totalNum', title: '商品数量', align: 'right', width: 120 },
        { field: 'totalGiftNum', title: '赠品数量', align: 'right', width: 120 },
        { field: 'createTime', title: '操作时间', width: 170 },
        { field: 'createBy', title: '操作人', width: 100 },
        { field: 'status', title: '状态', width: 100, formatter: ({ cellValue }) => { return this.$enums.SALE_RETURN_STATUS.getDesc(cellValue) } },
        { field: 'approveTime', title: '审核时间', width: 170 },
        { field: 'approveBy', title: '审核人', width: 100 },
        { field: 'settleStatus', title: '结算状态', width: 100, formatter: ({ cellValue }) => { return this.$enums.SETTLE_STATUS.getDesc(cellValue) } },
        { field: 'description', title: '备注', width: 200 },
        { field: 'outSheetCode', title: '销售出库单号', width: 180, slots: { default: 'outSheetCode_default' }},
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
            return this.$api.sc.sale.saleReturn.query(this.buildQueryParams(page))
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
      const params = Object.assign({}, this.searchFormData, {
        customerId: this.searchFormData.customer.id,
        scId: this.searchFormData.sc.id,
        createBy: this.searchFormData.createBy.id,
        approveBy: this.searchFormData.approveBy.id,
        salerId: this.searchFormData.saler.id
      })

      delete params.customer
      delete params.sc
      delete params.saler

      return params
    },
    openAddDialog() {
      this.loading = true
      this.$api.sc.sale.saleConfig.get().then(res => {
        this.visible = false
        if (res.saleReturnRequireOutStock) {
          this.$refs.addRequireDialog.openDialog()
        } else {
          this.$refs.addUnRequireDialog.openDialog()
        }
      }).finally(() => {
        this.loading = false
      })
    },
    openModifyDialog(row) {
      this.id = row.id
      this.visible = false
      if (!this.$utils.isEmpty(row.outSheetId)) {
        this.$nextTick(() => this.$refs.modifyRequireDialog.openDialog())
      } else {
        this.$nextTick(() => this.$refs.modifyUnRequireDialog.openDialog())
      }
    },
    // 删除订单
    deleteOrder(row) {
      this.$msg.confirm('对选中的销售退货单执行删除操作？').then(() => {
        this.loading = true
        this.$api.sc.sale.saleReturn.deleteOrder({
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
        this.$msg.error('请选择要执行操作的销售退货单！')
        return
      }

      for (let i = 0; i < records.length; i++) {
        if (this.$enums.PURCHASE_ORDER_STATUS.APPROVE_PASS.equalsCode(records[i].status)) {
          this.$msg.error('第' + (i + 1) + '个销售退货单已审核通过，不允许执行删除操作！')
          return
        }
      }

      this.$msg.confirm('对选中的销售退货单执行批量删除操作？').then(() => {
        this.loading = true
        this.$api.sc.sale.saleReturn.batchDeleteOrder(records.map(item => item.id)).then(() => {
          this.$msg.success('删除成功！')
          this.search()
        }).finally(() => {
          this.loading = false
        })
      })
    },
    // 批量审核通过
    batchApprovePass() {
      const records = this.$refs.grid.getCheckboxRecords()
      if (this.$utils.isEmpty(records)) {
        this.$msg.error('请选择要执行操作的销售退货单！')
        return
      }

      for (let i = 0; i < records.length; i++) {
        if (this.$enums.PURCHASE_ORDER_STATUS.APPROVE_PASS.equalsCode(records[i].status)) {
          this.$msg.error('第' + (i + 1) + '个采购单已审核通过，不允许继续执行审核！')
          return
        }
      }

      this.$msg.confirm('对选中的销售退货单执行审核通过操作？').then(() => {
        this.loading = true
        this.$api.sc.sale.saleReturn.batchApprovePassOrder({
          ids: records.map(item => item.id)
        }).then(() => {
          this.$msg.success('审核通过！')
          this.search()
        }).finally(() => {
          this.loading = false
        })
      })
    },
    // 批量审核拒绝
    batchApproveRefuse() {
      const records = this.$refs.grid.getCheckboxRecords()
      if (this.$utils.isEmpty(records)) {
        this.$msg.error('请选择要执行操作的销售退货单！')
        return
      }

      for (let i = 0; i < records.length; i++) {
        if (this.$enums.PURCHASE_ORDER_STATUS.APPROVE_PASS.equalsCode(records[i].status)) {
          this.$msg.error('第' + (i + 1) + '个销售退货单已审核通过，不允许继续执行审核！')
          return
        }

        if (this.$enums.PURCHASE_ORDER_STATUS.APPROVE_REFUSE.equalsCode(records[i].status)) {
          this.$msg.error('第' + (i + 1) + '个销售退货单已审核拒绝，不允许继续执行审核！')
          return
        }
      }

      this.$refs.approveRefuseDialog.openDialog()
    },
    doApproveRefuse(reason) {
      const records = this.$refs.grid.getCheckboxRecords()

      this.loading = true
      this.$api.sc.sale.saleReturn.batchApproveRefuseOrder({
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
      this.$api.sc.sale.saleReturn.exportList(this.buildQueryParams({})).then(() => {
        this.$msg.successTip('导出成功！')
      }).finally(() => {
        this.loading = false
      })
    },
    viewOutSheetDetail(id) {
      this.outSheetId = id
      this.$nextTick(() => this.$refs.viewOutSheetDetailDialog.openDialog())
    }
  }
}
</script>
<style scoped>
</style>
