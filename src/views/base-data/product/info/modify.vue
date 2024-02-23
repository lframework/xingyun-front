<template>
  <div class="simple-app-container">
    <div v-loading="loading" v-permission="['base-data:product:info:modify']">
      <a-form
        ref="form"
        :label-col="{ span: 6 }"
        :wrapper-col="{ span: 14 }"
        :model="formData"
        :rules="rules"
      >
        <a-row
          v-if="
            $enums.PRODUCT_TYPE.NORMAL.equalsCode(productType) ||
            $enums.PRODUCT_TYPE.BUNDLE.equalsCode(productType)
          "
        >
          <a-col :md="8" :sm="24">
            <a-form-item label="编号" name="code">
              <a-input v-model:value="formData.code" allow-clear />
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="24">
            <a-form-item label="名称" name="name">
              <a-input v-model:value="formData.name" allow-clear />
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="24">
            <a-form-item label="简称" name="shortName">
              <a-input v-model:value="formData.shortName" allow-clear />
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="24">
            <a-form-item label="SKU编号" name="skuCode">
              <a-input v-model:value="formData.skuCode" allow-clear />
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="24">
            <a-form-item label="外部编号" name="externalCode">
              <a-input v-model:value="formData.externalCode" allow-clear />
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="24">
            <a-form-item label="商品类目" name="categoryId">
              <product-category-selector
                v-model:value="formData.categoryId"
                :only-final="false"
                @update:value="selectCategory"
              />
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="24">
            <a-form-item label="商品品牌" name="brandId">
              <product-brand-selector
                v-model:value="formData.brandId"
                :request-params="{ available: true }"
              />
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="24">
            <a-form-item label="规格" name="spec">
              <a-input v-model:value="formData.spec" allow-clear />
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="24">
            <a-form-item label="单位" name="unit">
              <a-input v-model:value="formData.unit" allow-clear />
            </a-form-item>
          </a-col>
          <a-col v-if="$enums.PRODUCT_TYPE.NORMAL.equalsCode(productType)" :md="8" :sm="24">
            <a-form-item label="重量（kg）" name="weight">
              <a-input v-model:value="formData.weight" allow-clear />
            </a-form-item>
          </a-col>
          <a-col v-if="$enums.PRODUCT_TYPE.NORMAL.equalsCode(productType)" :md="8" :sm="24">
            <a-form-item label="体积（cm³）" name="volume">
              <a-input v-model:value="formData.volume" allow-clear />
            </a-form-item>
          </a-col>
          <a-col v-if="$enums.PRODUCT_TYPE.NORMAL.equalsCode(productType)" :md="8" :sm="24">
            <a-form-item label="进项税率（%）" name="taxRate">
              <a-input v-model:value="formData.taxRate" allow-clear />
            </a-form-item>
          </a-col>
          <a-col v-if="$enums.PRODUCT_TYPE.NORMAL.equalsCode(productType)" :md="8" :sm="24">
            <a-form-item label="销项税率（%）" name="saleTaxRate">
              <a-input v-model:value="formData.saleTaxRate" allow-clear />
            </a-form-item>
          </a-col>
          <a-col v-if="$enums.PRODUCT_TYPE.NORMAL.equalsCode(productType)" :md="8" :sm="24">
            <a-form-item label="采购价（元）" name="purchasePrice">
              <a-input v-model:value="formData.purchasePrice" allow-clear />
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="24">
            <a-form-item label="销售价（元）" name="salePrice">
              <a-input v-model:value="formData.salePrice" allow-clear />
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="24">
            <a-form-item label="零售价（元）" name="retailPrice">
              <a-input v-model:value="formData.retailPrice" allow-clear />
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="24">
            <a-form-item label="状态" name="available">
              <a-select v-model:value="formData.available" allow-clear>
                <a-select-option
                  v-for="item in $enums.AVAILABLE.values()"
                  :key="item.code"
                  :value="item.code"
                  >{{ item.desc }}</a-select-option
                >
              </a-select>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row v-if="$enums.PRODUCT_TYPE.BUNDLE.equalsCode(productType)">
          <a-col :span="24">
            <vxe-grid
              ref="grid"
              resizable
              show-overflow
              highlight-hover-row
              keep-source
              row-id="id"
              height="500"
              :data="productBundles"
              :columns="[
                { type: 'checkbox', width: 45 },
                {
                  field: 'product',
                  title: '单品',
                  minWidth: 260,
                  slots: { default: 'product_default' },
                },
                {
                  field: 'bundle_num',
                  title: '包含数量',
                  width: 200,
                  align: 'right',
                  slots: { default: 'bundleNum_default', header: 'bundleNum_header' },
                },
                {
                  field: 'salePrice',
                  title: '销售价（元）',
                  width: 200,
                  align: 'right',
                  slots: { default: 'salePrice_default', header: 'salePrice_header' },
                },
                {
                  field: 'retailPrice',
                  title: '零售价（元）',
                  width: 200,
                  align: 'right',
                  slots: { default: 'retailPrice_default', header: 'retailPrice_header' },
                },
              ]"
              :toolbar-config="{
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
              }"
            >
              <!-- 工具栏 -->
              <template #toolbar_buttons>
                <a-space>
                  <a-button type="primary" icon="plus" @click="addRow">新增</a-button>
                  <a-button danger icon="delete" @click="delRow">删除</a-button>
                </a-space>
              </template>

              <!-- 商品 列自定义内容 -->
              <template #product_default="{ row }">
                <product-selector
                  v-model:value="row.productId"
                  :request-params="{ productType: $enums.PRODUCT_TYPE.NORMAL.code }"
                />
              </template>

              <!-- 包含数量 列自定义表头 -->
              <template #bundleNum_header>
                <a-space>
                  <span>包含数量</span
                  ><a-tooltip title="表示一个组合商品中包含的单品数量"
                    ><a-icon type="question-circle"
                  /></a-tooltip>
                </a-space>
              </template>

              <!-- 包含数量 列自定义内容 -->
              <template #bundleNum_default="{ row }">
                <a-input v-model:value="row.bundleNum" class="number-input" />
              </template>

              <!-- 销售价 列自定义表头 -->
              <template #salePrice_header>
                <a-space>
                  <span>销售价（元）</span
                  ><a-tooltip
                    title="表示一个组合商品销售后的单品的销售价，此处的计算公式：每行单品的【包含数量】乘以【销售价】的总和 等于【组合商品的销售价】"
                    ><a-icon type="question-circle"
                  /></a-tooltip>
                </a-space>
              </template>

              <!-- 销售价 列自定义内容 -->
              <template #salePrice_default="{ row }">
                <a-input v-model:value="row.salePrice" class="number-input" />
              </template>

              <!-- 零售价 列自定义表头 -->
              <template #retailPrice_header>
                <a-space>
                  <span>零售价（元）</span
                  ><a-tooltip
                    title="表示一个组合商品零售后的单品的零售价，此处的计算公式：每行单品的【包含数量】乘以【零售价】的总和 等于【组合商品的零售价】"
                    ><a-icon type="question-circle"
                  /></a-tooltip>
                </a-space>
              </template>

              <!-- 零售价 列自定义内容 -->
              <template #retailPrice_default="{ row }">
                <a-input v-model:value="row.retailPrice" class="number-input" />
              </template>
            </vxe-grid>
          </a-col>
        </a-row>
        <a-row>
          <a-col v-for="modelor in modelorList" :key="modelor.id" :md="8" :sm="24">
            <a-form-item :label="modelor.name" :required="modelor.isRequired">
              <a-select
                v-if="$enums.COLUMN_TYPE.MULTIPLE.equalsCode(modelor.columnType)"
                v-model:value="modelor.text"
                mode="multiple"
                placeholder="请选择"
              >
                <a-select-option v-for="item in modelor.items" :key="item.id" :value="item.id">{{
                  item.name
                }}</a-select-option>
              </a-select>
              <a-select
                v-if="$enums.COLUMN_TYPE.SINGLE.equalsCode(modelor.columnType)"
                v-model:value="modelor.text"
                placeholder="请选择"
              >
                <a-select-option v-for="item in modelor.items" :key="item.id" :value="item.id">{{
                  item.name
                }}</a-select-option>
              </a-select>
              <div v-else-if="$enums.COLUMN_TYPE.CUSTOM.equalsCode(modelor.columnType)">
                <a-input-number
                  v-if="$enums.COLUMN_DATA_TYPE.INT.equalsCode(modelor.columnDataType)"
                  v-model:value="modelor.text"
                  class="number-input"
                />
                <a-input-number
                  v-else-if="$enums.COLUMN_DATA_TYPE.FLOAT.equalsCode(modelor.columnDataType)"
                  v-model:value="modelor.text"
                  :precision="2"
                  class="number-input"
                />
                <a-input
                  v-else-if="$enums.COLUMN_DATA_TYPE.STRING.equalsCode(modelor.columnDataType)"
                  v-model:value="modelor.text"
                />
                <a-date-picker
                  v-else-if="$enums.COLUMN_DATA_TYPE.DATE.equalsCode(modelor.columnDataType)"
                  v-model:value="modelor.text"
                  placeholder=""
                  value-format="YYYY-MM-DD"
                />
                <a-time-picker
                  v-else-if="$enums.COLUMN_DATA_TYPE.TIME.equalsCode(modelor.columnDataType)"
                  v-model:value="modelor.text"
                  placeholder=""
                  value-format="HH:mm:ss"
                />
                <a-date-picker
                  v-else-if="$enums.COLUMN_DATA_TYPE.DATE_TIME.equalsCode(modelor.columnDataType)"
                  v-model:value="modelor.text"
                  placeholder=""
                  show-time
                  value-format="YYYY-MM-DD HH:mm:ss"
                />
              </div>
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
      <div class="form-modal-footer">
        <a-space>
          <a-button type="primary" @click="submit">保存</a-button>
          <a-button @click="closeDialog">关闭</a-button>
        </a-space>
      </div>
    </div>
  </div>
