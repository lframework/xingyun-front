<template>
  <div class="simple-app-container">
    <div v-permission="['sale:out:add']" v-loading="loading">
      <j-border>
        <j-form>
          <j-form-item label="仓库" required>
            <store-center-selector v-model:value="formData.scId" />
          </j-form-item>
          <j-form-item label="客户" required>
            <customer-selector v-model:value="formData.customerId" @update:value="customerChange" />
          </j-form-item>
          <j-form-item label="销售员">
            <user-selector v-model:value="formData.salerId" />
          </j-form-item>
          <j-form-item label="付款日期" required>
            <a-date-picker
              v-model:value="formData.paymentDate"
              placeholder=""
              value-format="YYYY-MM-DD"
              :disabled="!formData.allowModifyPaymentDate"
              :disabled-date="
                (current) => {
                  return current && current < $utils.getCurrentDateTime().endOf('day');
                }
              "
            />
          </j-form-item>
          <j-form-item label="销售订单">
            <sale-order-selector-with-out
              v-model:value="formData.saleOrderId"
              @update:value="saleOrderChange"
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
            <a-button :icon="h(NumberOutlined)" @click="batchInputOutNum">批量录入数量</a-button>
            <a-button :icon="h(EditOutlined)" @click="batchInputTaxPrice">批量调整价格</a-button>
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
          >
          </a-auto-complete>
        </template>

        <!-- 折扣 列自定义内容 -->
        <template #discountRate_default="{ row }">
          <span v-if="row.salePrice === 0 || row.isGift">{{ row.discountRate }}</span>
          <a-input
            v-else
            v-model:value="row.discountRate"
            class="number-input"
            @change="(e) => changeDiscountRate(row, e.target.value)"
          />
        </template>

        <!-- 价格 列自定义内容 -->
        <template #taxPrice_default="{ row }">
          <span v-if="row.isGift">{{ row.taxPrice }}</span>
          <a-input
            v-else
            v-model:value="row.taxPrice"
            class="number-input"
            @input="(e) => taxPriceInput(row, e.target.value)"
          />
        </template>

        <!-- 出库数量 列自定义内容 -->
        <template #outNum_default="{ row }">
          <a-input
            v-model:value="row.outNum"
            class="number-input"
            @input="(e) => outNumInput(e.target.value)"
          />
        </template>

        <!-- 库存数量 列自定义内容 -->
        <template #stockNum_default="{ row }">
          <span v-if="checkStockNum(row)">{{ row.stockNum }}</span>
          <span v-else style="color: #f5222d">{{ row.stockNum }}</span>
        </template>

        <!-- 含税金额 列自定义内容 -->
        <template #taxAmount_default="{ row }">
          <span v-if="$utils.isFloatGeZero(row.taxPrice) && $utils.isIntegerGeZero(row.outNum)">{{
            $utils.mul(row.taxPrice, row.outNum)
          }}</span>
        </template>

        <!-- 备注 列自定义内容 -->
        <template #description_default="{ row }">
          <a-input v-model:value="row.description" />
        </template>
      </vxe-grid>

      <j-border title="合计">
        <j-form label-width="140px">
          <j-form-item label="出库数量" :span="6">
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
            v-permission="['sale:out:add']"
            type="primary"
            :loading="loading"
            @click="createOrder"
            >保存</a-button
          >
          <a-button
            v-permission="['sale:out:approve']"
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
  import SaleOrderSelectorWithOut from './SaleOrderSelectorWithOut.vue';
  import BatchAddProduct from '@/views/sc/sale/batch-add-product.vue';
  import Moment from 'moment';
  import {
    PlusOutlined,
    DeleteOutlined,
    NumberOutlined,
    EditOutlined,
    AlertOutlined,
  } from '@ant-design/icons-vue';
  import * as api from '@/api/sc/sale/out';
  import * as saleApi from '@/api/sc/sale/order';

  export default defineComponent({
    name: 'AddSaleOutUnRequire',
    components: {
      SaleOrderSelectorWithOut,
      BatchAddProduct,
    },
    setup() {
      return { h, PlusOutlined, DeleteOutlined, NumberOutlined, EditOutlined, AlertOutlined };
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
          { field: 'salePrice', title: '参考销售价（元）', align: 'right', width: 150 },
          {
            field: 'isGift',
            title: '是否赠品',
            width: 80,
            formatter: ({ cellValue }) => {
              return cellValue ? '是' : '否';
            },
          },
          {
            field: 'stockNum',
            title: '库存数量',
            align: 'right',
            width: 100,
            slots: { default: 'stockNum_default' },
          },
          {
            field: 'discountRate',
            title: '折扣（%）',
            align: 'right',
            width: 120,
            slots: { default: 'discountRate_default' },
          },
          {
            field: 'taxPrice',
            title: '价格（元）',
            align: 'right',
            width: 120,
            slots: { default: 'taxPrice_default' },
          },
          {
            field: 'outNum',
            title: '出库数量',
            align: 'right',
            width: 100,
            slots: { default: 'outNum_default' },
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
    computed: {},
    created() {
      // 初始化表单数据
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
          customerId: '',
          saleOrderId: '',
          salerId: '',
          paymentDate: this.$utils.formatDate(Moment().add(1, 'M')),
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
          salePrice: '',
          taxPrice: '',
          discountRate: 100,
          stockNum: '',
          orderNum: '',
          remainNum: '',
          outNum: '',
          taxRate: '',
          isGift: false,
          taxAmount: '',
          description: '',
          isFixed: false,
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

        saleApi.searchSaleProducts(this.formData.scId, queryString).then((res) => {
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
        value = row ? row.products.filter((item) => item.productId === value)[0] : value;
        this.tableData[index] = Object.assign(this.tableData[index], value, {
          isGift: false,
          taxPrice: value.salePrice,
        });

        this.taxPriceInput(this.tableData[index], this.tableData[index].taxPrice);
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
      openBatchAddProductDialog() {
        if (this.$utils.isEmpty(this.formData.scId)) {
          this.$msg.createError('请先选择仓库！');
          return;
        }
        this.$refs.batchAddProductDialog.openDialog();
      },
      changeDiscountRate(row, value) {
        if (
          this.$utils.isFloatGeZero(row.discountRate) &&
          this.$utils.isFloatGtZero(row.salePrice)
        ) {
          row.taxPrice = this.$utils
            .div(this.$utils.mul(row.salePrice, row.discountRate), 100)
            .toFixed(2);
        }

        this.calcSum();
      },
      taxPriceInput(row, value) {
        if (row.salePrice !== 0) {
          if (this.$utils.isFloatGeZero(row.taxPrice)) {
            row.discountRate = this.$utils
              .mul(this.$utils.div(row.taxPrice, row.salePrice), 100)
              .toFixed(2);
          }
        }
        this.calcSum();
      },
      outNumInput(value) {
        this.calcSum();
      },
      // 计算汇总数据
      calcSum() {
        let totalNum = 0;
        let giftNum = 0;
        let totalAmount = 0;

        this.tableData
          .filter((t) => {
            return this.$utils.isFloatGeZero(t.taxPrice) && this.$utils.isIntegerGeZero(t.outNum);
          })
          .forEach((t) => {
            const num = parseInt(t.outNum);
            if (t.isGift) {
              giftNum = this.$utils.add(giftNum, num);
            } else {
              totalNum = this.$utils.add(totalNum, num);
            }

            totalAmount = this.$utils.add(totalAmount, this.$utils.mul(num, t.taxPrice));
          });

        this.formData.totalNum = totalNum;
        this.formData.giftNum = giftNum;
        this.formData.totalAmount = totalAmount;
      },
      // 批量录入数量
      batchInputOutNum() {
        const records = this.$refs.grid.getCheckboxRecords();
        if (this.$utils.isEmpty(records)) {
          this.$msg.createError('请选择商品数据！');
          return;
        }

        this.$msg
          .createPrompt('请输入出库数量', {
            inputPattern: this.$utils.PATTERN_IS_INTEGER_GT_ZERO,
            inputErrorMessage: '出库数量必须为整数并且大于0',
            title: '批量录入数量',
            required: true,
          })
          .then(({ value }) => {
            records.forEach((t) => {
              t.outNum = value;

              this.outNumInput(value);
            });
          });
      },
      // 批量录入价格
      batchInputTaxPrice() {
        const records = this.$refs.grid.getCheckboxRecords();
        if (this.$utils.isEmpty(records)) {
          this.$msg.createError('请选择商品数据！');
          return;
        }

        for (let i = 0; i < records.length; i++) {
          if (records[i].isGift) {
            this.$msg.createError('第' + (i + 1) + '行商品为赠品，不允许录入价格！');
            return;
          }
        }

        this.$msg
          .createPrompt('请输入价格（元）', {
            inputPattern: this.$utils.PATTERN_IS_PRICE,
            inputErrorMessage: '价格（元）必须为数字并且不小于0',
            title: '批量调整价格',
            required: true,
          })
          .then(({ value }) => {
            records.forEach((t) => {
              t.taxPrice = value;

              this.taxPriceInput(t, value);
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
          item.taxPrice = 0;
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

        if (this.$utils.isEmpty(this.formData.customerId)) {
          this.$msg.createError('客户不允许为空！');
          return false;
        }

        if (this.formData.allowModifyPaymentDate) {
          if (this.$utils.isEmpty(this.formData.paymentDate)) {
            this.$msg.createError('付款日期不允许为空！');
            return false;
          }
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

          if (this.$utils.isEmpty(product.taxPrice)) {
            this.$msg.createError('第' + (i + 1) + '行商品价格不允许为空！');
            return false;
          }

          if (!this.$utils.isFloat(product.taxPrice)) {
            this.$msg.createError('第' + (i + 1) + '行商品价格必须为数字！');
            return false;
          }

          if (product.isGift) {
            if (parseFloat(product.taxPrice) !== 0) {
              this.$msg.createError('第' + (i + 1) + '行商品价格必须等于0！');
              return false;
            }
          } else {
            if (!this.$utils.isFloatGtZero(product.taxPrice)) {
              this.$msg.createError('第' + (i + 1) + '行商品价格必须大于0！');
              return false;
            }
          }

          if (!this.$utils.isNumberPrecision(product.taxPrice, 2)) {
            this.$msg.createError('第' + (i + 1) + '行商品价格最多允许2位小数！');
            return false;
          }

          if (!this.$utils.isEmpty(product.outNum)) {
            if (!this.$utils.isInteger(product.outNum)) {
              this.$msg.createError('第' + (i + 1) + '行商品出库数量必须为整数！');
              return false;
            }

            if (!this.$utils.isIntegerGtZero(product.outNum)) {
              this.$msg.createError('第' + (i + 1) + '行商品出库数量必须大于0！');
              return false;
            }
          } else {
            this.$msg.createError('第' + (i + 1) + '行商品出库数量不允许为空！');
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
          scId: this.formData.scId,
          customerId: this.formData.customerId,
          salerId: this.formData.salerId || '',
          paymentDate: this.formData.paymentDate || '',
          description: this.formData.description,
          required: false,
          products: this.tableData
            .filter((t) => this.$utils.isIntegerGtZero(t.outNum))
            .map((t) => {
              const product = {
                productId: t.productId,
                oriPrice: t.salePrice,
                taxPrice: t.taxPrice,
                discountRate: t.discountRate,
                orderNum: t.outNum,
                description: t.description,
              };

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

        const checkStockNumArr = [];
        this.tableData
          .filter((item) => this.$utils.isIntegerGtZero(item.outNum))
          .forEach((item) => {
            if (checkStockNumArr.map((v) => item.productId).includes(item.productId)) {
              checkStockNumArr
                .filter((v) => v.productId === item.productId)
                .forEach((v) => {
                  v.outNum = this.$utils.add(v.outNum, item.outNum);
                });
            } else {
              checkStockNumArr.push({
                productId: item.productId,
                productCode: item.productCode,
                productName: item.productName,
                stockNum: item.stockNum,
                outNum: item.outNum,
              });
            }
          });

        const unValidStockNumArr = checkStockNumArr.filter((item) => item.stockNum < item.outNum);
        if (!this.$utils.isEmpty(unValidStockNumArr)) {
          this.$msg.createError(
            '商品（' +
              unValidStockNumArr[0].productCode +
              '）' +
              unValidStockNumArr[0].productName +
              '当前库存为' +
              unValidStockNumArr[0].stockNum +
              '，总出库数量为' +
              unValidStockNumArr[0].outNum +
              '，无法完成销售出库！',
          );
          return false;
        }

        const params = {
          scId: this.formData.scId,
          customerId: this.formData.customerId,
          salerId: this.formData.salerId || '',
          paymentDate: this.formData.paymentDate || '',
          description: this.formData.description,
          products: this.tableData
            .filter((t) => this.$utils.isIntegerGtZero(t.outNum))
            .map((t) => {
              const product = {
                productId: t.productId,
                oriPrice: t.salePrice,
                taxPrice: t.taxPrice,
                discountRate: t.discountRate,
                orderNum: t.outNum,
                description: t.description,
              };

              return product;
            }),
        };

        this.$msg.createConfirm('对销售出库单执行审核通过操作？').then(() => {
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
      // 选择销售订单
      saleOrderChange(e) {
        // 只要选择了销售订单，清空所有商品，然后将销售订单中所有的明细列出来
        if (!this.$utils.isEmpty(e)) {
          this.loading = true;
          saleApi
            .getWithOut(e)
            .then((res) => {
              let saleDetails = res.details || [];
              saleDetails = saleDetails.map((item) => {
                item.isFixed = false;

                return Object.assign(this.emptyProduct(), item);
              });

              this.tableData = saleDetails;

              this.formData.scId = res.scId;

              this.formData.customerId = res.customerId;

              if (!this.$utils.isEmpty(res.salerId)) {
                this.formData.salerId = res.salerId;
              }

              this.customerChange(this.formData.customerId);
            })
            .finally(() => {
              this.loading = false;
            });
        }
      },
      // 客户改变时触发
      customerChange(customerId) {
        if (!this.$utils.isEmpty(customerId)) {
          api.getPaymentDate(customerId).then((res) => {
            if (res.allowModify) {
              // 如果允许修改付款日期
              if (this.$utils.isEmpty(this.formData.paymentDate)) {
                this.formData.paymentDate = res.paymentDate || '';
              }
            } else {
              // 不允许修改则按默认日期
              this.formData.paymentDate = res.paymentDate || '';
            }
            this.formData.allowModifyPaymentDate = res.allowModify;
          });
        }
      },
      // 检查库存数量
      checkStockNum(row) {
        const checkArr = this.tableData
          .filter((item) => item.productId === row.productId)
          .map((item) => item.outNum);
        if (this.$utils.isEmpty(checkArr)) {
          checkArr.push(0);
        }
        const totalOutNum = checkArr.reduce((total, item) => {
          const outNum = this.$utils.isIntegerGtZero(item) ? item : 0;
          return this.$utils.add(total, outNum);
        }, 0);

        return totalOutNum <= row.stockNum;
      },
    },
  });
</script>
<style></style>
