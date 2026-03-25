<template>
  <a-modal
    v-model:open="visible"
    :mask-closable="false"
    width="40%"
    title="修改"
    :style="{ top: '20px' }"
    :footer="null"
  >
    <div v-if="visible" v-permission="['base-data:product:property:modify']" v-loading="loading">
      <vxe-form
        border
        title-background
        title-width="120"
        ref="form"
        :data="formData"
        :rules="rules"
      >
        <vxe-form-group span="24" title="基础信息" title-bold vertical>
          <vxe-form-item title="编号" field="code" span="12">
            <a-input v-model:value.trim="formData.code" allow-clear />
          </vxe-form-item>
          <vxe-form-item title="名称" field="name" span="12">
            <a-input v-model:value.trim="formData.name" allow-clear />
          </vxe-form-item>
          <vxe-form-item title="是否必填" field="isRequired" span="12">
            <a-select v-model:value="formData.isRequired" allow-clear>
              <a-select-option :value="true">是</a-select-option>
              <a-select-option :value="false">否</a-select-option>
            </a-select>
          </vxe-form-item>
          <vxe-form-item title="字段类型" field="columnType" span="12">
            <a-select v-model:value="formData.columnType" allow-clear :disabled="columnTypeDisabled">
              <a-select-option
                v-for="item in COLUMN_TYPE.values()"
                :key="item.code"
                :value="item.code"
                >{{ item.desc }}</a-select-option
              >
            </a-select>
          </vxe-form-item>
          <vxe-form-item
            :visible="COLUMN_TYPE.CUSTOM.equalsCode(formData.columnType)"
            title="数据类型"
            field="columnDataType"
            span="12"
          >
            <a-select
              v-model:value="formData.columnDataType"
              allow-clear
              :disabled="columnTypeDisabled"
            >
              <a-select-option
                v-for="item in COLUMN_DATA_TYPE.values()"
                :key="item.code"
                :value="item.code"
              >{{ item.desc }}</a-select-option
              >
            </a-select>
          </vxe-form-item>
          <vxe-form-item title="类别" field="propertyType" span="12">
            <a-select v-model:value="formData.propertyType" allow-clear>
              <a-select-option
                v-for="item in PROPERTY_TYPE.values()"
                :key="item.code"
                :value="item.code"
                >{{ item.desc }}</a-select-option
              >
            </a-select>
          </vxe-form-item>
          <vxe-form-item
            :visible="PROPERTY_TYPE.APPOINT.equalsCode(formData.propertyType)"
            title="商品分类"
            span="12"
          >
            <product-category-selector
              v-model:value="formData.categories"
              :multiple="true"
              :only-final="false"
              :disabled="columnTypeDisabled"
            />
          </vxe-form-item>
        </vxe-form-group>
        <vxe-form-group span="24" title="扩展信息" title-bold vertical>
          <vxe-form-item title="备注" field="description" span="24">
            <a-textarea v-model:value.trim="formData.description" />
          </vxe-form-item>
        </vxe-form-group>
        <vxe-form-item span="24">
          <div class="form-modal-footer">
            <a-space>
              <a-button type="primary" :loading="loading" html-type="submit" @click="submit"
                >保存</a-button
              >
              <a-button :loading="loading" @click="closeDialog">取消</a-button>
            </a-space>
          </div>
        </vxe-form-item>
      </vxe-form>
    </div>
  </a-modal>
</template>
<script>
  import { defineComponent } from 'vue';
  import { validCode } from '@/utils/validate';
  import * as api from '@/api/base-data/product/property';
  import { isEmpty } from '@/utils/utils';
  import { createSuccess, createError } from '@/hooks/web/msg';
  import ProductCategorySelector from '@/components/Selector/ProductCategorySelector.vue';
  import { COLUMN_TYPE } from '@/enums/biz/columnType';
  import { COLUMN_DATA_TYPE } from '@/enums/biz/columnDataType';
  import { PROPERTY_TYPE } from '@/enums/biz/propertyType';

  export default defineComponent({
    // 使用组件
    components: {
      ProductCategorySelector,
    },
    props: {
      id: {
        type: String,
        required: true,
      },
    },
    setup() {
      return {
        COLUMN_TYPE,
        COLUMN_DATA_TYPE,
        PROPERTY_TYPE,
      };
    },
    data() {
      return {
        // 是否可见
        visible: false,
        // 字段类型是否禁用
        columnTypeDisabled: false,
        // 是否显示加载框
        loading: false,
        // 表单数据
        formData: {},
        // 表单校验规则
        rules: {
          code: [{ required: true, message: '请输入编号' }, { validator: validCode }],
          name: [{ required: true, message: '请输入名称' }],
          isRequired: [{ required: true, message: '请选择是否必填' }],
          columnType: [{ required: true, message: '请选择字段类型' }],
          columnDataType: [{ required: true, message: '请选择数据类型' }],
          propertyType: [{ required: true, message: '请选择类别' }],
        },
      };
    },
    created() {
      this.initFormData();
    },
    methods: {
      // 打开对话框 由父页面触发
      openDialog() {
        this.visible = true;

        this.$nextTick(() => this.open());
      },
      // 关闭对话框
      closeDialog() {
        this.visible = false;
        this.$emit('close');
      },
      // 初始化表单数据
      initFormData() {
        this.formData = {
          id: '',
          code: '',
          name: '',
          isRequired: '',
          columnType: '',
          columnDataType: '',
          propertyType: '',
          description: '',
          categories: [],
        };
      },
      // 提交表单事件
      submit() {
        if (PROPERTY_TYPE.APPOINT.equalsCode(this.formData.propertyType)) {
          if (isEmpty(this.formData.categories)) {
            createError('请选择商品分类');
            return;
          }
        }
        this.$refs.form.validate().then((errMaps) => {
          if (!errMaps) {
            this.loading = true;
            const params = {
              id: this.formData.id,
              code: this.formData.code,
              name: this.formData.name,
              isRequired: this.formData.isRequired,
              columnType: this.formData.columnType,
              columnDataType: this.formData.columnDataType,
              propertyType: this.formData.propertyType,
              description: this.formData.description,
            };
            if (!isEmpty(this.formData.categories)) {
              params.categoryIds = this.formData.categories;
            }
            api
              .update(params)
              .then(() => {
                createSuccess('修改成功！');
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
        // 初始化数据
        this.initFormData();

        // 查询数据
        this.loadFormData();
      },
      // 查询数据
      loadFormData() {
        this.columnTypeDisabled = false;

        this.loading = true;
        api
          .get(this.id)
          .then((data) => {
            data.categories = data.categories || [];

            this.formData = data;
            this.columnTypeDisabled = COLUMN_TYPE.CUSTOM.equalsCode(this.formData.columnType);
          })
          .finally(() => {
            this.loading = false;
          });
      },
    },
  });
</script>
