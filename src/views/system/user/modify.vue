<template>
  <el-dialog :visible.sync="visible" :close-on-click-modal="false" append-to-body width="40%" title="修改" top="5vh" @open="open">
    <div v-if="visible" v-permission="['system:user:modify']">
      <el-form ref="form" v-loading="loading" label-width="100px" title-align="right" :model="formData" :rules="rules">
        <el-form-item label="编号" prop="code">
          <el-input v-model.trim="formData.code" clearable />
        </el-form-item>
        <el-form-item label="用户名" prop="username">
          <el-input v-model.trim="formData.username" clearable />
        </el-form-item>
        <el-form-item label="姓名" prop="name">
          <el-input v-model.trim="formData.name" clearable />
        </el-form-item>
        <el-form-item label="部门" prop="dept">
          <sys-dept-selector v-model="formData.depts" :only-final="true" :multiple="true" />
        </el-form-item>
        <el-form-item label="角色" prop="role">
          <sys-role-selector v-model="formData.roles" :multiple="true" />
        </el-form-item>
        <el-form-item label="岗位" prop="position">
          <sys-position-selector v-model="formData.positions" :multiple="true" />
        </el-form-item>
        <el-form-item v-if="!formData.modifyPassword" label="更新密码">
          <el-checkbox v-model="formData.modifyPassword" />
        </el-form-item>
        <el-form-item v-show="formData.modifyPassword" label="密码" prop="password">
          <el-input v-model="formData.password" type="password" show-password />
        </el-form-item>
        <el-form-item label="性别" prop="gender">
          <el-select v-model="formData.gender">
            <el-option v-for="item in $enums.GENDER.values()" :key="item.code" :label="item.desc" :value="item.code" />
          </el-select>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model.trim="formData.email" clearable />
        </el-form-item>
        <el-form-item label="联系电话" prop="telephone">
          <el-input v-model.trim="formData.telephone" clearable />
        </el-form-item>
        <el-form-item label="状态" prop="available">
          <el-select v-model="formData.available">
            <el-option v-for="item in $enums.AVAILABLE.values()" :key="item.code" :label="item.desc" :value="item.code" />
          </el-select>
        </el-form-item>
        <el-form-item label="备注" prop="description">
          <el-input v-model.trim="formData.description" type="textarea" resize="none" />
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
import SysPositionSelector from '@/components/Selector/SysPositionSelector'
import SysDeptSelector from '@/components/Selector/SysDeptSelector'
import SysRoleSelector from '@/components/Selector/SysRoleSelector'
export default {
  // 使用组件
  components: {
    SysPositionSelector, SysDeptSelector, SysRoleSelector
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
          { required: true, message: '请输入编号' }
        ],
        username: [
          { required: true, message: '请输入用户名' }
        ],
        name: [
          { required: true, message: '请输入姓名' }
        ],
        password: [
          { validator: constants.validPassword }
        ],
        gender: [
          { required: true, message: '请选择性别' }
        ],
        email: [
          { validator: constants.validEmail }
        ],
        telephone: [
          { validator: constants.validTelephone }
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
        username: '',
        name: '',
        positions: [],
        roles: [],
        depts: [],
        modifyPassword: false,
        password: '',
        gender: this.$enums.GENDER.UNKNOWN.code,
        email: '',
        telephone: '',
        description: ''
      }
    },
    // 提交表单事件
    submit() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.loading = true
          const params = Object.assign({
            positionIds: this.formData.positions.map(item => item.id),
            deptIds: this.formData.depts,
            roleIds: this.formData.roles.map(item => item.id)
          }, this.formData)

          delete params.positions
          delete params.depts
          delete params.roles

          this.$api.system.user.modify(params).then(() => {
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
      await this.$api.system.user.get(this.id).then(data => {
        if (!this.$utils.isEmpty(data.depts)) {
          data.depts = data.depts.map(item => item.id)
        }

        this.formData = Object.assign({}, this.formData, data)
      }).finally(() => {
        this.loading = false
      })
    }
  }
}
</script>
