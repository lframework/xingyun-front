<template>
  <div class="app-card-container">
    <div v-permission="['sale:order:add']" v-loading="loading">
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
            <customer-selector v-model:value="formData.customerId" />
          </j-form-item>
          <j-form-item label="销售员">
            <user-selector v-model:value="formData.salerId" />
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
            <a-button :icon="h(NumberOutlined)" @click="batchInputOrderNum">批量录入数量</a-button>
            <a-button :icon="h(EditOutlined)" @click="batchInputTaxPrice">批量调整价格</a-button>
            <a-button :icon="h(AlertOutlined)" @click="setGift">设置赠品</a-button>
            <a-button :icon="h(ScanOutlined)" @click="openScanDialog">扫码录入</a-button>
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
          <span v-if="row.oriPrice === 0 || row.isGift">{{ row.discountRate }}</span>
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

        <!-- 销售数量 列自定义内容 -->
        <template #orderNum_default="{ row }">
          <a-input
            v-model:value="row.orderNum"
            class="number-input"
            @input="(e) => orderNumInput(e.target.value)"
          />
        </template>

        <!-- 含税金额 列自定义内容 -->
        <template #orderAmount_default="{ row }">
          <span v-if="isFloatGeZero(row.taxPrice) && isFloatGeZero(row.orderNum)">{{
            getNumber(mul(row.taxPrice, row.orderNum), 2)
          }}</span>
        </template>

        <!-- 备注 列自定义内容 -->
        <template #description_default="{ row }">
          <a-input v-model:value="row.description" />
        </template>
      </vxe-grid>

      <j-border title="合计">
        <j-form bordered label-width="140px">
          <j-form-item label="销售数量" :span="6">
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
      <a-modal
        v-model:open="scanDialogVisible"
        title="扫码录入"
        :confirm-loading="scanLoading"
        :footer="null"
        width="900px"
        @cancel="closeScanDialog"
      >
        <a-space direction="vertical" style="width: 100%">
          <a-alert
            message="连续扫码录入"
            description="请先选择仓库后再扫码。扫描成功后会保留弹窗，可直接继续扫描下一件商品。"
            type="info"
            show-icon
          />
          <a-input
            ref="scanInputRef"
            v-model:value.trim="scanCode"
            allow-clear
            placeholder="请扫描商品条码/商品编号，回车确认"
            :disabled="loading"
            @focus="handleScanInputFocus"
            @blur="handleScanInputBlur"
            @keydown.enter.stop
            @press-enter="submitScanCode"
          />
          <a-alert
            v-if="!isEmpty(scanMessage)"
            :message="scanMessage"
            :type="scanMessageType"
            show-icon
          />
          <vxe-table
            v-if="!isEmpty(scanCandidates)"
            :data="scanCandidates"
            max-height="500"
            class="cursor-pointer"
            highlight-hover-row
            show-overflow
            :row-config="{ isHover: true }"
            @cell-click="({ row }) => selectScanCandidate(row)"
          >
            <vxe-column field="productCode" title="商品编号" width="120" />
            <vxe-column field="productName" title="商品名称" min-width="200" />
            <vxe-column field="spec" title="规格" width="80" />
            <vxe-column field="unit" title="单位" width="80" />
            <vxe-column field="salePrice" title="参考销售价（元）" width="140" align="right" />
            <vxe-column field="stockNum" title="库存数量" width="140" align="right" />
          </vxe-table>
        </a-space>
      </a-modal>
      <div style="text-align: center; background-color: #ffffff; padding: 8px 0">
        <a-space>
          <a-button
            v-permission="['sale:order:add']"
            type="primary"
            :loading="loading"
            @click="createOrder"
            >保存</a-button
          >
          <a-button
            v-permission="['sale:order:approve']"
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
  import BatchAddProduct from '@/views/sc/sale/batch-add-product.vue';
  import PayType from '@/views/sc/pay-type/index.vue';
  import {
    PlusOutlined,
    DeleteOutlined,
    NumberOutlined,
    EditOutlined,
    AlertOutlined,
    ScanOutlined,
  } from '@ant-design/icons-vue';
  import StoreCenterSelector from '@/components/Selector/StoreCenterSelector.vue';
  import * as api from '@/api/sc/sale/order';
  import { multiplePageMix } from '@/mixins/multiplePageMix';
  import {
    applyScannedProductResult,
    beginNextScanConsumeState,
    openScanDialogState,
    closeScanDialogState,
    enqueueScanCodeState,
    finishScanConsumeState,
    pauseScanQueueState,
    resumeScanQueueState,
    shouldIgnoreGlobalEnter,
  } from '../../common/scanProductHelper.mjs';
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
    eq,
    uuid,
    PATTERN_IS_FLOAT_GT_ZERO,
    PATTERN_IS_PRICE,
  } from '@/utils/utils';
  import { createSuccess, createError, createConfirm, createPrompt } from '@/hooks/web/msg';
  import CustomerSelector from '@/components/Selector/CustomerSelector.vue';
  import UserSelector from '@/components/Selector/UserSelector.vue';

  export default defineComponent({
    name: 'AddSaleOrder',
    components: {
      BatchAddProduct,
      PayType,
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
        ScanOutlined,
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
          { field: 'spec', title: '规格', width: 80 },
          { field: 'unit', title: '单位', width: 80 },
          { field: 'categoryName', title: '商品分类', width: 120 },
          { field: 'brandName', title: '商品品牌', width: 120 },
          { field: 'oriPrice', title: '参考销售价（元）', align: 'right', width: 140 },
          {
            field: 'isGift',
            title: '是否赠品',
            width: 80,
            formatter: ({ cellValue }) => {
              return cellValue ? '是' : '否';
            },
          },
          { field: 'stockNum', title: '库存数量', align: 'right', width: 140 },
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
            field: 'orderNum',
            title: '销售数量',
            align: 'right',
            width: 140,
            slots: { default: 'orderNum_default' },
          },
          {
            field: 'orderAmount',
            title: '含税金额',
            align: 'right',
            width: 140,
            slots: { default: 'orderAmount_default' },
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
        scanCode: '',
        scanLoading: false,
        scanMessage: '',
        scanMessageType: 'info',
        scanDialogVisible: false,
        scanCandidates: [],
        scanQueue: [],
        scanPendingCode: '',
        scanQueuePaused: false,
        isScanInputFocused: false,
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
        if (shouldIgnoreGlobalEnter(this.$data)) {
          return;
        }
        if (event.key === 'Enter' || event.keyCode === 13) {
          this.addProduct();
        }
      },
      handleScanInputFocus() {
        this.isScanInputFocused = true;
      },
      handleScanInputBlur() {
        this.isScanInputFocused = false;
      },
      focusScanInput() {
        this.$nextTick(() => {
          const scanInputRef = this.$refs.scanInputRef;
          if (scanInputRef && scanInputRef.focus) {
            scanInputRef.focus();
          }
        });
      },
      setScanMessage(message, type = 'info') {
        this.scanMessage = message;
        this.scanMessageType = type;
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
          customerId: '',
          salerId: '',
          totalNum: 0,
          giftNum: 0,
          totalAmount: 0,
          description: '',
        };

        this.tableData = [];
        this.scanCode = '';
        this.scanLoading = false;
        this.scanMessage = '';
        this.scanMessageType = 'info';
        this.scanDialogVisible = false;
        this.scanCandidates = [];
        this.scanQueue = [];
        this.scanPendingCode = '';
        this.scanQueuePaused = false;
        this.isScanInputFocused = false;
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
          oriPrice: '',
          taxPrice: '',
          discountRate: 100,
          stockNum: '',
          taxRate: '',
          isGift: false,
          orderNum: '',
          orderAmount: '',
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
        this.tableData.unshift(this.emptyProduct());
        this.$nextTick(() => {
          const productInputRef = this.$refs.productInputRef0;
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

        api.searchSaleProducts(this.formData.scId, queryString).then((res) => {
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
        product.oriPrice = product.salePrice;
        product.taxPrice = product.oriPrice;
        if (product.oriPrice === 0) {
          product.discountRate = 100;
        }
        this.tableData[index] = Object.assign(this.tableData[index], product);

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
      // 批量添加商品
      openBatchAddProductDialog() {
        if (isEmpty(this.formData.scId)) {
          createError('请先选择仓库！');
          return;
        }
        this.$refs.batchAddProductDialog.openDialog();
      },
      openScanDialog() {
        if (isEmpty(this.formData.scId)) {
          createError('请先选择仓库！');
          return;
        }
        Object.assign(this.$data, openScanDialogState(this.$data));
        this.focusScanInput();
      },
      createScannedRow(product, orderNum = 1) {
        return Object.assign(this.emptyProduct(), product, {
          oriPrice: product.salePrice,
          taxPrice: product.salePrice,
          isGift: false,
          orderNum,
        });
      },
      applyScannedProduct(product) {
        const result = applyScannedProductResult(this.tableData, product, {
          quantityField: 'orderNum',
          createRow: (item, quantity) => this.createScannedRow(item, quantity),
        });

        this.tableData = result.tableData;
        this.calcSum();

        if (result.type === 'merged') {
          this.setScanMessage(
            '商品【' +
              product.productCode +
              ' ' +
              product.productName +
              '】销售数量已 +1，可继续扫码',
            'success',
          );
        } else {
          this.setScanMessage(
            '已新增商品【' +
              product.productCode +
              ' ' +
              product.productName +
              '】，可继续扫码下一件',
            'success',
          );
        }

        this.scanCode = '';
        this.scanCandidates = [];
        this.focusScanInput();
      },
      async submitScanCode() {
        if (isEmpty(this.formData.scId)) {
          createError('请先选择仓库！');
          this.setScanMessage('请先选择仓库后再扫码！', 'warning');
          this.focusScanInput();
          return;
        }

        if (isEmpty(this.scanCode)) {
          this.setScanMessage('请先扫描商品条码或商品编号！', 'warning');
          this.focusScanInput();
          return;
        }

        const code = this.scanCode;
        const shouldShowQueuedMessage =
          !this.scanQueuePaused && (this.scanLoading || !isEmpty(this.scanQueue));
        Object.assign(this.$data, enqueueScanCodeState(this.$data, code));
        if (shouldShowQueuedMessage) {
          this.setScanMessage(
            '条码/编号【' + code + '】已加入扫码队列，等待前序扫码处理完成！',
            'info',
          );
        }
        this.focusScanInput();
        this.consumeScanQueue();
      },
      async consumeScanQueue() {
        const { state, code } = beginNextScanConsumeState(this.$data);
        if (isEmpty(code)) {
          return;
        }

        Object.assign(this.$data, state);
        try {
          const products = await api.searchSaleProducts(this.formData.scId, code);
          if (isEmpty(products)) {
            this.setScanMessage('条码/编号【' + code + '】未匹配到商品！', 'error');
            Object.assign(this.$data, finishScanConsumeState(this.$data));
            return;
          }

          if (products.length > 1) {
            Object.assign(this.$data, pauseScanQueueState(this.$data, products));
            this.setScanMessage('条码/编号【' + code + '】匹配到多条商品，请选择！', 'warning');
            return;
          }

          this.applyScannedProduct(products[0]);
          Object.assign(this.$data, finishScanConsumeState(this.$data));
        } catch (e) {
          createError('扫码查询失败：' + (e.message || e));
          this.setScanMessage('扫码查询失败，请重试！', 'error');
          Object.assign(this.$data, finishScanConsumeState(this.$data));
        } finally {
          this.scanLoading = false;
          if (this.scanDialogVisible) {
            this.focusScanInput();
          }
          if (this.scanDialogVisible && !this.scanQueuePaused) {
            this.consumeScanQueue();
          }
        }
      },
      selectScanCandidate(product) {
        this.applyScannedProduct(product);
        Object.assign(this.$data, resumeScanQueueState(this.$data));
        if (this.scanDialogVisible) {
          this.focusScanInput();
          this.consumeScanQueue();
        }
      },
      closeScanDialog() {
        Object.assign(this.$data, closeScanDialogState(this.$data));
        this.isScanInputFocused = false;
      },
      taxPriceInput(row, _value) {
        if (row.oriPrice !== 0) {
          if (isFloatGeZero(row.taxPrice)) {
            row.discountRate = getNumber(mul(div(row.taxPrice, row.oriPrice), 100), 2);
          }
        }

        this.calcSum();
      },
      changeDiscountRate(row, _value) {
        if (isFloatGeZero(row.discountRate) && isFloatGtZero(row.oriPrice)) {
          row.taxPrice = getNumber(div(mul(row.oriPrice, row.discountRate), 100), 6);
        }

        this.calcSum();
      },
      orderNumInput(_value) {
        this.calcSum();
      },
      // 计算汇总数据
      calcSum() {
        let totalNum = 0;
        let giftNum = 0;
        let totalAmount = 0;

        this.tableData
          .filter((t) => {
            return isFloatGeZero(t.taxPrice) && isFloatGeZero(t.orderNum);
          })
          .forEach((t) => {
            const num = parseFloat(t.orderNum);
            if (t.isGift) {
              giftNum = add(num, giftNum);
            } else {
              totalNum = add(num, totalNum);
            }

            totalAmount = add(totalAmount, getNumber(mul(num, t.taxPrice), 2));
          });

        this.formData.totalNum = totalNum;
        this.formData.giftNum = giftNum;
        this.formData.totalAmount = totalAmount;
      },
      // 批量录入数量
      batchInputOrderNum() {
        const records = this.$refs.grid.getCheckboxRecords();
        if (isEmpty(records)) {
          createError('请选择商品数据！');
          return;
        }

        createPrompt('请输入销售数量', {
          inputPattern: PATTERN_IS_FLOAT_GT_ZERO,
          inputErrorMessage: '销售数量必须是数字并且大于0',
          title: '批量录入数量',
          required: true,
        }).then(({ value }) => {
          records.forEach((t) => {
            t.orderNum = value;

            this.orderNumInput(value);
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
            createError('第' + (i + 1) + '行商品为赠品，不允许录入销售价！');
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
          item.discountRate = 0;
        });

        this.calcSum();
      },
      // 批量新增商品
      batchAddProduct(productList) {
        productList
          .slice()
          .reverse()
          .forEach((item) => {
            this.tableData.unshift(this.emptyProduct());
            this.handleSelectProduct(0, item);
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

          if (isEmpty(product.orderNum)) {
            createError('第' + (i + 1) + '行商品销售数量不允许为空！');
            return false;
          }

          if (!isFloat(product.orderNum)) {
            createError('第' + (i + 1) + '行商品销售数量必须是数字！');
            return false;
          }

          if (!isFloatGtZero(product.orderNum)) {
            createError('第' + (i + 1) + '行商品销售数量必须大于0！');
            return false;
          }

          if (!isNumberPrecision(product.orderNum, 8)) {
            createError('第' + (i + 1) + '行商品销售数量最多允许8位小数！');
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
          customerId: this.formData.customerId,
          salerId: this.formData.salerId || '',
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
              oriPrice: t.oriPrice,
              taxPrice: t.taxPrice,
              discountRate: t.discountRate,
              orderNum: t.orderNum,
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
          .then(() => {
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

        createConfirm('对销售单据执行审核通过操作？').then(() => {
          this.loading = true;
          api
            .directApprovePass(params)
            .then(() => {
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
