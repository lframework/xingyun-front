<template>
  <a-modal v-model="visible" :mask-closable="false" width="40%" title="修改" :dialog-style="{ top: '20px' }" :footer="null">
    <div v-if="visible" v-permission="['base-data:product:brand:modify']" v-loading="loading">
      <a-form-model ref="form" :label-col="{span: 4}" :wrapper-col="{span: 16}" :model="formData" :rules="rules">
        <a-form-model-item label="编号" prop="code">
          <a-input v-model.trim="formData.code" allow-clear />
        </a-form-model-item>
        <a-form-model-item label="名称" prop="name">
          <a-input v-model.trim="formData.name" allow-clear />
        </a-form-model-item>
        <a-form-model-item label="简称" prop="shortName">
          <a-input v-model.trim="formData.shortName" allow-clear />
        </a-form-model-item>
        <a-form-model-item label="Logo" prop="logo">
          <a-upload
            list-type="picture-card"
            :show-upload-list="false"
            :custom-request="uploadLogo"
          >
            <img v-if="!$utils.isEmpty(formData.logo)" :src="formData.logo" class="img-uploader-container">
            <div v-else>
              <a-icon :type="loading ? 'loading' : 'plus'" />
              <div class="ant-upload-text">
                上传
              </div>
            </div>
          </a-upload>
        </a-form-model-item>
        <a-form-model-item label="简介" prop="introduction">
          <a-textarea v-model.trim="formData.introduction" />
        </a-form-model-item>
        <a-form-model-item label="状态" prop="available">
          <a-select v-model="formData.available" allow-clear>
            <a-select-option v-for="item in $enums.AVAILABLE.values()" :key="item.code" :value="item.code">{{ item.desc }}</a-select-option>
          </a-select>
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
import { validCode } from '@/utils/validate'

export default {
  // 使用组件
  components: {
  },

  props: {
    id: {
      type: String,
      required: true
    }
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
        available: [
          { required: true, message: '请选择状态' }
        ]
      }
    }
  },
  created() {
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
        id: '',
        code: '',
        name: '',
        shortName: '',
        logo: '',
        introduction: '',
        available: '',
        description: ''
      }
    },
    // 提交表单事件
    submit() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.loading = true
          this.$api.baseData.product.brand.modify(this.formData).then(() => {
            this.$msg.success('修改成功！')
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
      // 初始化数据
      this.initFormData()

      // 查询数据
      this.loadFormData()
    },
    // 查询数据
    async loadFormData() {
      this.loading = true
      await this.$api.baseData.product.brand.get(this.id).then(data => {
        this.formData = data
      }).finally(() => {
        this.loading = false
      })
    },
    uploadLogo(e) {
      this.loading = true
      this.$api.baseData.product.brand.uploadLogo({
        file: e.file
      }).then(res => {
        this.formData.logo = res
      }).finally(() => {
        this.loading = false
      })
    }
  }
}
</script>
