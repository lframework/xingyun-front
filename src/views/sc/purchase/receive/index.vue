<template>
  <div>
    <div v-permission="['purchase:receive:query']" class="app-container">
      <!-- 数据列表 -->
      <vxe-grid
        id="ReceiveSheet"
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

              <j-form-item label="供应商">
                <supplier-selector
                  v-model="searchFormData.supplierId"
                />
              </j-form-item>

              <j-form-item label="仓库">
                <store-center-selector
                  v-model="searchFormData.scId"
                />
              </j-form-item>

              <j-form-item label="操作人">
                <user-selector
                  v-model="searchFormData.createBy"
                />
              </j-form-item>

              <j-form-item label="操作日期" :content-nest="false">
                <div class="date-range-container">
                  <a-date-picker v-model="searchFormData.createStartTime" placeholder="" value-format="YYYY-MM-DD 00:00:00" />
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
                  <a-date-picker v-model="searchFormData.approveStartTime" placeholder="" value-format="YYYY-MM-DD 00:00:00" />
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
                  <a-select-option v-for="item in $enums.RECEIVE_SHEET_STATUS.values()" :key="item.code" :value="item.code">{{ item.desc }}</a-select-option>
                </a-select>
              </j-form-item>

              <j-form-item label="采购员">
                <user-selector
                  v-model="searchFormData.purchaser"
                />
              </j-form-item>

              <j-form-item label="采购订单号">
                <a-input v-model="searchFormData.purchaseOrderCode" allow-clear />
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
            <a-button v-permission="['purchase:receive:add']" type="primary" icon="plus" @click="openAddDialog">新增</a-button>
            <a-button v-permission="['purchase:receive:approve']" icon="check" @click="batchApprovePass">审核通过</a-button>
            <a-button v-permission="['purchase:receive:approve']" icon="close" @click="batchApproveRefuse">审核拒绝</a-button>
            <a-button v-permission="['purchase:receive:delete']" type="danger" icon="delete" @click="batchDelete">批量删除</a-button>
            <a-button v-permission="['purchase:receive:import']" icon="cloud-upload" @click="$refs.importer.openDialog()">导入Excel</a-button>
            <a-button v-permission="['purchase:receive:import']" icon="cloud-upload" @click="$refs.importer2.openDialog()">批量设置支付方式</a-button>
            <a-button v-permission="['purchase:receive:export']" icon="download" @click="exportList">导出</a-button>
          </a-space>
        </template>

        <!-- 采购订单号 列自定义内容 -->
        <template v-slot:purchaseOrderCode_default="{ row }">
          <span v-if="$utils.isEmpty(row.purchaseOrderCode)">-</span>
          <span v-else>
            <a v-permission="['purchase:order:query']" @click="viewPurchaseOrderDetail(row.purchaseOrderId)">{{ row.purchaseOrderCode }}</a>
            <span v-no-permission="['purchase:order:query']">{{ row.purchaseOrderCode }}</span>
          </span>
        </template>

        <!-- 操作 列自定义内容 -->
        <template v-slot:action_default="{ row }">
          <a-button v-permission="['purchase:receive:query']" type="link" @click="e => { id = row.id;$nextTick(() => $refs.viewDialog.openDialog()) }">查看</a-button>
          <a-button v-if="$enums.PURCHASE_ORDER_STATUS.CREATED.equalsCode(row.status) || $enums.PURCHASE_ORDER_STATUS.APPROVE_REFUSE.equalsCode(row.status)" v-permission="['purchase:receive:approve']" type="link" @click="$router.push('/purchase/receive/approve/' + row.id)">审核</a-button>
          <a-button v-if="$enums.PURCHASE_ORDER_STATUS.CREATED.equalsCode(row.status) || $enums.PURCHASE_ORDER_STATUS.APPROVE_REFUSE.equalsCode(row.status)" v-permission="['purchase:receive:modify']" type="link" @click="openModifyDialog(row)">修改</a-button>
          <a-button v-if="$enums.PURCHASE_ORDER_STATUS.CREATED.equalsCode(row.status) || $enums.PURCHASE_ORDER_STATUS.APPROVE_REFUSE.equalsCode(row.status)" v-permission="['purchase:receive:delete']" type="link" class="ant-btn-link-danger" @click="deleteOrder(row)">删除</a-button>
        </template>
      </vxe-grid>

      <!-- 查看窗口 -->
      <detail :id="id" ref="viewDialog" />

      <approve-refuse ref="approveRefuseDialog" @confirm="doApproveRefuse" />

      <!-- 采购订单查看窗口 -->
      <purchase-order-detail :id="purchaseOrderId" ref="viewPurchaseOrderDetailDialog" />
    </div>
    <receive-sheet-importer ref="importer" @confirm="search" />
    <receive-sheet-pay-type-importer ref="importer2" />
  </div>
