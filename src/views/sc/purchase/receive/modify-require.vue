<template>
  <div class="simple-app-container">
    <div v-permission="['purchase:receive:modify']" v-loading="loading">
      <j-border>
        <j-form>
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
          <j-form-item label="实际到货日期" required>
            <a-date-picker
              v-model:value="formData.receiveDate"
              placeholder=""
              value-format="YYYY-MM-DD"
            />
          </j-form-item>
          <j-form-item label="采购订单" required>
            <div v-if="!$utils.isEmpty(formData.purchaseOrder.code)">
              <a
                v-permission="['purchase:order:query']"
                @click="(e) => $refs.viewPurchaseOrderDetailDialog.openDialog()"
                >{{ formData.purchaseOrder.code }}</a
              >
              <span v-no-permission="['purchase:order:query']">{{
                formData.purchaseOrder.code
              }}</span>
            </div>
          </j-form-item>
          <j-form-item label="状态">
            <span
              v-if="$enums.RECEIVE_SHEET_STATUS.APPROVE_PASS.equalsCode(formData.status)"
              style="color: #52c41a"
              >{{ $enums.RECEIVE_SHEET_STATUS.getDesc(formData.status) }}</span
            >
            <span
              v-else-if="$enums.RECEIVE_SHEET_STATUS.APPROVE_REFUSE.equalsCode(formData.status)"
              style="color: #f5222d"
              >{{ $enums.RECEIVE_SHEET_STATUS.getDesc(formData.status) }}</span
            >
            <span v-else style="color: #303133">{{
              $enums.RECEIVE_SHEET_STATUS.getDesc(formData.status)
            }}</span>
          </j-form-item>
          <j-form-item :span="16" :content-nest="false" label="拒绝理由">
            <a-input
              v-if="$enums.RECEIVE_SHEET_STATUS.APPROVE_REFUSE.equalsCode(formData.status)"
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
              $enums.RECEIVE_SHEET_STATUS.APPROVE_PASS.equalsCode(formData.status) ||
              $enums.RECEIVE_SHEET_STATUS.APPROVE_REFUSE.equalsCode(formData.status)
            "
            label="审核人"
          >
            <span>{{ formData.approveBy }}</span>
          </j-form-item>
          <j-form-item
            v-if="
              $enums.RECEIVE_SHEET_STATUS.APPROVE_PASS.equalsCode(formData.status) ||
              $enums.RECEIVE_SHEET_STATUS.APPROVE_REFUSE.equalsCode(formData.status)
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
            <a-tooltip title="将收货数量设置为剩余收货数量">
              <a-button :icon="h(EditOutlined)" @click="quickSettingReceiveNum"
                >快捷设置数量</a-button
              >
            </a-tooltip>
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

        <!-- 采购价 列自定义内容 -->
        <template #purchasePrice_default="{ row }">
          <span>{{ row.purchasePrice }}</span>
        </template>

        <!-- 剩余收货数量 列自定义内容 -->
        <template #remainNum_default="{ row }">
          <span v-if="$utils.isEmpty(row.remainNum)">-</span>
          <span v-else-if="$utils.isIntegerGeZero(row.receiveNum)">{{
            Math.max(0, $utils.sub(row.remainNum, row.receiveNum))
          }}</span>
          <span v-else>{{ row.remainNum }}</span>
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
          <span
            v-if="$utils.isFloatGeZero(row.purchasePrice) && $utils.isIntegerGeZero(row.receiveNum)"
            >{{ $utils.mul(row.purchasePrice, row.receiveNum) }}</span
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
        <j-form label-width="140px">
          <j-form-item label="备注" :span="24" :content-nest="false">
            <a-textarea v-model:value.trim="formData.description" maxlength="200" />
          </j-form-item>
        </j-form>
      </j-border>
      <batch-add-product
        ref="batchAddProductDialog"
        :sc-id="formData.sc.id"
        @confirm="batchAddProduct"
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
    <!-- 采购订单查看窗口 -->
    <purchase-order-detail :id="formData.purchaseOrder.id" ref="viewPurchaseOrderDetailDialog" />
  </div>
