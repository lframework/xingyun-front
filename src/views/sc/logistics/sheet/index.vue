<template>
  <div>
    <div v-permission="['logistics:sheet:query']">
      <page-wrapper content-full-height fixed-height>
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
          :custom-config="{}"
          :pager-config="{}"
          :loading="loading"
          height="auto"
        >
          <template #form>
            <j-border>
              <j-form @collapse="$refs.grid.refreshColumn()">
                <j-form-item label="单据号">
                  <a-input v-model:value="searchFormData.code" allow-clear />
                </j-form-item>
                <j-form-item label="物流单号">
                  <a-input v-model:value="searchFormData.logisticsNo" allow-clear />
                </j-form-item>
                <j-form-item label="物流公司">
                  <logistics-company-selector v-model:value="searchFormData.logisticsCompanyId" />
                </j-form-item>
                <j-form-item label="操作人">
                  <user-selector v-model:value="searchFormData.createBy" />
                </j-form-item>
                <j-form-item label="操作日期" :content-nest="false">
                  <div class="date-range-container">
                    <a-date-picker
                      v-model:value="searchFormData.createStartTime"
                      placeholder=""
                      value-format="YYYY-MM-DD 00:00:00"
                    />
                    <span class="date-split">至</span>
                    <a-date-picker
                      v-model:value="searchFormData.createEndTime"
                      placeholder=""
                      value-format="YYYY-MM-DD 23:59:59"
                    />
                  </div>
                </j-form-item>
                <j-form-item label="发货人">
                  <user-selector v-model:value="searchFormData.deliveryBy" />
                </j-form-item>
                <j-form-item label="发货日期" :content-nest="false">
                  <div class="date-range-container">
                    <a-date-picker
                      v-model:value="searchFormData.deliveryStartTime"
                      placeholder=""
                      value-format="YYYY-MM-DD 00:00:00"
                    />
                    <span class="date-split">至</span>
                    <a-date-picker
                      v-model:value="searchFormData.deliveryEndTime"
                      placeholder=""
                      value-format="YYYY-MM-DD 23:59:59"
                    />
                  </div>
                </j-form-item>
                <j-form-item label="状态">
                  <a-select v-model:value="searchFormData.status" placeholder="全部" allow-clear>
                    <a-select-option
                      v-for="item in $enums.LOGISTICS_SHEET_STATUS.values()"
                      :key="item.code"
                      :value="item.code"
                      >{{ item.desc }}</a-select-option
                    >
                  </a-select>
                </j-form-item>
              </j-form>
            </j-border>
          </template>
          <!-- 工具栏 -->
          <template #toolbar_buttons>
            <a-space>
              <a-button type="primary" :icon="h(SearchOutlined)" @click="search">查询</a-button>
              <a-button
                v-permission="['logistics:sheet:add']"
                type="primary"
                :icon="h(PlusOutlined)"
                @click="$router.push('/logistics/sheet/add')"
                >新增</a-button
              >
              <a-button
                v-permission="['logistics:sheet:delivery']"
                :icon="h(CloudUploadOutlined)"
                @click="$refs.deliveryImporter.openDialog()"
                >批量Excel发货</a-button
              >
              <a-button
                v-permission="['logistics:sheet:delete']"
                danger
                :icon="h(DeleteOutlined)"
                @click="batchDelete"
                >批量删除</a-button
              >
              <a-button
                v-permission="['logistics:sheet:import']"
                :icon="h(CloudUploadOutlined)"
                @click="$refs.importer.openDialog()"
                >导入Excel</a-button
              >
              <a-button
                v-permission="['logistics:sheet:export']"
                :icon="h(DownloadOutlined)"
                @click="exportList"
                >导出</a-button
              >
            </a-space>
          </template>

          <!-- 操作 列自定义内容 -->
          <template #action_default="{ row }">
            <table-action outside :actions="createActions(row)" />
          </template>
        </vxe-grid>
      </page-wrapper>

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
  import { h, defineComponent } from 'vue';
  import Detail from './detail.vue';
  import ApproveRefuse from '@/components/ApproveRefuse';
  import moment from 'moment';
  import Delivery from './delivery.vue';
  import {
    SearchOutlined,
    PlusOutlined,
    CloudUploadOutlined,
    DeleteOutlined,
    DownloadOutlined,
  } from '@ant-design/icons-vue';
  import * as api from '@/api/sc/logistics/sheet';

  export default defineComponent({
    name: 'LogisticsSheet',
    components: {
      Detail,
      ApproveRefuse,
      Delivery,
    },
    setup() {
      return {
        h,
        SearchOutlined,
        PlusOutlined,
        CloudUploadOutlined,
        DeleteOutlined,
        DownloadOutlined,
      };
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
          createStartTime: this.$utils.formatDateTime(
            this.$utils.getDateTimeWithMinTime(moment().subtract(1, 'M')),
          ),
          createEndTime: this.$utils.formatDateTime(this.$utils.getDateTimeWithMaxTime(moment())),
          approveBy: '',
          approveStartTime: '',
          approveEndTime: '',
          status: undefined,
          saler: '',
        },
        // 工具栏配置
        toolbarConfig: {
          // 自定义左侧工具栏
          slots: {
            buttons: 'toolbar_buttons',
          },
        },
        // 列表数据配置
        tableColumn: [
          { type: 'checkbox', width: 45 },
          { field: 'code', title: '单据号', width: 180, sortable: true },
          { field: 'logisticsNo', title: '物流单号', width: 150, sortable: true },
          { field: 'logisticsCompanyName', title: '物流公司名称', width: 120 },
          { field: 'totalWeight', title: '总重量（kg）', width: 120 },
          { field: 'totalVolume', title: '总体积（cm³）', width: 120 },
          { field: 'totalAmount', title: '物流费（元）', width: 120 },
          { field: 'createTime', title: '操作时间', width: 170, sortable: true },
          { field: 'createBy', title: '操作人', width: 100 },
          {
            field: 'status',
            title: '状态',
            width: 100,
            formatter: ({ cellValue }) => {
              return this.$enums.LOGISTICS_SHEET_STATUS.getDesc(cellValue);
            },
          },
          { field: 'deliveryTime', title: '发货时间', width: 170, sortable: true },
          { field: 'deliveryBy', title: '发货人', width: 100 },
          { field: 'description', title: '备注', width: 200 },
          { title: '操作', width: 210, fixed: 'right', slots: { default: 'action_default' } },
        ],
        // 请求接口配置
        proxyConfig: {
          props: {
            // 响应结果列表字段
            result: 'datas',
            // 响应结果总条数字段
            total: 'totalCount',
          },
          ajax: {
            // 查询接口
            query: ({ page, sorts }) => {
              return api.query(this.buildQueryParams(page, sorts));
            },
          },
        },
      };
    },
    created() {},
    methods: {
      // 列表发生查询时的事件
      search() {
        this.$refs.grid.commitProxy('reload');
      },
      // 查询前构建查询参数结构
      buildQueryParams(page, sorts) {
        return {
          ...this.$utils.buildSortPageVo(page, sorts),
          ...this.buildSearchFormData(),
        };
      },
      // 查询前构建具体的查询参数
      buildSearchFormData() {
        const params = Object.assign({}, this.searchFormData, {
          customerId: this.searchFormData.customerId,
          scId: this.searchFormData.scId,
          createBy: this.searchFormData.createBy,
          approveBy: this.searchFormData.approveBy,
          salerId: this.searchFormData.saler,
        });

        return params;
      },
      // 删除订单
      deleteOrder(row) {
        this.$msg.createConfirm('对选中的物流单执行删除操作？').then(() => {
          this.loading = true;
          api
            .deleteById(row.id)
            .then(() => {
              this.$msg.createSuccess('删除成功！');
              this.search();
            })
            .finally(() => {
              this.loading = false;
            });
        });
      },
      // 批量删除
      batchDelete() {
        const records = this.$refs.grid.getCheckboxRecords();
        if (this.$utils.isEmpty(records)) {
          this.$msg.createError('请选择要执行操作的物流单！');
          return;
        }

        for (let i = 0; i < records.length; i++) {
          if (!this.$enums.LOGISTICS_SHEET_STATUS.CREATED.equalsCode(records[i].status)) {
            this.$msg.createError('第' + (i + 1) + '个物流单已发货，不允许执行删除操作！');
            return;
          }
        }

        this.$msg.createConfirm('对选中的物流单执行批量删除操作？').then(() => {
          this.loading = true;
          api
            .deleteByIds(records.map((item) => item.id))
            .then(() => {
              this.$msg.createSuccess('删除成功！');
              this.search();
            })
            .finally(() => {
              this.loading = false;
            });
        });
      },
      exportList() {
        this.loading = true;
        api
          .exportList(this.buildQueryParams({}))
          .then(() => {
            this.$msg.createSuccessTip('导出成功！');
          })
          .finally(() => {
            this.loading = false;
          });
      },
      createActions(row) {
        return [
          {
            label: '查看',
            onClick: () => {
              this.id = row.id;
              this.$nextTick(() => this.$refs.viewDialog.openDialog());
            },
          },
          {
            permission: ['logistics:sheet:modify'],
            label: '修改',
            ifShow: () => {
              return this.$enums.LOGISTICS_SHEET_STATUS.CREATED.equalsCode(row.status);
            },
            onClick: () => {
              this.$router.push('/logistics/sheet/modify/' + row.id);
            },
          },
          {
            permission: ['logistics:sheet:delivery'],
            label: '发货',
            ifShow: () => {
              return this.$enums.LOGISTICS_SHEET_STATUS.CREATED.equalsCode(row.status);
            },
            onClick: () => {
              this.id = row.id;
              this.$nextTick(() => this.$refs.deliveryDialog.openDialog());
            },
          },
          {
            permission: ['logistics:sheet:delete'],
            label: '删除',
            color: 'error',
            ifShow: () => {
              return this.$enums.LOGISTICS_SHEET_STATUS.CREATED.equalsCode(row.status);
            },
            onClick: () => {
              this.deleteOrder(row);
            },
          },
        ];
      },
    },
  });
</script>
<style scoped></style>
