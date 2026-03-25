<template>
  <a-modal
    v-model:open="visible"
    :mask-closable="false"
    width="40%"
    title="新增"
    :style="{ top: '20px' }"
    :footer="null"
  >
    <div v-if="visible" v-permission="['base-data:supplier:add']" v-loading="loading">
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
            <a-input
              v-model:value.trim="formData.name"
              allow-clear
              @input="(e) => changeName(e.target.value)"
            />
          </vxe-form-item>
          <vxe-form-item title="简码" field="mnemonicCode" span="12">
            <a-input v-model:value.trim="formData.mnemonicCode" allow-clear />
          </vxe-form-item>
          <vxe-form-item title="经营方式" field="manageType" span="12">
            <a-select v-model:value="formData.manageType" allow-clear>
              <a-select-option
                v-for="item in MANAGE_TYPE.values()"
                :key="item.code"
                :value="item.code"
                >{{ item.desc }}</a-select-option
              >
            </a-select>
          </vxe-form-item>
        </vxe-form-group>
        <vxe-form-group span="24" title="结算信息" title-bold vertical>
          <vxe-form-item title="结算方式" field="settleType" span="8">
            <a-select v-model:value="formData.settleType" allow-clear>
              <a-select-option
                v-for="item in SETTLE_TYPE.values()"
                :key="item.code"
                :value="item.code"
                >{{ item.desc }}</a-select-option
              >
            </a-select>
          </vxe-form-item>
          <vxe-form-item title="统一社会信用代码" field="creditCode" span="8">
            <a-input v-model:value.trim="formData.creditCode" allow-clear />
          </vxe-form-item>
          <vxe-form-item title="纳税人识别号" field="taxIdentifyNo" span="8">
            <a-input v-model:value.trim="formData.taxIdentifyNo" allow-clear />
          </vxe-form-item>
          <vxe-form-item title="开户银行" field="bankName" span="8">
            <a-input v-model:value.trim="formData.bankName" allow-clear />
          </vxe-form-item>
          <vxe-form-item title="户名" field="accountName" span="8">
            <a-input v-model:value.trim="formData.accountName" allow-clear />
          </vxe-form-item>
          <vxe-form-item title="银行账号" field="accountNo" span="8">
            <a-input v-model:value.trim="formData.accountNo" allow-clear />
          </vxe-form-item>
        </vxe-form-group>
        <vxe-form-group span="24" title="扩展信息" title-bold vertical>
          <vxe-form-item title="联系人" field="contact" span="8">
            <a-input v-model:value.trim="formData.contact" allow-clear />
          </vxe-form-item>
          <vxe-form-item title="联系电话" field="telephone" span="8">
            <a-input v-model:value.trim="formData.telephone" allow-clear />
          </vxe-form-item>
          <vxe-form-item title="电子邮箱" field="email" span="8">
            <a-input v-model:value.trim="formData.email" allow-clear />
          </vxe-form-item>
          <vxe-form-item title="邮编" field="zipCode" span="8">
            <a-input v-model:value.trim="formData.zipCode" allow-clear />
          </vxe-form-item>
          <vxe-form-item title="传真" field="fax" span="8">
            <a-input v-model:value.trim="formData.fax" allow-clear />
          </vxe-form-item>
          <vxe-form-item title="送货周期（天）" field="deliveryCycle" span="8">
            <a-input v-model:value="formData.deliveryCycle" allow-clear />
          </vxe-form-item>
          <vxe-form-item title="地区" field="city" span="24">
            <city-selector v-model:value="formData.city" :only-final="true" />
          </vxe-form-item>
          <vxe-form-item title="地址" field="address" span="24">
            <a-input v-model:value.trim="formData.address" allow-clear />
          </vxe-form-item>
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
  import { validCode, isEmail } from '@/utils/validate';
  import * as api from '@/api/base-data/supplier';
  import { generateCode } from '@/api/components';
  import { isEmpty, isInteger, isIntegerGtZero, getCamelCharsUpperCase } from '@/utils/utils';
  import { createSuccess, createConfirm } from '@/hooks/web/msg';
  import CitySelector from '@/components/Selector/CitySelector.vue';
  import { MANAGE_TYPE } from '@/enums/biz/manageType';
  import { SETTLE_TYPE } from '@/enums/biz/settleType';
  import { GENERATE_CODE_TYPE } from '@/enums/biz/generateCodeType';

  export default defineComponent({
    components: {
      CitySelector,
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
        // 表单校验规则
        rules: {
          code: [{ required: true, message: '请输入编号' }, { validator: validCode }],
          name: [{ required: true, message: '请输入名称' }],
          mnemonicCode: [{ required: true, message: '请输入简码' }],
          email: [
            {
              validator({ itemValue }) {
                if (!isEmpty(itemValue) && !isEmail(itemValue)) {
                  return new Error('邮箱地址格式不正确');
                }
              },
            },
          ],
          settleType: [{ required: true, message: '请选择结算方式' }],
          deliveryCycle: [
            {
              validator({ itemValue }) {
                if (isEmpty(itemValue)) {
                  return;
                }

                if (!isInteger(itemValue)) {
                  return new Error('送货周期（天）必须为整数');
                }

                if (!isIntegerGtZero(itemValue)) {
                  return new Error('送货周期（天）必须大于0');
                }
              },
            },
          ],
          manageType: [{ required: true, message: '请选择经营方式' }],
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
          mnemonicCode: '',
          contact: '',
          telephone: '',
          email: '',
          zipCode: '',
          fax: '',
          city: [],
          address: '',
          sendAddress: '',
          deliveryCycle: '',
          manageType: MANAGE_TYPE.DISTRIBUTION.code,
          settleType: '',
          creditCode: '',
          taxIdentifyNo: '',
          bankName: '',
          accountName: '',
          accountNo: '',
          description: '',
        };
      },
      // 提交表单事件
      submit() {
        this.$refs.form.validate().then((errMaps) => {
          if (!errMaps) {
            createConfirm('新增后结算方式不允许修改，请仔细核对结算方式是否正确').then(() => {
              this.loading = true;
              const params = Object.assign({}, this.formData);
              params.cityId = isEmpty(params.city) ? '' : params.city[params.city.length - 1];
              delete params.city;
              api
                .create(params)
                .then(() => {
                  createSuccess('新增成功！');
                  // 初始化表单数据
                  this.initFormData();
                  this.$emit('confirm');
                  this.visible = false;
                })
                .finally(() => {
                  this.loading = false;
                });
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
      // 名称改变
      changeName(e) {
        this.formData.mnemonicCode = getCamelCharsUpperCase(e);
      },
      onGenerateCode() {
        generateCode(GENERATE_CODE_TYPE.SUPPLIER.code).then((res) => {
          this.formData.code = res;
        });
      },
    },
  });
</script>
