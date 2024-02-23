<template>
  <a-modal
    v-model:open="visible"
    :mask-closable="false"
    width="40%"
    title="新增"
    :style="{ top: '20px' }"
    :footer="null"
  >
    <div v-if="visible" v-permission="['stock:take:plan:add']" v-loadind="loading">
      <a-form
        ref="form"
        :label-col="{ span: 4 }"
        :wrapper-col="{ span: 16 }"
        :model="formData"
        :rules="rules"
      >
        <a-form-item label="仓库" name="scId">
          <store-center-selector v-model:value="formData.scId" />
        </a-form-item>
        <a-form-item label="盘点类别" name="takeType">
          <a-select v-model:value="formData.takeType" @change="changeTakeType">
            <a-select-option
              v-for="item in $enums.TAKE_STOCK_PLAN_TYPE.values()"
              :key="item.code"
              :value="item.code"
              >{{ item.desc }}</a-select-option
            >
          </a-select>
        </a-form-item>
        <a-form-item
          v-if="$enums.TAKE_STOCK_PLAN_TYPE.CATEGORY.equalsCode(formData.takeType)"
          label="类目"
          required
          name="category"
        >
          <product-category-selector
            v-model:value="formData.category"
            :only-final="false"
            :multiple="true"
          />
        </a-form-item>
        <a-form-item
          v-if="$enums.TAKE_STOCK_PLAN_TYPE.BRAND.equalsCode(formData.takeType)"
          label="品牌"
          required
          name="brand"
        >
          <product-brand-selector v-model:value="formData.brand" :multiple="true" />
        </a-form-item>
        <a-form-item label="备注" name="description">
          <a-textarea v-model:value.trim="formData.description" maxlength="200" />
        </a-form-item>
        <div class="form-modal-footer">
          <a-space>
            <a-button type="primary" :loading="loading" html-type="submit" @click="submit"
              >保存</a-button
            >
            <a-button :loading="loading" @click="closeDialog">取消</a-button>
          </a-space>
        </div>
      </a-form>
    </div>
  </a-modal>
</template>
<script>
  import { defineComponent } from 'vue';
  import * as api from '@/api/sc/stock/take/plan';

  export default defineComponent({
    components: {},
    data() {
      return {
        // 是否可见
        visible: false,
        // 是否显示加载框
        loading: false,
        // 表单数据
        formData: {},
        // 表单校验规则
        rules: {
          scId: [{ required: true, message: '请选择仓库' }],
          takeType: [{ required: true, message: '请选择盘点类别' }],
          category: [
            {
              validator: (rule, value, callback) => {
                if (!this.$enums.TAKE_STOCK_PLAN_TYPE.CATEGORY.equalsCode(this.formData.takeType)) {
                  return callback();
                }

                if (this.$utils.isEmpty(value)) {
                  return callback(new Error('请选择商品类目'));
                }

                return callback();
              },
            },
          ],
          brand: [
            {
              validator: (rule, value, callback) => {
                if (!this.$enums.TAKE_STOCK_PLAN_TYPE.BRAND.equalsCode(this.formData.takeType)) {
                  return callback();
                }

                if (this.$utils.isEmpty(value)) {
                  return callback(new Error('请选择商品品牌'));
                }

                return callback();
              },
            },
          ],
        },
      };
    },
    computed: {},
    created() {
      // 初始化表单数据
      this.initFormData();
    },
    methods: {
      // 打开对话框 由父页面触发
      openDialog() {
        this.visible = true;

        this.open();
      },
      // 关闭对话框
      closeDialog() {
        this.visible = false;
        this.$emit('close');
      },
      // 初始化表单数据
      initFormData() {
        this.formData = {
          scId: '',
          takeType: this.$enums.TAKE_STOCK_PLAN_TYPE.ALL.code,
          description: '',
          category: [],
          brand: [],
        };
      },
      // 提交表单事件
      submit() {
        this.$refs.form.validate().then((valid) => {
          if (valid) {
            const params = {
              scId: this.formData.scId,
              takeType: this.formData.takeType,
              description: this.formData.description,
            };

            if (this.$enums.TAKE_STOCK_PLAN_TYPE.CATEGORY.equalsCode(this.formData.takeType)) {
              params.bizIds = this.formData.category;
            } else if (this.$enums.TAKE_STOCK_PLAN_TYPE.BRAND.equalsCode(this.formData.takeType)) {
              params.bizIds = this.formData.brand;
            }

            this.loading = true;
            api
              .create(params)
              .then(() => {
                this.$msg.createSuccess('盘点任务生成！');
                this.$emit('confirm');
                this.visible = false;
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
      changeTakeType() {
        this.formData.category = [];
        this.formData.brand = [];
      },
    },
  });
</script>
