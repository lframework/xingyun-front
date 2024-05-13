<template>
  <div class="simple-app-container">
    <div v-permission="['stock:take:pre:add']" v-loading="loading">
      <j-border>
        <j-form label-width="120px">
          <j-form-item label="仓库" required>
            <store-center-selector
              v-model:value="formData.scId"
              :before-open="beforeSelectSc"
              @update:value="afterSelectSc"
            />
          </j-form-item>
          <j-form-item label="预先盘点状态" required :span="16">
            <a-checkbox-group v-model:value="checkedStatus" @change="changeCheckedStatus">
              <a-checkbox :value="$enums.PRE_TAKE_STOCK_SHEET_STATUS.FIRST_TAKE.code" disabled>{{
                $enums.PRE_TAKE_STOCK_SHEET_STATUS.FIRST_TAKE.desc
              }}</a-checkbox>
              <a-checkbox
                :value="$enums.PRE_TAKE_STOCK_SHEET_STATUS.SECOND_TAKE.code"
                :disabled="
                  formData.takeStatus === $enums.PRE_TAKE_STOCK_SHEET_STATUS.RAND_TAKE.code
                "
                >{{ $enums.PRE_TAKE_STOCK_SHEET_STATUS.SECOND_TAKE.desc }}</a-checkbox
              >
              <a-checkbox
                :value="$enums.PRE_TAKE_STOCK_SHEET_STATUS.RAND_TAKE.code"
                :disabled="
                  formData.takeStatus === $enums.PRE_TAKE_STOCK_SHEET_STATUS.FIRST_TAKE.code
                "
                >{{ $enums.PRE_TAKE_STOCK_SHEET_STATUS.RAND_TAKE.desc }}</a-checkbox
              >
            </a-checkbox-group>
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

        <!-- 初盘数量 列自定义内容 -->
        <template #firstNum_default="{ row }">
          <a-input
            v-if="$enums.PRE_TAKE_STOCK_SHEET_STATUS.FIRST_TAKE.equalsCode(formData.takeStatus)"
            v-model:value="row.firstNum"
            class="number-input"
          />
          <span v-else>{{ row.firstNum }}</span>
        </template>

        <!-- 复盘数量 列自定义内容 -->
        <template #secondNum_default="{ row }">
          <a-input
            v-if="$enums.PRE_TAKE_STOCK_SHEET_STATUS.SECOND_TAKE.equalsCode(formData.takeStatus)"
            v-model:value="row.secondNum"
            class="number-input"
          />
          <span
            v-else-if="$enums.PRE_TAKE_STOCK_SHEET_STATUS.RAND_TAKE.equalsCode(formData.takeStatus)"
            >{{ row.secondNum }}</span
          >
        </template>

        <!-- 抽盘数量 列自定义内容 -->
        <template #randNum_default="{ row }">
          <a-input
            v-if="$enums.PRE_TAKE_STOCK_SHEET_STATUS.RAND_TAKE.equalsCode(formData.takeStatus)"
            v-model:value="row.randNum"
            class="number-input"
          />
        </template>

        <!-- 复盘初盘差异数量 列自定义内容 -->
        <template #secondDiffNum_default="{ row }">
          <span
            v-if="
              formData.takeStatus === $enums.PRE_TAKE_STOCK_SHEET_STATUS.SECOND_TAKE.code ||
              formData.takeStatus === $enums.PRE_TAKE_STOCK_SHEET_STATUS.RAND_TAKE.code
            "
            >{{
              $utils.sub(
                $utils.isInteger(row.secondNum) ? row.secondNum : 0,
                $utils.isInteger(row.firstNum) ? row.firstNum : 0,
              )
            }}</span
          >
        </template>

        <!-- 抽盘复盘差异数量 列自定义内容 -->
        <template #randDiffNum_default="{ row }">
          <span v-if="formData.takeStatus === $enums.PRE_TAKE_STOCK_SHEET_STATUS.RAND_TAKE.code">{{
            $utils.sub(
              $utils.isInteger(row.randNum) ? row.randNum : 0,
              $utils.isInteger(row.secondNum) ? row.secondNum : 0,
            )
          }}</span>
        </template>
      </vxe-grid>

      <batch-add-product ref="batchAddProductDialog" @confirm="batchAddProduct" />

      <div style="text-align: center; background-color: #ffffff; padding: 8px 0">
        <a-space>
          <a-button
            v-permission="['stock:take:pre:add']"
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
  import BatchAddProduct from '@/views/sc/stock/take/pre/batch-add-product.vue';
  import { PlusOutlined, DeleteOutlined } from '@ant-design/icons-vue';
  import * as api from '@/api/sc/stock/take/pre';

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
          {
            field: 'firstNum',
            title: '初盘数量',
            width: 120,
            slots: { default: 'firstNum_default' },
            align: 'right',
          },
          {
            field: 'secondNum',
            title: '复盘数量',
            width: 120,
            slots: { default: 'secondNum_default' },
            align: 'right',
          },
          {
            field: 'randNum',
            title: '抽盘数量',
            width: 120,
            slots: { default: 'randNum_default' },
            align: 'right',
          },
          {
            field: 'secondDiffNum',
            title: '复盘初盘差异数量',
            width: 140,
            slots: { default: 'secondDiffNum_default' },
            align: 'right',
          },
          {
            field: 'randDiffNum',
            title: '抽盘复盘差异数量',
            width: 140,
            slots: { default: 'randDiffNum_default' },
            align: 'right',
          },
        ],
        tableData: [],
        // 已选择的预先盘点状态
        checkedStatus: [],
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
          description: '',
          takeStatus: this.$enums.PRE_TAKE_STOCK_SHEET_STATUS.FIRST_TAKE.code,
        };

        this.checkedStatus = [this.$enums.PRE_TAKE_STOCK_SHEET_STATUS.FIRST_TAKE.code];

        this.tableData = [];
      },
      // 提交表单事件
      submit() {
        if (this.$utils.isEmpty(this.formData.scId)) {
          this.$msg.createError('请选择仓库！');
          return;
        }
        if (this.$utils.isEmpty(this.tableData)) {
          this.$msg.createError('请录入商品！');
          return;
        }
        if (this.formData.takeStatus === this.$enums.PRE_TAKE_STOCK_SHEET_STATUS.FIRST_TAKE.code) {
          // 初盘
          for (let i = 0; i < this.tableData.length; i++) {
            const data = this.tableData[i];
            if (this.$utils.isEmpty(data.productId)) {
              this.$msg.createError('第' + (i + 1) + '行商品不允许为空！');
              return;
            }
            if (this.$utils.isEmpty(data.firstNum)) {
              this.$msg.createError('第' + (i + 1) + '行商品的初盘数量不允许为空！');
              return;
            }

            if (!this.$utils.isIntegerGeZero(data.firstNum)) {
              this.$msg.createError('第' + (i + 1) + '行商品的初盘数量不允许小于0！');
              return;
            }
          }
        } else if (
          this.formData.takeStatus === this.$enums.PRE_TAKE_STOCK_SHEET_STATUS.SECOND_TAKE.code
        ) {
          // 复盘
          for (let i = 0; i < this.tableData.length; i++) {
            const data = this.tableData[i];
            if (this.$utils.isEmpty(data.secondNum)) {
              this.$msg.createError('第' + (i + 1) + '行商品的复盘数量不允许为空！');
              return;
            }

            if (!this.$utils.isIntegerGeZero(data.secondNum)) {
              this.$msg.createError('第' + (i + 1) + '行商品的复盘数量不允许小于0！');
              return;
            }
          }
        } else if (
          this.formData.takeStatus === this.$enums.PRE_TAKE_STOCK_SHEET_STATUS.RAND_TAKE.code
        ) {
          // 抽盘
          for (let i = 0; i < this.tableData.length; i++) {
            const data = this.tableData[i];
            if (this.$utils.isEmpty(data.randNum)) {
              this.$msg.createError('第' + (i + 1) + '行商品的抽盘数量不允许为空！');
              return;
            }

            if (!this.$utils.isIntegerGeZero(data.randNum)) {
              this.$msg.createError('第' + (i + 1) + '行商品的抽盘数量不允许小于0！');
              return;
            }
          }
        }

        const params = {
          scId: this.formData.scId,
          takeStatus: this.formData.takeStatus,
          description: this.formData.description,
          products: this.tableData.map((item) => {
            return {
              productId: item.productId,
              firstNum: item.firstNum,
              secondNum: item.secondNum,
              randNum: item.randNum,
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
      // 页面显示时触发
      open() {
        // 初始化表单数据
        this.initFormData();
      },
      changeCheckedStatus() {
        if (
          this.checkedStatus.length === 1 &&
          this.checkedStatus.includes(this.$enums.PRE_TAKE_STOCK_SHEET_STATUS.FIRST_TAKE.code)
        ) {
          this.formData.takeStatus = this.$enums.PRE_TAKE_STOCK_SHEET_STATUS.FIRST_TAKE.code;
        } else if (
          this.checkedStatus.includes(this.$enums.PRE_TAKE_STOCK_SHEET_STATUS.RAND_TAKE.code)
        ) {
          this.formData.takeStatus = this.$enums.PRE_TAKE_STOCK_SHEET_STATUS.RAND_TAKE.code;
        } else {
          this.formData.takeStatus = this.$enums.PRE_TAKE_STOCK_SHEET_STATUS.SECOND_TAKE.code;
        }

        if (this.formData.takeStatus === this.$enums.PRE_TAKE_STOCK_SHEET_STATUS.FIRST_TAKE.code) {
          this.tableData.forEach((item) => {
            item.secondNum = '';
            item.randNum = '';
          });
        } else if (
          this.formData.takeStatus === this.$enums.PRE_TAKE_STOCK_SHEET_STATUS.SECOND_TAKE.code
        ) {
          this.tableData.forEach((item) => {
            if (this.$utils.isEmpty(item.secondNum)) {
              item.secondNum = item.firstNum;
            }
            item.randNum = '';
          });
        } else if (
          this.formData.takeStatus === this.$enums.PRE_TAKE_STOCK_SHEET_STATUS.RAND_TAKE.code
        ) {
          this.tableData.forEach((item) => {
            item.randNum = item.secondNum;
          });
        }
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
          firstNum: '',
          secondNum: '',
          randNum: '',
          secondDiffNum: '',
          randDiffNum: '',
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

        api.searchProducts(queryString).then((res) => {
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
        }
      },
    },
  });
</script>
