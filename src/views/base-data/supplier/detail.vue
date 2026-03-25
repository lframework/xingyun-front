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
      <vxe-form border title-background title-width="120" :data="formData">
        <vxe-form-group span="24" title="基础信息" title-bold vertical>
          <vxe-form-item title="编号" field="code" span="12" />
          <vxe-form-item title="名称" field="name" span="12" />
          <vxe-form-item title="简码" field="mnemonicCode" span="12" />
          <vxe-form-item title="经营方式" field="manageType" span="12">
            {{ MANAGE_TYPE.getDesc(formData.manageType) }}
          </vxe-form-item>
        </vxe-form-group>
        <vxe-form-group span="24" title="结算信息" title-bold vertical>
          <vxe-form-item title="结算方式" field="settleType" span="8">
            {{ SETTLE_TYPE.getDesc(formData.settleType) }}
          </vxe-form-item>
          <vxe-form-item title="统一社会信用代码" field="creditCode" span="8" />
          <vxe-form-item title="纳税人识别号" field="taxIdentifyNo" span="8" />
          <vxe-form-item title="开户银行" field="bankName" span="8" />
          <vxe-form-item title="户名" field="accountName" span="8" />
          <vxe-form-item title="银行账号" field="accountNo" span="8" />
        </vxe-form-group>
        <vxe-form-group span="24" title="扩展信息" title-bold vertical>
          <vxe-form-item title="联系人" field="contact" span="8" />
          <vxe-form-item title="联系电话" field="telephone" span="8" />
          <vxe-form-item title="电子邮箱" field="email" span="8" />
          <vxe-form-item title="邮编" field="zipCode" span="8" />
          <vxe-form-item title="传真" field="fax" span="8" />
          <vxe-form-item title="送货周期（天）" field="deliveryCycle" span="8" />
          <vxe-form-item title="地区" field="cityName" span="24" />
          <vxe-form-item title="地址" field="address" span="24" />
          <vxe-form-item title="备注" field="description" span="24" />
        </vxe-form-group>
      </vxe-form>
    </div>
  </a-modal>
</template>
<script>
  import { defineComponent } from 'vue';
  import * as api from '@/api/base-data/supplier';
  import { MANAGE_TYPE } from '@/enums/biz/manageType';
  import { SETTLE_TYPE } from '@/enums/biz/settleType';

  export default defineComponent({
    // 使用组件
    components: {},
    props: {
      id: {
        type: String,
        required: true,
      },
    },
    setup() {
      return {
        MANAGE_TYPE,
        SETTLE_TYPE,
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
          cityName: '',
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
