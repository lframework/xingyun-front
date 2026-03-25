<template>
  <a-modal
    v-model:open="visible"
    :mask-closable="false"
    width="40%"
    title="查看"
    :style="{ top: '20px' }"
    :footer="null"
  >
    <div v-if="visible" v-permission="['base-data:address:query']" v-loading="loading">
      <vxe-form border title-background title-width="80" ref="form" :data="formData">
        <vxe-form-group span="24" title="基础信息" title-bold vertical>
          <vxe-form-item title="实体类型" field="entityType" span="24">
            {{ ADDRESS_ENTITY_TYPE.getDesc(formData.entityType) }}
          </vxe-form-item>
          <vxe-form-item title="实体" field="entityName" span="24" />
          <vxe-form-item title="地址类型" field="addressType" span="24">
            {{ ADDRESS_TYPE.getDesc(formData.addressType) }}
          </vxe-form-item>
          <vxe-form-item title="姓名" field="name" span="12" />
          <vxe-form-item title="手机号" field="telephone" span="12" />
        </vxe-form-group>
        <vxe-form-group span="24" title="扩展信息" title-bold vertical>
          <vxe-form-item title="地区" field="areaName" span="24" />
          <vxe-form-item title="详细地址" field="address" span="24" />
          <vxe-form-item title="默认地址" field="isDefault" span="24">
            {{ formData.isDefault ? '是' : '否' }}
          </vxe-form-item>
        </vxe-form-group>
      </vxe-form>
    </div>
  </a-modal>
</template>
<script>
  import { defineComponent } from 'vue';
  import * as api from '@/api/base-data/address';
  import { ADDRESS_ENTITY_TYPE } from '@/enums/biz/addressEntityType';
  import { ADDRESS_TYPE } from '@/enums/biz/addressType';

  export default defineComponent({
    components: {},
    props: {
      id: {
        type: String,
        required: true,
      },
    },
    setup() {
      return {
        ADDRESS_ENTITY_TYPE,
        ADDRESS_TYPE,
      };
    },
    data() {
      return {
        // 是否可见
        visible: false,
        // 是否显示加载框
        loading: false,
        // 表单数据
        formData: {},
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
          entityType: '',
          entityName: '',
          addressType: '',
          name: '',
          telephone: '',
          areaName: '',
          address: '',
          isDefault: false,
        };
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
        this.loading = true;
        api
          .get(this.id)
          .then((data) => {
            this.formData = data;
            this.formData.areaName =
              this.formData.provinceName +
              ' / ' +
              this.formData.cityName +
              ' / ' +
              this.formData.districtName;
          })
          .finally(() => {
            this.loading = false;
          });
      },
    },
  });
</script>