</template>
<script>
  import { h, defineComponent } from 'vue';
  import BatchAddProduct from '@/views/sc/purchase/batch-add-product.vue';
  import Moment from 'moment';
  import PurchaseOrderDetail from '@/views/sc/purchase/order/detail.vue';
  import {
    PlusOutlined,
    DeleteOutlined,
    NumberOutlined,
    EditOutlined,
    AlertOutlined,
  } from '@ant-design/icons-vue';
  import * as api from '@/api/sc/purchase/receive';
  import * as purchaseApi from '@/api/sc/purchase/order';

  export default defineComponent({
    name: 'ModifyPurchaseReceiveRequire',
    components: {
      PurchaseOrderDetail,
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
          { field: 'stockNum', title: '库存数量', align: 'right', width: 100 },
          {
            field: 'orderNum',
            title: '采购数量',
            align: 'right',
            width: 100,
            formatter: ({ cellValue }) => {
              return this.$utils.isEmpty(cellValue) ? '-' : cellValue;
            },
          },
          {
            field: 'remainNum',
            title: '剩余收货数量',
            align: 'right',
            width: 120,
            slots: { default: 'remainNum_default' },
          },
          {
            field: 'receiveNum',
            title: '收货数量',
            align: 'right',
            width: 100,
            slots: { default: 'receiveNum_default' },
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
      // 初始化表单数据
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
          sc: {},
          supplier: {},
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
              !this.$enums.RECEIVE_SHEET_STATUS.CREATED.equalsCode(res.status) &&
              !this.$enums.RECEIVE_SHEET_STATUS.APPROVE_REFUSE.equalsCode(res.status)
            ) {
              this.$msg.createError('采购收货单已审核通过，无法修改！');
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
              receiveDate: res.receiveDate,
              purchaseOrder: {
                id: res.purchaseOrderId,
                code: res.purchaseOrderCode,
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
              item.isFixed = !this.$utils.isEmpty(item.purchaseOrderDetailId);

              if (item.isFixed) {
                // 接口返回的剩余收货数量是最新的数据，应加上当前收货数量
                item.remainNum = this.$utils.add(item.remainNum, item.receiveNum);
              }

              return item;
            });
            this.tableData = tableData.map((item) => Object.assign(this.emptyProduct(), item));

            this.supplierChange(this.formData.supplier.id, true);

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
          purchasePrice: 0,
          taxCostPrice: '',
          stockNum: '',
          orderNum: '',
          remainNum: '',
          receiveNum: '',
          taxRate: '',
          isGift: true,
          taxAmount: '',
          description: '',
          isFixed: false,
          products: [],
        };
      },
      // 新增商品
      addProduct() {
        if (this.$utils.isEmpty(this.formData.purchaseOrder)) {
          this.$msg.createError('请先选择采购订单！');
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

        purchaseApi.searchPurchaseProducts(this.formData.sc.id, queryString).then((res) => {
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
            isGift: true,
            purchasePrice: 0,
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

        for (let i = 0; i < records.length; i++) {
          if (records[i].isFixed) {
            this.$msg.createError('第' + (i + 1) + '行商品是采购订单中的商品，不允许删除！');
            return;
          }
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
        if (this.$utils.isEmpty(this.formData.purchaseOrder)) {
          this.$msg.createError('请先选择采购订单！');
          return;
        }
        this.$refs.batchAddProductDialog.openDialog();
      },
      purchasePriceInput(row, value) {
        this.calcSum();
      },
      receiveNumInput(value) {
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
              this.$utils.isFloatGeZero(t.purchasePrice) &&
              this.$utils.isIntegerGeZero(t.receiveNum)
            );
          })
          .forEach((t) => {
            const num = parseInt(t.receiveNum);
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
      batchInputReceiveNum() {
        const records = this.$refs.grid.getCheckboxRecords();
        if (this.$utils.isEmpty(records)) {
          this.$msg.createError('请选择商品数据！');
          return;
        }

        this.$msg
          .createPrompt('请输入收货数量', {
            inputPattern: this.$utils.PATTERN_IS_INTEGER_GE_ZERO,
            inputErrorMessage: '收货数量必须为整数并且不小于0',
            title: '批量录入数量',
            required: true,
          })
          .then(({ value }) => {
            records.forEach((t) => {
              t.receiveNum = value;

              this.receiveNumInput(value);
            });
          });
      },
      // 快捷设置数量
      quickSettingReceiveNum() {
        const records = this.$refs.grid.getCheckboxRecords();
        if (this.$utils.isEmpty(records)) {
          this.$msg.createError('请选择商品数据！');
          return;
        }

        for (let i = 0; i < records.length; i++) {
          const record = records[i];
          if (record.isFixed) {
            record.outNum = record.remainNum;
          }
        }

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
        if (this.$utils.isEmpty(this.formData.sc.id)) {
          this.$msg.createError('仓库不允许为空！');
          return false;
        }

        if (this.$utils.isEmpty(this.formData.supplier.id)) {
          this.$msg.createError('供应商不允许为空！');
          return false;
        }

        if (this.formData.allowModifyPaymentDate) {
          if (this.$utils.isEmpty(this.formData.paymentDate)) {
            this.$msg.createError('付款日期不允许为空！');
            return false;
          }
        }

        if (this.$utils.isEmpty(this.formData.receiveDate)) {
          this.$msg.createError('实际到货日期不允许为空！');
          return false;
        }

        if (this.$utils.isEmpty(this.formData.purchaseOrder.id)) {
          this.$msg.createError('采购订单不允许为空！');
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

          if (!this.$utils.isEmpty(product.receiveNum)) {
            if (!this.$utils.isInteger(product.receiveNum)) {
              this.$msg.createError('第' + (i + 1) + '行商品收货数量必须为整数！');
              return false;
            }

            if (product.isFixed) {
              if (!this.$utils.isIntegerGeZero(product.receiveNum)) {
                this.$msg.createError('第' + (i + 1) + '行商品收货数量不允许小于0！');
                return false;
              }
            } else {
              if (!this.$utils.isIntegerGtZero(product.receiveNum)) {
                this.$msg.createError('第' + (i + 1) + '行商品收货数量必须大于0！');
                return false;
              }
            }

            if (product.isFixed) {
              if (product.receiveNum > product.remainNum) {
                this.$msg.createError(
                  '第' +
                    (i + 1) +
                    '行商品累计收货数量为' +
                    (product.orderNum - product.remainNum) +
                    '，剩余收货数量为' +
                    product.remainNum +
                    '，本次收货数量不允许大于' +
                    product.remainNum +
                    '！',
                );
                return false;
              }
            }
          } else {
            if (!product.isFixed) {
              this.$msg.createError('第' + (i + 1) + '行商品收货数量不允许为空！');
              return false;
            }
          }
        }

        if (
          this.tableData.filter((item) => this.$utils.isIntegerGtZero(item.receiveNum)).length === 0
        ) {
          this.$msg.createError('采购订单中的商品必须全部或部分收货！');
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
          receiveDate: this.formData.receiveDate,
          purchaseOrderId: this.formData.purchaseOrder.id,
          description: this.formData.description,
          allowModifyPaymentDate: true,
          products: this.tableData
            .filter((t) => this.$utils.isIntegerGtZero(t.receiveNum))
            .map((t) => {
              const product = {
                productId: t.productId,
                receiveNum: t.receiveNum,
                description: t.description,
              };

              if (t.isFixed) {
                product.purchaseOrderDetailId = t.purchaseOrderDetailId;
              }

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
      supplierChange(supplierId, unModify) {
        api.getPaymentDate(supplierId).then((res) => {
          if (!unModify) {
            if (res.allowModify) {
              // 如果允许修改付款日期
              if (this.$utils.isEmpty(this.formData.paymentDate)) {
                this.formData.paymentDate = res.paymentDate || '';
              }
            } else {
              // 不允许修改则按默认日期
              this.formData.paymentDate = res.paymentDate || '';
            }
          }

          this.formData.allowModifyPaymentDate = res.allowModify;
        });
      },
    },
  });
</script>
<style></style>
