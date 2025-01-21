<template>
  <div>
    <a-modal
      v-model:open="dialogVisible"
      :title="title"
      :width="dialogWidth"
      :mask-closable="false"
      :keyboard="false"
      :style="{ top: '20px' }"
      :closable="false"
    >
      <div>
        <div v-if="!$utils.isEmpty(tip)" class="tip-container">
          <a-alert :message="tip" type="warning" show-icon />
        </div>
        <!-- 数据列表 -->
        <vxe-grid
          v-if="dialogVisible"
          ref="batchHandleTable"
          resizable
          show-overflow
          highlight-hover-row
          keep-source
          :max-height="600"
          :scroll-y="{
            enabled: true,
            gt: 50,
          }"
          :data="copyedTableData"
          :columns="_tableColumn"
          :pager-config="undefined"
        >
          <!-- 状态 列自定义内容 -->
          <template #__status_default="{ row }">
            <span v-if="row.__status == 0"><ClockCircleOutlined /></span>
            <span v-else-if="row.__status === 1"><LoadingOutlined /></span>
            <span v-else-if="row.__status === 2" style="color: #52c41a"><CheckCircleFilled /></span>
            <span v-else-if="row.__status === 3" style="color: #ff4d4f"><CloseCircleFilled /></span>
          </template>
        </vxe-grid>
      </div>

      <template #footer>
        <div>
          <a-space>
            <a-button @click="onClose">关 闭</a-button>
            <a-button v-if="!loading" type="primary" @click="onBegin">开 始</a-button>
            <a-button v-if="loading" type="primary" @click="onStop">停 止</a-button>
          </a-space>
        </div>
      </template>
    </a-modal>
  </div>
</template>
<script>
  import { defineComponent } from 'vue';
  import {
    LoadingOutlined,
    CheckCircleFilled,
    CloseCircleFilled,
    ClockCircleOutlined,
  } from '@ant-design/icons-vue';
  import { ConcurrentPromise } from '@/utils/concurrentPromise';

  export default defineComponent({
    components: {
      LoadingOutlined,
      CheckCircleFilled,
      CloseCircleFilled,
      ClockCircleOutlined,
    },
    props: {
      title: {
        type: String,
        default: '批量处理',
      },
      dialogWidth: {
        type: String,
        default: '60%',
      },
      tableColumn: {
        type: Array,
        required: true,
      },
      tableData: {
        type: Array,
        default: () => {
          return [];
        },
      },
      concurrency: {
        type: Number,
        default: 2,
      },
      handleFn: {
        type: Function,
        required: true,
      },
      tip: {
        type: String,
        default: '',
      },
    },
    data() {
      return {
        loading: false,
        dialogVisible: false,
        copyedTableData: [],
        concurrentPromise: undefined,
        currentIndex: 0,
      };
    },
    computed: {
      _tableColumn() {
        return [
          { type: 'seq', width: 45 },
          ...this.tableColumn,
          { width: 40, slots: { default: '__status_default' }, fixed: 'right' },
          {
            field: '__errorMsg',
            title: '错误信息',
            width: 200,
            fixed: 'right',
          },
        ];
      },
    },
    watch: {
      dialogVisible(val) {
        if (!val) {
          this.stopPromise();
        } else {
          this.$nextTick(() => {
            this.open();
          });
        }
      },
    },
    mounted() {},
    methods: {
      openDialog() {
        this.dialogVisible = true;
      },
      onStop() {
        if (!this.loading) {
          return;
        }

        this.$msg.createConfirm('当前任务正在执行，是否确认停止执行？').then(() => {
          this.stopPromise();
          this.loading = false;
        });
      },
      onBegin() {
        if (this.loading) {
          return;
        }

        if (this.copyedTableData.filter((item) => item.__status === 1).length > 0) {
          this.$msg.createErrorDialog('部分任务正在执行，请稍后再重新开始！');
          return;
        }

        if (
          this.copyedTableData.filter((item) => item.__status !== 2 && item.__status !== 3)
            .length === 0
        ) {
          this.$msg.createErrorDialog('所有任务均已执行，请勿重复执行！');
          return;
        }

        this.$msg.createConfirm('是否确认开始执行？').then(() => {
          this.loading = true;
          this.concurrentPromise = new ConcurrentPromise(this.concurrency);
          this.copyedTableData.forEach((item, index) => {
            if (index >= this.currentIndex) {
              this.concurrentPromise
                .add(() => {
                  item.__status = 1;
                  return this.handleFn(item);
                })
                .then(() => {
                  item.__status = 2;
                })
                .catch((e) => {
                  item.__errorMsg = e?.msg || '网络请求错误，请稍后重试！';
                  item.__status = 3;
                })
                .finally(() => {
                  this.currentIndex++;

                  this.$emit('confirm-row', item);
                  if (this.currentIndex === this.copyedTableData.length) {
                    this.$emit('confirm');
                    this.loading = false;
                  }
                });
            }
          });
        });
      },
      open() {
        this.copyedTableData = (this.tableData || []).map((item) => {
          return Object.assign({}, item, {
            __status: 0,
            __errorMsg: '',
          });
        });

        this.concurrentPromise = undefined;
        this.currentIndex = 0;
        this.loading = false;
      },

      stopPromise() {
        if (this.concurrentPromise) {
          this.concurrentPromise.stop();
        }
      },
      onClose() {
        if (this.loading) {
          this.$msg
            .createConfirm('当前任务正在执行，关闭后会中断执行任务，是否确认关闭？')
            .then(() => {
              this.dialogVisible = false;
            });
        } else {
          this.dialogVisible = false;
        }
      },
    },
  });
</script>
<style scoped>
  .tip-container {
    padding: 2px 0;
  }
</style>
