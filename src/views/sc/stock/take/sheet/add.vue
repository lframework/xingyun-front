<template>
  <div class="simple-app-container">
    <div v-permission="['stock:take:sheet:add']" v-loading="loading">
      <j-border>
        <j-form label-width="120px">
          <j-form-item label="关联盘点任务" required>
            <take-stock-plan-selector
              v-model:value="formData.takeStockPlanId"
              :request-params="{
                taking: true,
              }"
              :before-open="beforeSelectTakeStockPlan"
              @update:value="afterSelectTakeStockPlan"
            />
          </j-form-item>
          <j-form-item label="预先盘点单">
            <pre-take-stock-sheet-selector
              v-model:value="formData.preTakeStockSheetId"
              :request-params="{
                scId: formData.scId,
              }"
              :before-open="beforeSelectPreTakeStockSheet"
              @update:value="afterSelectPreTakeStockSheet"
            />
          </j-form-item>
          <j-form-item label="仓库">
            {{ formData.scName }}
          </j-form-item>
          <j-form-item label="盘点类别">
            {{ $enums.TAKE_STOCK_PLAN_TYPE.getDesc(formData.takeType) }}
          </j-form-item>
          <j-form-item label="盘点状态">
            {{ $enums.TAKE_STOCK_PLAN_STATUS.getDesc(formData.takeStatus) }}
          </j-form-item>
          <j-form-item label="类目/品牌">
            {{ formData.bizName }}
          </j-form-item>
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
          />
          <span v-else>{{ row.productName }}</span>
        </template>

        <!-- 盘点数量 列自定义内容 -->
        <template #takeNum_default="{ row }">
          <a-input v-model:value="row.takeNum" class="number-input" />
        </template>

        <!-- 备注 列自定义内容 -->
        <template #description_default="{ row }">
          <a-input v-model:value="row.description" />
        </template>
      </vxe-grid>

      <batch-add-product
        ref="batchAddProductDialog"
        :plan-id="formData.takeStockPlanId || ''"
        @confirm="batchAddProduct"
      />

      <div style="text-align: center; background-color: #ffffff; padding: 8px 0">
        <a-space>
          <a-button
            v-permission="['stock:take:sheet:add']"
            type="primary"
            :loading="loading"
            @click="submit"
            >保存</a-button
          >
          <a-button
            v-permission="['stock:take:sheet:approve']"
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
  import BatchAddProduct from '@/views/sc/stock/take/sheet/batch-add-product.vue';
  import { PlusOutlined, DeleteOutlined } from '@ant-design/icons-vue';
  import * as planApi from '@/api/sc/stock/take/plan';
  import * as preApi from '@/api/sc/stock/take/pre';
  import * as api from '@/api/sc/stock/take/sheet';

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
        // 设置信息
        config: {},
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
          { field: 'stockNum', title: '系统库存数量', width: 120, align: 'right' },
          {
            field: 'takeNum',
            title: '盘点数量',
            width: 120,
            slots: { default: 'takeNum_default' },
            align: 'right',
          },
          {
            field: 'description',
            title: '备注',
            slots: { default: 'description_default' },
            width: 200,
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
          takeStockPlanId: '',
          preTakeStockSheetId: '',
          description: '',
          scId: '',
          scName: '',
          takeType: '',
          takeStatus: '',
          bizName: '',
        };

        this.tableData = [];
      },
      validParams() {
        if (this.$utils.isEmpty(this.formData.takeStockPlanId)) {
          this.$msg.createError('请选择关联盘点任务！');
          return false;
        }
        if (this.$utils.isEmpty(this.tableData)) {
          this.$msg.createError('请录入商品！');
          return false;
        }

        for (let i = 0; i < this.tableData.length; i++) {
          const column = this.tableData[i];
          if (this.$utils.isEmpty(column.productId)) {
            this.$msg.createError('第' + (i + 1) + '行商品不允许为空！');
            return false;
          }
          if (this.$utils.isEmpty(column.takeNum)) {
            this.$msg.createError('第' + (i + 1) + '行商品的盘点数量不允许为空！');
            return false;
          }

          if (!this.$utils.isIntegerGeZero(column.takeNum)) {
            this.$msg.createError('第' + (i + 1) + '行商品的盘点数量不允许小于0！');
            return false;
          }
        }

        return true;
      },
      // 提交表单事件
      submit() {
        if (!this.validParams()) {
          return;
        }
        const params = {
          planId: this.formData.takeStockPlanId,
          preSheetId: this.formData.preTakeStockSheetId || '',
          description: this.formData.description,
          products: this.tableData.map((item) => {
            return {
              productId: item.productId,
              takeNum: item.takeNum,
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
      },
      // 直接审核通过
      directApprovePass() {
        if (!this.validParams()) {
          return;
        }
        const params = {
          planId: this.formData.takeStockPlanId,
          preSheetId: this.formData.preTakeStockSheetId || '',
          description: this.formData.description,
          products: this.tableData.map((item) => {
            return {
              productId: item.productId,
              takeNum: item.takeNum,
              description: item.description,
            };
          }),
        };

        this.loading = true;
        api
          .directApprovePass(params)
          .then(() => {
            this.$msg.createSuccess('审核通过！');
            this.$emit('confirm');

            this.closeDialog();
          })
          .finally(() => {
            this.loading = false;
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
          takeNum: '',
          description: '',
          products: [],
        };
      },
      // 新增商品
      addProduct() {
        if (this.$utils.isEmpty(this.formData.takeStockPlanId)) {
          this.$msg.createError('请先选择关联盘点任务！');
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

        api.searchProducts(this.formData.takeStockPlanId, queryString).then((res) => {
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
        });
      },
      openBatchAddProductDialog() {
        if (this.$utils.isEmpty(this.formData.takeStockPlanId)) {
          this.$msg.createError('请先选择关联盘点任务！');
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
      beforeSelectPreTakeStockSheet() {
        if (this.$utils.isEmpty(this.formData.takeStockPlanId)) {
          this.$msg.createError('请先选择关联盘点任务');
          return false;
        }

        if (!this.$utils.isEmpty(this.formData.preTakeStockSheetId)) {
          return this.$msg.createConfirm(
            '更改关联盘点任务，不会清除已加载的预先盘点单的商品数据，是否确认更改？',
          );
        }

        return true;
      },
      beforeSelectTakeStockPlan() {
        if (!this.$utils.isEmpty(this.formData.takeStockPlanId)) {
          return this.$msg.createConfirm('更改关联盘点任务，会清空商品数据，是否确认更改？');
        } else {
          return true;
        }
      },
      afterSelectTakeStockPlan(e) {
        this.formData.preTakeStockSheetId = '';

        this.formData.scId = '';
        this.formData.scName = '';
        this.formData.takeType = '';
        this.formData.takeStatus = '';
        this.formData.bizName = '';

        if (!this.$utils.isEmpty(e)) {
          this.loading = true;
          planApi.get(e).then((res) => {
            this.formData.scId = res.scId;
            this.formData.scName = res.scName;
            this.formData.takeType = res.takeType;
            this.formData.takeStatus = res.takeStatus;
            this.formData.bizName = res.bizName;

            planApi
              .getProducts(e)
              .then((products) => {
                this.tableData = products.map((item) => {
                  return Object.assign(this.emptyProduct(), { isFixed: true }, item);
                });
              })
              .finally(() => {
                this.loading = false;
              });
          });
        } else {
          this.tableData = [];
        }
      },
      afterSelectPreTakeStockSheet(e) {
        this.loading = true;
        preApi
          .getProducts(e, this.formData.takeStockPlanId)
          .then((products) => {
            products.forEach((item) => {
              const tableData = this.tableData.filter((obj) => obj.productId === item.productId);
              if (!this.$utils.isEmpty(tableData)) {
                tableData.forEach((obj) => {
                  obj.takeNum = item.takeNum;
                });
              } else {
                this.tableData.push(Object.assign(this.emptyProduct(), item));
              }
            });
          })
          .finally(() => {
            this.loading = false;
          });
      },
    },
  });
</script>
