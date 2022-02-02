<template>
  <el-dialog :visible.sync="visible" :close-on-click-modal="false" width="40%" title="新增" top="5vh" @open="open">
    <div v-if="visible" v-permission="['base-data:store-center:add']">
      <el-form ref="form" v-loading="loading" label-width="120px" title-align="right" :model="formData" :rules="rules">
        <el-form-item label="编号" prop="code">
          <el-input v-model.trim="formData.code" maxlength="20" show-word-limit clearable />
        </el-form-item>
        <el-form-item label="名称" prop="name">
          <el-input v-model.trim="formData.name" maxlength="20" show-word-limit clearable />
        </el-form-item>
        <el-form-item label="联系人" prop="contact">
          <el-input v-model.trim="formData.contact" maxlength="100" show-word-limit clearable />
        </el-form-item>
        <el-form-item label="联系人手机号码" prop="telephone">
          <el-input v-model.trim="formData.telephone" maxlength="20" show-word-limit clearable />
        </el-form-item>
        <el-form-item label="地区" prop="cityId">
          <city-selector v-model="formData.cityId" :only-final="true" />
        </el-form-item>
        <el-form-item label="仓库地址" prop="address">
          <el-input v-model.trim="formData.address" maxlength="200" show-word-limit clearable />
        </el-form-item>
        <el-form-item label="仓库人数" prop="peopleNum">
          <el-input v-model="formData.peopleNum" clearable />
        </el-form-item>
        <el-form-item label="备注" prop="description">
          <el-input v-model.trim="formData.description" maxlength="200" show-word-limit type="textarea" resize="none" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submit">保存</el-button>
          <el-button @click="closeDialog">取消</el-button>
        </el-form-item>
      </el-form>
    </div>
  </el-dialog>
</template>
<script>
import * as constants from './constants'
import CitySelector from '@/components/Selector/CitySelector'
export default {
  components: {
    CitySelector
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
          { required: true, message: '请输入编号' }
        ],
        name: [
          { required: true, message: '请输入名称' }
        ],
        peopleNum: [
          { validator: constants.validPeopleNum }
        ]
      }
    }
  },
  computed: {
  },
  created() {
    // 初始化表单数据
    this.initFormData()
  },
  methods: {
    // 打开对话框 由父页面触发
    openDialog() {
      this.visible = true
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
        contact: '',
        telephone: '',
        cityId: '',
        address: '',
        peopleNum: '',
        description: ''
      }
    },
    // 提交表单事件
    submit() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.loading = true
          this.$api.baseData.storeCenter.create(this.formData).then(() => {
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
