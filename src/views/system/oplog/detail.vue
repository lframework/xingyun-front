<template>
  <el-dialog :visible.sync="visible" :close-on-click-modal="false" width="50%" title="查看" top="5vh" @open="open">
    <div v-if="visible" v-permission="['system:oplog:query']">
      <el-descriptions :column="4" label-class-name="descriptions-label" content-class-name="descriptions-content" border>
        <el-descriptions-item label="日志名称" :span="4">{{ formData.name }}</el-descriptions-item>
        <el-descriptions-item label="日志类型" :span="2">{{ $enums.OP_LOG_TYPE.getDesc(formData.logType) }}</el-descriptions-item>
        <el-descriptions-item label="IP地址" :span="2">{{ formData.ip }}</el-descriptions-item>
        <el-descriptions-item label="创建人" :span="2">{{ formData.createBy }}</el-descriptions-item>
        <el-descriptions-item label="创建时间" :span="2">{{ formData.createTime }}</el-descriptions-item>
        <el-descriptions-item label="补充信息" :span="4"><el-link v-if="!$utils.isEmpty(formData.extra)" type="primary" :underline="false" @click="handleClipboard(formData.extra, $event)">{{ formData.extra }}</el-link></el-descriptions-item>
      </el-descriptions>
    </div>
  </el-dialog>
</template>
<script>
import clipboard from '@/utils/clipboard'
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
        name: '',
        logType: '',
        ip: '',
        createBy: '',
        createTime: '',
        extra: ''
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
      await this.$api.system.opLog.get(this.id).then(data => {
        this.formData = data
      }).finally(() => {
        this.loading = false
      })
    },
    handleClipboard(text, event) {
      clipboard(text, event)
    }
  }
}
</script>
