<template>
  <a-modal v-model="visible" :mask-closable="false" width="40%" title="查看" :dialog-style="{ top: '20px' }" :footer="null">
    <div v-if="visible" v-loading="loading">
      <a-descriptions :column="4" bordered>
        <a-descriptions-item label="名称" :span="2">
          {{ formData.name }}
        </a-descriptions-item>
        <a-descriptions-item label="状态" :span="2">
          <available-tag :available="formData.available" />
        </a-descriptions-item>
        <a-descriptions-item label="创建时间" :span="2">
          {{ formData.createTime }}
        </a-descriptions-item>
        <a-descriptions-item label="修改时间" :span="2">
          {{ formData.updateTime }}
        </a-descriptions-item>
        <a-descriptions-item label="备注" :span="4">
          {{ formData.description }}
        </a-descriptions-item>
      </a-descriptions>
    </div>
  </a-modal>
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

      this.$nextTick(() => this.open())
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
        name: '',
        available: '',
        description: '',
        createTime: '',
        updateTime: ''
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
      await this.$api.sw.filebox.get(this.id).then(data => {
        this.formData = data
      }).finally(() => {
        this.loading = false
      })
    }
  }
}
</script>
