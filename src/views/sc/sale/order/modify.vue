<template>
  <div class="simple-app-container">
    <div v-permission="['sale:order:modify']" v-loading="loading">
      <j-border>
        <j-form>
          <j-form-item label="仓库" required>
            <store-center-selector v-model:value="formData.scId" />
          </j-form-item>
          <j-form-item label="客户" required>
            <customer-selector v-model:value="formData.customerId" />
          </j-form-item>
          <j-form-item label="销售员">
            <user-selector v-model:value="formData.salerId" />
          </j-form-item>
          <j-form-item label="状态">
            <span
              v-if="$enums.SALE_ORDER_STATUS.APPROVE_PASS.equalsCode(formData.status)"
              style="color: #52c41a"
              >{{ $enums.SALE_ORDER_STATUS.getDesc(formData.status) }}</span
            >
            <span
              v-else-if="$enums.SALE_ORDER_STATUS.APPROVE_REFUSE.equalsCode(formData.status)"
              style="color: #f5222d"
              >{{ $enums.SALE_ORDER_STATUS.getDesc(formData.status) }}</span
            >
            <span v-else style="color: #303133">{{
              $enums.SALE_ORDER_STATUS.getDesc(formData.status)
            }}</span>
          </j-form-item>
          <j-form-item label="拒绝理由" :content-nest="false" :span="16">
            <a-input
              v-if="$enums.SALE_ORDER_STATUS.APPROVE_REFUSE.equalsCode(formData.status)"
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
              $enums.SALE_ORDER_STATUS.APPROVE_PASS.equalsCode(formData.status) ||
              $enums.SALE_ORDER_STATUS.APPROVE_REFUSE.equalsCode(formData.status)
            "
            label="审核人"
          >
            <span>{{ formData.approveBy }}</span>
          </j-form-item>
          <j-form-item
            v-if="
              $enums.SALE_ORDER_STATUS.APPROVE_PASS.equalsCode(formData.status) ||
              $enums.SALE_ORDER_STATUS.APPROVE_REFUSE.equalsCode(formData.status)
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
            <a-button :icon="h(NumberOutlined)" @click="batchInputOrderNum">批量录入数量</a-button>
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
          >
          </a-auto-complete>
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
          <span v-if="$utils.isFloatGeZero(row.taxPrice) && $utils.isFloatGeZero(row.orderNum)">{{
            $utils.mul(row.taxPrice, row.orderNum)
          }}</span>
        </template>

        <!-- 备注 列自定义内容 -->
        <template #description_default="{ row }">
          <a-input v-model:value="row.description" />
        </template>
      </vxe-grid>

      <order-time-line :id="id" />

      <j-border title="合计">
        <j-form label-width="140px">
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
        <j-form label-width="140px">
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
            v-permission="['sale:order:modify']"
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
  import BatchAddProduct from '@/views/sc/sale/batch-add-product.vue';
  import PayType from '@/views/sc/pay-type/index.vue';
  import {
    PlusOutlined,
    DeleteOutlined,
    NumberOutlined,
    EditOutlined,
    AlertOutlined,
  } from '@ant-design/icons-vue';
  import * as api from '@/api/sc/sale/order';

  export default defineComponent({
    name: 'ModifySaleOrder',
    components: {
      BatchAddProduct,
      PayType,
    },
    setup() {
      return {
        h,
        PlusOutlined,
        DeleteOutlined,
        NumberOutlined,
        EditOutlined,
        AlertOutlined,
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
          { field: 'skuCode', title: '商品SKU编号', width: 120 },
          { field: 'externalCode', title: '商品外部编号', width: 120 },
          { field: 'unit', title: '单位', width: 80 },
          { field: 'spec', title: '规格', width: 80 },
          { field: 'categoryName', title: '商品类目', width: 120 },
          { field: 'brandName', title: '商品品牌', width: 120 },
          { field: 'oriPrice', title: '参考销售价（元）', align: 'right', width: 150 },
          {
            field: 'isGift',
            title: '是否赠品',
            width: 80,
            formatter: ({ cellValue }) => {
              return cellValue ? '是' : '否';
            },
          },
          { field: 'stockNum', title: '库存数量', align: 'right', width: 100 },
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
            field: 'orderNum',
            title: '销售数量',
            align: 'right',
            width: 100,
            slots: { default: 'orderNum_default' },
          },
          {
            field: 'orderAmount',
            title: '含税金额',
            align: 'right',
            width: 120,
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
        this.$utils.closeCurrentPage();
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
      },
      // 加载数据
      loadData() {
        this.loading = true;
        api
          .get(this.id)
          .then((res) => {
            if (
              !this.$enums.SALE_ORDER_STATUS.CREATED.equalsCode(res.status) &&
              !this.$enums.SALE_ORDER_STATUS.APPROVE_REFUSE.equalsCode(res.status)
            ) {
              this.$msg.createError('订单已审核通过，无法修改！');
              this.closeDialog();
              return;
            }
            this.formData = Object.assign(this.formData, {
              scId: res.scId,
              customerId: res.customerId,
              salerId: res.salerId,
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
            this.tableData = tableData.map((item) => Object.assign(this.emptyProduct(), item));

            this.$refs.payType.setTableData(res.payTypes || []);
            this.calcSum();
          })
          .finally(() => {
            this.loading = false;
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
      // 选择商品
      handleSelectProduct(index, value, row) {
        value = row ? row.products.filter((item) => item.productId === value)[0] : value;
        value.oriPrice = value.salePrice;
        value.taxPrice = value.oriPrice;
        if (value.oriPrice === 0) {
          value.discountRate = 100;
        }
        this.tableData[index] = Object.assign(this.tableData[index], value);

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
      // 批量添加商品
      openBatchAddProductDialog() {
        if (this.$utils.isEmpty(this.formData.scId)) {
          this.$msg.createError('请先选择仓库！');
          return;
        }
        this.$refs.batchAddProductDialog.openDialog();
      },
      taxPriceInput(row, value) {
        if (row.oriPrice !== 0) {
          if (this.$utils.isFloatGeZero(row.taxPrice)) {
            row.discountRate = this.$utils
              .mul(this.$utils.div(row.taxPrice, row.oriPrice), 100)
              .toFixed(2);
          }
        }
        this.calcSum();
      },
      changeDiscountRate(row, value) {
        if (
          this.$utils.isFloatGeZero(row.discountRate) &&
          this.$utils.isFloatGtZero(row.oriPrice)
        ) {
          row.taxPrice = this.$utils
            .div(this.$utils.mul(row.oriPrice, row.discountRate), 100)
            .toFixed(2);
        }

        this.calcSum();
      },
      orderNumInput(value) {
        this.calcSum();
      },
      // 计算汇总数据
      calcSum() {
        let totalNum = 0;
        let giftNum = 0;
        let totalAmount = 0;

        this.tableData
          .filter((t) => {
            return this.$utils.isFloatGeZero(t.taxPrice) && this.$utils.isIntegerGeZero(t.orderNum);
          })
          .forEach((t) => {
            const num = parseInt(t.orderNum);
            if (t.isGift) {
              giftNum = this.$utils.add(num, giftNum);
            } else {
              totalNum = this.$utils.add(num, totalNum);
            }

            totalAmount = this.$utils.add(totalAmount, this.$utils.mul(num, t.taxPrice));
          });

        this.formData.totalNum = totalNum;
        this.formData.giftNum = giftNum;
        this.formData.totalAmount = totalAmount;
      },
      // 批量录入数量
      batchInputOrderNum() {
        const records = this.$refs.grid.getCheckboxRecords();
        if (this.$utils.isEmpty(records)) {
          this.$msg.createError('请选择商品数据！');
          return;
        }

        this.$msg
          .createPrompt('请输入销售数量', {
            inputPattern: this.$utils.PATTERN_IS_INTEGER_GT_ZERO,
            inputErrorMessage: '销售数量必须为整数并且大于0',
            title: '批量录入数量',
            required: true,
          })
          .then(({ value }) => {
            records.forEach((t) => {
              t.orderNum = value;

              this.orderNumInput(value);
            });
          });
      },
      // 批量录入销售价
      batchInputTaxPrice() {
        const records = this.$refs.grid.getCheckboxRecords();
        if (this.$utils.isEmpty(records)) {
          this.$msg.createError('请选择商品数据！');
          return;
        }

        for (let i = 0; i < records.length; i++) {
          if (records[i].isGift) {
            this.$msg.createError('第' + (i + 1) + '行商品为赠品，不允许录入采购价！');
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
          item.discountRate = 0;
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

        if (this.$utils.isEmpty(this.formData.customerId)) {
          this.$msg.createError('客户不允许为空！');
          return false;
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

          if (this.$utils.isEmpty(product.orderNum)) {
            this.$msg.createError('第' + (i + 1) + '行商品销售数量不允许为空！');
            return false;
          }

          if (!this.$utils.isInteger(product.orderNum)) {
            this.$msg.createError('第' + (i + 1) + '行商品销售数量必须为整数！');
            return false;
          }

          if (!this.$utils.isIntegerGtZero(product.orderNum)) {
            this.$msg.createError('第' + (i + 1) + '行商品销售数量必须大于0！');
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
          this.$msg.createError('所有约定支付的支付金额不等于含税总金额，请检查！');
          return false;
        }

        return true;
      },
      // 创建订单
      updateOrder() {
        if (!this.validData()) {
          return;
        }

        const params = {
          id: this.id,
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

        this.loading = true;
        api
          .update(params)
          .then((res) => {
            this.$msg.createSuccess('保存成功！');

            this.$emit('confirm');
            this.closeDialog();
          })
          .finally(() => {
            this.loading = false;
          });
      },
    },
  });
</script>
<style></style>
