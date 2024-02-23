<template>
  <div class="simple-app-container">
    <div v-permission="['purchase:order:add']" v-loading="loading">
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
        <template #form>
          <j-border>
            <j-form>
              <j-form-item label="仓库" required>
                <store-center-selector v-model:value="formData.scId" />
              </j-form-item>
              <j-form-item label="供应商" required>
                <supplier-selector v-model:value="formData.supplierId" />
              </j-form-item>
              <j-form-item label="采购员">
                <user-selector v-model:value="formData.purchaserId" />
              </j-form-item>
              <j-form-item label="预计到货日期" required>
                <a-date-picker
                  v-model:value="formData.expectArriveDate"
                  placeholder=""
                  value-format="YYYY-MM-DD"
                />
              </j-form-item>
            </j-form>
          </j-border>
        </template>
        <!-- 工具栏 -->
        <template #toolbar_buttons>
          <a-space>
            <a-button type="primary" :icon="h(PlusOutlined)" @click="addProduct">新增</a-button>
            <a-button :icon="h(DeleteOutlined)" @click="delProduct" danger>删除</a-button>
            <a-button :icon="h(PlusOutlined)" @click="openBatchAddProductDialog"
              >批量添加商品</a-button
            >
            <a-button :icon="h(NumberOutlined)" @click="batchInputPurchaseNum"
              >批量录入数量</a-button
            >
            <a-button :icon="h(EditOutlined)" @click="batchInputPurchasePrice"
              >批量调整采购价</a-button
            >
            <a-button :icon="h(AlertOutlined)" @click="setGift">设置赠品</a-button>
          </a-space>
        </template>

        <!-- 商品名称 列自定义内容 -->
        <template #productName_default="{ row, rowIndex }">
          <a-auto-complete
            v-model:value="row.productName"
            style="width: 100%"
            placeholder=""
            value-key="productName"
            :options="row.productOptions"
            @search="(e) => queryProduct(e, row)"
            @select="(e) => handleSelectProduct(rowIndex, e, row)"
          />
        </template>

        <!-- 采购价 列自定义内容 -->
        <template #purchasePrice_default="{ row }">
          <span v-if="row.isGift">{{ row.purchasePrice }}</span>
          <a-input
            v-else
            v-model:value="row.purchasePrice"
            class="number-input"
            @input="(e) => purchasePriceInput(row, e.target.value)"
          />
        </template>

        <!-- 采购数量 列自定义内容 -->
        <template #purchaseNum_default="{ row }">
          <a-input
            v-model:value="row.purchaseNum"
            class="number-input"
            @input="(e) => purchaseNumInput(e.target.value)"
          />
        </template>

        <!-- 采购含税金额 列自定义内容 -->
        <template #purchaseAmount_default="{ row }">
          <span
            v-if="$utils.isFloatGeZero(row.purchasePrice) && $utils.isFloatGeZero(row.purchaseNum)"
            >{{ $utils.mul(row.purchasePrice, row.purchaseNum) }}</span
          >
        </template>

        <!-- 备注 列自定义内容 -->
        <template #description_default="{ row }">
          <a-input v-model:value="row.description" />
        </template>
      </vxe-grid>

      <j-border title="合计">
        <j-form label-width="140px">
          <j-form-item label="采购数量" :span="6">
            <a-input v-model:value="formData.totalNum" class="number-input" readonly />
          </j-form-item>
          <j-form-item label="赠品数量" :span="6">
            <a-input v-model:value="formData.giftNum" class="number-input" readonly />
          </j-form-item>
          <j-form-item label="含税总金额" :span="6">
            <a-input v-model:value="formData.totalAmount" class="number-input" readonly />
          </j-form-item>
        </j-form>
      </j-border>

      <j-border title="约定支付">
        <pay-type ref="payType" />
      </j-border>

      <j-border>
        <j-form label-width="140px">
          <j-form-item label="备注" :span="24" :content-nest="false">
            <a-textarea v-model:value.trim="formData.description" maxlength="200" />
          </j-form-item>
        </j-form>
      </j-border>
      <batch-add-product
        ref="batchAddProductDialog"
        :sc-id="formData.scId"
        @confirm="batchAddProduct"
      />

      <div style="text-align: center; background-color: #ffffff; padding: 8px 0">
        <a-space>
          <a-button
            v-permission="['purchase:order:add']"
            type="primary"
            :loading="loading"
            @click="createOrder"
            >保存</a-button
          >
          <a-button
            v-permission="['purchase:order:approve']"
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
  import BatchAddProduct from '@/views/sc/purchase/batch-add-product.vue';
  import Moment from 'moment';
  import PayType from '@/views/sc/pay-type/index.vue';
  import {
    PlusOutlined,
    DeleteOutlined,
    NumberOutlined,
    EditOutlined,
    AlertOutlined,
  } from '@ant-design/icons-vue';
  import * as api from '@/api/sc/purchase/order';

  export default defineComponent({
    name: 'AddPurchaseOrder',
    components: {
      BatchAddProduct,
      PayType,
    },
    setup() {
      return {
        h,
        PlusOutlined,
        DeleteOutlined,
        NumberOutlined,
        EditOutlined,
        AlertOutlined,
      };
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
          { field: 'productCode', title: '商品编号', width: 120 },
          {
            field: 'productName',
            title: '商品名称',
            width: 260,
            slots: { default: 'productName_default' },
          },
          { field: 'skuCode', title: '商品SKU编号', width: 120 },
          { field: 'externalCode', title: '商品外部编号', width: 120 },
          { field: 'unit', title: '单位', width: 80 },
          { field: 'spec', title: '规格', width: 80 },
          { field: 'categoryName', title: '商品类目', width: 120 },
          { field: 'brandName', title: '商品品牌', width: 120 },
          {
            field: 'purchasePrice',
            title: '采购价（元）',
            align: 'right',
            width: 120,
            slots: { default: 'purchasePrice_default' },
          },
          { field: 'taxRate', title: '税率（%）', align: 'right', width: 100 },
          {
            field: 'isGift',
            title: '是否赠品',
            width: 80,
            formatter: ({ cellValue }) => {
              return cellValue ? '是' : '否';
            },
          },
          { field: 'taxCostPrice', title: '含税成本价（元）', align: 'right', width: 140 },
          { field: 'stockNum', title: '库存数量', align: 'right', width: 100 },
          {
            field: 'purchaseNum',
            title: '采购数量',
            align: 'right',
            width: 100,
            slots: { default: 'purchaseNum_default' },
          },
          {
            field: 'purchaseAmount',
            title: '采购含税金额',
            align: 'right',
            width: 120,
            slots: { default: 'purchaseAmount_default' },
          },
          {
            field: 'description',
            title: '备注',
            width: 200,
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
          scId: '',
          supplierId: '',
          purchaserId: '',
          expectArriveDate: this.$utils.formatDate(Moment().add(1, 'M')),
          totalNum: 0,
          giftNum: 0,
          totalAmount: 0,
          description: '',
        };

        this.tableData = [];
      },
      emptyProduct() {
        return {
          id: this.$utils.uuid(),
          productId: '',
          productCode: '',
          productName: '',
          skuCode: '',
          externalCode: '',
          unit: '',
          spec: '',
          categoryName: '',
          brandName: '',
          purchasePrice: '',
          taxCostPrice: '',
          stockNum: '',
          taxRate: '',
          isGift: false,
          purchaseNum: '',
          purchaseAmount: '',
          description: '',
          products: [],
        };
      },
      // 新增商品
      addProduct() {
        if (this.$utils.isEmpty(this.formData.scId)) {
          this.$msg.createError('请先选择仓库！');
          return;
        }
        this.tableData.push(this.emptyProduct());
      },
      // 搜索商品
      queryProduct(queryString, row) {
        if (this.$utils.isEmpty(queryString)) {
          row.products = [];
          row.productOptions = [];
          return;
        }

        api.searchPurchaseProducts(this.formData.scId, queryString).then((res) => {
          row.products = res;
          row.productOptions = res.map((item) => {
            return {
              value: item.productId,
              label: item.productCode + ' ' + item.productName,
            };
          });
        });
      },
      // 选择商品
      handleSelectProduct(index, value, row) {
        this.tableData[index] = Object.assign(
          this.tableData[index],
          row ? row.products.filter((item) => item.productId === value)[0] : value,
        );

        this.purchasePriceInput(this.tableData[index], this.tableData[index].purchasePrice);
      },
      // 删除商品
      delProduct() {
        const records = this.$refs.grid.getCheckboxRecords();
        if (this.$utils.isEmpty(records)) {
          this.$msg.createError('请选择要删除的商品数据！');
          return;
        }
        this.$msg.createConfirm('是否确定删除选中的商品？').then(() => {
          const tableData = this.tableData.filter((t) => {
            const tmp = records.filter((item) => item.id === t.id);
            return this.$utils.isEmpty(tmp);
          });

          this.tableData = tableData;

          this.calcSum();
        });
      },
      // 批量添加商品
      openBatchAddProductDialog() {
        if (this.$utils.isEmpty(this.formData.scId)) {
          this.$msg.createError('请先选择仓库！');
          return;
        }
        this.$refs.batchAddProductDialog.openDialog();
      },
      purchasePriceInput(row, value) {
        this.calcSum();
      },
      purchaseNumInput(value) {
        this.calcSum();
      },
      // 计算汇总数据
      calcSum() {
        let totalNum = 0;
        let giftNum = 0;
        let totalAmount = 0;

        this.tableData
          .filter((t) => {
            return (
              this.$utils.isFloatGeZero(t.purchasePrice) &&
              this.$utils.isIntegerGeZero(t.purchaseNum)
            );
          })
          .forEach((t) => {
            const num = parseInt(t.purchaseNum);
            if (t.isGift) {
              giftNum = this.$utils.add(giftNum, num);
            } else {
              totalNum = this.$utils.add(totalNum, num);
            }

            totalAmount = this.$utils.add(totalAmount, this.$utils.mul(num, t.purchasePrice));
          });

        this.formData.totalNum = totalNum;
        this.formData.giftNum = giftNum;
        this.formData.totalAmount = totalAmount;
      },
      // 批量录入数量
      batchInputPurchaseNum() {
        const records = this.$refs.grid.getCheckboxRecords();
        if (this.$utils.isEmpty(records)) {
          this.$msg.createError('请选择商品数据！');
          return;
        }

        this.$msg
          .createPrompt('请输入采购数量', {
            inputPattern: this.$utils.PATTERN_IS_INTEGER_GT_ZERO,
            inputErrorMessage: '采购数量必须为整数并且大于0',
            title: '批量录入数量',
            required: true,
          })
          .then(({ value }) => {
            records.forEach((t) => {
              t.purchaseNum = value;

              this.purchaseNumInput(value);
            });
          });
      },
      // 批量录入采购价
      batchInputPurchasePrice() {
        const records = this.$refs.grid.getCheckboxRecords();
        if (this.$utils.isEmpty(records)) {
          this.$msg.createError('请选择商品数据！');
          return;
        }

        for (let i = 0; i < records.length; i++) {
          if (records[i].isGift) {
            this.$msg.createError('第' + (i + 1) + '行商品为赠品，不允许录入采购价！');
            return;
          }
        }

        this.$msg
          .createPrompt('请输入采购价（元）', {
            inputPattern: this.$utils.PATTERN_IS_PRICE,
            inputErrorMessage: '采购价（元）必须为数字并且不小于0',
            title: '批量调整采购价',
            required: true,
          })
          .then(({ value }) => {
            records.forEach((t) => {
              t.purchasePrice = value;

              this.purchasePriceInput(t, value);
            });
          });
      },
      // 设置赠品
      setGift() {
        const records = this.$refs.grid.getCheckboxRecords();
        if (this.$utils.isEmpty(records)) {
          this.$msg.createError('请选择要设置为赠品的商品数据！');
          return;
        }

        records.forEach((item) => {
          item.purchasePrice = 0;
          item.isGift = true;
        });

        this.calcSum();
      },
      // 批量新增商品
      batchAddProduct(productList) {
        productList.forEach((item) => {
          this.tableData.push(this.emptyProduct());
          this.handleSelectProduct(this.tableData.length - 1, item);
        });
      },
      // 校验数据
      validData() {
        if (this.$utils.isEmpty(this.formData.scId)) {
          this.$msg.createError('仓库不允许为空！');
          return false;
        }

        if (this.$utils.isEmpty(this.formData.supplierId)) {
          this.$msg.createError('供应商不允许为空！');
          return false;
        }

        if (this.$utils.isEmpty(this.formData.expectArriveDate)) {
          this.$msg.createError('预计到货日期不允许为空！');
          return false;
        }

        if (this.$utils.isEmpty(this.tableData)) {
          this.$msg.createError('请录入商品！');
          return false;
        }

        for (let i = 0; i < this.tableData.length; i++) {
          const product = this.tableData[i];

          if (this.$utils.isEmpty(product.productId)) {
            this.$msg.createError('第' + (i + 1) + '行商品不允许为空！');
            return false;
          }

          if (this.$utils.isEmpty(product.purchasePrice)) {
            this.$msg.createError('第' + (i + 1) + '行商品采购价不允许为空！');
            return false;
          }

          if (!this.$utils.isFloat(product.purchasePrice)) {
            this.$msg.createError('第' + (i + 1) + '行商品采购价必须为数字！');
            return false;
          }

          if (product.isGift) {
            if (parseFloat(product.purchasePrice) !== 0) {
              this.$msg.createError('第' + (i + 1) + '行商品采购价必须等于0！');
              return false;
            }
          } else {
            if (!this.$utils.isFloatGtZero(product.purchasePrice)) {
              this.$msg.createError('第' + (i + 1) + '行商品采购价必须大于0！');
              return false;
            }
          }

          if (!this.$utils.isNumberPrecision(product.purchasePrice, 2)) {
            this.$msg.createError('第' + (i + 1) + '行商品采购价最多允许2位小数！');
            return false;
          }

          if (this.$utils.isEmpty(product.purchaseNum)) {
            this.$msg.createError('第' + (i + 1) + '行商品采购数量不允许为空！');
            return false;
          }

          if (!this.$utils.isInteger(product.purchaseNum)) {
            this.$msg.createError('第' + (i + 1) + '行商品采购数量必须为整数！');
            return false;
          }

          if (!this.$utils.isIntegerGtZero(product.purchaseNum)) {
            this.$msg.createError('第' + (i + 1) + '行商品采购数量必须大于0！');
            return false;
          }
        }

        if (!this.$refs.payType.validData()) {
          return false;
        }

        const payTypes = this.$refs.payType.getTableData();
        const totalPayAmount = payTypes.reduce(
          (tot, item) => this.$utils.add(tot, item.payAmount),
          0,
        );
        if (!this.$utils.eq(this.formData.totalAmount, totalPayAmount)) {
          this.$msg.createError('所有约定支付的支付金额不等于含税总金额，请检查！');
          return false;
        }

        return true;
      },
      // 创建订单
      createOrder() {
        if (!this.validData()) {
          return;
        }

        const params = {
          scId: this.formData.scId,
          supplierId: this.formData.supplierId,
          purchaserId: this.formData.purchaserId,
          expectArriveDate: this.formData.expectArriveDate,
          description: this.formData.description,
          payTypes: this.$refs.payType.getTableData().map((t) => {
            return {
              id: t.payTypeId,
              payAmount: t.payAmount,
              text: t.text,
            };
          }),
          products: this.tableData.map((t) => {
            return {
              productId: t.productId,
              purchasePrice: t.purchasePrice,
              purchaseNum: t.purchaseNum,
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

        const params = {
          scId: this.formData.scId,
          supplierId: this.formData.supplierId,
          purchaserId: this.formData.purchaserId,
          expectArriveDate: this.formData.expectArriveDate,
          description: this.formData.description,
          payTypes: this.$refs.payType.getTableData().map((t) => {
            return {
              id: t.payTypeId,
              payAmount: t.payAmount,
              text: t.text,
            };
          }),
          products: this.tableData.map((t) => {
            return {
              productId: t.productId,
              purchasePrice: t.purchasePrice,
              purchaseNum: t.purchaseNum,
              description: t.description,
            };
          }),
        };

        this.$msg.createConfirm('对采购单据执行审核通过操作？').then(() => {
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