</template>

<script>
import Detail from './detail'
import StoreCenterSelector from '@/components/Selector/StoreCenterSelector'
import SupplierSelector from '@/components/Selector/SupplierSelector'
import UserSelector from '@/components/Selector/UserSelector'
import ApproveRefuse from '@/components/ApproveRefuse'
import PurchaseOrderDetail from '@/views/sc/purchase/order/detail'
import moment from 'moment'
import ReceiveSheetImporter from '@/components/Importer/ReceiveSheetImporter'
import ReceiveSheetPayTypeImporter from '@/components/Importer/ReceiveSheetPayTypeImporter.vue'

export default {
  name: 'ReceiveSheet',
  components: {
    Detail, StoreCenterSelector, SupplierSelector, UserSelector, ApproveRefuse, PurchaseOrderDetail, ReceiveSheetImporter, ReceiveSheetPayTypeImporter
  },
  data() {
    return {
      loading: false,
      // 当前行数据
      id: '',
      purchaseOrderId: '',
      // 查询列表的查询条件
      searchFormData: {
        code: '',
        scId: '',
        supplierId: '',
        createBy: '',
        createStartTime: this.$utils.formatDateTime(this.$utils.getDateTimeWithMinTime(moment().subtract(1, 'M'))),
        createEndTime: this.$utils.formatDateTime(this.$utils.getDateTimeWithMaxTime(moment())),
        approveBy: '',
        approveStartTime: '',
        approveEndTime: '',
        status: undefined,
        purchaser: '',
        purchaseOrderCode: '',
        settleStatus: undefined
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
        { field: 'supplierCode', title: '供应商编号', width: 100 },
        { field: 'supplierName', title: '供应商名称', width: 120 },
        { field: 'purchaserName', title: '采购员', width: 100 },
        { field: 'totalAmount', title: '单据总金额', align: 'right', width: 100 },
        { field: 'totalNum', title: '商品数量', align: 'right', width: 120 },
        { field: 'totalGiftNum', title: '赠品数量', align: 'right', width: 120 },
        { field: 'receiveDate', title: '实际到货日期', width: 120 },
        { field: 'createTime', title: '操作时间', width: 170 },
        { field: 'createBy', title: '操作人', width: 100 },
        { field: 'status', title: '状态', width: 100, formatter: ({ cellValue }) => { return this.$enums.RECEIVE_SHEET_STATUS.getDesc(cellValue) } },
        { field: 'approveTime', title: '审核时间', width: 170 },
        { field: 'approveBy', title: '审核人', width: 100 },
        { field: 'settleStatus', title: '结算状态', width: 100, formatter: ({ cellValue }) => { return this.$enums.SETTLE_STATUS.getDesc(cellValue) } },
        { field: 'description', title: '备注', width: 200 },
        { field: 'purchaseOrderCode', title: '采购订单号', width: 180, slots: { default: 'purchaseOrderCode_default' }},
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
            return this.$api.sc.purchase.receiveSheet.query(this.buildQueryParams(page))
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
        supplierId: this.searchFormData.supplierId,
        scId: this.searchFormData.scId,
        createBy: this.searchFormData.createBy,
        approveBy: this.searchFormData.approveBy,
        purchaserId: this.searchFormData.purchaser
      })

      return params
    },
    openAddDialog() {
      this.$api.sc.purchase.purchaseConfig.get().then(res => {
        if (res.receiveRequirePurchase) {
          this.$router.push('/purchase/receive/add/require')
        } else {
          this.$router.push('/purchase/receive/add/un-require')
        }
      })
    },
    openModifyDialog(row) {
      if (!this.$utils.isEmpty(row.purchaseOrderId)) {
        this.$router.push('/purchase/receive/modify/require/' + row.id)
      } else {
        this.$router.push('/purchase/receive/modify/un-require/' + row.id)
      }
    },
    // 删除订单
    deleteOrder(row) {
      this.$msg.confirm('对选中的采购收货单执行删除操作？').then(() => {
        this.loading = true
        this.$api.sc.purchase.receiveSheet.deleteOrder({
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
        this.$msg.error('请选择要执行操作的采购收货单！')
        return
      }

      for (let i = 0; i < records.length; i++) {
        if (this.$enums.PURCHASE_ORDER_STATUS.APPROVE_PASS.equalsCode(records[i].status)) {
          this.$msg.error('第' + (i + 1) + '个采购收货单已审核通过，不允许执行删除操作！')
          return
        }
      }

      this.$msg.confirm('对选中的采购收货单执行批量删除操作？').then(() => {
        this.loading = true
        this.$api.sc.purchase.receiveSheet.batchDeleteOrder(records.map(item => item.id)).then(() => {
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
        this.$msg.error('请选择要执行操作的采购收货单！')
        return
      }

      for (let i = 0; i < records.length; i++) {
        if (this.$enums.PURCHASE_ORDER_STATUS.APPROVE_PASS.equalsCode(records[i].status)) {
          this.$msg.error('第' + (i + 1) + '个采购单已审核通过，不允许继续执行审核！')
          return
        }
      }

      this.$msg.confirm('对选中的采购收货单执行审核通过操作？').then(() => {
        this.loading = true
        this.$api.sc.purchase.receiveSheet.batchApprovePassOrder({
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
        this.$msg.error('请选择要执行操作的采购收货单！')
        return
      }

      for (let i = 0; i < records.length; i++) {
        if (this.$enums.PURCHASE_ORDER_STATUS.APPROVE_PASS.equalsCode(records[i].status)) {
          this.$msg.error('第' + (i + 1) + '个采购收货单已审核通过，不允许继续执行审核！')
          return
        }

        if (this.$enums.PURCHASE_ORDER_STATUS.APPROVE_REFUSE.equalsCode(records[i].status)) {
          this.$msg.error('第' + (i + 1) + '个采购收货单已审核拒绝，不允许继续执行审核！')
          return
        }
      }

      this.$refs.approveRefuseDialog.openDialog()
    },
    doApproveRefuse(reason) {
      const records = this.$refs.grid.getCheckboxRecords()

      this.loading = true
      this.$api.sc.purchase.receiveSheet.batchApproveRefuseOrder({
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
      this.$api.sc.purchase.receiveSheet.exportList(this.buildQueryParams({})).then(() => {
        this.$msg.successTip('导出成功！')
      }).finally(() => {
        this.loading = false
      })
    },
    viewPurchaseOrderDetail(id) {
      this.purchaseOrderId = id
      this.$refs.viewPurchaseOrderDetailDialog.openDialog()
    }
  }
}
</script>
<style scoped>
</style>
e
      })
    },
    viewPurchaseOrderDetail(id) {
      this.purchaseOrderId = id
      this.$refs.viewPurchaseOrderDetailDialog.openDialog()
    }
  }
}
</script>
<style scoped>
</style>
