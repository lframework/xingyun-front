<template>
  <div>
    <!-- 数据列表 -->
    <vxe-grid
      ref="grid"
      resizable
      show-overflow
      highlight-hover-row
      keep-source
      row-id="id"
      height="300"
      :data="tableData"
      :columns="tableColumn"
      :toolbar-config="toolbarConfig"
    >
      <!-- 工具栏 -->
      <template #toolbar_buttons>
        <a-space v-if="!disabled">
          <a-button type="primary" :icon="h(PlusOutlined)" @click="addRow">新增</a-button>
          <a-button danger :icon="h(DeleteOutlined)" @click="delRow">删除</a-button>
        </a-space>
      </template>

      <!-- 支付方式 列自定义内容 -->
      <template #payType_default="{ row }">
        <pay-type-selector
          v-model:value="row.payTypeId"
          :disabled="disabled"
          @input-row="(e) => changePayType(row, e)"
        />
      </template>

      <!-- 支付金额 列自定义内容 -->
      <template #payAmount_default="{ row }">
        <a-input v-model:value="row.payAmount" :readonly="disabled" class="number-input" />
      </template>

      <!-- 支付记录 列自定义内容 -->
      <template #recText_default="{ row }">
        <a-input v-if="row.recText" v-model:value="row.text" :readonly="disabled" />
      </template>
    </vxe-grid>
  </div>
</template>
<script>
  import { h, defineComponent } from 'vue';
  import { PlusOutlined, DeleteOutlined } from '@ant-design/icons-vue';

  export default defineComponent({
    components: {},
    props: {
      disabled: {
        type: Boolean,
        default: false,
      },
    },
    setup() {
      return {
        h,
        PlusOutlined,
        DeleteOutlined,
      };
    },
    data() {
      return {
        // 是否显示加载框
        loading: false,
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
          {
            field: 'payType',
            title: '支付方式',
            width: 200,
            slots: { default: 'payType_default' },
          },
          {
            field: 'payAmount',
            title: '支付金额',
            width: 260,
            slots: { default: 'payAmount_default' },
          },
          {
            field: 'recText',
            title: '支付记录',
            width: 300,
            slots: { default: 'recText_default' },
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
      // 初始化表单数据
      initFormData() {
        this.tableData = [];
      },
      emptyRow() {
        return {
          id: this.$utils.uuid(),
          payTypeId: '',
          payAmount: '',
          recText: false,
          text: '',
        };
      },
      // 新增
      addRow() {
        this.tableData.push(this.emptyRow());
      },
      // 删除商品
      delRow() {
        const records = this.$refs.grid.getCheckboxRecords();
        if (this.$utils.isEmpty(records)) {
          this.$msg.createError('请选择要删除的支付方式！');
          return;
        }
        this.$msg.createConfirm('是否确定删除选中的支付方式？').then(() => {
          const tableData = this.tableData.filter((t) => {
            const tmp = records.filter((item) => item.id === t.id);
            return this.$utils.isEmpty(tmp);
          });

          this.tableData = tableData;

          this.calcSum();
        });
      },
      changePayType(row, e) {
        row.recText = false;
        if (!this.$utils.isEmpty(row.payTypeId)) {
          row.recText = e.recText;
        }
      },
      // 校验数据
      validData() {
        for (let i = 0; i < this.tableData.length; i++) {
          const row = this.tableData[i];

          if (this.$utils.isEmpty(row.payTypeId)) {
            this.$msg.createError('第' + (i + 1) + '行支付方式不允许为空！');
            return false;
          }

          if (this.$utils.isEmpty(row.payAmount)) {
            this.$msg.createError('第' + (i + 1) + '行支付方式支付金额不允许为空！');
            return false;
          }

          if (!this.$utils.isFloat(row.payAmount)) {
            this.$msg.createError('第' + (i + 1) + '行支付方式支付金额必须为数字！');
            return false;
          }

          if (!this.$utils.isFloatGtZero(row.payAmount)) {
            this.$msg.createError('第' + (i + 1) + '行支付方式支付金额必须大于0！');
            return false;
          }

          if (!this.$utils.isNumberPrecision(row.payAmount, 2)) {
            this.$msg.createError('第' + (i + 1) + '行支付方式支付金额最多允许2位小数！');
            return false;
          }

          if (row.recText) {
            if (this.$utils.isEmpty(row.text)) {
              this.$msg.createError('第' + (i + 1) + '行支付方式支付记录不允许为空！');
              return false;
            }
          }
        }

        return true;
      },
      setTableData(tableData) {
        if (!this.$utils.isEmpty(tableData)) {
          this.tableData = tableData.map((item) => {
            return Object.assign({}, this.emptyRow(), item);
          });
        }
      },
      getTableData() {
        return this.tableData;
      },
    },
  });
</script>
<style></style>
