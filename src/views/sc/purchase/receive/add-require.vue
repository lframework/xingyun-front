<template>
  <div class="simple-app-container">
    <div v-permission="['purchase:receive:add']" v-loading="loading">
      <j-border>
        <j-form>
          <j-form-item label="仓库" required>
            <store-center-selector v-model:value="formData.scId" :before-open="beforeSelectSc" />
          </j-form-item>
          <j-form-item label="供应商" required>
            <supplier-selector
              v-model:value="formData.supplierId"
              :before-open="beforeSelectSupplier"
            />
          </j-form-item>
          <j-form-item label="采购员">
            <user-selector
              v-model:value="formData.purchaserId"
              :before-open="beforeSelectPurchaser"
            />
          </j-form-item>
          <j-form-item label="付款日期" required>
            <a-date-picker
              v-model:value="formData.paymentDate"
              placeholder=""
              value-format="YYYY-MM-DD"
              :disabled="!formData.allowModifyPaymentDate"
              :disabled-date="
                (current) => {
                  return current && current < moment().endOf('day');
                }
              "
            />
          </j-form-item>
          <j-form-item label="实际到货日期" required>
            <a-date-picker
              v-model:value="formData.receiveDate"
              placeholder=""
              value-format="YYYY-MM-DD"
            />
          </j-form-item>
          <j-form-item label="采购订单" required>
            <purchase-order-selector-with-receive
              v-model:value="formData.purchaseOrderId"
              @update:value="purchaseOrderChange"
            />
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
            <a-button type="primary" :icon="h(PlusOutlined)" @click="addProduct">新增</a-button>
            <a-button danger :icon="h(DeleteOutlined)" @click="delProduct">删除</a-button>
            <a-button :icon="h(PlusOutlined)" @click="openBatchAddProductDialog"
              >批量添加商品</a-button
            >
            <a-button :icon="h(NumberOutlined)" @click="batchInputReceiveNum"
              >批量录入数量</a-button
            >
            <a-tooltip title="将收货数量设置为剩余收货数量">
              <a-button :icon="h(EditOutlined)" @click="quickSettingReceiveNum"
                >快捷设置数量</a-button
              >
            </a-tooltip>
          </a-space>
        </template>

        <!-- 商品名称 列自定义内容 -->
        <template #productName_default="{ row, rowIndex }">
          <a-auto-complete
            v-if="!row.isFixed"
            v-model:value="row.productName"
            style="width: 100%"
            placeholder=""
            value-key="productName"
            :options="row.productOptions"
            @search="(e) => queryProduct(e, row)"
            @select="(e) => handleSelectProduct(rowIndex, e, row)"
          />
          <span v-else>{{ row.productName }}</span>
        </template>

        <!-- 采购价 列自定义内容 -->
        <template #purchasePrice_default="{ row }">
          <span>{{ row.purchasePrice }}</span>
        </template>

        <!-- 剩余收货数量 列自定义内容 -->
        <template #remainNum_default="{ row }">
          <span v-if="$utils.isEmpty(row.remainNum)">-</span>
          <span v-else-if="$utils.isIntegerGeZero(row.receiveNum)">{{
            Math.max(0, $utils.sub(row.remainNum, row.receiveNum))
          }}</span>
          <span v-else>{{ row.remainNum }}</span>
        </template>

        <!-- 收货数量 列自定义内容 -->
        <template #receiveNum_default="{ row }">
          <a-input
            v-model:value="row.receiveNum"
            class="number-input"
            @input="(e) => receiveNumInput(e.target.value)"
          />
        </template>

        <!-- 含税金额 列自定义内容 -->
        <template #taxAmount_default="{ row }">
          <span
            v-if="$utils.isFloatGeZero(row.purchasePrice) && $utils.isIntegerGeZero(row.receiveNum)"
            >{{ $utils.mul(row.purchasePrice, row.receiveNum) }}</span
          >
        </template>

        <!-- 备注 列自定义内容 -->
        <template #description_default="{ row }">
          <a-input v-model:value="row.description" />
        </template>
      </vxe-grid>

      <j-border title="合计">
        <j-form label-width="140px">
          <j-form-item label="收货数量" :span="6">
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
            v-permission="['purchase:receive:add']"
            type="primary"
            :loading="loading"
            @click="createOrder"
            >保存</a-button
          >
          <a-button
            v-permission="['purchase:receive:approve']"
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
  import PurchaseOrderSelectorWithReceive from '@/views/sc/purchase/receive/PurchaseOrderSelectorWithReceive.vue';
  import Moment from 'moment';
  import {
    PlusOutlined,
    DeleteOutlined,
    NumberOutlined,
    EditOutlined,
    AlertOutlined,
  } from '@ant-design/icons-vue';
  import * as api from '@/api/sc/purchase/receive';
  import * as purchaseApi from '@/api/sc/purchase/order';

  export default defineComponent({
    name: 'AddPurchaseReceiveRequire',
    components: {
      BatchAddProduct,
      PurchaseOrderSelectorWithReceive,
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
            field: 'purchasePrice',
            title: '采购价（元）',
            align: 'right',
            width: 120,
            slots: { default: 'purchasePrice_default' },
          },
          {
            field: 'orderNum',
            title: '采购数量',
            align: 'right',
            width: 100,
            formatter: ({ cellValue }) => {
              return this.$utils.isEmpty(cellValue) ? '-' : cellValue;
            },
          },
          {
            field: 'remainNum',
            title: '剩余收货数量',
            align: 'right',
            width: 120,
            slots: { default: 'remainNum_default' },
          },
          {
            field: 'receiveNum',
            title: '收货数量',
            align: 'right',
            width: 100,
            slots: { default: 'receiveNum_default' },
          },
          {
            field: 'taxAmount',
            title: '含税金额',
            align: 'right',
            width: 120,
            slots: { default: 'taxAmount_default' },
          },
          { field: 'taxRate', title: '税率（%）', align: 'right', width: 100 },
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
    computed: {
      moment() {
        return Moment;
      },
    },
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
      async initFormData() {
        this.formData = {
          scId: '',
          supplierId: '',
          purchaseOrderId: '',
          purchaserId: '',
          paymentDate: this.$utils.formatDate(Moment().add(1, 'M')),
          receiveDate: this.$utils.formatDate(Moment()),
          totalNum: 0,
          giftNum: 0,
          totalAmount: 0,
          description: '',
          // 是否允许修改付款日期
          allowModifyPaymentDate: true,
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
          purchasePrice: 0,
          taxCostPrice: '',
          stockNum: '',
          orderNum: '',
          remainNum: '',
          receiveNum: '',
          taxRate: '',
          isGift: true,
          taxAmount: '',
          description: '',
          isFixed: false,
          products: [],
        };
      },
      // 新增商品
      addProduct() {
        if (this.$utils.isEmpty(this.formData.purchaseOrderId)) {
          this.$msg.createError('请先选择采购订单！');
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

        purchaseApi.searchPurchaseProducts(this.formData.scId, queryString).then((res) => {
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
          {
            isGift: true,
            purchasePrice: 0,
          },
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

        for (let i = 0; i < records.length; i++) {
          if (records[i].isFixed) {
            this.$msg.createError('第' + (i + 1) + '行商品是采购订单中的商品，不允许删除！');
            return;
          }
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
      openBatchAddProductDialog() {
        if (this.$utils.isEmpty(this.formData.purchaseOrderId)) {
          this.$msg.createError('请先选择采购订单！');
          return;
        }
        this.$refs.batchAddProductDialog.openDialog();
      },
      purchasePriceInput(row, value) {
        this.calcSum();
      },
      receiveNumInput(value) {
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
              this.$utils.isIntegerGeZero(t.receiveNum)
            );
          })
          .forEach((t) => {
            const num = parseInt(t.receiveNum);
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
      batchInputReceiveNum() {
        const records = this.$refs.grid.getCheckboxRecords();
        if (this.$utils.isEmpty(records)) {
          this.$msg.createError('请选择商品数据！');
          return;
        }

        this.$msg
          .createPrompt('请输入收货数量', {
            inputPattern: this.$utils.PATTERN_IS_INTEGER_GE_ZERO,
            inputErrorMessage: '收货数量必须为整数并且不小于0',
            title: '批量录入数量',
            required: true,
          })
          .then(({ value }) => {
            records.forEach((t) => {
              t.receiveNum = value;

              this.receiveNumInput(value);
            });
          });
      },
      // 快捷设置数量
      quickSettingReceiveNum() {
        const records = this.$refs.grid.getCheckboxRecords();
        if (this.$utils.isEmpty(records)) {
          this.$msg.createError('请选择商品数据！');
          return;
        }

        for (let i = 0; i < records.length; i++) {
          const record = records[i];
          if (record.isFixed) {
            record.receiveNum = record.remainNum;
          }
        }

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

        if (this.formData.allowModifyPaymentDate) {
          if (this.$utils.isEmpty(this.formData.paymentDate)) {
            this.$msg.createError('付款日期不允许为空！');
            return false;
          }
        }

        if (this.$utils.isEmpty(this.formData.receiveDate)) {
          this.$msg.createError('实际到货日期不允许为空！');
          return false;
        }

        if (this.$utils.isEmpty(this.formData.purchaseOrderId)) {
          this.$msg.createError('采购订单不允许为空！');
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

          if (!this.$utils.isEmpty(product.receiveNum)) {
            if (!this.$utils.isInteger(product.receiveNum)) {
              this.$msg.createError('第' + (i + 1) + '行商品收货数量必须为整数！');
              return false;
            }

            if (product.isFixed) {
              if (!this.$utils.isIntegerGeZero(product.receiveNum)) {
                this.$msg.createError('第' + (i + 1) + '行商品收货数量不允许小于0！');
                return false;
              }
            } else {
              if (!this.$utils.isIntegerGtZero(product.receiveNum)) {
                this.$msg.createError('第' + (i + 1) + '行商品收货数量必须大于0！');
                return false;
              }
            }

            if (product.isFixed) {
              if (product.receiveNum > product.remainNum) {
                this.$msg.createError(
                  '第' +
                    (i + 1) +
                    '行商品累计收货数量为' +
                    (product.orderNum - product.remainNum) +
                    '，剩余收货数量为' +
                    product.remainNum +
                    '，本次收货数量不允许大于' +
                    product.remainNum +
                    '！',
                );
                return false;
              }
            }
          } else {
            if (!product.isFixed) {
              this.$msg.createError('第' + (i + 1) + '行商品收货数量不允许为空！');
              return false;
            }
          }
        }

        if (
          this.tableData.filter((item) => this.$utils.isIntegerGtZero(item.receiveNum)).length === 0
        ) {
          this.$msg.createError('采购订单中的商品必须全部或部分收货！');
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
          purchaserId: this.formData.purchaserId || '',
          paymentDate: this.formData.paymentDate || '',
          receiveDate: this.formData.receiveDate,
          purchaseOrderId: this.formData.purchaseOrderId,
          description: this.formData.description,
          required: true,
          products: this.tableData
            .filter((t) => this.$utils.isIntegerGtZero(t.receiveNum))
            .map((t) => {
              const product = {
                productId: t.productId,
                receiveNum: t.receiveNum,
                description: t.description,
              };

              if (t.isFixed) {
                product.purchaseOrderDetailId = t.id;
              }

              return product;
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
          paymentDate: this.formData.paymentDate || '',
          receiveDate: this.formData.receiveDate,
          purchaseOrderId: this.formData.purchaseOrderId,
          description: this.formData.description,
          products: this.tableData
            .filter((t) => this.$utils.isIntegerGtZero(t.receiveNum))
            .map((t) => {
              const product = {
                productId: t.productId,
                receiveNum: t.receiveNum,
                description: t.description,
              };

              if (t.isFixed) {
                product.purchaseOrderDetailId = t.id;
              }

              return product;
            }),
        };

        this.$msg.createConfirm('对采购收货单执行审核通过操作？').then(() => {
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
      // 选择采购订单
      purchaseOrderChange(e) {
        // 只要选择了采购订单，清空所有商品，然后将采购订单中所有的明细列出来
        if (!this.$utils.isEmpty(e)) {
          this.loading = true;
          purchaseApi
            .getWithReceive(e)
            .then((res) => {
              const tableData = this.tableData.filter((item) => !item.isFixed);
              let purchaseDetails = res.details || [];
              purchaseDetails = purchaseDetails.map((item) => {
                item.isFixed = true;

                return Object.assign(this.emptyProduct(), item);
              });

              this.tableData = [...purchaseDetails, ...tableData];

              this.formData.scId = res.scId;

              this.formData.supplierId = res.supplierId;

              if (!this.$utils.isEmpty(res.purchaserId)) {
                this.formData.purchaserId = res.purchaserId;
              }

              this.supplierChange(this.formData.supplierId);
            })
            .finally(() => {
              this.loading = false;
            });
        }
      },
      beforeSelectSc() {
        if (!this.beforeSelectComponents()) {
          return false;
        }

        this.$msg.createError('由于“采购收货单关联采购订单”，不允许修改仓库！');
        return false;
      },
      beforeSelectSupplier() {
        if (!this.beforeSelectComponents()) {
          return false;
        }

        this.$msg.createError('由于“采购收货单关联采购订单”，不允许修改供应商！');
        return false;
      },
      beforeSelectPurchaser() {
        return this.beforeSelectComponents();
      },
      beforeSelectComponents() {
        if (this.$utils.isEmpty(this.formData.purchaseOrderId)) {
          this.$msg.createError('请先选择采购订单！');
          return false;
        }

        return true;
      },
      // 供应商改变时触发
      supplierChange(supplierId) {
        api.getPaymentDate(supplierId).then((res) => {
          this.formData.paymentDate = res.paymentDate || '';
          this.formData.allowModifyPaymentDate = res.allowModify;
        });
      },
    },
  });
</script>
<style></style>
