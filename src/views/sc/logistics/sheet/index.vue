<template>
  <div>
    <div v-permission="['logistics:sheet:query']" class="app-container">
      <!-- 数据列表 -->
      <vxe-grid
        id="LogisticsSheet"
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
              <j-form-item label="物流单号">
                <a-input v-model="searchFormData.logisticsNo" allow-clear />
              </j-form-item>
              <j-form-item label="物流公司">
                <logistics-company-selector
                  v-model="searchFormData.logisticsCompanyId"
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
              <j-form-item label="发货人">
                <user-selector
                  v-model="searchFormData.deliveryBy"
                />
              </j-form-item>
              <j-form-item label="发货日期" :content-nest="false">
                <div class="date-range-container">
                  <a-date-picker
                    v-model="searchFormData.deliveryStartTime"
                    placeholder=""
                    value-format="YYYY-MM-DD 00:00:00"
                  />
                  <span class="date-split">至</span>
                  <a-date-picker
                    v-model="searchFormData.deliveryEndTime"
                    placeholder=""
                    value-format="YYYY-MM-DD 23:59:59"
                  />
                </div>
              </j-form-item>
              <j-form-item label="状态">
                <a-select v-model="searchFormData.status" placeholder="全部" allow-clear>
                  <a-select-option v-for="item in $enums.LOGISTICS_SHEET_STATUS.values()" :key="item.code" :value="item.code">{{ item.desc }}</a-select-option>
                </a-select>
              </j-form-item>
            </j-form>
          </j-border>
        </template>
        <!-- 工具栏 -->
        <template v-slot:toolbar_buttons>
          <a-space>
            <a-button type="primary" icon="search" @click="search">查询</a-button>
            <a-button v-permission="['logistics:sheet:add']" type="primary" icon="plus" @click="$router.push('/logistics/sheet/add')">新增</a-button>
            <a-button v-permission="['logistics:sheet:delivery']" icon="cloud-upload" @click="$refs.deliveryImporter.openDialog()">批量Excel发货</a-button>
            <a-button v-permission="['logistics:sheet:delete']" type="danger" icon="delete" @click="batchDelete">批量删除</a-button>
            <a-button v-permission="['logistics:sheet:import']" icon="cloud-upload" @click="$refs.importer.openDialog()">导入Excel</a-button>
            <a-button v-permission="['logistics:sheet:export']" icon="download" @click="exportList">导出</a-button>
          </a-space>
        </template>

        <!-- 操作 列自定义内容 -->
        <template v-slot:action_default="{ row }">
          <a-space>
            <a-button v-permission="['logistics:sheet:query']" type="link" @click="e => { id = row.id;$nextTick(() => $refs.viewDialog.openDialog()) }">查看</a-button>
            <a-button v-if="$enums.LOGISTICS_SHEET_STATUS.CREATED.equalsCode(row.status)" v-permission="['logistics:sheet:modify']" type="link" @click="$router.push('/logistics/sheet/modify/' + row.id)">修改</a-button>
            <a-button v-if="$enums.LOGISTICS_SHEET_STATUS.CREATED.equalsCode(row.status)" v-permission="['logistics:sheet:delivery']" type="link" @click="e => { id = row.id;$nextTick(() => $refs.deliveryDialog.openDialog()) }">发货</a-button>
            <a-button v-if="$enums.LOGISTICS_SHEET_STATUS.CREATED.equalsCode(row.status)" v-permission="['logistics:sheet:delete']" type="link" class="ant-btn-link-danger" @click="deleteOrder(row)">删除</a-button>
          </a-space>
        </template>
      </vxe-grid>

      <!-- 查看窗口 -->
      <detail :id="id" ref="viewDialog" />

      <approve-refuse ref="approveRefuseDialog" @confirm="doApproveRefuse" />

      <delivery ref="deliveryDialog" :sheet-id="id" @confirm="search" />

      <logistics-sheet-importer ref="importer" @confirm="search" />

      <logistics-sheet-delivery-importer ref="deliveryImporter" @confirm="search" />
    </div>
  </div>
</template>

<script>
import Detail from './detail'
import UserSelector from '@/components/Selector/UserSelector'
import ApproveRefuse from '@/components/ApproveRefuse'
import LogisticsCompanySelector from '@/components/Selector/LogisticsCompanySelector'
import moment from 'moment'
import Delivery from './delivery'
import LogisticsSheetImporter from '@/components/Importer/LogisticsSheetImporter'
import LogisticsSheetDeliveryImporter from '@/components/Importer/LogisticsSheetDeliveryImporter'

export default {
  name: 'LogisticsSheet',
  components: {
    Detail, UserSelector, ApproveRefuse, LogisticsCompanySelector, Delivery, LogisticsSheetImporter, LogisticsSheetDeliveryImporter
  },
  data() {
    return {
      loading: false,
      // 当前行数据
      id: '',
      // 查询列表的查询条件
      searchFormData: {
        code: '',
        scId: '',
        customerId: '',
        createBy: '',
        createStartTime: this.$utils.formatDateTime(this.$utils.getDateTimeWithMinTime(moment().subtract(1, 'M'))),
        createEndTime: this.$utils.formatDateTime(this.$utils.getDateTimeWithMaxTime(moment())),
        approveBy: '',
        approveStartTime: '',
        approveEndTime: '',
        status: undefined,
        saler: ''
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
        { field: 'logisticsNo', title: '物流单号', width: 150 },
        { field: 'logisticsCompanyName', title: '物流公司名称', width: 120 },
        { field: 'totalWeight', title: '总重量（kg）', width: 120 },
        { field: 'totalVolume', title: '总体积（cm³）', width: 120 },
        { field: 'totalAmount', title: '物流费（元）', width: 120 },
        { field: 'createTime', title: '操作时间', width: 170 },
        { field: 'createBy', title: '操作人', width: 100 },
        { field: 'status', title: '状态', width: 100, formatter: ({ cellValue }) => { return this.$enums.LOGISTICS_SHEET_STATUS.getDesc(cellValue) } },
        { field: 'deliveryTime', title: '发货时间', width: 170 },
        { field: 'deliveryBy', title: '发货人', width: 100 },
        { field: 'description', title: '备注', width: 200 },
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
            return this.$api.sc.logistics.logisticsSheet.query(this.buildQueryParams(page))
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
        customerId: this.searchFormData.customerId,
        scId: this.searchFormData.scId,
        createBy: this.searchFormData.createBy,
        approveBy: this.searchFormData.approveBy,
        salerId: this.searchFormData.saler
      })

      return params
    },
    // 删除订单
    deleteOrder(row) {
      this.$msg.confirm('对选中的物流单执行删除操作？').then(() => {
        this.loading = true
        this.$api.sc.logistics.logisticsSheet.deleteOrder({
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
        this.$msg.error('请选择要执行操作的物流单！')
        return
      }

      for (let i = 0; i < records.length; i++) {
        if (!this.$enums.LOGISTICS_SHEET_STATUS.CREATED.equalsCode(records[i].status)) {
          this.$msg.error('第' + (i + 1) + '个物流单已发货，不允许执行删除操作！')
          return
        }
      }

      this.$msg.confirm('对选中的物流单执行批量删除操作？').then(() => {
        this.loading = true
        this.$api.sc.logistics.logisticsSheet.batchDeleteOrder(records.map(item => item.id)).then(() => {
          this.$msg.success('删除成功！')
          this.search()
        }).finally(() => {
          this.loading = false
        })
      })
    },
    exportList() {
      this.loading = true
      this.$api.sc.logistics.logisticsSheet.exportList(this.buildQueryParams({})).then(() => {
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
