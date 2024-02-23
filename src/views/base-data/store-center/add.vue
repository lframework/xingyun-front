<template>
  <a-modal
    v-model:open="visible"
    :mask-closable="false"
    width="40%"
    title="新增"
    :style="{ top: '20px' }"
    :footer="null"
  >
    <div v-if="visible" v-permission="['base-data:store-center:add']" v-loading="loading">
      <a-form ref="form" layout="vertical" :model="formData" :rules="rules">
        <a-row :gutter="16">
          <a-col :span="8">
            <a-form-item label="编号" name="code">
              <a-input v-model:value.trim="formData.code" allow-clear />
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="名称" name="name">
              <a-input v-model:value.trim="formData.name" allow-clear />
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="联系人" name="contact">
              <a-input v-model:value.trim="formData.contact" allow-clear />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="16">
          <a-col :span="8">
            <a-form-item label="联系人手机号码" name="telephone">
              <a-input v-model:value.trim="formData.telephone" allow-clear />
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="地区" name="city">
              <city-selector v-model:value="formData.city" :only-final="true" />
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="仓库地址" name="address">
              <a-input v-model:value.trim="formData.address" allow-clear />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="16">
          <a-col :span="8">
            <a-form-item label="仓库人数" name="peopleNum">
              <a-input v-model:value="formData.peopleNum" allow-clear />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="16">
          <a-col :span="24">
            <a-form-item label="备注" name="description">
              <a-textarea v-model:value.trim="formData.description" />
            </a-form-item>
          </a-col>
        </a-row>
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
  import * as api from '@/api/base-data/store-center';

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
          peopleNum: [
            {
              validator: (rule, value) => {
                if (this.$utils.isEmpty(value) || this.$utils.isIntegerGeZero(value)) {
                  return Promise.resolve();
                } else {
                  if (!this.$utils.isInteger(value)) {
                    return Promise.reject('仓库人数必须为整数');
                  }

                  if (!this.$utils.isIntegerGeZero(value)) {
                    return Promise.reject('仓库人数不允许小于0');
                  }

                  return Promise.resolve();
                }
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
          contact: '',
          telephone: '',
          city: [],
          address: '',
          peopleNum: '',
          description: '',
        };
      },
      // 提交表单事件
      submit() {
        this.$refs.form.validate().then((valid) => {
          if (valid) {
            this.loading = true;
            const params = Object.assign({}, this.formData);
            params.cityId = this.$utils.isEmpty(params.city)
              ? ''
              : params.city[params.city.length - 1];
            delete params.city;
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
