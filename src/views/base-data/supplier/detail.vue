<template>
  <a-modal
    v-model:open="visible"
    :mask-closable="false"
    width="40%"
    title="查看"
    :style="{ top: '20px' }"
    :footer="null"
  >
    <div v-if="visible" v-permission="['base-data:supplier:query']" v-loading="loading">
      <a-descriptions :column="4" bordered>
        <a-descriptions-item label="编号" :span="2">
          {{ formData.code }}
        </a-descriptions-item>
        <a-descriptions-item label="名称" :span="2">
          {{ formData.name }}
        </a-descriptions-item>
        <a-descriptions-item label="助记码" :span="2">
          {{ formData.mnemonicCode }}
        </a-descriptions-item>
        <a-descriptions-item label="联系人" :span="2">
          {{ formData.contact }}
        </a-descriptions-item>
        <a-descriptions-item label="联系电话" :span="2">
          {{ formData.telephone }}
        </a-descriptions-item>
        <a-descriptions-item label="电子邮箱" :span="2">
          {{ formData.email }}
        </a-descriptions-item>
        <a-descriptions-item label="邮编" :span="2">
          {{ formData.zipCode }}
        </a-descriptions-item>
        <a-descriptions-item label="传真" :span="2">
          {{ formData.fax }}
        </a-descriptions-item>
        <a-descriptions-item label="地区" :span="2">
          {{ formData.cityName }}
        </a-descriptions-item>
        <a-descriptions-item label="地址" :span="2">
          {{ formData.address }}
        </a-descriptions-item>
        <a-descriptions-item label="送货周期（天）" :span="2">
          {{ formData.deliveryCycle }}
        </a-descriptions-item>
        <a-descriptions-item label="经营方式" :span="2">
          {{ $enums.MANAGE_TYPE.getDesc(formData.manageType) }}
        </a-descriptions-item>
        <a-descriptions-item label="结账方式" :span="2">
          {{ $enums.SETTLE_TYPE.getDesc(formData.settleType) }}
        </a-descriptions-item>
        <a-descriptions-item label="统一社会信用代码" :span="2">
          {{ formData.creditCode }}
        </a-descriptions-item>
        <a-descriptions-item label="纳税人识别号" :span="2">
          {{ formData.taxIdentifyNo }}
        </a-descriptions-item>
        <a-descriptions-item label="开户银行" :span="2">
          {{ formData.bankName }}
        </a-descriptions-item>
        <a-descriptions-item label="户名" :span="2">
          {{ formData.accountName }}
        </a-descriptions-item>
        <a-descriptions-item label="银行账号" :span="2">
          {{ formData.accountNo }}
        </a-descriptions-item>
        <a-descriptions-item label="状态" :span="4">
          <available-tag :available="formData.available" />
        </a-descriptions-item>
        <a-descriptions-item label="备注" :span="4">
          {{ formData.description }}
        </a-descriptions-item>
      </a-descriptions>
    </div>
  </a-modal>
</template>
<script>
  import { defineComponent } from 'vue';
  import * as api from '@/api/base-data/supplier';

  export default defineComponent({
    // 使用组件
    components: {},

    props: {
      id: {
        type: String,
        required: true,
      },
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
          id: '',
          code: '',
          name: '',
          mnemonicCode: '',
          contact: '',
          telephone: '',
          email: '',
          zipCode: '',
          fax: '',
          cityId: '',
          address: '',
          sendAddress: '',
          deliveryCycle: '',
          manageType: '',
          settleType: '',
          creditCode: '',
          taxIdentifyNo: '',
          bankName: '',
          accountName: '',
          accountNo: '',
          description: '',
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
          })
          .finally(() => {
            this.loading = false;
          });
      },
    },
  });
</script>
