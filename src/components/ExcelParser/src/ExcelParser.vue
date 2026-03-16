<template>
  <div>
    <a-modal
      v-model:open="visible"
      :mask-closable="false"
      width="40%"
      :title="title"
      :style="{ top: '20px' }"
      :footer="null"
      @cancel="onCancel"
    >
      <div v-loading="loading">
        <div>
          <a-upload-dragger
            name="file"
            accept=".xls,.xlsx"
            :custom-request="handleUpload"
            :show-upload-list="false"
          >
            <p class="ant-upload-drag-icon">
              <InboxOutlined />
            </p>
            <p class="ant-upload-text">点击或拖拽文件进行导入</p>
            <p class="ant-upload-hint">仅支持xls、xlsx格式</p>
          </a-upload-dragger>
          <div style="margin-bottom: 8px"></div>
          <slot name="form"></slot>
          <div style="padding: 0 5px">
            <span v-if="tipMsg" style="font-size: 12px; color: #999999; white-space: pre-wrap">{{
              tipMsg
            }}</span>
          </div>
          <div class="content-wrapper">
            <a-space>
              <a-button type="link" block @click="handleDownloadTemplate">下载模板文件</a-button>
            </a-space>
          </div>
        </div>
        <div v-if="parseSuccess">
          <a-alert
            :message="`成功解析 ${resultCount} 行数据`"
            type="success"
            show-icon
            style="margin-bottom: 8px"
          />
        </div>
        <div v-if="warnings.length > 0">
          <a-list size="small" bordered :data-source="warnings">
            <template #renderItem="{ item }">
              <a-list-item>
                <span style="color: #ff4d4f">{{ item }}</span>
              </a-list-item>
            </template>
            <template #header>
              <div>提示信息</div>
            </template>
          </a-list>
        </div>
      </div>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
  import { ref } from 'vue';
  import { InboxOutlined } from '@ant-design/icons-vue';
  import { generateTemplate, parseExcelFile } from './helper';
  import type { ExcelParserColumn, ExcelParserResult } from './typing';

  interface Props {
    columns: ExcelParserColumn[];
    templateFilename?: string;
    title?: string;
    tipMsg?: string;
    closeAfterFinish?: boolean;
  }

  const props = withDefaults(defineProps<Props>(), {
    title: '导入',
    templateFilename: '导入模板',
    tipMsg: '',
    closeAfterFinish: false,
  });

  const emit = defineEmits<{
    (e: 'confirm', result: ExcelParserResult): void;
  }>();

  const visible = ref(false);
  const loading = ref(false);
  const parseSuccess = ref(false);
  const resultCount = ref(0);
  const warnings = ref<string[]>([]);

  function initData() {
    parseSuccess.value = false;
    resultCount.value = 0;
    warnings.value = [];
  }

  function openDialog() {
    initData();
    visible.value = true;
  }

  function closeDialog() {
    visible.value = false;
  }

  function onCancel() {
    initData();
  }

  function handleDownloadTemplate() {
    generateTemplate(props.columns, props.templateFilename);
  }

  async function handleUpload({ file }: { file: File }) {
    initData();
    loading.value = true;
    try {
      const result = await parseExcelFile(file, props.columns);
      warnings.value = result.warnings;
      resultCount.value = result.data.length;
      parseSuccess.value = true;

      emit('confirm', {
        data: result.data,
        totalCount: result.data.length,
      });

      if (props.closeAfterFinish) {
        closeDialog();
      }
    } catch (err) {
      warnings.value = [(err as Error).message];
    } finally {
      loading.value = false;
    }
  }

  defineExpose({
    openDialog,
    closeDialog,
  });
</script>

<style lang="less" scoped>
  .content-wrapper {
    text-align: center;
  }
</style>
