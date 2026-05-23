<template>
  <div class="app-card-container">
    <div v-permission="['stock:adjust:modify']" v-loading="loading">
      <j-border>
        <j-form
          ref="form"
          bordered
          :model="formData"
          :rules="{
            scId: [{ required: true, message: '请选择仓库' }],
            bizType: [{ required: true, message: '请选择业务类型' }],
            reasonId: [{ required: true, message: '请选择调整原因' }],
          }"
        >
          <j-form-item label="仓库" required>
            <store-center-selector
              v-model:value="formData.scId"
              :before-open="beforeSelectSc"
              @update:value="afterSelectSc"
            />
          </j-form-item>
          <j-form-item label="业务类型" required>
            <a-select v-model:value="formData.bizType">
              <a-select-option
                v-for="item in STOCK_ADJUST_SHEET_BIZ_TYPE.values()"
                :key="item.code"
                :value="item.code"
                >{{ item.desc }}</a-select-option
              >
            </a-select>
          </j-form-item>
          <j-form-item label="调整原因" required>
            <stock-adjust-reason-selector v-model:value="formData.reasonId" />
          </j-form-item>
          <j-form-item label="备注" :span="24">
            <a-textarea v-model:value.trim="formData.description" maxlength="200" />
          </j-form-item>
          <j-form-item label="状态">
            <span
              v-if="STOCK_ADJUST_SHEET_STATUS.APPROVE_PASS.equalsCode(formData.status)"
              style="color: #52c41a"
              >{{ STOCK_ADJUST_SHEET_STATUS.getDesc(formData.status) }}</span
            >
            <span
              v-else-if="STOCK_ADJUST_SHEET_STATUS.APPROVE_REFUSE.equalsCode(formData.status)"
              style="color: #f5222d"
              >{{ STOCK_ADJUST_SHEET_STATUS.getDesc(formData.status) }}</span
            >
            <span v-else style="color: #303133">{{
              STOCK_ADJUST_SHEET_STATUS.getDesc(formData.status)
            }}</span>
          </j-form-item>
          <j-form-item label="拒绝理由" :span="16" :content-nest="false">
            <a-input
              v-if="STOCK_ADJUST_SHEET_STATUS.APPROVE_REFUSE.equalsCode(formData.status)"
              v-model:value="formData.refuseReason"
              readonly
            />
          </j-form-item>
          <j-form-item label="操作人">
            <span>{{ formData.updateBy }}</span>
          </j-form-item>
          <j-form-item label="操作时间" :span="16">
            <span>{{ formData.updateTime }}</span>
          </j-form-item>
          <j-form-item
            v-if="
              STOCK_ADJUST_SHEET_STATUS.APPROVE_PASS.equalsCode(formData.status) ||
              STOCK_ADJUST_SHEET_STATUS.APPROVE_REFUSE.equalsCode(formData.status)
            "
            label="审核人"
          >
            <span>{{ formData.approveBy }}</span>
          </j-form-item>
          <j-form-item
            v-if="
              STOCK_ADJUST_SHEET_STATUS.APPROVE_PASS.equalsCode(formData.status) ||
              STOCK_ADJUST_SHEET_STATUS.APPROVE_REFUSE.equalsCode(formData.status)
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
            :dropdown-style="{ width: '900px' }"
            @search="(e) => queryProduct(e, row)"
          >
            <template #dropdownRender>
              <div v-if="!isEmpty(row.products)">
                <vxe-table
                  :data="row.products"
                  max-height="500"
                  class="cursor-pointer"
                  highlight-hover-row
                  show-overflow
                  :row-config="{ isHover: true }"
                  @cell-click="({ row: product }) => handleSelectProduct(rowIndex, product, row)"
                >
                  <vxe-column field="productCode" title="商品编号" width="120" />
                  <vxe-column field="skuCode" title="SKU编号" width="120" />
                  <vxe-column field="productName" title="商品名称" min-width="200" />
                  <vxe-column field="salePropertyText" title="销售属性" min-width="180" />
                  <vxe-column field="spec" title="规格" width="80" />
                  <vxe-column field="unit" title="单位" width="80" />
                  <vxe-column field="curStockNum" title="库存数量" width="140" align="right" />
                </vxe-table>
              </div>
            </template>
          </a-auto-complete>
          <span v-else>{{ row.productName }}</span>
        </template>

        <!-- 调整库存数量 列自定义内容 -->
        <template #stockNum_default="{ row }">
          <a-input
            v-model:value="row.stockNum"
            class="number-input"
            @input="(e) => stockNumInput(e.target.value)"
          />
        </template>

        <!-- 备注 列自定义内容 -->
        <template #description_default="{ row }">
          <a-input v-model:value="row.description" />
        </template>
      </vxe-grid>

      <order-time-line :id="id" />

      <j-border title="合计">
        <j-form bordered label-width="140px">
          <j-form-item label="调整品种数" :span="6">
            <a-input v-model:value="formData.productNum" class="number-input" readonly />
          </j-form-item>
          <j-form-item label="库存调整数量" :span="6">
            <a-input v-model:value="formData.diffStockNum" class="number-input" readonly />
          </j-form-item>
        </j-form>
      </j-border>

      <batch-add-product
        ref="batchAddProductDialog"
        :sc-id="formData.scId || ''"
        @confirm="batchAddProduct"
      />

      <div style="text-align: center; background-color: #ffffff; padding: 8px 0">
        <a-space>
          <a-button
            v-permission="['stock:adjust:modify']"
            type="primary"
            :loading="loading"
            @click="submit"
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
  import BatchAddProduct from '@/views/sc/stock/adjust/stock/batch-add-product.vue';
  import { PlusOutlined, DeleteOutlined } from '@ant-design/icons-vue';
  import * as api from '@/api/sc/stock/adjust/stock';
  import StoreCenterSelector from '@/components/Selector/StoreCenterSelector.vue';
  import { multiplePageMix } from '@/mixins/multiplePageMix';
  import {
    isEmpty,
    isFloat,
    isFloatGtZero,
    isNumberPrecision,
    uuid,
    isFloatGeZero,
    add,
  } from '@/utils/utils';
  import { createSuccess, createError, createConfirm } from '@/hooks/web/msg';
  import StockAdjustReasonSelector from '@/components/Selector/StockAdjustReasonSelector.vue';
  import { STOCK_ADJUST_SHEET_BIZ_TYPE } from '@/enums/biz/stockAdjustSheetBizType';
  import { STOCK_ADJUST_SHEET_STATUS } from '@/enums/biz/stockAdjustSheetStatus';
  import OrderTimeLine from '@/components/OrderTimeLine';

  export default defineComponent({
    name: 'ModifyStockAdjustSheet',
    components: {
      BatchAddProduct,
      StockAdjustReasonSelector,
      StoreCenterSelector,
      OrderTimeLine,
    },
    mixins: [multiplePageMix],
    setup() {
      return {
        h,
        PlusOutlined,
        DeleteOutlined,
        isEmpty,
        STOCK_ADJUST_SHEET_BIZ_TYPE,
        STOCK_ADJUST_SHEET_STATUS,
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
          { field: 'salePropertyText', title: '销售属性', minWidth: 180 },
          { field: 'unit', title: '单位', width: 80 },
          { field: 'spec', title: '规格', width: 80 },
          { field: 'categoryName', title: '商品分类', width: 120 },
          { field: 'brandName', title: '商品品牌', width: 120 },
          { field: 'curStockNum', title: '库存数量', width: 120, align: 'right' },
          {
            field: 'stockNum',
            title: '调整库存数量',
            width: 120,
            align: 'right',
            slots: { default: 'stockNum_default' },
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
          bizType: '',
          reasonId: '',
          description: '',
          updateBy: '',
          updateTime: '',
          approveBy: '',
          approveTime: '',
          status: '',
          refuseReason: '',
          productNum: 0,
          diffStockNum: 0,
        };

        this.tableData = [];
      },
      // 提交表单事件
      submit() {
        this.$refs.form
          .validate()
          .then()
          .then((valid) => {
            if (valid) {
              if (isEmpty(this.tableData)) {
                createError('请录入商品！');
                return;
              }

              for (let i = 0; i < this.tableData.length; i++) {
                const data = this.tableData[i];
                if (isEmpty(data.productId)) {
                  createError('第' + (i + 1) + '行商品不允许为空！');
                  return;
                }
                if (isEmpty(data.stockNum)) {
                  createError('第' + (i + 1) + '行调整库存数量不允许为空！');
                  return;
                }
                if (!isFloat(data.stockNum)) {
                  createError('第' + (i + 1) + '行调整库存数量必须是数字！');
                  return;
                }
                if (!isFloatGtZero(data.stockNum)) {
                  createError('第' + (i + 1) + '行调整库存数量必须大于0！');
                  return;
                }
                if (!isNumberPrecision(data.stockNum, 8)) {
                  createError('第' + (i + 1) + '行调整库存数量最多允许8位小数！');
                  return;
                }
              }

              const params = {
                id: this.id,
                scId: this.formData.scId,
                bizType: this.formData.bizType,
                reasonId: this.formData.reasonId,
                description: this.formData.description,
                products: this.tableData.map((item) => {
                  return {
                    productId: item.productId,
                    skuId: item.skuId || item.productId,
                    stockNum: item.stockNum,
                    description: item.description,
                  };
                }),
              };
              this.loading = true;
              api
                .update(params)
                .then(() => {
                  createSuccess('修改成功！');
                  this.$emit('confirm');

                  this.closeDialog();
                })
                .finally(() => {
                  this.loading = false;
                });
            }
          });
      },
      // 页面显示时触发
      open() {
        // 初始化表单数据
        this.initFormData();
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
          stockNum: '',
          curStockNum: '',
          description: '',
        };
      },
      // 新增商品
      addProduct() {
        if (isEmpty(this.formData.scId)) {
          createError('请先选择仓库！');
          return;
        }
        this.tableData.push(this.emptyProduct());
      },
      // 搜索商品
      queryProduct(queryString, row) {
        if (isEmpty(queryString)) {
          row.products = [];
          row.productOptions = [];
          return;
        }

        api.searchProducts(this.formData.scId, queryString).then((res) => {
          row.products = res;
          row.productOptions = res.map((item) => {
            return {
              value: item.productId,
              label: (item.skuCode || item.productCode) + ' ' + item.productName,
            };
          });
        });
      },
      // 选择商品
      handleSelectProduct(index, value, row) {
        const product =
          row && typeof value === 'string'
            ? row.products.filter((item) => (item.skuId || item.productId) === value)[0]
            : value;
        for (let i = 0; i < this.tableData.length; i++) {
          const data = this.tableData[i];
          if ((data.skuId || data.productId) === (product.skuId || product.productId)) {
            if (i === index) {
              this.tableData[index] = Object.assign(this.tableData[index], product);
              return;
            }
            createError('新增商品与第' + (i + 1) + '行商品相同，请勿重复添加');
            this.tableData = this.tableData.filter((t) => {
              return t.id !== row.id;
            });
            return;
          }
        }
        this.tableData[index] = Object.assign(this.tableData[index], product);
        this.calcSum();
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
      // 批量新增商品
      batchAddProduct(productList) {
        const filterProductList = [];
        productList.forEach((item) => {
          if (
            isEmpty(
              this.tableData.filter(
                (data) => (item.skuId || item.productId) === (data.skuId || data.productId),
              ),
            )
          ) {
            filterProductList.push(item);
          }
        });

        filterProductList.forEach((item) => {
          this.tableData.push(this.emptyProduct());
          this.handleSelectProduct(this.tableData.length - 1, item);
        });
      },
      beforeSelectSc() {
        let flag = false;
        if (!isEmpty(this.formData.scId)) {
          return createConfirm('更改仓库，会清空商品数据，是否确认更改？');
        } else {
          flag = true;
        }

        return flag;
      },
      afterSelectSc(e) {
        if (!isEmpty(e)) {
          this.tableData = [];
          this.calcSum();
        }
      },
      priceInput(_e) {
        this.calcSum();
      },
      calcSum() {
        let productNum = 0;
        let diffStockNum = 0;
        this.tableData.forEach((item) => {
          if (!isEmpty(item.productId)) {
            productNum += 1;

            if (isFloatGeZero(item.stockNum)) {
              diffStockNum = add(item.stockNum, diffStockNum);
            }
          }
        });

        this.formData.productNum = productNum;
        this.formData.diffStockNum = diffStockNum;
      },
      stockNumInput(_e) {
        this.calcSum();
      },
      async loadData() {
        this.loading = true;
        api
          .getDetail(this.id)
          .then((res) => {
            Object.assign(this.formData, {
              scId: res.scId,
              bizType: res.bizType,
              reasonId: res.reasonId,
              description: res.description,
              updateBy: res.updateBy,
              updateTime: res.updateTime,
              approveBy: res.approveBy,
              approveTime: res.approveTime,
              status: res.status,
              refuseReason: res.refuseReason,
            });

            this.tableData = res.details;
            this.calcSum();
          })
          .finally(() => {
            this.loading = false;
          });
      },
    },
  });
</script>
