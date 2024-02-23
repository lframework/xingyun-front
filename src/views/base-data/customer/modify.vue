<template>
  <a-modal
    v-model:open="visible"
    :mask-closable="false"
    width="40%"
    title="修改"
    :style="{ top: '20px' }"
    :footer="null"
  >
    <div v-if="visible" v-permission="['base-data:customer:modify']" v-loading="loading">
      <a-form ref="form" layout="vertical" :model="formData" :rules="rules">
        <a-row :gutter="16">
          <a-col :span="8">
            <a-form-item label="编号" name="code">
              <a-input v-model:value.trim="formData.code" allow-clear />
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="名称" name="name">
              <a-input
                v-model:value.trim="formData.name"
                allow-clear
                @input="(e) => changeName(e.target.value)"
              />
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="助记码" name="mnemonicCode">
              <a-input v-model:value.trim="formData.mnemonicCode" allow-clear />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="16">
          <a-col :span="8">
            <a-form-item label="联系人" name="contact">
              <a-input v-model:value.trim="formData.contact" allow-clear />
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="联系电话" name="telephone">
              <a-input v-model:value.trim="formData.telephone" allow-clear />
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="电子邮箱" name="email">
              <a-input v-model:value.trim="formData.email" allow-clear />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="16">
          <a-col :span="8">
            <a-form-item label="邮编" name="zipCode">
              <a-input v-model:value.trim="formData.zipCode" allow-clear />
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="传真" name="fax">
              <a-input v-model:value.trim="formData.fax" allow-clear />
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="地区" name="city">
              <city-selector v-model:value="formData.city" :only-final="true" />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="16">
          <a-col :span="8">
            <a-form-item label="地址" name="address">
              <a-input v-model:value.trim="formData.address" allow-clear />
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="结账方式" name="settleType">
              <a-select v-model:value="formData.settleType" disabled>
                <a-select-option
                  v-for="item in $enums.SETTLE_TYPE.values()"
                  :key="item.code"
                  :value="item.code"
                  >{{ item.desc }}</a-select-option
                >
              </a-select>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="16">
          <a-col :span="8">
            <a-form-item label="统一社会信用代码" name="creditCode">
              <a-input v-model:value.trim="formData.creditCode" allow-clear />
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="纳税人识别号" name="taxIdentifyNo">
              <a-input v-model:value.trim="formData.taxIdentifyNo" allow-clear />
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="开户银行" name="bankName">
              <a-input v-model:value.trim="formData.bankName" allow-clear />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="16">
          <a-col :span="8">
            <a-form-item label="户名" name="accountName">
              <a-input v-model:value.trim="formData.accountName" allow-clear />
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="银行账号" name="accountNo">
              <a-input v-model:value.trim="formData.accountNo" allow-clear />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="16">
          <a-col :span="24">
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
  import { validCode, isEmail } from '@/utils/validate';
  import * as api from '@/api/base-data/customer';

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
        // 表单校验规则
        rules: {
          code: [{ required: true, message: '请输入编号' }, { validator: validCode }],
          name: [{ required: true, message: '请输入名称' }],
          mnemonicCode: [{ required: true, message: '请输入助记码' }],
          email: [
            {
              validator: (rule, value) => {
                if (this.$utils.isEmpty(value) || isEmail(value)) {
                  return Promise.resolve();
                } else {
                  return Promise.reject('邮箱地址格式不正确');
                }
              },
            },
          ],
          settleType: [{ required: true, message: '请选择结账方式' }],
          available: [{ required: true, message: '请选择状态' }],
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
          mnemonicCode: '',
          contact: '',
          telephone: '',
          email: '',
          zipCode: '',
          fax: '',
          city: [],
          address: '',
          receiver: '',
          receiveTelephone: '',
          receiveAddress: '',
          settleType: '',
          creditCode: '',
          taxIdentifyNo: '',
          bankName: '',
          accountName: '',
          accountNo: '',
          available: '',
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
              .update(params)
              .then(() => {
                this.$msg.createSuccess('修改成功！');
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
      // 名称改变
      changeName(e) {
        if (this.$utils.isEmpty(this.formData.mnemonicCode)) {
          this.formData.mnemonicCode = this.$utils.getCamelCharsUpperCase(e);
        }
      },
    },
  });
</script>
