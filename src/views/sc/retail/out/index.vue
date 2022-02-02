<template>
  <div>
    <div v-show="visible" v-permission="['retail:out:query']" class="app-container">
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
            <j-form>
              <j-form-item label="业务单据号">
                <el-input v-model="searchFormData.code" clearable />
              </j-form-item>

              <j-form-item label="会员">
                <member-selector
                  v-model="searchFormData.member"
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
                <el-date-picker
                  v-model="searchFormData.createStartTime"
                  type="date"
                  value-format="yyyy-MM-dd 00:00:00"
                />
                <span class="date-split">至</span>
                <el-date-picker
                  v-model="searchFormData.createEndTime"
                  type="date"
                  value-format="yyyy-MM-dd 23:59:59"
                />
              </j-form-item>

              <j-form-item label="审核人">
                <user-selector
                  v-model="searchFormData.approveBy"
                />
              </j-form-item>

              <j-form-item label="审核日期" :content-nest="false">
                <el-date-picker
                  v-model="searchFormData.approveStartTime"
                  type="date"
                  value-format="yyyy-MM-dd 00:00:00"
                />
                <span class="date-split">至</span>
                <el-date-picker
                  v-model="searchFormData.approveEndTime"
                  type="date"
                  value-format="yyyy-MM-dd 23:59:59"
                />
              </j-form-item>

              <j-form-item label="审核状态">
                <el-select v-model="searchFormData.status" placeholder="全部" clearable>
                  <el-option v-for="item in $enums.RECEIVE_SHEET_STATUS.values()" :key="item.code" :label="item.desc" :value="item.code" />
                </el-select>
              </j-form-item>

              <j-form-item label="销售员">
                <user-selector
                  v-model="searchFormData.saler"
                />
              </j-form-item>

              <j-form-item label="结算状态">
                <el-select v-model="searchFormData.settleStatus" placeholder="全部" clearable>
                  <el-option v-for="item in $enums.SETTLE_STATUS.values()" :key="item.code" :label="item.desc" :value="item.code" />
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
            <el-form-item v-permission="['retail:out:add']">
              <el-button type="primary" icon="el-icon-plus" @click="visible = false;$refs.addDialog.openDialog()">新增</el-button>
            </el-form-item>
            <el-form-item v-permission="['retail:out:approve']">
              <el-button icon="el-icon-check" @click="batchApprovePass">审核通过</el-button>
            </el-form-item>
            <el-form-item v-permission="['retail:out:approve']">
              <el-button icon="el-icon-close" @click="batchApproveRefuse">审核拒绝</el-button>
            </el-form-item>
            <el-form-item v-permission="['retail:out:delete']">
              <el-button type="danger" icon="el-icon-delete" @click="batchDelete">批量删除</el-button>
            </el-form-item>
            <el-form-item v-permission="['retail:out:export']">
              <el-button icon="el-icon-download" @click="exportList">导出</el-button>
            </el-form-item>
          </el-form>
        </template>

        <!-- 操作 列自定义内容 -->
        <template v-slot:action_default="{ row }">
          <el-button v-permission="['retail:out:query']" type="text" icon="el-icon-view" @click="e => { id = row.id;$refs.viewDialog.openDialog() }">查看</el-button>
          <el-button v-if="$enums.RETAIL_OUT_SHEET_STATUS.CREATED.equalsCode(row.status) || $enums.RETAIL_OUT_SHEET_STATUS.APPROVE_REFUSE.equalsCode(row.status)" v-permission="['retail:out:approve']" type="text" icon="el-icon-s-check" @click="e => { id = row.id;visible=false;$nextTick(() => $refs.approveDialog.openDialog()) }">审核</el-button>
          <el-button v-if="$enums.RETAIL_OUT_SHEET_STATUS.CREATED.equalsCode(row.status) || $enums.RETAIL_OUT_SHEET_STATUS.APPROVE_REFUSE.equalsCode(row.status)" v-permission="['retail:out:modify']" type="text" icon="el-icon-edit" @click="e => { id = row.id;visible=false;$nextTick(() => $refs.modifyDialog.openDialog()) }">修改</el-button>
          <el-button v-if="$enums.RETAIL_OUT_SHEET_STATUS.CREATED.equalsCode(row.status) || $enums.RETAIL_OUT_SHEET_STATUS.APPROVE_REFUSE.equalsCode(row.status)" v-permission="['retail:out:delete']" type="text" icon="el-icon-delete" @click="deleteOrder(row)">删除</el-button>
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
import StoreCenterSelector from '@/components/Selector/StoreCenterSelector'
import MemberSelector from '@/components/Selector/MemberSelector'
import UserSelector from '@/components/Selector/UserSelector'
import ApproveRefuse from '@/components/ApproveRefuse'
import moment from 'moment'

