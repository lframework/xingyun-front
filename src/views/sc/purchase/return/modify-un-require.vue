<template>
  <div class="simple-app-container">
    <div v-permission="['purchase:return:modify']" v-loading="loading">
      <j-border>
        <j-form>
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
          <j-form-item :span="16" />
          <j-form-item label="状态">
            <span
              v-if="$enums.PURCHASE_RETURN_STATUS.APPROVE_PASS.equalsCode(formData.status)"
              style="color: #52c41a"
              >{{ $enums.PURCHASE_RETURN_STATUS.getDesc(formData.status) }}</span
            >
            <span
              v-else-if="$enums.PURCHASE_RETURN_STATUS.APPROVE_REFUSE.equalsCode(formData.status)"
              style="color: #f5222d"
              >{{ $enums.PURCHASE_RETURN_STATUS.getDesc(formData.status) }}</span
            >
            <span v-else style="color: #303133">{{
              $enums.PURCHASE_RETURN_STATUS.getDesc(formData.status)
            }}</span>
          </j-form-item>
          <j-form-item :span="16" :content-nest="false" label="拒绝理由">
            <a-input
              v-if="$enums.PURCHASE_RETURN_STATUS.APPROVE_REFUSE.equalsCode(formData.status)"
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
              $enums.PURCHASE_RETURN_STATUS.APPROVE_PASS.equalsCode(formData.status) ||
              $enums.PURCHASE_RETURN_STATUS.APPROVE_REFUSE.equalsCode(formData.status)
            "
            label="审核人"
          >
            <span>{{ formData.approveBy }}</span>
          </j-form-item>
          <j-form-item
            v-if="
              $enums.PURCHASE_RETURN_STATUS.APPROVE_PASS.equalsCode(formData.status) ||
              $enums.PURCHASE_RETURN_STATUS.APPROVE_REFUSE.equalsCode(formData.status)
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
            <a-button :icon="h(EditOutlined)" @click="batchInputPurchasePrice"
              >批量调整采购价</a-button
            >
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

        <!-- 库存数量 列自定义内容 -->
        <template #stockNum_default="{ row }">
          <span v-if="checkStockNum(row)">{{ row.stockNum }}</span>
          <span v-else style="color: #f5222d">{{ row.stockNum }}</span>
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
          <span
            v-if="$utils.isFloatGeZero(row.purchasePrice) && $utils.isIntegerGeZero(row.returnNum)"
            >{{ $utils.mul(row.purchasePrice, row.returnNum) }}</span
          >
        </template>

        <!-- 备注 列自定义内容 -->
        <template #description_default="{ row }">
          <a-input v-model:value="row.description" />
        </template>
      </vxe-grid>

      <order-time-line :id="id" />

      <j-border title="合计">
        <j-form label-width="140px">
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
  import { defineComponent, h } from 'vue';
  import BatchAddProduct from '@/views/sc/purchase/batch-add-product.vue';
  import Moment from 'moment';
  import {
    PlusOutlined,
    DeleteOutlined,
    NumberOutlined,
    EditOutlined,
    AlertOutlined,
  } from '@ant-design/icons-vue';
  import * as api from '@/api/sc/purchase/return';
  import * as purchaseApi from '@/api/sc/purchase/order';
  import * as receiveApi from '@/api/sc/purchase/receive';

  export default defineComponent({
    name: 'ModifyPurchaseReturnUnRequire',
    components: {
      BatchAddProduct,
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
            width: 120,
            slots: { default: 'purchasePrice_default' },
          },
          { field: 'taxCostPrice', title: '含税成本价（元）', align: 'right', width: 140 },
          {
            field: 'stockNum',
            title: '库存数量',
            align: 'right',
            width: 100,
            slots: { default: 'stockNum_default' },
          },
          {
            field: 'returnNum',
            title: '退货数量',
            align: 'right',
            width: 100,
            slots: { default: 'returnNum_default' },
          },
          {
            field: 'taxAmount',
            title: '含税金额',
            align: 'right',
            width: 120,
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
          supplierId: '',
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
              !this.$enums.PURCHASE_RETURN_STATUS.CREATED.equalsCode(res.status) &&
              !this.$enums.PURCHASE_RETURN_STATUS.APPROVE_REFUSE.equalsCode(res.status)
            ) {
              this.$msg.createError('采购退货单已审核通过，无法修改！');
              this.closeDialog();
              return;
            }
            this.formData = Object.assign(this.formData, {
              scId: res.scId,
              supplierId: res.supplierId,
              purchaserId: res.purchaserId || '',
              paymentDate: res.paymentDate || '',
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

            this.supplierChange(this.formData.supplierId);

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
          purchasePrice: '',
          taxCostPrice: '',
          stockNum: '',
          returnNum: '',
          taxRate: '',
          isGift: false,
          taxAmount: '',
          description: '',
          isFixed: false,
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
      // 选择商品
      handleSelectProduct(index, value, row) {
        this.tableData[index] = Object.assign(
          this.tableData[index],
          row ? row.products.filter((item) => item.productId === value)[0] : value,
          {
            isGift: false,
          },
        );

        this.purchasePriceInput(this.tableData[index], this.tableData[index].purchasePrice);
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
            return (
              this.$utils.isFloatGeZero(t.purchasePrice) && this.$utils.isIntegerGeZero(t.returnNum)
            );
          })
          .forEach((t) => {
            const num = parseInt(t.returnNum);
            if (t.isGift) {
              giftNum = this.$utils.add(giftNum, num);
            } else {
              totalNum = this.$utils.add(totalNum, num);
            }

            totalAmount = this.$utils.add(totalAmount, this.$utils.mul(num, t.purchasePrice));
          });

        this.formData.totalNum = totalNum;
        this.formData.giftNum = giftNum;
        this.formData.totalAmount = totalAmount;
      },
      // 批量录入数量
      batchInputReturnNum() {
        const records = this.$refs.grid.getCheckboxRecords();
        if (this.$utils.isEmpty(records)) {
          this.$msg.createError('请选择商品数据！');
          return;
        }

        this.$msg
          .createPrompt('请输入退货数量', {
            inputPattern: this.$utils.PATTERN_IS_INTEGER_GT_ZERO,
            inputErrorMessage: '退货数量必须为整数并且大于0',
            title: '批量录入数量',
            required: true,
          })
          .then(({ value }) => {
            records.forEach((t) => {
              t.returnNum = value;

              this.returnNumInput(value);
            });
          });
      },
      // 批量录入采购价
      batchInputPurchasePrice() {
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
          .createPrompt('请输入采购价（元）', {
            inputPattern: this.$utils.PATTERN_IS_PRICE,
            inputErrorMessage: '采购价（元）必须为数字并且不小于0',
            title: '批量调整采购价',
            required: true,
          })
          .then(({ value }) => {
            records.forEach((t) => {
              t.purchasePrice = value;

              this.purchasePriceInput(t, value);
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
      // 校验数据
      validData() {
        if (this.$utils.isEmpty(this.formData.scId)) {
          this.$msg.createError('仓库不允许为空！');
          return false;
        }

        if (this.$utils.isEmpty(this.formData.supplierId)) {
          this.$msg.createError('供应商不允许为空！');
          return false;
        }

        if (this.formData.allowModifyPaymentDate) {
          if (this.$utils.isEmpty(this.formData.paymentDate)) {
            this.$msg.createError('付款日期不允许为空！');
            return false;
          }
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

          if (this.$utils.isEmpty(product.purchasePrice)) {
            this.$msg.createError('第' + (i + 1) + '行商品采购价不允许为空！');
            return false;
          }

          if (!this.$utils.isFloat(product.purchasePrice)) {
            this.$msg.createError('第' + (i + 1) + '行商品采购价必须为数字！');
            return false;
          }

          if (product.isGift) {
            if (parseFloat(product.purchasePrice) !== 0) {
              this.$msg.createError('第' + (i + 1) + '行商品采购价必须等于0！');
              return false;
            }
          } else {
            if (!this.$utils.isFloatGtZero(product.purchasePrice)) {
              this.$msg.createError('第' + (i + 1) + '行商品采购价必须大于0！');
              return false;
            }
          }

          if (!this.$utils.isNumberPrecision(product.purchasePrice, 2)) {
            this.$msg.createError('第' + (i + 1) + '行商品采购价最多允许2位小数！');
            return false;
          }

          if (!this.$utils.isEmpty(product.returnNum)) {
            if (!this.$utils.isInteger(product.returnNum)) {
              this.$msg.createError('第' + (i + 1) + '行商品退货数量必须为整数！');
              return false;
            }

            if (!this.$utils.isIntegerGtZero(product.returnNum)) {
              this.$msg.createError('第' + (i + 1) + '行商品退货数量必须大于0！');
              return false;
            }
          } else {
            this.$msg.createError('第' + (i + 1) + '行商品退货数量不允许为空！');
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
          description: this.formData.description,
          products: this.tableData
            .filter((t) => this.$utils.isIntegerGtZero(t.returnNum))
            .map((t) => {
              const product = {
                productId: t.productId,
                purchasePrice: t.purchasePrice,
                returnNum: t.returnNum,
                description: t.description,
              };

              return product;
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
      // 供应商改变时触发
      supplierChange(supplierId) {
        if (!this.$utils.isEmpty(supplierId)) {
          receiveApi.getPaymentDate(supplierId).then((res) => {
            if (res.allowModify) {
              // 如果允许修改付款日期
              if (this.$utils.isEmpty(this.formData.paymentDate)) {
                this.formData.paymentDate = res.paymentDate || '';
              }
            } else {
              // 不允许修改则按默认日期
              this.formData.paymentDate = res.paymentDate || '';
            }
            this.formData.allowModifyPaymentDate = res.allowModify;
          });
        }
      },
      // 检查库存数量
      checkStockNum(row) {
        const checkArr = this.tableData
          .filter((item) => item.productId === row.productId)
          .map((item) => item.returnNum);
        if (this.$utils.isEmpty(checkArr)) {
          checkArr.push(0);
        }
        const totalReturnNum = checkArr.reduce((total, item) => {
          const returnNum = this.$utils.isIntegerGtZero(item) ? item : 0;
          return this.$utils.add(total, returnNum);
        }, 0);

        return totalReturnNum <= row.stockNum;
      },
    },
  });
</script>
<style></style>
