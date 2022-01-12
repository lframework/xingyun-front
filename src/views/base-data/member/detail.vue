<template>
  <el-dialog :visible.sync="visible" :close-on-click-modal="false" width="40%" title="查看" top="5vh" @open="open">
    <div v-if="visible" v-permission="['base-data:member:query']">
      <el-descriptions :column="4" border label-class-name="descriptions-label" content-class-name="descriptions-content">
        <el-descriptions-item label="编号" :span="2">
          {{ formData.code }}
        </el-descriptions-item>
        <el-descriptions-item label="名称" :span="2">
          {{ formData.name }}
        </el-descriptions-item>
        <el-descriptions-item label="性别" :span="2">
          {{ $enums.GENDER.getDesc(formData.gender) }}
        </el-descriptions-item>
        <el-descriptions-item label="会员手机号" :span="2">
          {{ formData.telephone }}
        </el-descriptions-item>
        <el-descriptions-item label="电子邮箱" :span="2">
          {{ formData.email }}
        </el-descriptions-item>
        <el-descriptions-item label="出生日期" :span="2">
          {{ formData.birthday }}
        </el-descriptions-item>
        <el-descriptions-item label="入会日期" :span="2">
          {{ formData.joinDay }}
        </el-descriptions-item>
        <el-descriptions-item label="状态" :span="2">
          <available-tag :available="formData.available" />
        </el-descriptions-item>
        <el-descriptions-item label="备注" :span="4">
          {{ formData.description }}
        </el-descriptions-item>
      </el-descriptions>
    </div>
  </el-dialog>
</template>
<script>
import AvailableTag from '@/components/Tag/Available'
export default {
  // 使用组件
  components: {
    AvailableTag
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
      formData: {}
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
        id: '',
        code: '',
        name: '',
        gender: '',
        telephone: '',
        email: '',
        birthday: '',
        joinDay: '',
        available: '',
        description: ''
      }
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
      await this.$api.baseData.member.get(this.id).then(data => {
        this.formData = data
      }).finally(() => {
        this.loading = false
      })
    }
  }
}
</script>
