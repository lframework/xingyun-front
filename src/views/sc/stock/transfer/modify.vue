<template>
  <div class="simple-app-container">
    <div v-permission="['stock:sc-transfer:modify']" v-loading="loading">
      <j-border>
        <j-form ref="form" :model="formData" :rules="rules">
          <j-form-item label="转出仓库" required>
            <store-center-selector
              v-model:value="formData.sourceScId"
              :before-open="beforeSelectSc"
              @update:value="afterSelectSc"
            />
          </j-form-item>
          <j-form-item label="转入仓库" required>
            <store-center-selector v-model:value="formData.targetScId" />
          </j-form-item>
          <j-form-item :span="8" />
          <j-form-item label="备注" :span="24">
            <a-textarea v-model:value.trim="formData.description" maxlength="200" />
          </j-form-item>
          <j-form-item label="状态">
            <span
              v-if="$enums.SC_TRANSFER_ORDER_STATUS.APPROVE_PASS.equalsCode(formData.status)"
              style="color: #52c41a"
              >{{ $enums.SC_TRANSFER_ORDER_STATUS.getDesc(formData.status) }}</span
            >
            <span
              v-else-if="$enums.SC_TRANSFER_ORDER_STATUS.APPROVE_REFUSE.equalsCode(formData.status)"
              style="color: #f5222d"
              >{{ $enums.SC_TRANSFER_ORDER_STATUS.getDesc(formData.status) }}</span
            >
            <span v-else style="color: #303133">{{
              $enums.SC_TRANSFER_ORDER_STATUS.getDesc(formData.status)
            }}</span>
          </j-form-item>
          <j-form-item label="拒绝理由" :span="16" :content-nest="false">
            <a-input
              v-if="$enums.SC_TRANSFER_ORDER_STATUS.APPROVE_REFUSE.equalsCode(formData.status)"
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
              $enums.SC_TRANSFER_ORDER_STATUS.APPROVE_PASS.equalsCode(formData.status) ||
              $enums.SC_TRANSFER_ORDER_STATUS.APPROVE_REFUSE.equalsCode(formData.status)
            "
            label="审核人"
          >
            <span>{{ formData.approveBy }}</span>
          </j-form-item>
          <j-form-item
            v-if="
              $enums.SC_TRANSFER_ORDER_STATUS.APPROVE_PASS.equalsCode(formData.status) ||
              $enums.SC_TRANSFER_ORDER_STATUS.APPROVE_REFUSE.equalsCode(formData.status)
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

        <!-- 调拨数量 列自定义内容 -->
        <template #transferNum_default="{ row }">
          <a-input
            v-model:value="row.transferNum"
            class="number-input"
            @input="(e) => transferNumInput(e.target.value)"
          />
        </template>

        <!-- 备注 列自定义内容 -->
        <template #description_default="{ row }">
          <a-input v-model:value="row.description" />
        </template>
      </vxe-grid>

      <order-time-line :id="id" />

      <j-border title="合计">
        <j-form label-width="140px">
          <j-form-item label="调拨数量" :span="6">
            <a-input v-model:value="formData.totalNum" class="number-input" readonly />
          </j-form-item>
        </j-form>
      </j-border>

      <batch-add-product
        ref="batchAddProductDialog"
        :sc-id="formData.sourceScId || ''"
        @confirm="batchAddProduct"
      />

      <div style="text-align: center; background-color: #ffffff; padding: 8px 0">
        <a-space>
          <a-button
            v-permission="['stock:sc-transfer:modify']"
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
  import BatchAddProduct from './batch-add-product.vue';
  import { PlusOutlined, DeleteOutlined } from '@ant-design/icons-vue';
  import * as api from '@/api/sc/stock/transfer-sc';

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
        id: this.$route.params.id,
        // 是否显示加载框
        loading: false,
        // 表单数据
        formData: {},
        rules: {
          sourceScId: [
            { required: true, message: '请选择转出仓库' },
            {
              validator: (rule, value, callback) => {
                if (!this.$utils.isEmpty(value)) {
                  if (this.$utils.isEqualWithStr(value, this.formData.targetScId)) {
                    return callback(new Error('转出仓库不能与转入仓库相同'));
                  }
                }

                callback();
              },
            },
          ],
          targetScId: [{ required: true, message: '请选择转入仓库' }],
        },
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
            field: 'transferNum',
            title: '调拨数量',
            width: 120,
            align: 'right',
            slots: { default: 'transferNum_default' },
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
        this.$utils.closeCurrentPage();
      },
      // 初始化表单数据
      initFormData() {
        this.formData = {
          sourceScId: '',
          targetScId: '',
          description: '',
          updateBy: '',
          updateTime: '',
          approveBy: '',
          approveTime: '',
          status: '',
          refuseReason: '',
          totalNum: 0,
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
              if (this.$utils.isEmpty(this.tableData)) {
                this.$msg.createError('请录入商品！');
                return;
              }

              for (let i = 0; i < this.tableData.length; i++) {
                const data = this.tableData[i];
                if (this.$utils.isEmpty(data.productId)) {
                  this.$msg.createError('第' + (i + 1) + '行商品不允许为空！');
                  return;
                }
                if (this.$utils.isEmpty(data.transferNum)) {
                  this.$msg.createError('第' + (i + 1) + '行调拨数量不允许为空！');
                  return false;
                }
                if (!this.$utils.isInteger(data.transferNum)) {
                  this.$msg.createError('第' + (i + 1) + '行调拨数量必须是整数！');
                  return false;
                }
                if (!this.$utils.isIntegerGtZero(data.transferNum)) {
                  this.$msg.createError('第' + (i + 1) + '行调拨数量必须大于0！');
                  return false;
                }
              }

              const params = {
                id: this.id,
                sourceScId: this.formData.sourceScId,
                targetScId: this.formData.targetScId,
                description: this.formData.description,
                products: this.tableData.map((item) => {
                  return {
                    productId: item.productId,
                    transferNum: item.transferNum,
                    description: item.description,
                  };
                }),
              };
              this.loading = true;
              api
                .update(params)
                .then(() => {
                  this.$msg.createSuccess('修改成功！');
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
          transferNum: '',
          curStockNum: '',
          description: '',
          products: [],
        };
      },
      // 新增商品
      addProduct() {
        if (this.$utils.isEmpty(this.formData.sourceScId)) {
          this.$msg.createError('请先选择转出仓库！');
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

        api.searchProducts(this.formData.sourceScId, queryString).then((res) => {
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
        if (this.$utils.isEmpty(this.formData.sourceScId)) {
          this.$msg.createError('请先选择转出仓库！');
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
          return this.$msg.createConfirm('更改转出仓库，会清空商品数据，是否确认更改？');
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
      calcSum() {
        let totalNum = 0;
        this.tableData.forEach((item) => {
          if (!this.$utils.isEmpty(item.productId)) {
            if (this.$utils.isIntegerGeZero(item.transferNum)) {
              totalNum = this.$utils.add(item.transferNum, totalNum);
            }
          }
        });

        this.formData.totalNum = totalNum;
      },
      transferNumInput(e) {
        this.calcSum();
      },
      loadData() {
        this.loading = true;
        api
          .get(this.id)
          .then((res) => {
            Object.assign(this.formData, {
              sourceScId: res.sourceScId,
              targetScId: res.targetScId,
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
