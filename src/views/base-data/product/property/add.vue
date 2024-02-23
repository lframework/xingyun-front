<template>
  <a-modal
    v-model:open="visible"
    :mask-closable="false"
    width="40%"
    title="新增"
    :style="{ top: '20px' }"
    :footer="null"
  >
    <div v-if="visible" v-permission="['base-data:product:property:add']" v-loading="loading">
      <a-form
        ref="form"
        :label-col="{ span: 4 }"
        :wrapper-col="{ span: 16 }"
        :model="formData"
        :rules="rules"
      >
        <a-form-item label="编号" name="code">
          <a-input v-model:value.trim="formData.code" allow-clear />
        </a-form-item>
        <a-form-item label="名称" name="name">
          <a-input v-model:value.trim="formData.name" allow-clear />
        </a-form-item>
        <a-form-item label="是否必填" name="isRequired">
          <a-select v-model:value="formData.isRequired" allow-clear>
            <a-select-option :value="true">是</a-select-option>
            <a-select-option :value="false">否</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="字段类型" name="columnType">
          <a-select v-model:value="formData.columnType" allow-clear>
            <a-select-option
              v-for="item in $enums.COLUMN_TYPE.values()"
              :key="item.code"
              :value="item.code"
              >{{ item.desc }}</a-select-option
            >
          </a-select>
        </a-form-item>
        <a-form-item
          v-if="$enums.COLUMN_TYPE.CUSTOM.equalsCode(formData.columnType)"
          label="数据类型"
          name="columnDataType"
        >
          <a-select v-model:value="formData.columnDataType" allow-clear>
            <a-select-option
              v-for="item in $enums.COLUMN_DATA_TYPE.values()"
              :key="item.code"
              :value="item.code"
              >{{ item.desc }}</a-select-option
            >
          </a-select>
        </a-form-item>
        <a-form-item label="类别" name="propertyType">
          <a-select v-model:value="formData.propertyType" allow-clear>
            <a-select-option
              v-for="item in $enums.PROPERTY_TYPE.values()"
              :key="item.code"
              :value="item.code"
              >{{ item.desc }}</a-select-option
            >
          </a-select>
        </a-form-item>
        <a-form-item
          v-if="$enums.PROPERTY_TYPE.APPOINT.equalsCode(formData.propertyType)"
          label="商品类目"
          :required="true"
        >
          <product-category-selector
            v-model:value="formData.categories"
            :multiple="true"
            :only-final="false"
          />
        </a-form-item>
        <a-form-item label="备注" name="description">
          <a-textarea v-model:value.trim="formData.description" />
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
  import { validCode } from '@/utils/validate';
  import * as api from '@/api/base-data/product/property';

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
          code: [{ required: true, message: '请输入编号' }, { validator: validCode }],
          name: [{ required: true, message: '请输入名称' }],
          isRequired: [{ required: true, message: '请选择是否必填' }],
          columnType: [{ required: true, message: '请选择字段类型' }],
          columnDataType: [{ required: true, message: '请选择数据类型' }],
          propertyType: [{ required: true, message: '请选择类别' }],
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
        if (this.$enums.PROPERTY_TYPE.APPOINT.equalsCode(this.formData.propertyType)) {
          if (this.$utils.isEmpty(this.formData.categories)) {
            this.$msg.createError('请选择商品类目');
            return;
          }
        }
        this.$refs.form.validate().then((valid) => {
          if (valid) {
            this.loading = true;
            const params = {
              code: this.formData.code,
              name: this.formData.name,
              isRequired: this.formData.isRequired,
              columnType: this.formData.columnType,
              columnDataType: this.formData.columnDataType,
              propertyType: this.formData.propertyType,
              description: this.formData.description,
            };
            if (!this.$utils.isEmpty(this.formData.categories)) {
              params.categoryIds = this.formData.categories;
            }
            api
              .create(params)
              .then(() => {
                this.$msg.createSuccess('新增成功！');
                // 初始化表单数据
                this.initFormData();
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
    },
  });
</script>
