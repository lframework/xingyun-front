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
            <a-form-item label="性别" name="gender">
              <a-select v-model:value="formData.gender" allow-clear>
                <a-select-option
                  v-for="item in $enums.GENDER.values()"
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
            <a-form-item label="会员手机号" name="telephone">
              <a-input v-model:value.trim="formData.telephone" allow-clear />
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="电子邮箱" name="email">
              <a-input v-model:value.trim="formData.email" allow-clear />
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="出生日期" name="birthday">
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
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="16">
          <a-col :span="8">
            <a-form-item label="注册门店" name="shopId">
              <shop-selector v-model:value="formData.shopId" />
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="所属导购" name="guiderId">
              <user-selector v-model:value="formData.guiderId" />
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="入会日期" name="joinDay">
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
  import moment from 'moment';
  import { validCode, isEmail } from '@/utils/validate';
  import * as api from '@/api/base-data/member';

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
          gender: [{ required: true, message: '请选择性别' }],
          email: [
            {
              validator: (rule, value, callback) => {
                if (this.$utils.isEmpty(value) || isEmail(value)) {
                  return Promise.resolve();
                } else {
                  return Promise.reject('邮箱地址格式不正确');
                }
              },
            },
          ],
          joinDay: [{ required: true, message: '请选择入会日期' }],
          available: [{ required: true, message: '请选择状态' }],
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
