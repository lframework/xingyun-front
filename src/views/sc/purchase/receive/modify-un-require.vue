<template>
  <div class="app-card-container">
    <div v-permission="['purchase:receive:modify']" v-loading="loading">
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
          <j-form-item label="供应商" required>
            <supplier-selector v-model:value="formData.supplierId" @update:value="supplierChange" />
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
          <j-form-item label="实际到货日期" required>
            <a-date-picker
              v-model:value="formData.receiveDate"
              placeholder=""
              value-format="YYYY-MM-DD"
            />
          </j-form-item>
          <j-form-item />
          <j-form-item label="状态">
            <span
              v-if="RECEIVE_SHEET_STATUS.APPROVE_PASS.equalsCode(formData.status)"
              style="color: #52c41a"
              >{{ RECEIVE_SHEET_STATUS.getDesc(formData.status) }}</span
            >
            <span
              v-else-if="RECEIVE_SHEET_STATUS.APPROVE_REFUSE.equalsCode(formData.status)"
              style="color: #f5222d"
              >{{ RECEIVE_SHEET_STATUS.getDesc(formData.status) }}</span
            >
            <span v-else style="color: #303133">{{
              RECEIVE_SHEET_STATUS.getDesc(formData.status)
            }}</span>
          </j-form-item>
          <j-form-item :span="16" :content-nest="false" label="拒绝理由">
            <a-input
              v-if="RECEIVE_SHEET_STATUS.APPROVE_REFUSE.equalsCode(formData.status)"
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
              RECEIVE_SHEET_STATUS.APPROVE_PASS.equalsCode(formData.status) ||
              RECEIVE_SHEET_STATUS.APPROVE_REFUSE.equalsCode(formData.status)
            "
            label="审核人"
          >
            <span>{{ formData.approveBy }}</span>
          </j-form-item>
          <j-form-item
            v-if="
              RECEIVE_SHEET_STATUS.APPROVE_PASS.equalsCode(formData.status) ||
              RECEIVE_SHEET_STATUS.APPROVE_REFUSE.equalsCode(formData.status)
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
            <a-button :icon="h(NumberOutlined)" @click="batchInputReceiveNum"
              >批量录入数量</a-button
            >
            <a-button :icon="h(EditOutlined)" @click="batchInputPurchasePrice"
              >批量调整采购价</a-button
            >
            <a-button :icon="h(AlertOutlined)" @click="setGift">设置赠品</a-button>
            <a-button :icon="h(UploadOutlined)" @click="openExcelModifyPriceDialog"
              >EXCEL修改采购价</a-button
            >
          </a-space>
        </template>

        <!-- 商品名称 列自定义内容 -->
        <template #productName_default="{ row, rowIndex }">
          <a-auto-complete
            v-if="isEmpty(row.productId)"
            :ref="'productInputRef' + rowIndex"
            v-model:value="row.productName"
            style="width: 100%"
            placeholder="请输入商品编号/SKU编号/名称"
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
                  <vxe-column field="skuCode" title="SKU编号" width="120" />
                  <vxe-column field="productName" title="商品名称" min-width="200" />
                  <vxe-column field="salePropertyText" title="销售属性" width="180" />
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

        <!-- 采购价 列自定义内容 -->
        <template #purchasePrice_default="{ row }">
          <span v-if="row.isGift">{{ row.purchasePrice }}</span>
          <a-input
            v-else
            v-model:value="row.purchasePrice"
            class="number-input"
            @input="(e) => purchasePriceInput(e.target.value)"
          />
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
          <span v-if="isFloatGeZero(row.purchasePrice) && isFloatGeZero(row.receiveNum)">{{
            getNumber(mul(row.purchasePrice, row.receiveNum), 2)
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
        <j-form bordered label-width="140px">
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

      <excel-parser
        ref="excelModifyPriceDialog"
        :columns="excelModifyPriceColumns"
        template-filename="EXCEL修改采购价模板"
        title="EXCEL修改采购价"
        :close-after-finish="false"
        @confirm="handleExcelModifyPrice"
      />

      <div style="text-align: center; background-color: #ffffff; padding: 8px 0">
        <a-space>
          <a-button
            v-permission="['purchase:receive:modify']"
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
  import ExcelParser from '@/components/ExcelParser';
  import Moment from 'moment';
  import {
    PlusOutlined,
    DeleteOutlined,
    NumberOutlined,
    EditOutlined,
    AlertOutlined,
    UploadOutlined,
  } from '@ant-design/icons-vue';
  import StoreCenterSelector from '@/components/Selector/StoreCenterSelector.vue';
  import SupplierSelector from '@/components/Selector/SupplierSelector.vue';
  import UserSelector from '@/components/Selector/UserSelector.vue';
  import * as api from '@/api/sc/purchase/receive';
  import * as purchaseApi from '@/api/sc/purchase/order';
  import { multiplePageMix } from '@/mixins/multiplePageMix';
  import {
    isEmpty,
    isFloatGeZero,
    getNumber,
    mul,
    add,
    isFloat,
    isFloatGtZero,
    isNumberPrecision,
    uuid,
    PATTERN_IS_FLOAT_GT_ZERO,
    PATTERN_IS_PRICE,
  } from '@/utils/utils';
  import { createSuccess, createError, createConfirm, createPrompt } from '@/hooks/web/msg';
  import { RECEIVE_SHEET_STATUS } from '@/enums/biz/receiveSheetStatus';
  import OrderTimeLine from '@/components/OrderTimeLine';

  export default defineComponent({
    name: 'ModifyPurchaseReceiveSheetUnRequire',
    components: {
      BatchAddProduct,
      ExcelParser,
      StoreCenterSelector,
      SupplierSelector,
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
        EditOutlined,
        AlertOutlined,
        UploadOutlined,
        isEmpty,
        isFloatGeZero,
        getNumber,
        mul,
        RECEIVE_SHEET_STATUS,
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
          { field: 'skuCode', title: 'SKU编号', width: 120 },
          {
            field: 'productName',
            title: '商品名称',
            width: 260,
            slots: { default: 'productName_default' },
          },
          { field: 'salePropertyText', title: '销售属性', width: 180 },
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
            title: '采购价（元）',
            align: 'right',
            width: 140,
            slots: { default: 'purchasePrice_default' },
          },
          { field: 'taxCostPrice', title: '含税成本价（元）', align: 'right', width: 140 },
          { field: 'stockNum', title: '库存数量', align: 'right', width: 140 },
          {
            field: 'receiveNum',
            title: '收货数量',
            align: 'right',
            width: 140,
            slots: { default: 'receiveNum_default' },
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
        // EXCEL修改价格列定义
        excelModifyPriceColumns: [
          { field: 'skuCode', label: 'SKU编号', required: true },
          { field: 'price', label: '采购价', required: false },
        ],
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
          scId: '',
          supplierId: '',
          purchaseOrder: {},
          purchaserId: '',
          paymentDate: '',
          receiveDate: '',
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
              !RECEIVE_SHEET_STATUS.CREATED.equalsCode(res.status) &&
              !RECEIVE_SHEET_STATUS.APPROVE_REFUSE.equalsCode(res.status)
            ) {
              createError('采购收货单已审核通过，无法修改！');
              this.closeDialog();
              return;
            }
            this.formData = Object.assign(this.formData, {
              scId: res.scId,
              supplierId: res.supplierId,
              purchaserId: res.purchaserId || '',
              paymentDate: res.paymentDate || '',
              receiveDate: res.receiveDate,
              purchaseOrder: {},
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
              item.isFixed = false;

              return item;
            });

            this.tableData = tableData.map((item) => Object.assign(this.emptyProduct(), item));

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
          skuId: '',
          productCode: '',
          skuCode: '',
          salePropertyText: '',
          productName: '',
          unit: '',
          spec: '',
          categoryName: '',
          brandName: '',
          purchasePrice: '',
          taxCostPrice: '',
          stockNum: '',
          receiveNum: '',
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
      // 选择商品（从表格中点击）
      handleSelectProduct(index, product) {
        // 将选中的商品数据赋值给当前行
        this.tableData[index] = Object.assign(this.tableData[index], product, {
          isGift: false,
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

        createConfirm('是否确定删除选中的商品？').then(() => {
          const tableData = this.tableData.filter((t) => {
            const tmp = records.filter((item) => item.id === t.id);
            return isEmpty(tmp);
          });

          this.tableData = tableData;

          this.supplierChange(this.formData.supplierId, true);
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
      purchasePriceInput(_row, _value) {
        this.calcSum();
      },
      receiveNumInput(_value) {
        this.calcSum();
      },
      // 计算汇总数据
      calcSum() {
        let totalNum = 0;
        let giftNum = 0;
        let totalAmount = 0;

        this.tableData
          .filter((t) => {
            return isFloatGeZero(t.purchasePrice) && isFloatGeZero(t.receiveNum);
          })
          .forEach((t) => {
            const num = parseFloat(t.receiveNum);
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
      batchInputReceiveNum() {
        const records = this.$refs.grid.getCheckboxRecords();
        if (isEmpty(records)) {
          createError('请选择商品数据！');
          return;
        }

        createPrompt('请输入收货数量', {
          inputPattern: PATTERN_IS_FLOAT_GT_ZERO,
          inputErrorMessage: '收货数量必须是数字并且大于0',
          title: '批量录入数量',
          required: true,
        }).then(({ value }) => {
          records.forEach((t) => {
            t.receiveNum = value;

            this.receiveNumInput(value);
          });
        });
      },
      // 批量录入采购价
      batchInputPurchasePrice() {
        const records = this.$refs.grid.getCheckboxRecords();
        if (isEmpty(records)) {
          createError('请选择商品数据！');
          return;
        }

        for (let i = 0; i < records.length; i++) {
          if (records[i].isGift) {
            createError('第' + (i + 1) + '行商品为赠品，不允许录入采购价！');
            return;
          }
        }

        createPrompt('请输入采购价（元）', {
          inputPattern: PATTERN_IS_PRICE,
          inputErrorMessage: '采购价（元）必须是数字并且不小于0，最多允许6位小数',
          title: '批量调整采购价',
          required: true,
        }).then(({ value }) => {
          records.forEach((t) => {
            t.purchasePrice = value;

            this.purchasePriceInput(t, value);
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
      // 打开EXCEL修改价格弹窗
      openExcelModifyPriceDialog() {
        if (isEmpty(this.tableData)) {
          createError('请先录入商品！');
          return;
        }
        this.$refs.excelModifyPriceDialog.openDialog();
      },
      // 处理EXCEL修改价格
      handleExcelModifyPrice({ data }) {
        if (isEmpty(data)) {
          createError('Excel中没有数据！');
          return;
        }

        let matchedCount = 0;

        for (const row of data) {
          const skuCode = row.skuCode;
          if (isEmpty(skuCode)) {
            continue;
          }

          if (isEmpty(row.price)) {
            continue;
          }

          const price = row.price;

          this.tableData
            .filter((item) => !item.isGift)
            .forEach((item) => {
              if (item.skuCode === skuCode) {
                item.purchasePrice = price;
                matchedCount++;
              }
            });
        }

        this.calcSum();
        this.$refs.excelModifyPriceDialog.closeDialog();
        createSuccess('成功修改' + matchedCount + '条商品的采购价！');
      },
      // 校验数据
      validData() {
        if (isEmpty(this.formData.scId)) {
          createError('仓库不允许为空！');
          return false;
        }

        if (isEmpty(this.formData.supplierId)) {
          createError('供应商不允许为空！');
          return false;
        }

        if (this.formData.allowModifyPaymentDate) {
          if (isEmpty(this.formData.paymentDate)) {
            createError('付款日期不允许为空！');
            return false;
          }
        }

        if (isEmpty(this.formData.receiveDate)) {
          createError('实际到货日期不允许为空！');
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
            createError('第' + (i + 1) + '行商品采购价不允许为空！');
            return false;
          }

          if (!isFloat(product.purchasePrice)) {
            createError('第' + (i + 1) + '行商品采购价必须是数字！');
            return false;
          }

          if (product.isGift) {
            if (parseFloat(product.purchasePrice) !== 0) {
              createError('第' + (i + 1) + '行商品采购价必须等于0！');
              return false;
            }
          } else {
            if (!isFloatGtZero(product.purchasePrice)) {
              createError('第' + (i + 1) + '行商品采购价必须大于0！');
              return false;
            }
          }

          if (!isNumberPrecision(product.purchasePrice, 6)) {
            createError('第' + (i + 1) + '行商品采购价最多允许6位小数！');
            return false;
          }

          if (!isEmpty(product.receiveNum)) {
            if (!isFloat(product.receiveNum)) {
              createError('第' + (i + 1) + '行商品收货数量必须是数字！');
              return false;
            }

            if (!isFloatGtZero(product.receiveNum)) {
              createError('第' + (i + 1) + '行商品收货数量必须大于0！');
              return false;
            }

            if (!isNumberPrecision(product.receiveNum, 8)) {
              createError('第' + (i + 1) + '行商品收货数量最多允许8位小数！');
              return false;
            }
          } else {
            createError('第' + (i + 1) + '行商品收货数量不允许为空！');
            return false;
          }
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
          scId: this.formData.scId,
          supplierId: this.formData.supplierId,
          purchaserId: this.formData.purchaserId || '',
          paymentDate: this.formData.paymentDate || '',
          receiveDate: this.formData.receiveDate,
          allowModifyPaymentDate: true,
          description: this.formData.description,
          products: this.tableData
            .filter((t) => isFloatGtZero(t.receiveNum))
            .map((t) => {
              const product = {
                productId: t.productId,
                skuId: t.skuId || t.productId,
                purchasePrice: t.purchasePrice,
                receiveNum: t.receiveNum,
                description: t.description,
              };

              return product;
            }),
        };

        this.loading = true;
        api
          .update(params)
          .then((_res) => {
            createSuccess('保存成功！');

            this.$emit('confirm');
            this.closeDialog();
          })
          .finally(() => {
            this.loading = false;
          });
      },
      // 供应商改变时触发
      supplierChange(supplierId, unModify) {
        if (!isEmpty(supplierId)) {
          api.getPaymentDate(supplierId).then((res) => {
            if (!unModify) {
              if (res.allowModify) {
                // 如果允许修改付款日期
                if (isEmpty(this.formData.paymentDate)) {
                  this.formData.paymentDate = res.paymentDate || '';
                }
              } else {
                // 不允许修改则按默认日期
                this.formData.paymentDate = res.paymentDate || '';
              }
            }

            this.formData.allowModifyPaymentDate = res.allowModify;
          });
        }
      },
    },
  });
</script>
<style></style>
