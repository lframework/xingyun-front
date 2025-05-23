<template>
  <a-modal
    v-model:open="visible"
    :mask-closable="false"
    width="40%"
    title="新增"
    :style="{ top: '20px' }"
    :footer="null"
  >
    <div v-if="visible" v-permission="['base-data:shop:add']" v-loading="loading">
      <a-form
        ref="form"
        :label-col="{ span: 4 }"
        :wrapper-col="{ span: 16 }"
        :model="formData"
        :rules="rules"
      >
        <a-form-item label="编号" name="code">
          <a-input-group compact>
            <a-input
              v-model:value.trim="formData.code"
              style="width: calc(100% - 75px)"
              allow-clear
            />
            <a-button type="primary" @click="onGenerateCode">点此生成</a-button>
          </a-input-group>
        </a-form-item>
        <a-form-item label="名称" name="name">
          <a-input v-model:value="formData.name" allow-clear />
        </a-form-item>
        <a-form-item label="所属部门" name="deptId">
          <sys-dept-selector v-model:value="formData.deptId" :only-final="false" />
        </a-form-item>
        <a-form-item label="位置" name="location">
          <location-map ref="map" v-model:value="location" allow-clear />
        </a-form-item>
        <a-form-item label="备注" name="description">
          <a-textarea v-model:value="formData.description" allow-clear />
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
  import LocationMap from '@/components/LocationMap';
  import { validCode } from '@/utils/validate';
  import * as api from '@/api/base-data/shop';
  import { generateCode } from '@/api/components';

  export default defineComponent({
    components: {
      LocationMap,
    },
    data() {
      return {
        // 是否可见
        visible: false,
        // 是否显示加载框
        loading: false,
        // 表单数据
        formData: {},
        // 位置数据
        location: {},
        // 表单校验规则
        rules: {
          code: [{ required: true, message: '请输入编号' }, { validator: validCode }],
          name: [{ required: true, message: '请输入名称' }],
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
          deptId: '',
          lng: '',
          lat: '',
          description: '',
        };
        this.location = {};
      },
      // 提交表单事件
      submit() {
        this.$refs.form.validate().then((valid) => {
          if (valid) {
            this.loading = true;
            const params = Object.assign({}, this.formData, this.location);
            api
              .create(params)
              .then(() => {
                this.$msg.createSuccess('新增成功！');
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

        this.onGenerateCode();
      },
      onGenerateCode() {
        generateCode(this.$enums.GENERATE_CODE_TYPE.SHOP.code).then((res) => {
          this.formData.code = res;
        });
      },
    },
  });
</script>
