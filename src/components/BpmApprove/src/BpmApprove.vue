<template>
  <div>
    <a-modal
      v-model:open="visible"
      :mask-closable="false"
      width="75%"
      :title="_title"
      :style="{ top: '20px' }"
    >
      <div v-if="visible">
        <a-tabs v-model:activeKey="activeKey">
          <a-tab-pane key="detail" tab="详情"
            ><component ref="comp" :is="componentPath" :id="businessId" is-form
          /></a-tab-pane>
          <a-tab-pane key="flowChart" tab="流程图"
            ><flow-chart v-if="activeKey === 'flowChart'" :instance-id="instanceId"
          /></a-tab-pane>
          <a-tab-pane key="approveHis" tab="审核历史"
            ><bpm-approve-his v-if="activeKey === 'approveHis'" :business-id="businessId"
          /></a-tab-pane>
        </a-tabs>
      </div>
      <template #footer>
        <div class="form-modal-footer">
          <a-space>
            <a-button
              v-if="showApprovePassBtn"
              type="primary"
              :loading="loading"
              @click="() => onHandle('pass')"
              >通过</a-button
            >
            <a-button
              v-if="showRejectBtn"
              type="primary"
              danger
              :loading="loading"
              @click="() => onHandle('reject')"
              >反对</a-button
            >
            <a-button
              v-if="showApproveRefuseBtn"
              type="primary"
              danger
              :loading="loading"
              @click="() => onHandle('refuse')"
              >退回</a-button
            >
            <a-button
              v-if="showUndoBtn"
              type="primary"
              :loading="loading"
              @click="() => onHandle('undo')"
              >撤回</a-button
            >
          </a-space>
        </div>
      </template>
    </a-modal>

    <approve-dialog ref="approveDialog" :approve-type="approveType" @confirm="confirmApprove" />
  </div>
</template>
<script>
  import { defineComponent } from 'vue';
  import FlowChart from '@/components/FlowChart';
  import ApproveDialog from './ApproveDialog.vue';
  import * as api from '@/api/bpm/flow/task';
  import * as instanceApi from '@/api/bpm/flow/instance';

  export default defineComponent({
    name: 'BpmApprove',
    components: { FlowChart, ApproveDialog },
    props: {
      taskId: {
        type: String,
        default: '',
      },
      instanceId: {
        type: String,
        required: true,
      },
      businessId: {
        type: String,
        required: true,
      },
      componentPath: {
        type: String,
        required: true,
      },
      /**
       * 页面来源
       * todo: 待办任务
       * my: 我的任务
       */
      pageFrom: {
        type: String,
        required: true,
      },
    },
    data() {
      return {
        loading: false,
        visible: false,
        activeKey: 'detail',
        approveType: '',
        instanceStatus: '',
        cooperateType: '',
      };
    },
    computed: {
      _title() {
        if ('todo' === this.pageFrom) {
          return '审核';
        }

        return '';
      },
      showApprovePassBtn() {
        return 'todo' === this.pageFrom;
      },
      showApproveRefuseBtn() {
        return 'todo' === this.pageFrom && !this.showRejectBtn;
      },
      showUndoBtn() {
        return (
          'my' === this.pageFrom &&
          this.$enums.FLOW_INSTANCE_STATUS.APPROVING.equalsCode(this.instanceStatus)
        );
      },
      showRejectBtn() {
        return (
          'todo' === this.pageFrom &&
          this.$enums.FLOW_COOPERATE_TYPE.VOTE.equalsCode(this.cooperateType)
        );
      },
    },
    mounted() {},
    methods: {
      // 打开对话框 由父页面触发
      openDialog() {
        this.visible = true;

        this.$nextTick(() => this.open());
      },
      // 页面显示时触发
      open() {
        // 初始化表单数据
        this.initFormData();
      },
      initFormData() {
        this.activeKey = 'detail';

        this.approveType = '';

        this.instanceStatus = '';

        this.cooperateType = '';
        if ('my' === this.pageFrom) {
          instanceApi.getStatus(this.instanceId).then((status) => {
            this.instanceStatus = status;
          });
        } else if ('todo' === this.pageFrom) {
          api.getCooperateType(this.taskId).then((cooperateType) => {
            this.cooperateType = cooperateType;
          });
        }
      },
      closeDialog() {
        this.visible = false;
        this.$emit('close');
      },
      onHandle(approveType) {
        this.approveType = approveType;
        this.$refs.approveDialog.openDialog();
      },
      confirmApprove({ approveType, message }) {
        const variables = this.$refs.comp.getFormData();
        if (approveType === 'pass') {
          this.loading = true;
          api
            .approvePass({
              taskId: this.taskId,
              message,
              variables,
            })
            .then(() => {
              this.$emit('confirm');
              this.$msg.createSuccess('通过成功！');
              this.closeDialog();
            })
            .finally(() => {
              this.loading = false;
            });
        } else if (approveType === 'refuse') {
          this.loading = true;
          api
            .approveRefuse({
              taskId: this.taskId,
              message,
              variables,
            })
            .then(() => {
              this.$emit('confirm');
              this.$msg.createSuccess('退回成功！');
              this.closeDialog();
            })
            .finally(() => {
              this.loading = false;
            });
        } else if (approveType === 'undo') {
          this.loading = true;
          api
            .undo({
              instanceId: this.instanceId,
              message,
              variables,
            })
            .then(() => {
              this.$emit('confirm');
              this.$msg.createSuccess('撤回成功！');
              this.closeDialog();
            })
            .finally(() => {
              this.loading = false;
            });
        } else if (approveType === 'reject') {
          this.loading = true;
          api
            .reject({
              taskId: this.taskId,
              message,
              variables,
            })
            .then(() => {
              this.$emit('confirm');
              this.$msg.createSuccess('反对成功！');
              this.closeDialog();
            })
            .finally(() => {
              this.loading = false;
            });
        }
      },
    },
  });
</script>
<style scoped></style>