</template>
<script>
  import { defineComponent } from 'vue';
  import { validCode } from '@/utils/validate';
  import * as api from '@/api/base-data/product/info';
  import * as propertyApi from '@/api/base-data/product/property'

  export default defineComponent({
    // 使用组件
    components: {},

    props: {},
    data() {
      return {
        id: this.$route.params.id,
        // 是否显示加载框
        loading: false,
        // 表单数据
        formData: {},
        productType: undefined,
        productBundles: [],
        modelorList: [],
        // 表单校验规则
        rules: {
          code: [
            { required: true, message: '请输入编号' },
            { validator: validCode, message: '编号必须由字母、数字、“-_.”组成，长度不能超过20位' },
          ],
          name: [{ required: true, message: '请输入名称' }],
          skuCode: [{ required: true, message: '请输入SKU编号' }],
          categoryId: [{ required: true, message: '请选择类目' }],
          brandId: [{ required: true, message: '请选择品牌' }],
          weight: [
            {
              validator: (rule, value) => {
                if (!this.$utils.isEmpty(value)) {
                  if (!this.$utils.isFloat(value)) {
                    return Promise.reject('重量（kg）必须为数字');
                  }
                  if (!this.$utils.isFloatGeZero(value)) {
                    return Promise.reject('重量（kg）不允许小于0');
                  }
                  if (!this.$utils.isNumberPrecision(value, 2)) {
                    return Promise.reject('重量（kg）最多允许2位小数');
                  }
                }

                return Promise.resolve();
              },
            },
          ],
          volume: [
            {
              validator: (rule, value) => {
                if (!this.$utils.isEmpty(value)) {
                  if (!this.$utils.isFloat(value)) {
                    return Promise.reject('体积（cm³）必须为数字');
                  }
                  if (!this.$utils.isFloatGeZero(value)) {
                    return Promise.reject('体积（cm³）不允许小于0');
                  }
                  if (!this.$utils.isNumberPrecision(value, 2)) {
                    return Promise.reject('体积（cm³）最多允许2位小数');
                  }
                }

                return Promise.resolve();
              },
            },
          ],
          taxRate: [
            { required: true, message: '请输入进项税率（%）' },
            {
              validator: (rule, value) => {
                if (!this.$utils.isEmpty(value)) {
                  if (!this.$utils.isInteger(value)) {
                    return Promise.reject('销项税率（%）必须为整数');
                  }
                  if (!this.$utils.isIntegerGeZero(value)) {
                    return Promise.reject('销项税率（%）不允许小于0');
                  }
                }

                return Promise.resolve();
              },
            },
          ],
          saleTaxRate: [
            { required: true, message: '请输入销项税率（%）' },
            {
              validator: (rule, value) => {
                if (!this.$utils.isEmpty(value)) {
                  if (!this.$utils.isInteger(value)) {
                    return Promise.reject('销项税率（%）必须为整数');
                  }
                  if (!this.$utils.isIntegerGeZero(value)) {
                    return Promise.reject('销项税率（%）不允许小于0');
                  }
                }

                return Promise.resolve();
              },
            },
          ],
          purchasePrice: [
            { required: true, message: '请输入采购价（元）' },
            {
              validator: (rule, value) => {
                if (!this.$utils.isEmpty(value)) {
                  if (!this.$utils.isFloat(value)) {
                    return Promise.reject('采购价（元）必须为数字');
                  }
                  if (!this.$utils.isFloatGeZero(value)) {
                    return Promise.reject('采购价（元）不允许小于0');
                  }
                  if (!this.$utils.isNumberPrecision(value, 2)) {
                    return Promise.reject('采购价（元）最多允许2位小数');
                  }
                }

                return Promise.resolve();
              },
            },
          ],
          salePrice: [
            { required: true, message: '请输入销售价（元）' },
            {
              validator: (rule, value) => {
                if (!this.$utils.isEmpty(value)) {
                  if (!this.$utils.isFloat(value)) {
                    return Promise.reject('销售价（元）必须为数字');
                  }
                  if (!this.$utils.isFloatGeZero(value)) {
                    return Promise.reject('销售价（元）不允许小于0');
                  }
                  if (!this.$utils.isNumberPrecision(value, 2)) {
                    return Promise.reject('销售价（元）最多允许2位小数');
                  }
                }

                return Promise.resolve();
              },
            },
          ],
          retailPrice: [
            { required: true, message: '请输入零售价（元）' },
            {
              validator: (rule, value) => {
                if (!this.$utils.isEmpty(value)) {
                  if (!this.$utils.isFloat(value)) {
                    return Promise.reject('零售价（元）必须为数字');
                  }
                  if (!this.$utils.isFloatGeZero(value)) {
                    return Promise.reject('零售价（元）不允许小于0');
                  }
                  if (!this.$utils.isNumberPrecision(value, 2)) {
                    return Promise.reject('零售价（元）最多允许2位小数');
                  }
                }

                return Promise.resolve();
              },
            },
          ],
          available: [{ required: true, message: '请选择状态' }],
        },
      };
    },
    created() {
      // 初始化数据
      this.initFormData();
      // 查询数据
      this.loadFormData();
    },
    methods: {
      // 关闭对话框
      closeDialog() {
        this.$utils.closeCurrentPage();
      },
      // 初始化表单数据
      initFormData() {
        this.formData = {};
      },
      // 提交表单事件
      async submit() {
        const that = this;
        let valid = true;

        await this.$refs.form.validate().then((res) => {
          valid = res;
        });

        if (!valid) {
          return;
        }
        if (this.$enums.PRODUCT_TYPE.BUNDLE.equalsCode(this.productType)) {
          // 如果是组合商品
          if (this.$utils.isEmpty(this.productBundles)) {
            this.$msg.createError('组合商品必须包含单品数据！');
            return;
          }

          let salePrice = 0;
          let retailPrice = 0;
          for (let i = 0; i < this.productBundles.length; i++) {
            const bundleProduct = this.productBundles[i];
            if (this.$utils.isEmpty(bundleProduct.productId)) {
              this.$msg.createError('第' + (i + 1) + '行单品不能为空！');
              return;
            }

            if (this.$utils.isEmpty(bundleProduct.bundleNum)) {
              this.$msg.createError('第' + (i + 1) + '行单品包含数量不能为空！');
              return;
            }
            if (!this.$utils.isInteger(bundleProduct.bundleNum)) {
              this.$msg.createError('第' + (i + 1) + '行单品包含数量必须为整数！');
              return;
            }
            if (!this.$utils.isIntegerGtZero(bundleProduct.bundleNum)) {
              this.$msg.createError('第' + (i + 1) + '行单品包含数量必须大于0！');
              return;
            }

            if (this.$utils.isEmpty(bundleProduct.salePrice)) {
              this.$msg.createError('第' + (i + 1) + '行单品销售价（元）不能为空！');
              return;
            }
            if (!this.$utils.isFloat(bundleProduct.salePrice)) {
              this.$msg.createError('第' + (i + 1) + '行单品销售价（元）必须为数字！');
              return;
            }
            if (!this.$utils.isFloatGtZero(bundleProduct.salePrice)) {
              this.$msg.createError('第' + (i + 1) + '行单品销售价（元）必须大于0！');
              return;
            }
            if (!this.$utils.isNumberPrecision(bundleProduct.salePrice, 2)) {
              this.$msg.createError('第' + (i + 1) + '行单品销售价（元）最多允许2位小数！');
              return;
            }

            if (this.$utils.isEmpty(bundleProduct.retailPrice)) {
              this.$msg.createError('第' + (i + 1) + '行单品零售价（元）不能为空！');
              return;
            }
            if (!this.$utils.isFloat(bundleProduct.retailPrice)) {
              this.$msg.createError('第' + (i + 1) + '行单品零售价（元）必须为数字！');
              return;
            }
            if (!this.$utils.isFloatGtZero(bundleProduct.retailPrice)) {
              this.$msg.createError('第' + (i + 1) + '行单品零售价（元）必须大于0！');
              return;
            }
            if (!this.$utils.isNumberPrecision(bundleProduct.retailPrice, 2)) {
              this.$msg.createError('第' + (i + 1) + '行单品零售价（元）最多允许2位小数！');
              return;
            }

            salePrice = this.$utils.add(
              salePrice,
              this.$utils.mul(bundleProduct.bundleNum, bundleProduct.salePrice),
            );
            retailPrice = this.$utils.add(
              retailPrice,
              this.$utils.mul(bundleProduct.bundleNum, bundleProduct.retailPrice),
            );
          }

          if (!this.$utils.eq(salePrice, this.formData.salePrice)) {
            this.$msg.createError(
              '当前所有单品的【包含数量】乘以【销售价（元）】的总和为' +
                salePrice +
                '元，组合商品的销售价为' +
                this.formData.salePrice +
                '元，两个值不相等，请调整！',
            );
            return;
          }

          if (!this.$utils.eq(retailPrice, this.formData.retailPrice)) {
            this.$msg.createError(
              '当前所有单品的【包含数量】乘以【零售价（元）】的总和为' +
                retailPrice +
                '元，组合商品的零售价为' +
                this.formData.retailPrice +
                '元，两个值不相等，请调整！',
            );
            return;
          }
        }
        if (!this.$utils.isEmpty(this.modelorList)) {
          this.modelorList
            .filter((item) => item.isRequired)
            .every((item) => {
              if (that.$utils.isEmpty(item.text)) {
                that.$msg.error(item.name + '不能为空！');
                valid = false;
                return false;
              }

              return true;
            });
        }

        if (!valid) {
          return;
        }

        const properties = this.modelorList
          .filter((item) => !this.$utils.isEmpty(item.text))
          .map((item) => {
            return {
              id: item.id,
              text: this.$utils.isArray(item.text) ? JSON.stringify(item.text) : item.text,
            };
          });

        const params = Object.assign({}, this.formData, {
          properties: properties,
          productBundles: this.productBundles,
        });
        this.loading = true;
        api
          .update(params)
          .then(() => {
            this.$msg.createSuccess('修改成功！');
            this.closeDialog();
          })
          .finally(() => {
            this.loading = false;
          });
      },
      // 查询数据
      loadFormData() {
        this.loading = true;
        api
          .get(this.id)
          .then((data) => {
            this.formData = Object.assign({}, data);
            this.selectCategory(this.formData.categoryId, this.formData);
            this.productType = this.formData.productType;
            this.productBundles = data.productBundles;
          })
          .finally(() => {
            this.loading = false;
          });
      },
      selectCategory(val, formData) {
        this.modelorList = [];
        if (!this.$utils.isEmpty(val)) {
          propertyApi.getModelorByCategory(val).then((res) => {
            const modelorList = res;
            if (formData) {
              const properties = formData.properties || [];
              modelorList.forEach((item) => {
                item.text = (properties.filter((p) => p.id === item.id)[0] || {}).text;
                if (this.$enums.COLUMN_TYPE.MULTIPLE.equalsCode(item.columnType)) {
                  item.text = this.$utils.isEmpty(item.text) ? [] : item.text.split(',');
                }
              });
            }

            modelorList
              .filter((item) => this.$utils.isEmpty(item.text))
              .forEach((item) => {
                if (this.$enums.COLUMN_TYPE.MULTIPLE.equalsCode(item.columnType)) {
                  item.text = [];
                } else {
                  item.text = '';
                }
              });

            this.modelorList = modelorList;
          });
        }
      },
      addRow() {
        this.productBundles.push(this.emptyProduct());
      },
      emptyProduct() {
        return {
          id: this.$utils.uuid(),
          productId: '',
        };
      },
      delRow() {
        const records = this.$refs.grid.getCheckboxRecords();
        if (this.$utils.isEmpty(records)) {
          this.$msg.createError('请选择要删除的商品数据！');
          return;
        }

        this.$msg.createConfirm('是否确定删除选中的商品？').then(() => {
          this.productBundles = this.productBundles.filter((t) => {
            const tmp = records.filter((item) => item.id === t.id);
            return this.$utils.isEmpty(tmp);
          });
        });
      },
    },
  });
</script>
