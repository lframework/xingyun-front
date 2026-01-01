<template>
  <div class="app-card-container">
    <div v-permission="['retail:return:add']" v-loading="loading">
      <a-alert
        description="提示：使用回车键可以快速添加商品；使用Tab键可以快速跳转至下一个输入框。"
        type="info"
        show-icon
      />
      <j-border>
        <j-form bordered>
          <j-form-item label="仓库" required>
            <store-center-selector v-model:value="formData.scId" :before-open="beforeSelectSc" />
          </j-form-item>
          <j-form-item label="会员" :required="retailConfig.retailReturnRequireMember">
            <member-selector
              v-model:value="formData.memberId"
              :before-open="beforeSelectMember"
              @update:value="memberChange"
            />
          </j-form-item>
          <j-form-item label="销售员">
            <user-selector v-model:value="formData.salerId" :before-open="beforeSelectSaler" />
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
          <j-form-item label="零售出库单" required>
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
          </a-space>
        </template>

        <!-- 商品名称 列自定义内容 -->
        <template #productName_default="{ row, rowIndex }">
          <a-auto-complete
            v-if="!row.isFixed && isEmpty(row.productId)"
            :ref="'productInputRef' + rowIndex"
            v-model:value="row.productName"
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
                    field="retailPrice"
                    title="参考零售价（元）"
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

        <!-- 是否赠品 列自定义内容 -->
        <template #isGift_default="{ row }">
          <span>{{ row.isGift ? '是' : '否' }}</span>
        </template>

        <!-- 剩余退货数量 列自定义内容 -->
        <template #remainNum_default="{ row }">
          <span v-if="isEmpty(row.remainNum)">-</span>
          <span v-else-if="isFloatGeZero(row.returnNum)">{{
            Math.max(0, sub(row.remainNum, row.returnNum))
          }}</span>
          <span v-else>{{ row.remainNum }}</span>
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
  import MemberSelector from '@/components/Selector/MemberSelector.vue';
  import StoreCenterSelector from '@/components/Selector/StoreCenterSelector.vue';
  import { PlusOutlined, DeleteOutlined, NumberOutlined } from '@ant-design/icons-vue';
  import * as payTypeApi from '@/api/base-data/pay-type';
  import * as configApi from '@/api/sc/retail/config';
  import * as outApi from '@/api/sc/retail/out';
  import * as api from '@/api/sc/retail/return';
  import { multiplePageMix } from '@/mixins/multiplePageMix';
  import {
    isEmpty,
    isFloatGeZero,
    sub,
    getNumber,
    mul,
    add,
    isFloatGtZero,
    isNumberPrecision,
    isFloat,
    eq,
    uuid,
    formatDate,
    PATTERN_IS_FLOAT_GE_ZERO,
  } from '@/utils/utils';
  import { createSuccess, createError, createConfirm, createPrompt } from '@/hooks/web/msg';
  import UserSelector from '@/components/Selector/UserSelector.vue';

  export default defineComponent({
    name: 'AddRetailReturnRequire',
    components: {
      RetailOutSheetSelector,
      BatchAddProduct,
      PayType,
      MemberSelector,
      StoreCenterSelector,
      UserSelector,
    },
    mixins: [multiplePageMix],
    setup() {
      const moment = Moment;
      return {
        h,
        PlusOutlined,
        DeleteOutlined,
        NumberOutlined,
        moment,
        isEmpty,
        isFloatGeZero,
        sub,
        getNumber,
        mul,
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
          { field: 'retailPrice', title: '参考零售价（元）', align: 'right', width: 140 },
          { field: 'isGift', title: '是否赠品', width: 80, slots: { default: 'isGift_default' } },
          { field: 'discountRate', title: '折扣（%）', align: 'right', width: 120 },
          { field: 'taxPrice', title: '价格（元）', align: 'right', width: 140 },
          {
            field: 'outNum',
            title: '出库数量',
            align: 'right',
            width: 140,
            formatter: ({ cellValue }) => {
              return isEmpty(cellValue) ? '-' : cellValue;
            },
          },
          {
            field: 'remainNum',
            title: '剩余退货数量',
            align: 'right',
            width: 140,
            slots: { default: 'remainNum_default' },
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
        retailConfig: {},
        canChangeMember: false,
      };
    },
    created() {
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
          memberId: '',
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
        this.canChangeMember = false;
        configApi.get().then((data) => {
          this.retailConfig = data;
        });
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
          retailPrice: 0,
          taxPrice: '',
          discountRate: 100,
          outNum: '',
          remainNum: '',
          returnNum: '',
          taxRate: '',
          isGift: true,
          taxAmount: '',
          description: '',
          isFixed: false,
          products: [],
          productOptions: [],
        };
      },
      // 新增商品
      addProduct() {
        if (isEmpty(this.formData.outSheetId)) {
          createError('请先选择零售出库单！');
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
      // 选择商品（从表格中点击）
      handleSelectProduct(index, product) {
        // 将选中的商品数据赋值给当前行
        this.tableData[index] = Object.assign(this.tableData[index], product, {
          isGift: true,
          taxPrice: 0,
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

        for (let i = 0; i < records.length; i++) {
          if (records[i].isFixed) {
            createError('第' + (i + 1) + '行商品是零售出库单中的商品，不允许删除！');
            return;
          }
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
        if (isEmpty(this.formData.outSheetId)) {
          createError('请先选择零售出库单！');
          return;
        }
        this.$refs.batchAddProductDialog.openDialog();
      },
      taxPriceInput(row, value) {
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

        if (this.retailConfig.retailReturnRequireMember && isEmpty(this.formData.memberId)) {
          createError('会员不允许为空！');
          return false;
        }

        if (this.formData.allowModifyPaymentDate) {
          if (isEmpty(this.formData.paymentDate)) {
            createError('付款日期不允许为空！');
            return false;
          }
        }

        if (isEmpty(this.formData.outSheetId)) {
          createError('零售出库单不允许为空！');
          return false;
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

            if (product.isFixed) {
              if (!isFloatGeZero(product.returnNum)) {
                createError('第' + (i + 1) + '行商品退货数量不允许小于0！');
                return false;
              }
            } else {
              if (!isFloatGtZero(product.returnNum)) {
                createError('第' + (i + 1) + '行商品退货数量必须大于0！');
                return false;
              }
            }

            if (!isNumberPrecision(product.returnNum, 8)) {
              createError('第' + (i + 1) + '行商品退货数量最多允许8位小数！');
              return false;
            }

            if (product.isFixed) {
              if (product.returnNum > product.remainNum) {
                createError(
                  '第' +
                    (i + 1) +
                    '行商品累计退货数量为' +
                    sub(product.outNum, product.remainNum) +
                    '，剩余退货数量为' +
                    product.remainNum +
                    '，本次退货数量不允许大于' +
                    product.remainNum +
                    '！',
                );
                return false;
              }
            }
          } else {
            if (!product.isFixed) {
              createError('第' + (i + 1) + '行商品退货数量不允许为空！');
              return false;
            }
          }
        }

        if (this.tableData.filter((item) => isFloatGtZero(item.returnNum)).length === 0) {
          createError('零售出库单中的商品必须全部或部分退货！');
          return false;
        }

        if (!this.$refs.payType.validData()) {
          return false;
        }

        const payTypes = this.$refs.payType.getTableData();
        const totalPayAmount = payTypes.reduce((tot, item) => add(tot, item.payAmount), 0);
        if (!eq(this.formData.totalAmount, totalPayAmount)) {
          createError('所有支付方式的支付金额不等于含税总金额，请检查！');
          return false;
        }

        return true;
      },
      buildParams() {
        return {
          scId: this.formData.scId,
          memberId: this.formData.memberId,
          salerId: this.formData.salerId || '',
          paymentDate: this.formData.paymentDate || '',
          outSheetId: this.formData.outSheetId,
          description: this.formData.description,
          required: true,
          payTypes: this.$refs.payType.getTableData().map((t) => {
            return {
              id: t.payTypeId,
              payAmount: t.payAmount,
              text: t.text,
            };
          }),
          products: this.tableData
            .filter((t) => isFloatGtZero(t.returnNum))
            .map((t) => {
              const product = {
                productId: t.productId,
                oriPrice: t.retailPrice,
                returnNum: t.returnNum,
                description: t.description,
              };

              if (t.isFixed) {
                product.outSheetDetailId = t.id;
              }

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

        createConfirm('对零售退货单执行审核通过操作？').then(() => {
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
      // 选择零售出库单
      outSheetChange(e) {
        // 只要选择了零售出库单，清空所有商品，然后将零售出库单中所有的明细列出来
        this.$refs.payType.setTableData([]);
        if (!isEmpty(e)) {
          this.loading = true;
          outApi
            .getWithReturn(e)
            .then((res) => {
              const tableData = this.tableData.filter((item) => !item.isFixed);
              let outSheetDetails = res.details || [];
              outSheetDetails = outSheetDetails.map((item) => {
                item.isFixed = true;
                return Object.assign(this.emptyProduct(), item);
              });

              this.tableData = [...outSheetDetails, ...tableData];

              this.formData.scId = res.scId;

              this.formData.memberId = res.memberId;

              this.canChangeMember = isEmpty(this.formData.memberId);

              if (!isEmpty(res.salerId)) {
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
      beforeSelectSc() {
        if (!this.beforeSelectComponents()) {
          return false;
        }

        createError('由于“零售退货单关联零售出库单”，不允许修改仓库！');
        return false;
      },
      beforeSelectMember() {
        if (!this.beforeSelectComponents()) {
          return false;
        }

        if (this.canChangeMember) {
          return true;
        }

        createError('由于“零售退货单关联零售出库单”，不允许修改会员！');
        return false;
      },
      beforeSelectSaler() {
        return this.beforeSelectComponents();
      },
      beforeSelectComponents() {
        if (isEmpty(this.formData.outSheetId)) {
          createError('请先选择零售出库单！');
          return false;
        }

        return true;
      },
      // 会员改变时触发
      memberChange(memberId) {
        outApi.getPaymentDate(memberId).then((res) => {
          this.formData.paymentDate = res.paymentDate || '';
          this.formData.allowModifyPaymentDate = res.allowModify;
        });
      },
    },
  });
</script>
<style></style>
