<template>
  <div class="app-card-container">
    <div v-permission="['sale:return:add']" v-loading="loading">
      <a-alert
        description="提示：使用回车键可以快速添加商品；使用Tab键可以快速跳转至下一个输入框。"
        type="info"
        show-icon
      />
      <j-border>
        <j-form bordered>
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
                  return current && current < getCurrentDateTime().endOf('day');
                }
              "
            />
          </j-form-item>
          <j-form-item label="销售出库单">
            <sale-out-sheet-selector-with-return
              v-model:value="formData.outSheetId"
              @update:value="outSheetChange"
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
            <a-button :icon="h(NumberOutlined)" @click="batchInputReturnNum">批量录入数量</a-button>
            <a-button :icon="h(EditOutlined)" @click="batchInputTaxPrice">批量调整价格</a-button>
            <a-button :icon="h(AlertOutlined)" @click="setGift">设置赠品</a-button>
          </a-space>
        </template>

        <!-- 商品名称 列自定义内容 -->
        <template #productName_default="{ row, rowIndex }">
          <a-auto-complete
            v-if="isEmpty(row.productId)"
            :ref="'productInputRef' + rowIndex"
            v-model:value="row.productName"
            style="width: 100%"
            placeholder="请输入商品编号/名称"
            :options="row.productOptions"
            :dropdown-match-select-width="false"
            :dropdown-style="{ width: '890px' }"
            @search="(e) => queryProduct(e, row)"
          >
            <!-- 自定义下拉框内容 -->
            <template #dropdownRender>
              <div v-if="!isEmpty(row.products)">
                <vxe-table
                  :data="row.products"
                  max-height="500"
                  class="cursor-pointer"
                  highlight-hover-row
                  show-overflow
                  :row-config="{ isHover: true }"
                  @cell-click="({ row: product }) => handleSelectProduct(rowIndex, product)"
                >
                  <vxe-column field="productCode" title="商品编号" width="120" />
                  <vxe-column field="productName" title="商品名称" min-width="200" />
                  <vxe-column field="spec" title="规格" width="80" />
                  <vxe-column field="unit" title="单位" width="80" />
                  <vxe-column
                    field="salePrice"
                    title="参考销售价（元）"
                    width="140"
                    align="right"
                  />
                  <vxe-column field="stockNum" title="库存数量" width="140" align="right" />
                </vxe-table>
              </div>
            </template>
          </a-auto-complete>
          <span v-else>{{ row.productName }}</span>
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

        <!-- 退货数量 列自定义内容 -->
        <template #returnNum_default="{ row }">
          <a-input
            v-model:value="row.returnNum"
            class="number-input"
            @input="(e) => returnNumInput(e.target.value)"
          />
        </template>

        <!-- 含税金额 列自定义内容 -->
        <template #taxAmount_default="{ row }">
          <span v-if="isFloatGeZero(row.taxPrice) && isFloatGeZero(row.returnNum)">{{
            getNumber(mul(row.taxPrice, row.returnNum), 2)
          }}</span>
        </template>

        <!-- 备注 列自定义内容 -->
        <template #description_default="{ row }">
          <a-input v-model:value="row.description" />
        </template>
      </vxe-grid>

      <j-border title="合计">
        <j-form bordered label-width="140px">
          <j-form-item label="退货数量" :span="6">
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
        <j-form bordered label-width="140px">
          <j-form-item label="备注" :span="24" :content-nest="false">
            <a-textarea v-model:value.trim="formData.description" maxlength="200" />
          </j-form-item>
        </j-form>
      </j-border>

      <batch-add-product
        ref="batchAddProductDialog"
        :sc-id="formData.scId"
        :is-return="true"
        @confirm="batchAddProduct"
      />
      <div style="text-align: center; background-color: #ffffff; padding: 8px 0">
        <a-space>
          <a-button
            v-permission="['sale:return:add']"
            type="primary"
            :loading="loading"
            @click="createOrder"
            >保存</a-button
          >
          <a-button
            v-permission="['sale:return:approve']"
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
  import SaleOutSheetSelectorWithReturn from './SaleOutSheetSelectorWithReturn.vue';
  import BatchAddProduct from '@/views/sc/sale/batch-add-product.vue';
  import Moment from 'moment';
  import {
    PlusOutlined,
    DeleteOutlined,
    NumberOutlined,
    EditOutlined,
    AlertOutlined,
  } from '@ant-design/icons-vue';
  import StoreCenterSelector from '@/components/Selector/StoreCenterSelector.vue';
  import * as api from '@/api/sc/sale/return';
  import * as saleApi from '@/api/sc/sale/order';
  import * as outApi from '@/api/sc/sale/out';
  import { multiplePageMix } from '@/mixins/multiplePageMix';
  import {
    isEmpty,
    isFloatGeZero,
    getNumber,
    mul,
    div,
    add,
    isFloat,
    isFloatGtZero,
    isNumberPrecision,
    uuid,
    formatDate,
    getCurrentDateTime,
    PATTERN_IS_FLOAT_GE_ZERO,
    PATTERN_IS_PRICE,
  } from '@/utils/utils';
  import { createSuccess, createError, createConfirm, createPrompt } from '@/hooks/web/msg';
  import CustomerSelector from '@/components/Selector/CustomerSelector.vue';
  import UserSelector from '@/components/Selector/UserSelector.vue';

  export default defineComponent({
    name: 'AddSaleReturnSheetUnRequire',
    components: {
      SaleOutSheetSelectorWithReturn,
      BatchAddProduct,
      CustomerSelector,
      StoreCenterSelector,
      UserSelector,
    },
    mixins: [multiplePageMix],
    setup() {
      return {
        h,
        PlusOutlined,
        DeleteOutlined,
        NumberOutlined,
        EditOutlined,
        AlertOutlined,
        isEmpty,
        isFloatGeZero,
        getNumber,
        mul,
        getCurrentDateTime,
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
          { field: 'spec', title: '规格', width: 80 },
          { field: 'unit', title: '单位', width: 80 },
          { field: 'categoryName', title: '商品分类', width: 120 },
          { field: 'brandName', title: '商品品牌', width: 120 },
          { field: 'salePrice', title: '参考销售价（元）', align: 'right', width: 140 },
          {
            field: 'isGift',
            title: '是否赠品',
            width: 80,
            formatter: ({ cellValue }) => {
              return cellValue ? '是' : '否';
            },
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
            width: 140,
            slots: { default: 'taxPrice_default' },
          },
          {
            field: 'returnNum',
            title: '退货数量',
            align: 'right',
            width: 140,
            slots: { default: 'returnNum_default' },
          },
          {
            field: 'taxAmount',
            title: '含税金额',
            align: 'right',
            width: 140,
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
    mounted() {
      // 监听键盘事件，按下回车键时调用addProduct方法
      document.addEventListener('keydown', this.handleKeyDown);
    },
    beforeUnmount() {
      // 移除键盘事件监听
      document.removeEventListener('keydown', this.handleKeyDown);
    },
    methods: {
      // 处理键盘事件
      handleKeyDown(event) {
        // 按下回车键时调用addProduct方法
        if (event.key === 'Enter' || event.keyCode === 13) {
          this.addProduct();
        }
      },
      // 打开对话框 由父页面触发
      openDialog() {
        // 初始化表单数据
        this.initFormData();
      },
      // 关闭对话框
      closeDialog() {
        this.closeCurrentPage();
      },
      // 初始化表单数据
      async initFormData() {
        this.formData = {
          scId: '',
          customerId: '',
          outSheetId: '',
          salerId: '',
          paymentDate: formatDate(Moment().add(1, 'M')),
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
          id: uuid(),
          productId: '',
          productCode: '',
          productName: '',
          unit: '',
          spec: '',
          categoryName: '',
          brandName: '',
          salePrice: '',
          taxPrice: '',
          discountRate: 100,
          returnNum: '',
          taxRate: '',
          isGift: false,
          taxAmount: '',
          description: '',
          isFixed: false,
          products: [],
          productOptions: [],
        };
      },
      // 新增商品
      addProduct() {
        if (isEmpty(this.formData.scId)) {
          createError('请先选择仓库！');
          return;
        }
        this.tableData.push(this.emptyProduct());
        this.$nextTick(() => {
          const productInputRef = this.$refs['productInputRef' + (this.tableData.length - 1)];
          if (productInputRef) {
            productInputRef.focus();
          }
        });
      },
      // 搜索商品
      queryProduct(queryString, row) {
        if (isEmpty(queryString)) {
          row.products = [];
          row.productOptions = [];
        }

        saleApi.searchSaleProducts(this.formData.scId, queryString, true).then((res) => {
          row.products = res;
          row.productOptions = res.map((item) => {
            return {
              value: item.productId,
              label: item.productCode + ' ' + item.productName,
            };
          });
        });
      },
      // 选择商品（从表格中点击）
      handleSelectProduct(index, product) {
        // 将选中的商品数据赋值给当前行
        this.tableData[index] = Object.assign(this.tableData[index], product, {
          isGift: false,
          taxPrice: product.salePrice,
        });

        this.taxPriceInput(this.tableData[index], this.tableData[index].taxPrice);
      },
      // 删除商品
      delProduct() {
        const records = this.$refs.grid.getCheckboxRecords();
        if (isEmpty(records)) {
          createError('请选择要删除的商品数据！');
          return;
        }

        createConfirm('是否确定删除选中的商品？').then(() => {
          const tableData = this.tableData.filter((t) => {
            const tmp = records.filter((item) => item.id === t.id);
            return isEmpty(tmp);
          });

          this.tableData = tableData;

          this.calcSum();
        });
      },
      openBatchAddProductDialog() {
        if (isEmpty(this.formData.scId)) {
          createError('请先选择仓库！');
          return;
        }
        this.$refs.batchAddProductDialog.openDialog();
      },
      changeDiscountRate(row, value) {
        if (isFloatGeZero(row.discountRate) && isFloatGtZero(row.salePrice)) {
          row.taxPrice = getNumber(div(mul(row.salePrice, row.discountRate), 100), 6);
        }

        this.calcSum();
      },
      taxPriceInput(row, value) {
        if (row.salePrice !== 0) {
          if (isFloatGeZero(row.taxPrice)) {
            row.discountRate = getNumber(mul(div(row.taxPrice, row.salePrice), 100), 2);
          }
        }
        this.calcSum();
      },
      returnNumInput(value) {
        this.calcSum();
      },
      // 计算汇总数据
      calcSum() {
        let totalNum = 0;
        let giftNum = 0;
        let totalAmount = 0;

        this.tableData
          .filter((t) => {
            return isFloatGeZero(t.taxPrice) && isFloatGeZero(t.returnNum);
          })
          .forEach((t) => {
            const num = parseFloat(t.returnNum);
            if (t.isGift) {
              giftNum = add(giftNum, num);
            } else {
              totalNum = add(totalNum, num);
            }

            totalAmount = add(totalAmount, getNumber(mul(num, t.taxPrice), 2));
          });

        this.formData.totalNum = totalNum;
        this.formData.giftNum = giftNum;
        this.formData.totalAmount = totalAmount;
      },
      // 批量录入数量
      batchInputReturnNum() {
        const records = this.$refs.grid.getCheckboxRecords();
        if (isEmpty(records)) {
          createError('请选择商品数据！');
          return;
        }

        createPrompt('请输入退货数量', {
          inputPattern: PATTERN_IS_FLOAT_GE_ZERO,
          inputErrorMessage: '退货数量必须是数字并且不小于0',
          title: '批量录入数量',
          required: true,
        }).then(({ value }) => {
          records.forEach((t) => {
            t.returnNum = value;

            this.returnNumInput(value);
          });
        });
      },
      // 批量录入价格
      batchInputTaxPrice() {
        const records = this.$refs.grid.getCheckboxRecords();
        if (isEmpty(records)) {
          createError('请选择商品数据！');
          return;
        }

        for (let i = 0; i < records.length; i++) {
          if (records[i].isGift) {
            createError('第' + (i + 1) + '行商品为赠品，不允许录入价格！');
            return;
          }
        }

        createPrompt('请输入价格（元）', {
          inputPattern: PATTERN_IS_PRICE,
          inputErrorMessage: '价格（元）必须是数字并且不小于0，最多允许6位小数',
          title: '批量调整价格',
          required: true,
        }).then(({ value }) => {
          records.forEach((t) => {
            t.taxPrice = value;

            this.taxPriceInput(t, value);
          });
        });
      },
      // 设置赠品
      setGift() {
        const records = this.$refs.grid.getCheckboxRecords();
        if (isEmpty(records)) {
          createError('请选择要设置为赠品的商品数据！');
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
        if (isEmpty(this.formData.scId)) {
          createError('仓库不允许为空！');
          return false;
        }

        if (isEmpty(this.formData.customerId)) {
          createError('客户不允许为空！');
          return false;
        }

        if (this.formData.allowModifyPaymentDate) {
          if (isEmpty(this.formData.paymentDate)) {
            createError('付款日期不允许为空！');
            return false;
          }
        }

        if (isEmpty(this.tableData)) {
          createError('请录入商品！');
          return false;
        }

        for (let i = 0; i < this.tableData.length; i++) {
          const product = this.tableData[i];

          if (isEmpty(product.productId)) {
            createError('第' + (i + 1) + '行商品不允许为空！');
            return false;
          }

          if (isEmpty(product.taxPrice)) {
            createError('第' + (i + 1) + '行商品价格不允许为空！');
            return false;
          }

          if (!isFloat(product.taxPrice)) {
            createError('第' + (i + 1) + '行商品价格必须是数字！');
            return false;
          }

          if (product.isGift) {
            if (parseFloat(product.taxPrice) !== 0) {
              createError('第' + (i + 1) + '行商品价格必须等于0！');
              return false;
            }
          } else {
            if (!isFloatGtZero(product.taxPrice)) {
              createError('第' + (i + 1) + '行商品价格必须大于0！');
              return false;
            }
          }

          if (!isNumberPrecision(product.taxPrice, 6)) {
            createError('第' + (i + 1) + '行商品价格最多允许6位小数！');
            return false;
          }

          if (!isEmpty(product.returnNum)) {
            if (!isFloat(product.returnNum)) {
              createError('第' + (i + 1) + '行商品退货数量必须是数字！');
              return false;
            }

            if (!isFloatGtZero(product.returnNum)) {
              createError('第' + (i + 1) + '行商品退货数量必须大于0！');
              return false;
            }

            if (!isNumberPrecision(product.returnNum, 8)) {
              createError('第' + (i + 1) + '行商品退货数量最多允许8位小数！');
              return false;
            }
          } else {
            createError('第' + (i + 1) + '行商品退货数量不允许为空！');
            return false;
          }
        }

        return true;
      },
      buildParams() {
        return {
          scId: this.formData.scId,
          customerId: this.formData.customerId,
          salerId: this.formData.salerId || '',
          paymentDate: this.formData.paymentDate || '',
          description: this.formData.description,
          required: false,
          products: this.tableData
            .filter((t) => isFloatGtZero(t.returnNum))
            .map((t) => {
              const product = {
                productId: t.productId,
                oriPrice: t.salePrice,
                taxPrice: t.taxPrice,
                discountRate: t.discountRate,
                returnNum: t.returnNum,
                description: t.description,
              };

              return product;
            }),
        };
      },
      // 创建订单
      createOrder() {
        if (!this.validData()) {
          return;
        }

        const params = this.buildParams();

        this.loading = true;
        api
          .create(params)
          .then((res) => {
            createSuccess('保存成功！');

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

        const params = this.buildParams();

        createConfirm('对销售退货单执行审核通过操作？').then(() => {
          this.loading = true;
          api
            .directApprovePass(params)
            .then((res) => {
              createSuccess('审核通过！');

              this.$emit('confirm');
              this.closeDialog();
            })
            .finally(() => {
              this.loading = false;
            });
        });
      },
      // 选择销售出库单
      outSheetChange(e) {
        // 只要选择了销售出库单，清空所有商品，然后将销售出库单中所有的明细列出来
        if (!isEmpty(e)) {
          this.loading = true;
          outApi
            .getWithReturn(e)
            .then((res) => {
              let outSheetDetails = res.details || [];
              outSheetDetails = outSheetDetails.map((item) => {
                item.isFixed = false;
                return Object.assign(this.emptyProduct(), item);
              });

              this.tableData = outSheetDetails;

              this.formData.scId = res.scId;

              this.formData.customerId = res.customerId;

              if (!isEmpty(res.salerId)) {
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
        if (!isEmpty(customerId)) {
          outApi.getPaymentDate(customerId).then((res) => {
            if (res.allowModify) {
              // 如果允许修改付款日期
              if (isEmpty(this.formData.paymentDate)) {
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
    },
  });
</script>
<style></style>
