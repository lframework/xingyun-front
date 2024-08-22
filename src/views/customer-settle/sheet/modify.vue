<template>
  <div class="simple-app-container">
    <div v-permission="['customer-settle:sheet:modify']" v-loading="loading">
      <j-border>
        <j-form>
          <j-form-item label="客户" required>
            <customer-selector v-model:value="formData.customerId" />
          </j-form-item>
          <j-form-item label="审核日期" :content-nest="false" required>
            <div class="date-range-container">
              <a-date-picker
                v-model:value="formData.startTime"
                placeholder=""
                value-format="YYYY-MM-DD 00:00:00"
                disabled
              />
              <span class="date-split">至</span>
              <a-date-picker
                v-model:value="formData.endTime"
                placeholder=""
                value-format="YYYY-MM-DD 23:59:59"
                disabled
              />
            </div>
          </j-form-item>
          <j-form-item />
          <j-form-item label="状态">
            <span
              v-if="$enums.CUSTOMER_SETTLE_SHEET_STATUS.APPROVE_PASS.equalsCode(formData.status)"
              style="color: #52c41a"
              >{{ $enums.CUSTOMER_SETTLE_SHEET_STATUS.getDesc(formData.status) }}</span
            >
            <span
              v-else-if="
                $enums.CUSTOMER_SETTLE_SHEET_STATUS.APPROVE_REFUSE.equalsCode(formData.status)
              "
              style="color: #f5222d"
              >{{ $enums.CUSTOMER_SETTLE_SHEET_STATUS.getDesc(formData.status) }}</span
            >
            <span v-else style="color: #303133">{{
              $enums.CUSTOMER_SETTLE_SHEET_STATUS.getDesc(formData.status)
            }}</span>
          </j-form-item>
          <j-form-item label="拒绝理由" :content-nest="false" :span="16">
            <a-input
              v-if="$enums.CUSTOMER_SETTLE_SHEET_STATUS.APPROVE_REFUSE.equalsCode(formData.status)"
              v-model:value="formData.refuseReason"
              readonly
            />
          </j-form-item>
          <j-form-item label="操作人">
            <span>{{ formData.createBy }}</span>
          </j-form-item>
          <j-form-item label="操作时间">
            <span>{{ formData.createTime }}</span>
          </j-form-item>
          <j-form-item
            v-if="
              $enums.CUSTOMER_SETTLE_SHEET_STATUS.APPROVE_PASS.equalsCode(formData.status) ||
              $enums.CUSTOMER_SETTLE_SHEET_STATUS.APPROVE_REFUSE.equalsCode(formData.status)
            "
            label="审核人"
          >
            <span>{{ formData.approveBy }}</span>
          </j-form-item>
          <j-form-item
            v-if="
              $enums.CUSTOMER_SETTLE_SHEET_STATUS.APPROVE_PASS.equalsCode(formData.status) ||
              $enums.CUSTOMER_SETTLE_SHEET_STATUS.APPROVE_REFUSE.equalsCode(formData.status)
            "
            label="审核时间"
            :span="16"
          >
            <span>{{ formData.approveTime }}</span>
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
            <a-button type="primary" :icon="h(SearchOutlined)" @click="searchUnSettleItems"
              >查询</a-button
            >
          </a-space>
        </template>

        <!-- 已收款金额 列自定义内容 -->
        <template #totalPayedAmount_default="{ row }">
          <span v-if="$utils.isFloat(row.payAmount)">{{
            $utils.add(row.totalPayedAmount, row.payAmount)
          }}</span>
          <span v-else>{{ row.totalPayedAmount }}</span>
        </template>

        <!-- 已优惠金额 列自定义内容 -->
        <template #totalDiscountAmount_default="{ row }">
          <span v-if="$utils.isFloat(row.discountAmount)">{{
            $utils.add(row.totalDiscountAmount, row.discountAmount)
          }}</span>
          <span v-else>{{ row.totalDiscountAmount }}</span>
        </template>

        <!-- 未收款金额 列自定义内容 -->
        <template #totalUnPayAmount_default="{ row }">
          <span>{{
            $utils.sub(
              $utils.sub(row.totalUnPayAmount, $utils.isFloat(row.payAmount) ? row.payAmount : 0),
              $utils.isFloat(row.discountAmount) ? row.discountAmount : 0,
            )
          }}</span>
        </template>

        <!-- 实收金额 列自定义内容 -->
        <template #payAmount_default="{ row }">
          <a-input
            v-model:value="row.payAmount"
            class="number-input"
            tabindex="1"
            @change="(e) => payAmountInput(row, e.target.value)"
          />
        </template>

        <!-- 优惠金额 列自定义内容 -->
        <template #discountAmount_default="{ row }">
          <a-input
            v-model:value="row.discountAmount"
            class="number-input"
            tabindex="1"
            @change="(e) => discountAmountInput(row, e.target.value)"
          />
        </template>

        <!-- 备注 列自定义内容 -->
        <template #description_default="{ row }">
          <a-input v-model:value="row.description" tabindex="2" />
        </template>
      </vxe-grid>

      <order-time-line :id="id" />

      <j-border title="合计">
        <j-form label-width="140px">
          <j-form-item label="未收款总金额" :span="6">
            <a-input v-model:value="formData.totalUnPayAmount" class="number-input" readonly />
          </j-form-item>
          <j-form-item label="实收总金额" :span="6">
            <a-input v-model:value="formData.totalAmount" class="number-input" readonly />
          </j-form-item>
          <j-form-item label="优惠总金额" :span="6">
            <a-input v-model:value="formData.totalDiscountAmount" class="number-input" readonly />
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
            v-permission="['customer-settle:sheet:modify']"
            type="primary"
            :loading="loading"
            @click="updateOrder"
            >保存</a-button
          >
          <a-button :loading="loading" @click="closeDialog">关闭</a-button>
        </a-space>
      </div>
    </div>
  </div>
