<template>
  <div>
    <a-modal v-model="visible" :mask-closable="false" width="40%" title="导入" :dialog-style="{ top: '20px' }" :footer="null" @cancel="onCancel">
      <div v-loading="loading">
        <div>
          <a-upload-dragger
            name="file"
            accept=".xls,.xlsx"
            :custom-request="doUpload"
            :show-upload-list="false"
          >
            <p class="ant-upload-drag-icon">
              <a-icon type="inbox" />
            </p>
            <p class="ant-upload-text">
              点击或拖拽文件进行导入
            </p>
            <p class="ant-upload-hint">
              仅支持xls、xlsx格式
            </p>
          </a-upload-dragger>
          <div style="margin-bottom: 8px;" />
          <slot name="form" />
          <div style="padding: 0 5px;">
            <span v-if="!$utils.isEmpty(tipMsg)" style="font-size: 12px; color: #999999; white-space: pre-wrap;">{{ tipMsg }}</span>
          </div>
          <div class="content-wrapper">
            <a-space>
              <a-button type="link" block @click="doDownloadTemplate">
                下载模板文件
              </a-button>
            </a-space>
          </div>
        </div>
        <div>
          <a-tooltip title="处理进度" placement="bottom">
            <a-progress :percent="process" :success-percent="successProcess" title="处理进度" :status="status" style="margin-bottom: 5px;" />
          </a-tooltip>
          <a-list
            v-if="!$utils.isEmpty(tipMsgs)"
            size="small"
            bordered
            :data-source="tipMsgs"
          >
            <a-list-item slot="renderItem" slot-scope="item">
              <span style="color: #FF4D4F;">{{ item }}</span>
            </a-list-item>
            <div slot="header">
              失败原因
            </div>
          </a-list>
        </div>
      </div>
    </a-modal>
  </div>
</template>
<script>
import { request } from '@/utils/request'

export default {
  name: 'ExcelImporter',

  props: {
    // 下载模板url，传入request
    downloadTemplateUrl: {
      type: Function,
      required: true
    },
    // 上传文件url，传入request
    uploadUrl: {
      type: Function,
      required: true
    },
    // 提示信息
    tipMsg: {
      type: String,
      default: ''
    },
    // 表单数据
    formData: {
      type: Object,
      default: e => {}
    }
  },
  data() {
    return {
      visible: false,
      loading: false,
      process: 0,
      successProcess: 0,
      tipMsgs: [],
      timer: null,
      taksId: '',
      status: ''
    }
  },
  beforeDestroy() {
    this.clearTimer()
  },
  methods: {
    initData() {
      this.process = 0
      this.tipMsgs = []
      this.clearTimer()
      this.taskId = this.$utils.uuid()
      this.successProcess = 0
      this.status = 'active'
    },
    openDialog() {
      this.initData()
      this.visible = true
    },
    // 下载导入模板
    doDownloadTemplate() {
      this.loading = true
      this.downloadTemplateUrl(this.formData).finally(() => {
        this.loading = false
      })
    },
    doUpload(e) {
      this.initData()
      this.loading = true
      this.uploadUrl(Object.assign({
        file: e.file
      }, { id: this.taskId }, this.formData)).then(() => {
        if (this.status !== 'exception') {
          this.process = 100
          this.successProcess = 100
        }
      })

      this.timer = setInterval(this.doTimer, 500)
    },
    doTimer() {
      this.getTask().then(res => {
        this.process = Math.max(this.process, res.process)
        this.tipMsgs = res.tipMsgs
        this.successProcess = Math.max(this.successProcess, res.successProcess)
        this.status = res.hasError ? 'exception' : 'active'

        if (res.finished) {
          this.clearTimer()
          this.loading = false
          if (!res.hasError) {
            this.$emit('confirm')
          }
        }
      }).catch(() => {
        this.clearTimer()
        this.loading = false
      })
    },
    getTask() {
      return request({
        url: '/component/import/task',
        method: 'get',
        params: {
          id: this.taskId
        }
      })
    },
    clearTimer() {
      if (this.timer) {
        clearInterval(this.timer)
        this.timer = null
      }
    },
    onCancel() {
      this.clearTimer()
    }
  }
}
</script>
<style lang="less" scoped>
.content-wrapper {
  text-align: center;
}
</style>
