<template>
  <div class="simple-app-container">
    <div v-permission="['stock:adjust:add']" v-loading="loading">
      <j-border>
        <j-form
          ref="form"
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
                v-for="item in $enums.STOCK_ADJUST_SHEET_BIZ_TYPE.values()"
                :key="item.code"
                :value="item.code"
                >{{ item.desc }}</a-select-option
              >
            </a-select>
          </j-form-item>
          <j-form-item label="调整原因" required>
            <stock-adjust-reason-selector v-model:value="formData.reasonId" />
          </j-form-item>
          <j-form-item :span="16" />
          <j-form-item label="备注" :span="24">
            <a-textarea v-model:value.trim="formData.description" maxlength="200" />
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
            v-if="!row.isFixed"
            v-model:value="row.productName"
            style="width: 100%"
            placeholder=""
            value-key="productName"
            :options="row.productOptions"
            @search="(e) => queryProduct(e, row)"
            @select="(e) => handleSelectProduct(rowIndex, e, row)"
          >
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

      <j-border title="合计">
        <j-form label-width="140px">
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
            v-permission="['stock:adjust:add']"
            type="primary"
            :loading="loading"
            @click="submit"
            >保存</a-button
          >
          <a-button
            v-permission="['stock:adjust:approve']"
            type="primary"
            :loading="loading"
            @click="directApprovePass"
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
  import BatchAddProduct from '@/views/sc/stock/adjust/stock/batch-add-product.vue';
  import { PlusOutlined, DeleteOutlined } from '@ant-design/icons-vue';
  import * as api from '@/api/sc/stock/adjust/stock';

  export default defineComponent({
    components: {
      BatchAddProduct,
    },
    setup() {
      return {
        h,
        PlusOutlined,
        DeleteOutlined,
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
      },
      // 关闭对话框
      closeDialog() {
        this.$utils.closeCurrentPage();
      },
      // 初始化表单数据
      initFormData() {
        this.formData = {
          scId: '',
          bizType: '',
          reasonId: '',
          description: '',
          productNum: 0,
          diffStockNum: 0,
        };

        this.tableData = [];
      },
      validData() {
        if (this.$utils.isEmpty(this.tableData)) {
          this.$msg.createError('请录入商品！');
          return false;
        }
        for (let i = 0; i < this.tableData.length; i++) {
          const data = this.tableData[i];
          if (this.$utils.isEmpty(data.productId)) {
            this.$msg.createError('第' + (i + 1) + '行商品不允许为空！');
            return false;
          }
          if (this.$utils.isEmpty(data.stockNum)) {
            this.$msg.createError('第' + (i + 1) + '行调整库存数量不允许为空！');
            return false;
          }
          if (!this.$utils.isInteger(data.stockNum)) {
            this.$msg.createError('第' + (i + 1) + '行调整库存数量必须是整数！');
            return false;
          }
          if (!this.$utils.isIntegerGtZero(data.stockNum)) {
            this.$msg.createError('第' + (i + 1) + '行调整库存数量必须大于0！');
            return false;
          }
        }

        return true;
      },
      // 提交表单事件
      submit() {
        this.$refs.form
          .validate()
          .then()
          .then((valid) => {
            if (valid) {
              if (!this.validData()) {
                return;
              }

              const params = {
                scId: this.formData.scId,
                bizType: this.formData.bizType,
                reasonId: this.formData.reasonId,
                description: this.formData.description,
                products: this.tableData.map((item) => {
                  return {
                    productId: item.productId,
                    stockNum: item.stockNum,
                    description: item.description,
                  };
                }),
              };
              this.loading = true;
              api
                .create(params)
                .then(() => {
                  this.$msg.createSuccess('保存成功！');
                  this.$emit('confirm');

                  this.closeDialog();
                })
                .finally(() => {
                  this.loading = false;
                });
            }
          });
      },
      // 直接审核通过
      directApprovePass() {
        this.$refs.form
          .validate()
          .then()
          .then((valid) => {
            if (valid) {
              if (!this.validData()) {
                return;
              }

              const params = {
                scId: this.formData.scId,
                bizType: this.formData.bizType,
                reasonId: this.formData.reasonId,
                description: this.formData.description,
                products: this.tableData.map((item) => {
                  return {
                    productId: item.productId,
                    stockNum: item.stockNum,
                    description: item.description,
                  };
                }),
              };

              this.$msg.createConfirm('对库存调整单执行审核通过操作？').then(() => {
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
          stockNum: '',
          curStockNum: '',
          description: '',
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

        api.searchProducts(this.formData.scId, queryString).then((res) => {
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
        for (let i = 0; i < this.tableData.length; i++) {
          const data = this.tableData[i];
          if (data.productId === value.productId) {
            if (i === index) {
              this.tableData[index] = Object.assign(this.tableData[index], value);
              return;
            }
            this.$msg.createError('新增商品与第' + (i + 1) + '行商品相同，请勿重复添加');
            this.tableData = this.tableData.filter((t) => {
              return t.id !== row.id;
            });
            return;
          }
        }
        this.tableData[index] = Object.assign(this.tableData[index], value);
        this.calcSum();
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
      // 批量新增商品
      batchAddProduct(productList) {
        const filterProductList = [];
        productList.forEach((item) => {
          if (
            this.$utils.isEmpty(this.tableData.filter((data) => item.productId === data.productId))
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
        if (!this.$utils.isEmpty(this.formData.scId)) {
          return this.$msg.createConfirm('更改仓库，会清空商品数据，是否确认更改？');
        } else {
          flag = true;
        }

        return flag;
      },
      afterSelectSc(e) {
        if (!this.$utils.isEmpty(e)) {
          this.tableData = [];
          this.calcSum();
        }
      },
      stockNumInput(e) {
        this.calcSum();
      },
      calcSum() {
        let productNum = 0;
        let diffStockNum = 0;
        this.tableData.forEach((item) => {
          if (!this.$utils.isEmpty(item.productId)) {
            productNum += 1;

            if (this.$utils.isIntegerGeZero(item.stockNum)) {
              diffStockNum = this.$utils.add(item.stockNum, diffStockNum);
            }
          }
        });

        this.formData.productNum = productNum;
        this.formData.diffStockNum = diffStockNum;
      },
    },
  });
</script>