</template>
<script>
  import { h, defineComponent } from 'vue';
  import { SearchOutlined } from '@ant-design/icons-vue';
  import * as api from '@/api/customer-settle/sheet';

  export default defineComponent({
    name: 'ModifySettleSheet',
    components: {},
    setup() {
      return {
        h,
        SearchOutlined,
      };
    },
    data() {
      return {
        id: this.$route.params.id,
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
          { field: 'bizCode', title: '单据号', width: 200 },
          {
            field: 'bizType',
            title: '单据类型',
            width: 120,
            formatter: ({ cellValue }) => {
              return '客户对账单';
            },
          },
          { field: 'approveTime', title: '审核时间', width: 170 },
          { field: 'totalPayAmount', title: '应收金额', align: 'right', width: 100 },
          {
            field: 'totalPayedAmount',
            title: '已收款金额',
            align: 'right',
            width: 100,
            slots: { default: 'totalPayedAmount_default' },
          },
          {
            field: 'totalDiscountAmount',
            title: '已优惠金额',
            align: 'right',
            width: 100,
            slots: { default: 'totalDiscountAmount_default' },
          },
          {
            field: 'totalUnPayAmount',
            title: '未收款金额',
            align: 'right',
            width: 100,
            slots: { default: 'totalUnPayAmount_default' },
          },
          {
            field: 'payAmount',
            title: '实收金额',
            align: 'right',
            width: 100,
            slots: { default: 'payAmount_default' },
          },
          {
            field: 'discountAmount',
            title: '优惠金额',
            align: 'right',
            width: 100,
            slots: { default: 'discountAmount_default' },
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
        this.loadData();
      },
      // 关闭对话框
      closeDialog() {
        this.$utils.closeCurrentPage();
      },
      // 初始化表单数据
      initFormData() {
        this.formData = {
          customerId: '',
          startTime: '',
          endTime: '',
          description: '',
          totalAmount: 0,
          totalUnPayAmount: 0,
          totalDiscountAmount: 0,
        };

        this.tableData = [];
      },
      // 加载数据
      loadData() {
        this.loading = true;
        api
          .get(this.id)
          .then((res) => {
            if (
              !this.$enums.CUSTOMER_SETTLE_SHEET_STATUS.CREATED.equalsCode(res.status) &&
              !this.$enums.CUSTOMER_SETTLE_SHEET_STATUS.APPROVE_REFUSE.equalsCode(res.status)
            ) {
              this.$msg.createError('单据已审核通过，无法修改！');
              this.closeDialog();
              return;
            }
            this.initFormData();
            this.formData = Object.assign(this.formData, {
              customerId: res.customerId,
              description: res.description,
              startTime: res.startTime,
              endTime: res.endTime,
              status: res.status,
              createBy: res.createBy,
              createTime: res.createTime,
              approveBy: res.approveBy,
              approveTime: res.approveTime,
              refuseReason: res.refuseReason,
              totalAmount: 0,
              totalUnPayAmount: 0,
              totalDiscountAmount: 0,
            });
            const details = res.details.map((item) => {
              return Object.assign(this.emptyLine(), {
                id: item.id,
                bizId: item.bizId,
                bizCode: item.bizCode,
                totalPayAmount: item.totalPayAmount,
                totalPayedAmount: item.totalPayedAmount,
                totalDiscountAmount: item.totalDiscountAmount,
                totalUnPayAmount: item.totalUnPayAmount,
                payAmount: item.payAmount,
                discountAmount: item.discountAmount,
                approveTime: item.approveTime,
                description: item.description,
              });
            });

            this.tableData = details;

            this.$nextTick(() => {
              this.$refs.grid.setAllCheckboxRow(true);
              this.calcSum();
            });
          })
          .finally(() => {
            this.loading = false;
          });
      },
      emptyLine() {
        return {
          id: this.$utils.uuid(),
          bizCode: '',
          bizType: '客户对账单',
          totalPayAmount: '',
          totalPayedAmount: '',
          totalDiscountAmount: '',
          totalUnPayAmount: '',
          payAmount: '',
          discountAmount: '',
          approveTime: '',
          description: '',
        };
      },
      payAmountInput(row, value) {
        this.calcSum();
      },
      discountAmountInput(row, value) {
        const diff = this.$utils.sub(
          this.$utils.sub(
            row.totalUnPayAmount,
            this.$utils.isFloat(row.payAmount) ? row.payAmount : 0,
          ),
          this.$utils.isFloat(value) ? value : 0,
        );
        if (diff < 0) {
          if (this.$utils.isFloat(row.payAmount)) {
            row.payAmount += diff;
          }
        }
        this.calcSum();
      },
      // 计算汇总数据
      calcSum() {
        let totalAmount = 0;
        let totalUnPayAmount = 0;
        let totalDiscountAmount = 0;
        const records = this.$refs.grid.getCheckboxRecords();
        if (!this.$utils.isEmpty(records)) {
          records.forEach((item) => {
            if (this.$utils.isFloat(item.payAmount)) {
              totalAmount = this.$utils.add(totalAmount, item.payAmount);
            }

            if (this.$utils.isFloat(item.discountAmount)) {
              totalDiscountAmount = this.$utils.add(
                totalDiscountAmount,
                this.$utils.add(item.discountAmount, item.totalDiscountAmount),
              );
            } else {
              totalDiscountAmount = this.$utils.add(totalDiscountAmount, item.totalDiscountAmount);
            }

            totalUnPayAmount = this.$utils.add(
              totalUnPayAmount,
              this.$utils.sub(
                this.$utils.sub(
                  item.totalUnPayAmount,
                  this.$utils.isFloat(item.payAmount) ? item.payAmount : 0,
                ),
                this.$utils.isFloat(item.discountAmount) ? item.discountAmount : 0,
              ),
            );
          });
        }

        this.formData.totalAmount = totalAmount;
        this.formData.totalUnPayAmount = totalUnPayAmount;
        this.formData.totalDiscountAmount = totalDiscountAmount;
      },
      // 校验数据
      validData() {
        if (this.$utils.isEmpty(this.formData.customerId)) {
          this.$msg.createError('客户不允许为空！');
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
            this.$msg.createError('第' + (i + 1) + '行实收金额不能为空！');
            return false;
          }

          if (!this.$utils.isFloat(item.payAmount)) {
            this.$msg.createError('第' + (i + 1) + '行实收金额必须为数字！');
            return false;
          }

          if (!this.$utils.isNumberPrecision(item.payAmount, 2)) {
            this.$msg.createError('第' + (i + 1) + '行实收金额最多允许2位小数！');
            return false;
          }

          if (this.$utils.isEmpty(item.discountAmount)) {
            this.$msg.createError('第' + (i + 1) + '行优惠金额不能为空！');
            return false;
          }

          if (!this.$utils.isFloat(item.discountAmount)) {
            this.$msg.createError('第' + (i + 1) + '行优惠金额必须为数字！');
            return false;
          }

          if (!this.$utils.isNumberPrecision(item.discountAmount, 2)) {
            this.$msg.createError('第' + (i + 1) + '行优惠金额最多允许2位小数！');
            return false;
          }

          if (item.totalPayAmount > 0) {
            if (item.payAmount < 0) {
              this.$msg.createError('第' + (i + 1) + '行实收金额不允许小于0！');
              return false;
            }

            if (item.discountAmount < 0) {
              this.$msg.createError('第' + (i + 1) + '行优惠金额不允许小于0！');
              return false;
            }

            if (this.$utils.add(item.payAmount, item.discountAmount) === 0) {
              this.$msg.createError('第' + (i + 1) + '行实收金额、优惠金额不允许同时等于0！');
              return false;
            }
            if (item.totalUnPayAmount < this.$utils.add(item.payAmount, item.discountAmount)) {
              this.$msg.createError(
                '第' + (i + 1) + '行实收金额与优惠金额相加不允许大于未收款金额！',
              );
              return false;
            }
          } else if (item.totalPayAmount < 0) {
            if (item.payAmount > 0) {
              this.$msg.createError('第' + (i + 1) + '行实收金额不允许大于0！');
              return false;
            }

            if (item.discountAmount > 0) {
              this.$msg.createError('第' + (i + 1) + '行优惠金额不允许大于0！');
              return false;
            }

            if (this.$utils.add(item.payAmount, item.discountAmount) === 0) {
              this.$msg.createError('第' + (i + 1) + '行实收金额、优惠金额不允许同时等于0！');
              return false;
            }
            if (item.totalUnPayAmount > this.$utils.add(item.payAmount, item.discountAmount)) {
              this.$msg.createError(
                '第' + (i + 1) + '行实收金额与优惠金额相加不允许小于未收款金额！',
              );
              return false;
            }
          } else {
            if (this.$utils.add(item.payAmount, item.discountAmount) !== 0) {
              this.$msg.createError('第' + (i + 1) + '行实收金额、优惠金额必须同时等于0！');
              return false;
            }
          }
        }

        return true;
      },
      // 创建订单
      updateOrder() {
        if (!this.validData()) {
          return;
        }

        const records = this.$refs.grid.getCheckboxRecords();

        const params = {
          id: this.id,
          customerId: this.formData.customerId,
          description: this.formData.description,
          startDate: this.$utils.dateTimeToDate(this.formData.startTime),
          endDate: this.$utils.dateTimeToDate(this.formData.endTime),
          items: records.map((t) => {
            return {
              id: t.bizId,
              payAmount: t.payAmount,
              discountAmount: t.discountAmount,
              description: t.description,
            };
          }),
        };

        this.loading = true;
        api
          .update(params)
          .then((res) => {
            this.$msg.createSuccess('保存成功！');

            this.$emit('confirm');
            this.closeDialog();
          })
          .finally(() => {
            this.loading = false;
          });
      },
      searchUnSettleItems() {
        if (this.$utils.isEmpty(this.formData.customerId)) {
          this.$msg.createError('请先选择客户！');
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
          .getUnSettleItems({
            customerId: this.formData.customerId,
            startTime: this.formData.startTime,
            endTime: this.formData.endTime,
          })
          .then((res) => {
            const tmpData = [];
            if (!this.$utils.isEmpty(res)) {
              res.forEach((item) => {
                const obj = Object.assign(this.emptyLine(), item);
                obj.payAmount = obj.totalUnPayAmount;
                obj.discountAmount = 0;
                tmpData.push(obj);
              });

              const tableData = [...this.tableData];
              const bizIds = this.tableData.map((item) => {
                return item.bizId;
              });
              tmpData.forEach((item) => {
                if (!bizIds.includes(item.bizId)) {
                  tableData.push(item);
                }
              });

              this.tableData = tableData;
            }

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
