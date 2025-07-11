<template>
  <div class="app-card-container">
    <div v-permission="['retail:return:add']" v-loading="loading">
      <j-border>
        <j-form bordered>
          <j-form-item label="仓库" required>
            <store-center-selector v-model:value="formData.scId" />
          </j-form-item>
          <j-form-item label="会员" :required="retailConfig.retailReturnRequireMember">
            <member-selector v-model:value="formData.memberId" @update:value="memberChange" />
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
                  return current && current < moment().endOf('day');
                }
              "
            />
          </j-form-item>
          <j-form-item label="零售出库单">
            <retail-out-sheet-selector
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
            v-model:value="row.productName"
            style="width: 100%"
            placeholder=""
            value-key="productName"
            :options="row.productOptions"
            @search="(e) => queryProduct(e, row)"
            @select="(e) => handleSelectProduct(rowIndex, e, row)"
          />
        </template>

        <!-- 折扣 列自定义内容 -->
        <template #discountRate_default="{ row }">
          <span v-if="row.retailPrice === 0 || row.isGift">{{ row.discountRate }}</span>
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

        <!-- 是否赠品 列自定义内容 -->
        <template #isGift_default="{ row }">
          <span>{{ row.isGift ? '是' : '否' }}</span>
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
          <span
            v-if="$utils.isFloatGeZero(row.taxPrice) && $utils.isIntegerGeZero(row.returnNum)"
            >{{ $utils.mul(row.taxPrice, row.returnNum) }}</span
          >
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

      <j-border title="支付方式">
        <pay-type ref="payType" />
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
            v-permission="['retail:return:add']"
            type="primary"
            :loading="loading"
            @click="createOrder"
            >保存</a-button
          >
          <a-button
            v-permission="['retail:return:approve']"
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
  import RetailOutSheetSelector from './RetailOutSheetSelector.vue';
  import BatchAddProduct from '@/views/sc/retail/batch-add-product.vue';
  import Moment from 'moment';
  import PayType from '@/views/sc/pay-type/index.vue';
  import {
    PlusOutlined,
    DeleteOutlined,
    NumberOutlined,
    EditOutlined,
    AlertOutlined,
  } from '@ant-design/icons-vue';
  import * as payTypeApi from '@/api/base-data/pay-type';
  import * as configApi from '@/api/sc/retail/config';
  import * as outApi from '@/api/sc/retail/out';
  import * as api from '@/api/sc/retail/return';
  import { multiplePageMix } from '@/mixins/multiplePageMix';

  export default defineComponent({
    name: 'AddRetailReturnUnRequire',
    components: {
      RetailOutSheetSelector,
      BatchAddProduct,
      PayType,
    },
    mixins: [multiplePageMix],
    setup() {
      const moment = Moment;
      return {
        h,
        PlusOutlined,
        DeleteOutlined,
        NumberOutlined,
        EditOutlined,
        AlertOutlined,
        moment,
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
          { field: 'externalCode', title: '商品简码', width: 120 },
          { field: 'unit', title: '单位', width: 80 },
          { field: 'spec', title: '规格', width: 80 },
          { field: 'categoryName', title: '商品分类', width: 120 },
          { field: 'brandName', title: '商品品牌', width: 120 },
          { field: 'retailPrice', title: '参考零售价（元）', align: 'right', width: 150 },
          { field: 'isGift', title: '是否赠品', width: 80, slots: { default: 'isGift_default' } },
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
            field: 'returnNum',
            title: '退货数量',
            align: 'right',
            width: 100,
            slots: { default: 'returnNum_default' },
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
        retailConfig: {},
      };
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
        this.closeCurrentPage();
      },
      // 初始化表单数据
      async initFormData() {
        this.formData = {
          scId: '',
          memberId: '',
          outSheetId: '',
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
        configApi.get().then((data) => {
          this.retailConfig = data;
        });
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
          retailPrice: '',
          taxPrice: '',
          discountRate: 100,
          returnNum: '',
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

        outApi.searchRetailProducts(this.formData.scId, queryString, true).then((res) => {
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
          taxPrice: value.retailPrice,
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
          this.$utils.isFloatGtZero(row.retailPrice)
        ) {
          row.taxPrice = this.$utils
            .div(this.$utils.mul(row.retailPrice, row.discountRate), 100)
            .toFixed(2);
        }

        this.calcSum();
      },
      taxPriceInput(row, value) {
        if (row.retailPrice !== 0) {
          if (this.$utils.isFloatGeZero(row.taxPrice)) {
            row.discountRate = this.$utils
              .mul(this.$utils.div(row.taxPrice, row.retailPrice), 100)
              .toFixed(2);
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
            return (
              this.$utils.isFloatGeZero(t.taxPrice) && this.$utils.isIntegerGeZero(t.returnNum)
            );
          })
          .forEach((t) => {
            const num = parseInt(t.returnNum);
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
      batchInputReturnNum() {
        const records = this.$refs.grid.getCheckboxRecords();
        if (this.$utils.isEmpty(records)) {
          this.$msg.createError('请选择商品数据！');
          return;
        }

        this.$msg
          .createPrompt('请输入退货数量', {
            inputPattern: this.$utils.PATTERN_IS_INTEGER_GT_ZERO,
            inputErrorMessage: '退货数量必须为整数并且大于0',
            title: '批量录入数量',
            required: true,
          })
          .then(({ value }) => {
            records.forEach((t) => {
              t.returnNum = value;

              this.returnNumInput(value);
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

        if (
          this.retailConfig.retailReturnRequireMember &&
          this.$utils.isEmpty(this.formData.memberId)
        ) {
          this.$msg.createError('会员不允许为空！');
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

          if (!this.$utils.isEmpty(product.returnNum)) {
            if (!this.$utils.isInteger(product.returnNum)) {
              this.$msg.createError('第' + (i + 1) + '行商品退货数量必须为整数！');
              return false;
            }

            if (!this.$utils.isIntegerGtZero(product.returnNum)) {
              this.$msg.createError('第' + (i + 1) + '行商品退货数量必须大于0！');
              return false;
            }
          } else {
            this.$msg.createError('第' + (i + 1) + '行商品退货数量不允许为空！');
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
          this.$msg.createError('所有支付方式的支付金额不等于含税总金额，请检查！');
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
          memberId: this.formData.memberId,
          salerId: this.formData.salerId || '',
          paymentDate: this.formData.paymentDate || '',
          description: this.formData.description,
          required: false,
          payTypes: this.$refs.payType.getTableData().map((t) => {
            return {
              id: t.payTypeId,
              payAmount: t.payAmount,
              text: t.text,
            };
          }),
          products: this.tableData
            .filter((t) => this.$utils.isIntegerGtZero(t.returnNum))
            .map((t) => {
              const product = {
                productId: t.productId,
                oriPrice: t.retailPrice,
                taxPrice: t.taxPrice,
                discountRate: t.discountRate,
                returnNum: t.returnNum,
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

        const params = {
          scId: this.formData.scId,
          memberId: this.formData.memberId,
          salerId: this.formData.salerId || '',
          paymentDate: this.formData.paymentDate || '',
          description: this.formData.description,
          payTypes: this.$refs.payType.getTableData().map((t) => {
            return {
              id: t.payTypeId,
              payAmount: t.payAmount,
              text: t.text,
            };
          }),
          products: this.tableData
            .filter((t) => this.$utils.isIntegerGtZero(t.returnNum))
            .map((t) => {
              const product = {
                productId: t.productId,
                oriPrice: t.retailPrice,
                taxPrice: t.taxPrice,
                discountRate: t.discountRate,
                returnNum: t.returnNum,
                description: t.description,
              };

              return product;
            }),
        };

        this.$msg.createConfirm('对零售退货单执行审核通过操作？').then(() => {
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
      // 选择零售出库单
      outSheetChange(e) {
        // 只要选择了零售出库单，清空所有商品，然后将零售出库单中所有的明细列出来
        this.$refs.payType.setTableData([]);
        if (!this.$utils.isEmpty(e)) {
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

              this.formData.memberId = res.memberId;

              if (!this.$utils.isEmpty(res.salerId)) {
                this.formData.salerId = res.salerId;
              }

              this.memberChange(this.formData.memberId);
            })
            .finally(() => {
              this.loading = false;
            });
          payTypeApi.getOrderPayType(e).then((res) => {
            this.$refs.payType.setTableData(res || []);
          });
        }
      },
      // 会员改变时触发
      memberChange(memberId) {
        if (!this.$utils.isEmpty(memberId)) {
          outApi.getPaymentDate(memberId).then((res) => {
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
    },
  });
</script>
<style></style>
