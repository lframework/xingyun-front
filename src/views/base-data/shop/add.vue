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
            <a-input-group compact>
              <a-input
                v-model:value.trim="formData.code"
                style="width: calc(100% - 75px)"
                allow-clear
              />
              <a-button type="primary" @click="onGenerateCode">点此生成</a-button>
            </a-input-group>
          </vxe-form-item>
          <vxe-form-item title="名称" field="name" span="12">
            <a-input v-model:value="formData.name" allow-clear />
          </vxe-form-item>
          <vxe-form-item title="所属部门" field="deptId" span="24">
            <sys-dept-selector v-model:value="formData.deptId" :only-final="false" />
          </vxe-form-item>
        </vxe-form-group>
        <vxe-form-group span="24" title="扩展信息" title-bold vertical>
          <vxe-form-item title="位置" field="location" span="24">
            <location-map ref="map" v-model:value="location" allow-clear />
          </vxe-form-item>
          <vxe-form-item title="备注" field="description" span="24">
            <a-textarea v-model:value="formData.description" allow-clear />
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
  import LocationMap from '@/components/LocationMap';
  import { validCode } from '@/utils/validate';
  import * as api from '@/api/base-data/shop';
  import { generateCode } from '@/api/components';
  import { createSuccess } from '@/hooks/web/msg';
  import SysDeptSelector from '@/components/Selector/SysDeptSelector.vue';
  import { GENERATE_CODE_TYPE } from '@/enums/biz/generateCodeType';

  export default defineComponent({
    components: {
      LocationMap,
      SysDeptSelector,
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
        this.$refs.form.validate().then((errMaps) => {
          if (!errMaps) {
            this.loading = true;
            const params = Object.assign({}, this.formData, this.location);
            api
              .create(params)
              .then(() => {
                createSuccess('新增成功！');
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
        generateCode(GENERATE_CODE_TYPE.SHOP.code).then((res) => {
          this.formData.code = res;
        });
      },
    },
  });
</script>
