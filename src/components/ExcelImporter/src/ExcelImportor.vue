<template>
  <div>
    <a-modal
      v-model:open="visible"
      :mask-closable="false"
      width="40%"
      title="导入"
      :style="{ top: '20px' }"
      :footer="null"
      @cancel="onCancel"
    >
      <div v-loading="loading">
        <div>
          <a-upload-dragger
            name="file"
            accept=".xls,.xlsx"
            :custom-request="doUpload"
            :show-upload-list="false"
          >
            <p class="ant-upload-drag-icon">
              <InboxOutlined />
            </p>
            <p class="ant-upload-text"> 点击或拖拽文件进行导入 </p>
            <p class="ant-upload-hint"> 仅支持xls、xlsx格式 </p>
          </a-upload-dragger>
          <div style="margin-bottom: 8px"></div>
          <slot name="form"></slot>
          <div style="padding: 0 5px">
            <span
              v-if="!$utils.isEmpty(tipMsg)"
              style="font-size: 12px; color: #999999; white-space: pre-wrap"
              >{{ tipMsg }}</span
            >
          </div>
          <div class="content-wrapper">
            <a-space>
              <a-button type="link" block @click="doDownloadTemplate"> 下载模板文件 </a-button>
            </a-space>
          </div>
        </div>
        <div>
          <a-tooltip title="处理进度" placement="bottom">
            <a-progress
              :percent="process"
              :success-percent="successProcess"
              title="处理进度"
              :status="status"
              style="margin-bottom: 5px"
            />
          </a-tooltip>
          <a-list v-if="!$utils.isEmpty(tipMsgs)" size="small" bordered :data-source="tipMsgs">
            <template #renderItem="{ item }">
              <a-list-item>
                <span style="color: #ff4d4f">{{ item }}</span>
              </a-list-item>
            </template>
            <template #header>
              <div> 失败原因 </div>
            </template>
          </a-list>
        </div>
      </div>
    </a-modal>
  </div>
</template>
<script>
  import { defineComponent } from 'vue';
  import { InboxOutlined } from '@ant-design/icons-vue';
  import * as api from '@/api/components';

  export default defineComponent({
    name: 'ExcelImporter',
    components: {
      InboxOutlined,
    },
    props: {
      // 下载模板url，传入request
      downloadTemplateUrl: {
        type: Function,
        required: true,
      },
      // 上传文件url，传入request
      uploadUrl: {
        type: Function,
        required: true,
      },
      // 提示信息
      tipMsg: {
        type: String,
        default: '',
      },
      // 表单数据
      formData: {
        type: Object,
        default: (e) => {},
      },
      // 完成后是否关闭对话框
      closeAfterFinish: {
        type: Boolean,
        default: false,
      },
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
        status: '',
        reqId: '',
      };
    },
    beforeUnmount() {
      this.clearTimer();
    },
    methods: {
      initData() {
        this.process = 0;
        this.tipMsgs = [];
        this.clearTimer();
        this.taskId = this.$utils.uuid();
        this.successProcess = 0;
        this.status = 'active';
        this.reqId = '';
      },
      openDialog() {
        this.initData();
        this.visible = true;
      },
      closeDialog() {
        this.visible = false;
      },
      // 下载导入模板
      doDownloadTemplate() {
        this.loading = true;
        this.downloadTemplateUrl(this.formData).finally(() => {
          this.loading = false;
        });
      },
      doUpload(e) {
        this.initData();
        this.loading = true;
        this.uploadUrl(
          Object.assign(
            {
              file: e.file,
            },
            { id: this.taskId },
            this.formData,
          ),
        ).then(() => {
          if (this.status !== 'exception') {
            this.process = 100;
            this.successProcess = 100;
          }
        });

        this.timer = setInterval(this.doTimer, 500);
      },
      doTimer() {
        if (!this.$utils.isEmpty(this.reqId)) {
          return;
        }
        this.reqId = this.$utils.uuid();
        this.getTask()
          .then((res) => {
            this.process = Math.max(this.process, res.process);
            this.tipMsgs = res.tipMsgs;
            this.successProcess = Math.max(this.successProcess, res.successProcess);
            this.status = res.hasError ? 'exception' : 'active';

            if (res.finished) {
              this.clearTimer();
              this.loading = false;
              if (!res.hasError) {
                this.$emit('confirm', res.data);
                if (this.closeAfterFinish) {
                  this.closeDialog();
                }
              }
            }

            this.reqId = '';
          })
          .catch(() => {
            this.clearTimer();
            this.loading = false;
          });
      },
      getTask() {
        return api.getExcelImportTask(this.taskId);
      },
      clearTimer() {
        if (this.timer) {
          clearInterval(this.timer);
          this.timer = null;
        }
      },
      onCancel() {
        this.clearTimer();
      },
    },
  });
</script>
<style lang="less" scoped>
  .content-wrapper {
    text-align: center;
  }
</style>
