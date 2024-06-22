<template>
  <div class="simple-app-container">
    <div v-permission="['settle:check-sheet:add']" v-loading="loading">
      <j-border>
        <j-form>
          <j-form-item label="供应商" required>
            <supplier-selector
              v-model:value="formData.supplierId"
              :request-params="{
                manageType: $enums.MANAGE_TYPE.DISTRIBUTION.code,
              }"
            />
          </j-form-item>
          <j-form-item label="审核日期" :content-nest="false" required>
            <div class="date-range-container">
              <a-date-picker
                v-model:value="formData.startTime"
                placeholder=""
                value-format="YYYY-MM-DD 00:00:00"
              />
              <span class="date-split">至</span>
              <a-date-picker
                v-model:value="formData.endTime"
                placeholder=""
                value-format="YYYY-MM-DD 23:59:59"
              />
            </div>
          </j-form-item>
        </j-form>
      </j-border>
      <!-- 数据列表 -->
      <vxe-grid
        ref="grid"
        resizable
        show-overflow
        highlight-hover-row
        keep-source
        row-id="id"
        height="500"
        :data="tableData"
        :columns="tableColumn"
        :toolbar-config="toolbarConfig"
        @checkbox-change="calcSum"
      >
        <!-- 工具栏 -->
        <template #toolbar_buttons>
          <a-space>
            <a-button type="primary" :icon="h(SearchOutlined)" @click="searchUnCheckItems"
              >查询</a-button
            >
          </a-space>
        </template>

        <!-- 应付金额 列自定义内容 -->
        <template #payAmount_default="{ row }">
          <a-input
            v-model:value="row.payAmount"
            class="number-input"
            tabindex="1"
            @change="(e) => payAmountInput(row, e.target.value)"
          />
        </template>

        <!-- 备注 列自定义内容 -->
        <template #description_default="{ row }">
          <a-input v-model:value="row.description" tabindex="2" />
        </template>
      </vxe-grid>

      <j-border title="合计">
        <j-form label-width="140px">
          <j-form-item label="单据总金额" :span="6">
            <a-input v-model:value="formData.totalAmount" class="number-input" readonly />
          </j-form-item>
          <j-form-item label="应付总金额" :span="6">
            <a-input v-model:value="formData.totalPayAmount" class="number-input" readonly />
          </j-form-item>
        </j-form>
      </j-border>

      <j-border>
        <j-form label-width="140px">
          <j-form-item label="备注" :span="24" :content-nest="false">
            <a-textarea v-model:value.trim="formData.description" maxlength="200" />
          </j-form-item>
        </j-form>
      </j-border>
      <div style="text-align: center; background-color: #ffffff; padding: 8px 0">
        <a-space>
          <a-button
            v-permission="['settle:check-sheet:add']"
            type="primary"
            :loading="loading"
            @click="createOrder"
            >保存</a-button
          >
          <a-button
            v-permission="['settle:check-sheet:approve']"
            type="primary"
            :loading="loading"
            @click="directApprovePassOrder"
            >审核通过</a-button
          >
          <a-button :loading="loading" @click="closeDialog">关闭</a-button>
        </a-space>
      </div>
    </div>
  </div>