export default {
  name: 'RetailOutSheet',
  components: {
    Add, Modify, Detail, Approve, StoreCenterSelector, MemberSelector, UserSelector, ApproveRefuse
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
        sc: {},
        member: {},
        createBy: {},
        createStartTime: this.$utils.formatDateTime(this.$utils.getDateTimeWithMinTime(moment().subtract(1, 'M'))),
        createEndTime: this.$utils.formatDateTime(this.$utils.getDateTimeWithMaxTime(moment())),
        approveBy: {},
        approveStartTime: '',
        approveEndTime: '',
        status: '',
        saler: {},
        settleStatus: ''
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
        { field: 'code', title: '业务单据号', width: 180 },
        { field: 'scCode', title: '仓库编号', width: 100 },
        { field: 'scName', title: '仓库名称', width: 120 },
        { field: 'memberCode', title: '会员编号', width: 100 },
        { field: 'memberName', title: '会员名称', width: 120 },
        { field: 'salerName', title: '销售员', width: 100 },
        { field: 'totalAmount', title: '单据总金额', align: 'right', width: 100 },
        { field: 'totalNum', title: '商品数量', align: 'right', width: 120 },
        { field: 'totalGiftNum', title: '赠品数量', align: 'right', width: 120 },
        { field: 'createTime', title: '操作时间', width: 170 },
        { field: 'createBy', title: '操作人', width: 100 },
        { field: 'status', title: '审核状态', width: 100, formatter: ({ cellValue }) => { return this.$enums.RECEIVE_SHEET_STATUS.getDesc(cellValue) } },
        { field: 'approveTime', title: '审核时间', width: 170 },
        { field: 'approveBy', title: '审核人', width: 100 },
        { field: 'settleStatus', title: '结算状态', width: 100, formatter: ({ cellValue }) => { return this.$enums.SETTLE_STATUS.getDesc(cellValue) } },
        { field: 'description', title: '备注', width: 200 },
        { title: '操作', width: 280, fixed: 'right', slots: { default: 'action_default' }}
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
            return this.$api.sc.retail.outSheet.query(this.buildQueryParams(page))
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
        memberId: this.searchFormData.member.id,
        scId: this.searchFormData.sc.id,
        createBy: this.searchFormData.createBy.id,
        approveBy: this.searchFormData.approveBy.id,
        salerId: this.searchFormData.saler.id
      })

      delete params.member
      delete params.sc
      delete params.saler

      return params
    },
    // 删除订单
    deleteOrder(row) {
      this.$msg.confirm('对选中的零售出库单执行删除操作？').then(() => {
        this.loading = true
        this.$api.sc.retail.outSheet.deleteOrder({
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
        this.$msg.error('请选择要执行操作的零售出库单！')
        return
      }

      for (let i = 0; i < records.length; i++) {
        if (this.$enums.RETAIL_OUT_SHEET_STATUS.APPROVE_PASS.equalsCode(records[i].status)) {
          this.$msg.error('第' + (i + 1) + '个零售出库单已审核通过，不允许执行删除操作！')
          return
        }
      }

      this.$msg.confirm('对选中的零售出库单执行批量删除操作？').then(valid => {
        if (valid) {
          this.loading = true
          this.$api.sc.retail.outSheet.batchDeleteOrder(records.map(item => item.id)).then(() => {
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
        this.$msg.error('请选择要执行操作的零售出库单！')
        return
      }

      for (let i = 0; i < records.length; i++) {
        if (this.$enums.RETAIL_OUT_SHEET_STATUS.APPROVE_PASS.equalsCode(records[i].status)) {
          this.$msg.error('第' + (i + 1) + '个采购单已审核通过，不允许继续执行审核！')
          return
        }
      }

      this.$msg.confirm('对选中的零售出库单执行审核通过操作？').then(valid => {
        if (valid) {
          this.loading = true
          this.$api.sc.retail.outSheet.batchApprovePassOrder({
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
        this.$msg.error('请选择要执行操作的零售出库单！')
        return
      }

      for (let i = 0; i < records.length; i++) {
        if (this.$enums.RETAIL_OUT_SHEET_STATUS.APPROVE_PASS.equalsCode(records[i].status)) {
          this.$msg.error('第' + (i + 1) + '个零售出库单已审核通过，不允许继续执行审核！')
          return
        }

        if (this.$enums.RETAIL_OUT_SHEET_STATUS.APPROVE_REFUSE.equalsCode(records[i].status)) {
          this.$msg.error('第' + (i + 1) + '个零售出库单已审核拒绝，不允许继续执行审核！')
          return
        }
      }

      this.$refs.approveRefuseDialog.openDialog()
    },
    doApproveRefuse(reason) {
      const records = this.$refs.grid.getCheckboxRecords()

      this.loading = true
      this.$api.sc.retail.outSheet.batchApproveRefuseOrder({
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
      this.$api.sc.retail.outSheet.exportList(this.buildQueryParams({})).then(() => {
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
