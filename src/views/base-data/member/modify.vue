<template>
  <a-modal
    v-model:open="visible"
    :mask-closable="false"
    width="40%"
    title="修改"
    :style="{ top: '20px' }"
    :footer="null"
  >
    <div v-if="visible" v-permission="['base-data:member:modify']" v-loading="loading">
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
          <vxe-form-item title="性别" field="gender" span="12">
            <a-select v-model:value="formData.gender" allow-clear>
              <a-select-option
                v-for="item in GENDER.values()"
                :key="item.code"
                :value="item.code"
                >{{ item.desc }}</a-select-option
              >
            </a-select>
          </vxe-form-item>
          <vxe-form-item title="入会日期" field="joinDay" span="12">
            <a-date-picker
              v-model:value="formData.joinDay"
              placeholder=""
              value-format="YYYY-MM-DD"
              :disabled-date="
                (current) => {
                  return current && current > moment().endOf('day');
                }
              "
            />
          </vxe-form-item>
        </vxe-form-group>
        <vxe-form-group span="24" title="扩展信息" title-bold vertical>
          <vxe-form-item title="会员手机号" field="telephone" span="8">
            <a-input v-model:value.trim="formData.telephone" allow-clear />
          </vxe-form-item>
          <vxe-form-item title="电子邮箱" field="email" span="8">
            <a-input v-model:value.trim="formData.email" allow-clear />
          </vxe-form-item>
          <vxe-form-item title="出生日期" field="birthday" span="8">
            <a-date-picker
              v-model:value="formData.birthday"
              placeholder=""
              value-format="YYYY-MM-DD"
              :disabled-date="
                (current) => {
                  return current && current > moment().endOf('day');
                }
              "
            />
          </vxe-form-item>
          <vxe-form-item title="注册门店" field="shopId" span="8">
            <shop-selector v-model:value="formData.shopId" />
          </vxe-form-item>
          <vxe-form-item title="所属导购" field="guiderId" span="8">
            <user-selector v-model:value="formData.guiderId" />
          </vxe-form-item>
          <vxe-form-item title="备注" field="description" span="24">
            <a-textarea v-model:value.trim="formData.description" />
          </vxe-form-item>
        </vxe-form-group>
        <vxe-form-item span="24">
          <div class="form-modal-footer">
            <a-space>
              <a-button type="primary" :loading="loading" @click="submit">保存</a-button>
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
  import moment from 'moment';
  import { validCode, isEmail } from '@/utils/validate';
  import * as api from '@/api/base-data/member';
  import { isEmpty } from '@/utils/utils';
  import { createSuccess } from '@/hooks/web/msg';
  import ShopSelector from '@/components/Selector/ShopSelector.vue';
  import UserSelector from '@/components/Selector/UserSelector.vue';
  import { GENDER } from '@/enums/biz/gender';

  export default defineComponent({
    // 使用组件
    components: {
      ShopSelector,
      UserSelector,
    },
    props: {
      id: {
        type: String,
        required: true,
      },
    },
    setup() {
      return {
        GENDER,
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
          gender: [{ required: true, message: '请选择性别' }],
          email: [
            {
              validator({ itemValue }) {
                if (!isEmpty(itemValue) && !isEmail(itemValue)) {
                  return new Error('邮箱地址格式不正确');
                }
              },
            },
          ],
          joinDay: [{ required: true, message: '请选择入会日期' }],
        },
      };
    },
    computed: {
      moment() {
        return moment;
      },
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
          gender: '',
          telephone: '',
          email: '',
          shopId: '',
          guiderId: '',
          birthday: '',
          joinDay: '',
          description: '',
        };
      },
      // 提交表单事件
      submit() {
        this.$refs.form.validate().then((errMaps) => {
          if (!errMaps) {
            this.loading = true;
            const params = Object.assign({}, this.formData);

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
