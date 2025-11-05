<template>
  <div class="app-card-container">
    <div v-permission="['purchase:order:add']" v-loading="loading">
      <a-alert
        description="提示：使用回车键可以快速添加商品；使用Tab键可以快速跳转至下一个输入框。"
        type="info"
        show-icon
      />
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
            <j-form bordered>
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
            v-if="isEmpty(row.productId)"
            :ref="'productInputRef' + rowIndex"
            v-model:value="row.productName"
            placeholder="请输入商品编号/名称/SKU编号/简码"
            :options="row.productOptions"
            :dropdown-match-select-width="false"
            :dropdown-style="{ width: '900px' }"
            @search="(e) => queryProduct(e, row, rowIndex)"
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
                  <vxe-column field="skuCode" title="商品SKU编号" width="120" />
                  <vxe-column field="spec" title="规格" width="80" />
                  <vxe-column field="unit" title="单位" width="80" />
                  <vxe-column field="purchasePrice" title="采购价（元）" width="140" align="right" />
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
          <span v-if="isFloatGeZero(row.purchasePrice) && isFloatGeZero(row.purchaseNum)">{{
            getNumber(mul(row.purchasePrice, row.purchaseNum), 2)
          }}</span>
        </template>

        <!-- 备注 列自定义内容 -->
        <template #description_default="{ row }">
          <a-input v-model:value="row.description" />
        </template>
      </vxe-grid>

      <j-border title="合计">
        <j-form bordered label-width="140px">
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
            v-if="!requireBpm"
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
  import StoreCenterSelector from '@/components/Selector/StoreCenterSelector.vue';
  import SupplierSelector from '@/components/Selector/SupplierSelector.vue';
  import UserSelector from '@/components/Selector/UserSelector.vue';
  import {
    PlusOutlined,
    DeleteOutlined,
    NumberOutlined,
    EditOutlined,
    AlertOutlined,
  } from '@ant-design/icons-vue';
  import * as api from '@/api/sc/purchase/order';
  import * as configApi from '@/api/sc/purchase/config';
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
    eq,
    uuid,
    formatDate,
    PATTERN_IS_FLOAT_GT_ZERO,
    PATTERN_IS_PRICE,
  } from '@/utils/utils';
  import { createSuccess, createError, createConfirm, createPrompt } from '@/hooks/web/msg';

  export default defineComponent({
    name: 'AddPurchaseOrder',
    components: {
      BatchAddProduct,
      PayType,
      StoreCenterSelector,
      SupplierSelector,
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
          { field: 'spec', title: '规格', width: 80 },
          { field: 'unit', title: '单位', width: 80 },
          { field: 'categoryName', title: '商品分类', width: 120 },
          { field: 'brandName', title: '商品品牌', width: 120 },
          {
            field: 'purchasePrice',
            title: '采购价（元）',
            align: 'right',
            width: 140,
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
          { field: 'stockNum', title: '库存数量', align: 'right', width: 140 },
          {
            field: 'purchaseNum',
            title: '采购数量',
            align: 'right',
            width: 140,
            slots: { default: 'purchaseNum_default' },
          },
          {
            field: 'purchaseAmount',
            title: '采购含税金额',
            align: 'right',
            width: 140,
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
        requireBpm: false,
      };
    },
    computed: {},
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
      initFormData() {
        this.formData = {
          scId: '',
          supplierId: '',
          purchaserId: '',
          expectArriveDate: formatDate(Moment().add(1, 'M')),
          totalNum: 0,
          giftNum: 0,
          totalAmount: 0,
          description: '',
        };

        this.tableData = [];

        configApi.get().then((res) => {
          this.requireBpm = res.purchaseRequireBpm;
        });
      },
      emptyProduct() {
        return {
          id: uuid(),
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
      // 选择商品（从表格中点击）
      handleSelectProduct(index, product) {
        // 将选中的商品数据赋值给当前行
        this.tableData[index] = Object.assign(this.tableData[index], product);

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

          this.calcSum();
        });
      },
      // 批量添加商品
      openBatchAddProductDialog() {
        if (isEmpty(this.formData.scId)) {
          createError('请先选择仓库！');
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
            return isFloatGeZero(t.purchasePrice) && isFloatGeZero(t.purchaseNum);
          })
          .forEach((t) => {
            const num = parseFloat(t.purchaseNum);
            if (t.isGift) {
              giftNum = add(giftNum, num);
            } else {
              totalNum = add(totalNum, num);
            }

            // 先将每行的金额格式化成2位小数，然后再累加
            const rowAmount = getNumber(mul(num, t.purchasePrice), 2);
            totalAmount = add(totalAmount, rowAmount);
          });

        this.formData.totalNum = totalNum;
        this.formData.giftNum = giftNum;
        this.formData.totalAmount = totalAmount;
      },
      // 批量录入数量
      batchInputPurchaseNum() {
        const records = this.$refs.grid.getCheckboxRecords();
        if (isEmpty(records)) {
          createError('请选择商品数据！');
          return;
        }

        createPrompt('请输入采购数量', {
          inputPattern: PATTERN_IS_FLOAT_GT_ZERO,
          inputErrorMessage: '采购数量必须是数字并且大于0',
          title: '批量录入数量',
          required: true,
        }).then(({ value }) => {
          records.forEach((t) => {
            t.purchaseNum = value;

            this.purchaseNumInput(value);
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
          const index = this.tableData.length - 1;
          this.handleSelectProduct(index, item);
        });
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

        if (isEmpty(this.formData.expectArriveDate)) {
          createError('预计到货日期不允许为空！');
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

          if (isEmpty(product.purchaseNum)) {
            createError('第' + (i + 1) + '行商品采购数量不允许为空！');
            return false;
          }

          if (!isFloat(product.purchaseNum)) {
            createError('第' + (i + 1) + '行商品采购数量必须是数字！');
            return false;
          }

          if (!isFloatGtZero(product.purchaseNum)) {
            createError('第' + (i + 1) + '行商品采购数量必须大于0！');
            return false;
          }

          if (!isNumberPrecision(product.purchaseNum, 8)) {
            createError('第' + (i + 1) + '行商品采购数量最多允许8位小数！');
            return false;
          }
        }

        if (!this.$refs.payType.validData()) {
          return false;
        }

        const payTypes = this.$refs.payType.getTableData();
        const totalPayAmount = payTypes.reduce((tot, item) => add(tot, item.payAmount), 0);
        if (!eq(this.formData.totalAmount, totalPayAmount)) {
          createError('所有约定支付的支付金额不等于含税总金额，请检查！');
          return false;
        }

        return true;
      },

      buildParams() {
        return {
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

        createConfirm('对采购单据执行审核通过操作？').then(() => {
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
    },
  });
</script>
<style></style>
