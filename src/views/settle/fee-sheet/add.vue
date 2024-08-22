<template>
  <div class="simple-app-container">
    <div v-permission="['settle:fee-sheet:add']" v-loading="loading">
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
          <j-form-item label="收支方式" required>
            <a-select v-model:value="formData.sheetType" :disabled="!$utils.isEmpty(tableData)">
              <a-select-option
                v-for="item in $enums.SETTLE_FEE_SHEET_TYPE.values()"
                :key="item.code"
                :value="item.code"
                >{{ item.desc }}</a-select-option
              >
            </a-select>
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
      >
        <!-- 工具栏 -->
        <template #toolbar_buttons>
          <a-space>
            <a-button type="primary" :icon="h(PlusOutlined)" @click="addItem">新增</a-button>
            <a-button danger :icon="h(DeleteOutlined)" @click="delItem">删除</a-button>
          </a-space>
        </template>

        <!-- 项目 列自定义内容 -->
        <template #item_default="{ row }">
          <settle-in-item-selector
            v-if="$enums.SETTLE_FEE_SHEET_TYPE.RECEIVE.equalsCode(formData.sheetType)"
            v-model:value="row.item"
            @update:value="itemInput"
          />
          <settle-out-item-selector
            v-if="$enums.SETTLE_FEE_SHEET_TYPE.PAY.equalsCode(formData.sheetType)"
            v-model:value="row.item"
            @update:value="itemInput"
          />
        </template>

        <!-- 金额 列自定义内容 -->
        <template #amount_default="{ row }">
          <a-input
            v-model:value="row.amount"
            class="number-input"
            tabindex="2"
            @input="(e) => amountInput(row, e.target.value)"
          />
        </template>
      </vxe-grid>

      <j-border title="合计">
        <j-form label-width="140px">
          <j-form-item label="总金额" :span="6">
            <a-input v-model:value="formData.totalAmount" class="number-input" readonly />
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
            v-permission="['settle:fee-sheet:add']"
            type="primary"
            :loading="loading"
            @click="createOrder"
            >保存</a-button
          >
          <a-button
            v-permission="['settle:fee-sheet:approve']"
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
  import { PlusOutlined, DeleteOutlined } from '@ant-design/icons-vue';
  import * as api from '@/api/settle/fee';

  export default defineComponent({
    name: 'AddSettleFeeSheet',
    components: {},
    setup() {
      return { h, PlusOutlined, DeleteOutlined };
    },
    data() {
      return {
        // 是否显示加载框
        loading: false,
        // 表单数据
        formData: {},
        // 工具栏配置
        toolbarConfig: {
          // 缩放
          zoom: false,
          // 自定义表头
          custom: false,
          // 右侧是否显示刷新按钮
          refresh: false,
          // 自定义左侧工具栏
          slots: {
            buttons: 'toolbar_buttons',
          },
        },
        // 列表数据配置
        tableColumn: [
          { type: 'checkbox', width: 45 },
          { type: 'seq', width: 50 },
          { field: 'item', title: '项目', width: 200, slots: { default: 'item_default' } },
          {
            field: 'amount',
            title: '金额',
            align: 'right',
            width: 120,
            slots: { default: 'amount_default' },
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
          totalNum: 0,
          giftNum: 0,
          totalAmount: 0,
          description: '',
        };

        this.tableData = [];
      },
      emptyLine() {
        return {
          id: this.$utils.uuid(),
          item: '',
          amount: '',
        };
      },
      // 新增项目
      addItem() {
        if (this.$utils.isEmpty(this.formData.supplierId)) {
          this.$msg.createError('请先选择供应商！');
          return;
        }
        if (this.$utils.isEmpty(this.formData.sheetType)) {
          this.$msg.createError('请先选择收支方式！');
          return;
        }
        this.tableData.push(this.emptyLine());
      },
      // 删除项目
      delItem() {
        const records = this.$refs.grid.getCheckboxRecords();
        if (this.$utils.isEmpty(records)) {
          this.$msg.createError('请选择要删除的数据！');
          return;
        }
        this.$msg.createConfirm('是否确定删除选中的数据？').then(() => {
          const tableData = this.tableData.filter((t) => {
            const tmp = records.filter((item) => item.id === t.id);
            return this.$utils.isEmpty(tmp);
          });

          this.tableData = tableData;

          this.calcSum();
        });
      },
      itemInput(value) {
        this.calcSum();
      },
      amountInput(row, value) {
        this.calcSum();
      },
      // 计算汇总数据
      calcSum() {
        let totalAmount = 0;

        this.tableData
          .filter((t) => {
            return this.$utils.isFloatGeZero(t.amount) && !this.$utils.isEmpty(t.item);
          })
          .forEach((t) => {
            totalAmount = this.$utils.add(totalAmount, t.amount);
          });

        this.formData.totalAmount = totalAmount;
      },
      // 校验数据
      validData() {
        if (this.$utils.isEmpty(this.formData.supplierId)) {
          this.$msg.createError('供应商不允许为空！');
          return false;
        }

        if (this.$utils.isEmpty(this.formData.sheetType)) {
          this.$msg.createError('请选择收支方式！');
          return false;
        }

        if (this.$utils.isEmpty(this.tableData)) {
          this.$msg.createError('请录入项目！');
          return false;
        }

        for (let i = 0; i < this.tableData.length; i++) {
          const item = this.tableData[i];

          if (this.$utils.isEmpty(item.id)) {
            this.$msg.createError('第' + (i + 1) + '行项目不允许为空！');
            return false;
          }

          if (this.$utils.isEmpty(item.amount)) {
            this.$msg.createError('第' + (i + 1) + '行金额不允许为空！');
            return false;
          }

          if (!this.$utils.isFloat(item.amount)) {
            this.$msg.createError('第' + (i + 1) + '行金额必须为数字！');
            return false;
          }

          if (!this.$utils.isFloatGtZero(item.amount)) {
            this.$msg.createError('第' + (i + 1) + '行金额必须大于0！');
            return false;
          }

          if (!this.$utils.isNumberPrecision(item.amount, 2)) {
            this.$msg.createError('第' + (i + 1) + '行金额最多允许2位小数！');
            return false;
          }
        }

        return true;
      },
      // 创建订单
      createOrder() {
        if (!this.validData()) {
          return;
        }

        const params = {
          supplierId: this.formData.supplierId,
          sheetType: this.formData.sheetType,
          description: this.formData.description,
          items: this.tableData.map((t) => {
            return {
              id: t.item,
              amount: t.amount,
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

        const params = {
          supplierId: this.formData.supplierId,
          sheetType: this.formData.sheetType,
          description: this.formData.description,
          items: this.tableData.map((t) => {
            return {
              id: t.item,
              amount: t.amount,
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
    },
  });
</script>
<style></style>
