<template>
  <a-modal v-model="visible" :mask-closable="false" width="40%" title="新增" :dialog-style="{ top: '20px' }" :footer="null">
    <div v-if="visible" v-permission="['base-data:member:add']" v-loading="loading">
      <a-form-model ref="form" :label-col="{span: 4}" :wrapper-col="{span: 16}" :model="formData" :rules="rules">
        <a-form-model-item label="编号" prop="code">
          <a-input v-model.trim="formData.code" allow-clear />
        </a-form-model-item>
        <a-form-model-item label="名称" prop="name">
          <a-input v-model.trim="formData.name" allow-clear />
        </a-form-model-item>
        <a-form-model-item label="性别" prop="gender">
          <a-select v-model="formData.gender" allow-clear>
            <a-select-option v-for="item in $enums.GENDER.values()" :key="item.code" :value="item.code">{{ item.desc }}</a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item label="会员手机号" prop="telephone">
          <a-input v-model.trim="formData.telephone" allow-clear />
        </a-form-model-item>
        <a-form-model-item label="电子邮箱" prop="email">
          <a-input v-model.trim="formData.email" allow-clear />
        </a-form-model-item>
        <a-form-model-item label="出生日期" prop="birthday">
          <a-date-picker
            v-model="formData.birthday"
            placeholder=""
            value-format="YYYY-MM-DD"
            :disabled-date="(current) => {
              return current && current > moment().endOf('day');
            }"
          />
        </a-form-model-item>
        <a-form-model-item label="注册门店" prop="shop">
          <shop-selector v-model="formData.shop" />
        </a-form-model-item>
        <a-form-model-item label="所属导购" prop="guider">
          <user-selector v-model="formData.guider" />
        </a-form-model-item>
        <a-form-model-item label="入会日期" prop="joinDay">
          <a-date-picker
            v-model="formData.joinDay"
            placeholder=""
            value-format="YYYY-MM-DD"
            :disabled-date="(current) => {
              return current && current > moment().endOf('day');
            }"
          />
        </a-form-model-item>
        <a-form-model-item label="备注" prop="description">
          <a-textarea v-model.trim="formData.description" />
        </a-form-model-item>
        <div class="form-modal-footer">
          <a-space>
            <a-button type="primary" :loading="loading" html-type="submit" @click="submit">保存</a-button>
            <a-button :loading="loading" @click="closeDialog">取消</a-button>
          </a-space>
        </div>
      </a-form-model>
    </div>
  </a-modal>
</template>
<script>
import * as constants from './constants'
import moment from 'moment'
import { validCode } from '@/utils/validate'
import ShopSelector from '@/components/Selector/ShopSelector'
import UserSelector from '@/components/Selector/UserSelector'

export default {
  components: {
    ShopSelector, UserSelector
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
        code: [
          { required: true, message: '请输入编号' },
          { validator: validCode }
        ],
        name: [
          { required: true, message: '请输入名称' }
        ],
        gender: [
          { required: true, message: '请选择性别' }
        ],
        email: [
          { validator: constants.validEmail }
        ],
        joinDay: [
          { required: true, message: '请选择入会日期' }
        ]
      }
    }
  },
  computed: {
    moment() {
      return moment
    }
  },
  created() {
    // 初始化表单数据
    this.initFormData()
  },
  methods: {
    // 打开对话框 由父页面触发
    openDialog() {
      this.visible = true

      this.open()
    },
    // 关闭对话框
    closeDialog() {
      this.visible = false
      this.$emit('close')
    },
    // 初始化表单数据
    initFormData() {
      this.formData = {
        code: '',
        name: '',
        gender: this.$enums.GENDER.MAN.code,
        telephone: '',
        email: '',
        shop: {},
        guider: {},
        birthday: '',
        joinDay: this.$utils.formatDate(this.$utils.getCurrentDate()),
        description: ''
      }
    },
    // 提交表单事件
    submit() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.loading = true
          const params = Object.assign({}, this.formData)
          params.shopId = params.shop.id
          params.guiderId = params.guider.id

          delete params.shop
          delete params.guider

          this.$api.baseData.member.create(params).then(() => {
            this.$msg.success('新增成功！')
            // 初始化表单数据
            this.initFormData()
            this.$emit('confirm')
            this.visible = false
          }).finally(() => {
            this.loading = false
          })
        }
      })
    },
    // 页面显示时触发
    open() {
      // 初始化表单数据
      this.initFormData()
    }
  }
}
</script>
