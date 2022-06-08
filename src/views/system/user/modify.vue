<template>
  <a-modal v-model="visible" :mask-closable="false" width="40%" title="修改" :dialog-style="{ top: '20px' }" :footer="null">
    <div v-if="visible" v-permission="['system:user:modify']" v-loading="loading">
      <a-form-model ref="form" v-loading="loading" :label-col="{span: 4}" :wrapper-col="{span: 16}" :model="formData" :rules="rules">
        <a-form-model-item label="编号" prop="code">
          <a-input v-model.trim="formData.code" allow-clear />
        </a-form-model-item>
        <a-form-model-item label="用户名" prop="username">
          <a-input v-model.trim="formData.username" allow-clear />
        </a-form-model-item>
        <a-form-model-item label="姓名" prop="name">
          <a-input v-model.trim="formData.name" allow-clear />
        </a-form-model-item>
        <a-form-model-item label="部门" prop="dept">
          <sys-dept-selector v-model="formData.depts" :only-final="true" :multiple="true" />
        </a-form-model-item>
        <a-form-model-item label="角色" prop="role">
          <sys-role-selector v-model="formData.roles" :multiple="true" />
        </a-form-model-item>
        <a-form-model-item label="岗位" prop="position">
          <sys-position-selector v-model="formData.positions" :multiple="true" />
        </a-form-model-item>
        <a-form-model-item v-if="!formData.modifyPassword" label="更新密码">
          <a-checkbox v-model="formData.modifyPassword" />
        </a-form-model-item>
        <a-form-model-item v-show="formData.modifyPassword" label="密码" prop="password">
          <a-input-password v-model="formData.password" allow-clear />
        </a-form-model-item>
        <a-form-model-item label="性别" prop="gender">
          <a-select v-model="formData.gender">
            <a-select-option v-for="item in $enums.GENDER.values()" :key="item.code" :value="item.code">{{ item.desc }}</a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item label="邮箱" prop="email">
          <a-input v-model.trim="formData.email" allow-clear />
        </a-form-model-item>
        <a-form-model-item label="联系电话" prop="telephone">
          <a-input v-model.trim="formData.telephone" allow-clear />
        </a-form-model-item>
        <a-form-model-item label="状态" prop="available">
          <a-select v-model="formData.available">
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
import * as constants from './constants'
import SysPositionSelector from '@/components/Selector/SysPositionSelector'
import SysDeptSelector from '@/components/Selector/SysDeptSelector'
import SysRoleSelector from '@/components/Selector/SysRoleSelector'
import { validCode } from '@/utils/validate'
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
          { required: true, message: '请输入编号' },
          { validator: validCode }
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
