<template>
  <div class="app-card-container">
    <div v-permission="['purchase:return:modify']" v-loading="loading">
      <a-alert
        description="提示：使用回车键可以快速添加商品；使用Tab键可以快速跳转至下一个输入框。"
        type="info"
        show-icon
      />
      <j-border>
        <j-form bordered>
          <j-form-item label="仓库" required>
            {{ formData.sc.name }}
          </j-form-item>
          <j-form-item label="供应商" required>
            {{ formData.supplier.name }}
          </j-form-item>
          <j-form-item label="采购员">
            <user-selector v-model:value="formData.purchaserId" />
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
          <j-form-item label="采购收货单" required>
            {{ formData.receiveSheet.code }}
          </j-form-item>
          <j-form-item />
          <j-form-item label="状态">
            <span
              v-if="PURCHASE_RETURN_STATUS.APPROVE_PASS.equalsCode(formData.status)"
              style="color: #52c41a"
              >{{ PURCHASE_RETURN_STATUS.getDesc(formData.status) }}</span
            >
            <span
              v-else-if="PURCHASE_RETURN_STATUS.APPROVE_REFUSE.equalsCode(formData.status)"
              style="color: #f5222d"
              >{{ PURCHASE_RETURN_STATUS.getDesc(formData.status) }}</span
            >
            <span v-else style="color: #303133">{{
              PURCHASE_RETURN_STATUS.getDesc(formData.status)
            }}</span>
          </j-form-item>
          <j-form-item :span="16" :content-nest="false" label="拒绝理由">
            <a-input
              v-if="PURCHASE_RETURN_STATUS.APPROVE_REFUSE.equalsCode(formData.status)"
              v-model:value="formData.refuseReason"
              readonly
            />
          </j-form-item>
          <j-form-item label="操作人">
            <span>{{ formData.createBy }}</span>
          </j-form-item>
          <j-form-item label="操作时间" :span="16">
            <span>{{ formData.createTime }}</span>
          </j-form-item>
          <j-form-item
            v-if="
              PURCHASE_RETURN_STATUS.APPROVE_PASS.equalsCode(formData.status) ||
              PURCHASE_RETURN_STATUS.APPROVE_REFUSE.equalsCode(formData.status)
            "
            label="审核人"
          >
            <span>{{ formData.approveBy }}</span>
          </j-form-item>
          <j-form-item
            v-if="
              PURCHASE_RETURN_STATUS.APPROVE_PASS.equalsCode(formData.status) ||
              PURCHASE_RETURN_STATUS.APPROVE_REFUSE.equalsCode(formData.status)
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
                    field="purchasePrice"
                    title="采购价（元）"
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

        <!-- 退货价 列自定义内容 -->
        <template #purchasePrice_default="{ row }">
          <span>{{ row.purchasePrice }}</span>
        </template>

        <!-- 库存数量 列自定义内容 -->
        <template #stockNum_default="{ row }">
          <span v-if="checkStockNum(row)">{{ row.stockNum }}</span>
          <span v-else style="color: #f5222d">{{ row.stockNum }}</span>
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
          <span v-if="isFloatGeZero(row.purchasePrice) && isFloatGeZero(row.returnNum)">{{
            getNumber(mul(row.purchasePrice, row.returnNum), 2)
          }}</span>
        </template>

        <!-- 备注 列自定义内容 -->
        <template #description_default="{ row }">
          <a-input v-model:value="row.description" />
        </template>
      </vxe-grid>

      <order-time-line :id="id" />

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
        :sc-id="formData.sc.id"
        :is-return="true"
        @confirm="batchAddProduct"
      />

      <div style="text-align: center; background-color: #ffffff; padding: 8px 0">
        <a-space>
          <a-button
            v-permission="['purchase:return:modify']"
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
  import BatchAddProduct from '@/views/sc/purchase/batch-add-product.vue';
  import Moment from 'moment';
  import { PlusOutlined, DeleteOutlined, NumberOutlined } from '@ant-design/icons-vue';
  import * as api from '@/api/sc/purchase/return';
  import * as purchaseApi from '@/api/sc/purchase/order';
  import * as receiveApi from '@/api/sc/purchase/receive';
  import { multiplePageMix } from '@/mixins/multiplePageMix';
  import {
    isEmpty,
    isFloatGeZero,
    isFloatGtZero,
    isFloat,
    isNumberPrecision,
    getNumber,
    mul,
    add,
    sub,
    uuid,
    PATTERN_IS_FLOAT_GE_ZERO,
  } from '@/utils/utils';
  import { createSuccess, createError, createConfirm, createPrompt } from '@/hooks/web/msg';
  import UserSelector from '@/components/Selector/UserSelector.vue';
  import { PURCHASE_RETURN_STATUS } from '@/enums/biz/purchaseReturnStatus';
  import OrderTimeLine from '@/components/OrderTimeLine';

  export default defineComponent({
    name: 'ModifyPurchaseReturnRequire',
    components: {
      BatchAddProduct,
      UserSelector,
      OrderTimeLine,
    },
    mixins: [multiplePageMix],
    setup() {
      return {
        h,
        PlusOutlined,
        DeleteOutlined,
        NumberOutlined,
        isEmpty,
        isFloatGeZero,
        getNumber,
        PURCHASE_RETURN_STATUS,
        mul,
        sub,
      };
    },
    data() {
      return {
        id: this.$route.params.id,
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
          {
            field: 'isGift',
            title: '是否赠品',
            width: 80,
            formatter: ({ cellValue }) => {
              return cellValue ? '是' : '否';
            },
          },
          {
            field: 'purchasePrice',
            title: '退货价（元）',
            align: 'right',
            width: 140,
            slots: { default: 'purchasePrice_default' },
          },
          { field: 'taxCostPrice', title: '含税成本价（元）', align: 'right', width: 140 },
          {
            field: 'stockNum',
            title: '库存数量',
            align: 'right',
            width: 140,
            slots: { default: 'stockNum_default' },
          },
          {
            field: 'receiveNum',
            title: '收货数量',
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
        this.loadData();
      },
      // 关闭对话框
      closeDialog() {
        this.closeCurrentPage();
      },
      // 初始化表单数据
      initFormData() {
        this.formData = {
          sc: {},
          supplier: {},
          receiveSheet: {},
          purchaserId: '',
          paymentDate: '',
          totalNum: 0,
          giftNum: 0,
          totalAmount: 0,
          description: '',
          // 是否允许修改付款日期
          allowModifyPaymentDate: false,
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
              !PURCHASE_RETURN_STATUS.CREATED.equalsCode(res.status) &&
              !PURCHASE_RETURN_STATUS.APPROVE_REFUSE.equalsCode(res.status)
            ) {
              createError('采购退货单已审核通过，无法修改！');
              this.closeDialog();
              return;
            }
            this.formData = Object.assign(this.formData, {
              sc: {
                id: res.scId,
                name: res.scName,
              },
              supplier: {
                id: res.supplierId,
                name: res.supplierName,
              },
              purchaserId: res.purchaserId || '',
              paymentDate: res.paymentDate || '',
              receiveSheet: {
                id: res.receiveSheetId,
                code: res.receiveSheetCode,
              },
              description: res.description,
              status: res.status,
              createBy: res.createBy,
              createTime: res.createTime,
              approveBy: res.approveBy,
              approveTime: res.approveTime,
              refuseReason: res.refuseReason,
              totalNum: 0,
              giftNum: 0,
              totalAmount: 0,
            });

            const tableData = res.details || [];
            tableData.forEach((item) => {
              item.isFixed = !isEmpty(item.receiveSheetDetailId);

              if (item.isFixed) {
                // 接口返回的剩余退货数量是最新的数据，应加上当前退货数量
                item.remainNum = add(item.remainNum, item.returnNum);
              }

              return item;
            });
            this.tableData = tableData.map((item) => Object.assign(this.emptyProduct(), item));

            this.supplierChange(this.formData.supplier.id);

            this.calcSum();
          })
          .finally(() => {
            this.loading = false;
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
          purchasePrice: 0,
          taxCostPrice: '',
          stockNum: '',
          receiveNum: '',
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
        if (isEmpty(this.formData.receiveSheet)) {
          createError('请先选择采购收货单！');
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

        purchaseApi.searchPurchaseProducts(this.formData.sc.id, queryString, true).then((res) => {
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
          purchasePrice: 0,
        });

        this.purchasePriceInput(this.tableData[index], this.tableData[index].purchasePrice);
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
            createError('第' + (i + 1) + '行商品是采购收货单中的商品，不允许删除！');
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
        if (isEmpty(this.formData.receiveSheet)) {
          createError('请先选择采购收货单！');
          return;
        }
        this.$refs.batchAddProductDialog.openDialog();
      },
      purchasePriceInput(row, value) {
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
            return isFloatGeZero(t.purchasePrice) && isFloatGeZero(t.returnNum);
          })
          .forEach((t) => {
            const num = parseFloat(t.returnNum);
            if (t.isGift) {
              giftNum = add(giftNum, num);
            } else {
              totalNum = add(totalNum, num);
            }

            totalAmount = add(totalAmount, getNumber(mul(num, t.purchasePrice), 2));
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
        if (isEmpty(this.formData.sc.id)) {
          createError('仓库不允许为空！');
          return false;
        }

        if (isEmpty(this.formData.supplier.id)) {
          createError('供应商不允许为空！');
          return false;
        }

        if (this.formData.allowModifyPaymentDate) {
          if (isEmpty(this.formData.paymentDate)) {
            createError('付款日期不允许为空！');
            return false;
          }
        }

        if (isEmpty(this.formData.receiveSheet.id)) {
          createError('采购收货单不允许为空！');
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

          if (isEmpty(product.purchasePrice)) {
            createError('第' + (i + 1) + '行商品退货价不允许为空！');
            return false;
          }

          if (!isFloat(product.purchasePrice)) {
            createError('第' + (i + 1) + '行商品退货价必须是数字！');
            return false;
          }

          if (product.isGift) {
            if (parseFloat(product.purchasePrice) !== 0) {
              createError('第' + (i + 1) + '行商品退货价必须等于0！');
              return false;
            }
          } else {
            if (!isFloatGtZero(product.purchasePrice)) {
              createError('第' + (i + 1) + '行商品退货价必须大于0！');
              return false;
            }
          }

          if (!isNumberPrecision(product.purchasePrice, 6)) {
            createError('第' + (i + 1) + '行商品退货价最多允许6位小数！');
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
                    (product.receiveNum - product.remainNum) +
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
          createError('采购收货单中的商品必须全部或部分退货！');
          return false;
        }

        return true;
      },
      // 修改订单
      updateOrder() {
        if (!this.validData()) {
          return;
        }

        const params = {
          id: this.id,
          scId: this.formData.sc.id,
          supplierId: this.formData.supplier.id,
          purchaserId: this.formData.purchaserId || '',
          paymentDate: this.formData.paymentDate || '',
          receiveSheetId: this.formData.receiveSheet.id,
          description: this.formData.description,
          products: this.tableData
            .filter((t) => isFloatGtZero(t.returnNum))
            .map((t) => {
              const product = {
                productId: t.productId,
                returnNum: t.returnNum,
                description: t.description,
              };

              if (t.isFixed) {
                product.receiveSheetDetailId = t.receiveSheetDetailId;
              }

              return product;
            }),
        };

        this.loading = true;
        api
          .update(params)
          .then((res) => {
            createSuccess('保存成功！');

            this.$emit('confirm');
            this.closeDialog();
          })
          .finally(() => {
            this.loading = false;
          });
      },
      // 供应商改变时触发
      supplierChange(supplierId) {
        receiveApi.getPaymentDate(supplierId).then((res) => {
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
      },
      // 检查库存数量
      checkStockNum(row) {
        const checkArr = this.tableData
          .filter((item) => item.productId === row.productId)
          .map((item) => item.returnNum);
        if (isEmpty(checkArr)) {
          checkArr.push(0);
        }
        const totalReturnNum = checkArr.reduce((total, item) => {
          const returnNum = isFloatGtZero(item) ? item : 0;
          return add(total, returnNum);
        }, 0);

        return totalReturnNum <= row.stockNum;
      },
    },
  });
</script>
<style></style>