</template>
<script>
  import { h, defineComponent } from 'vue';
  import moment from 'moment';
  import { SearchOutlined } from '@ant-design/icons-vue';
  import * as api from '@/api/settle/check';

  export default defineComponent({
    name: 'AddSettlePreSheet',
    components: {},
    setup() {
      return {
        h,
        SearchOutlined,
      };
    },
    data() {
      return {
        // 是否显示加载框
        loading: false,
        // 工具栏配置
        toolbarConfig: {
          // 自定义左侧工具栏
          slots: {
            buttons: 'toolbar_buttons',
          },
        },
        // 表单数据
        formData: {},
        // 列表数据配置
        tableColumn: [
          { type: 'checkbox', width: 45 },
          { type: 'seq', width: 50 },
          { field: 'code', title: '单据号', width: 200 },
          {
            field: 'bizType',
            title: '单据类型',
            width: 120,
            formatter: ({ cellValue }) => {
              return this.$enums.SETTLE_CHECK_SHEET_BIZ_TYPE.getDesc(cellValue);
            },
          },
          { field: 'approveTime', title: '审核时间', width: 170 },
          { field: 'totalAmount', title: '单据金额', align: 'right', width: 100 },
          {
            field: 'payAmount',
            title: '应付金额',
            align: 'right',
            width: 100,
            slots: { default: 'payAmount_default' },
          },
          {
            field: 'description',
            title: '备注',
            width: 260,
            slots: { default: 'description_default' },
          },
        ],
        tableData: [],
      };
    },
    computed: {},
    created() {
      this.openDialog();
    },
    methods: {
      // 打开对话框 由父页面触发
      openDialog() {
        // 初始化表单数据
        this.initFormData();
      },
      // 关闭对话框
      closeDialog() {
        this.$utils.closeCurrentPage();
      },
      // 初始化表单数据
      initFormData() {
        this.formData = {
          supplierId: '',
          startTime: this.$utils.formatDateTime(
            this.$utils.getDateTimeWithMinTime(moment().subtract(1, 'M')),
          ),
          endTime: this.$utils.formatDateTime(this.$utils.getDateTimeWithMaxTime(moment())),
          description: '',
          totalAmount: 0,
          totalPayAmount: 0,
        };

        this.tableData = [];
      },
      emptyLine() {
        return {
          id: this.$utils.uuid(),
          code: '',
          bizType: '',
          calcType: '',
          totalAmount: '',
          payAmount: '',
          approveTime: '',
          description: '',
        };
      },
      payAmountInput(row, value) {
        this.calcSum();
      },
      // 计算汇总数据
      calcSum() {
        let totalAmount = 0;
        let totalPayAmount = 0;
        const records = this.$refs.grid.getCheckboxRecords();
        if (!this.$utils.isEmpty(records)) {
          records.forEach((item) => {
            if (this.$utils.isFloat(item.totalAmount)) {
              totalAmount = this.$utils.add(totalAmount, item.totalAmount);
            }

            if (this.$utils.isFloat(item.payAmount)) {
              totalPayAmount = this.$utils.add(totalPayAmount, item.payAmount);
            }
          });
        }

        this.formData.totalAmount = totalAmount;
        this.formData.totalPayAmount = totalPayAmount;
      },
      // 校验数据
      validData() {
        if (this.$utils.isEmpty(this.formData.supplierId)) {
          this.$msg.createError('供应商不允许为空！');
          return false;
        }

        if (this.$utils.isEmpty(this.formData.startTime)) {
          this.$msg.createError('审核起始日期不能为空！');
          return;
        }

        if (this.$utils.isEmpty(this.formData.endTime)) {
          this.$msg.createError('审核截止日期不能为空！');
          return;
        }

        const records = this.$refs.grid.getCheckboxRecords();
        if (this.$utils.isEmpty(records)) {
          this.$msg.createError('请选择业务单据！');
          return false;
        }

        for (let i = 0; i < records.length; i++) {
          const item = records[i];

          if (this.$utils.isEmpty(item.payAmount)) {
            this.$msg.createError('第' + (i + 1) + '行应付金额不能为空！');
            return false;
          }

          if (!this.$utils.isFloat(item.payAmount)) {
            this.$msg.createError('第' + (i + 1) + '行应付金额必须为数字！');
            return false;
          }

          if (!this.$utils.isNumberPrecision(item.payAmount, 2)) {
            this.$msg.createError('第' + (i + 1) + '行应付金额最多允许2位小数！');
            return false;
          }

          if (this.$enums.SETTLE_CHECK_SHEET_CALC_TYPE.SUB.equalsCode(item.calcType)) {
            if (item.payAmount > 0) {
              this.$msg.createError('第' + (i + 1) + '行应付金额不允许大于0！');
              return false;
            }
          }

          if (this.$enums.SETTLE_CHECK_SHEET_CALC_TYPE.ADD.equalsCode(item.calcType)) {
            if (item.payAmount < 0) {
              this.$msg.createError('第' + (i + 1) + '行应付金额不允许小于0！');
              return false;
            }
          }
        }

        return true;
      },
      // 创建订单
      createOrder() {
        if (!this.validData()) {
          return;
        }

        const records = this.$refs.grid.getCheckboxRecords();

        const params = {
          supplierId: this.formData.supplierId,
          description: this.formData.description,
          startDate: this.$utils.dateTimeToDate(this.formData.startTime),
          endDate: this.$utils.dateTimeToDate(this.formData.endTime),
          items: records.map((t) => {
            return {
              id: t.id,
              bizType: t.bizType,
              payAmount: t.payAmount,
              description: t.description,
            };
          }),
        };

        this.loading = true;
        api
          .create(params)
          .then((res) => {
            this.$msg.createSuccess('保存成功！');

            this.$emit('confirm');
            this.closeDialog();
          })
          .finally(() => {
            this.loading = false;
          });
      },
      // 直接审核通过订单
      directApprovePassOrder() {
        if (!this.validData()) {
          return;
        }

        const records = this.$refs.grid.getCheckboxRecords();

        const params = {
          supplierId: this.formData.supplierId,
          description: this.formData.description,
          startDate: this.$utils.dateTimeToDate(this.formData.startTime),
          endDate: this.$utils.dateTimeToDate(this.formData.endTime),
          items: records.map((t) => {
            return {
              id: t.id,
              bizType: t.bizType,
              payAmount: t.payAmount,
              description: t.description,
            };
          }),
        };

        this.$msg.createConfirm('确定执行审核通过操作？').then(() => {
          this.loading = true;
          api
            .directApprovePass(params)
            .then((res) => {
              this.$msg.createSuccess('审核通过！');

              this.$emit('confirm');
              this.closeDialog();
            })
            .finally(() => {
              this.loading = false;
            });
        });
      },
      searchUnCheckItems() {
        if (this.$utils.isEmpty(this.formData.supplierId)) {
          this.$msg.createError('请先选择供应商！');
          return;
        }

        if (this.$utils.isEmpty(this.formData.startTime)) {
          this.$msg.createError('审核起始日期不能为空！');
          return;
        }

        if (this.$utils.isEmpty(this.formData.endTime)) {
          this.$msg.createError('审核截止日期不能为空！');
          return;
        }

        this.loading = true;
        api
          .getUnCheckItems({
            supplierId: this.formData.supplierId,
            startTime: this.formData.startTime,
            endTime: this.formData.endTime,
          })
          .then((res) => {
            const tableData = [];
            if (!this.$utils.isEmpty(res)) {
              res.forEach((item) => {
                const obj = Object.assign(this.emptyLine(), item);
                obj.payAmount = obj.totalAmount;
                tableData.push(obj);
              });
            }
            this.tableData = tableData;
            this.$nextTick(() => {
              this.$refs.grid.setAllCheckboxRow(true);
              this.calcSum();
            });
          })
          .finally(() => {
            this.loading = false;
          });
      },
    },
  });
</script>
<style></style>
