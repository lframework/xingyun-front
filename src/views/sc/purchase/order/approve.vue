<template>
  <div class="simple-app-container">
    <div v-permission="['purchase:order:approve']" v-loading="loading">
      <a-tabs v-model:activeKey="activeKey">
        <a-tab-pane key="detail" tab="详情"
          ><viewer ref="viewer" :id="id" @load-data-complete="(e) => (formData = e)"
        /></a-tab-pane>
        <a-tab-pane
          v-if="$utils.isEmpty(formData.flowInstanceId)"
          key="orderTimeLine"
          tab="变动记录"
          ><order-time-line :id="id"
        /></a-tab-pane>
        <a-tab-pane key="approveHis" v-if="!$utils.isEmpty(formData.flowInstanceId)" tab="审批历史"
          ><bpm-approve-his :business-id="formData.id"
        /></a-tab-pane>
      </a-tabs>
      <div
        v-if="
          $enums.PURCHASE_ORDER_STATUS.CREATED.equalsCode(formData.status) ||
          $enums.PURCHASE_ORDER_STATUS.APPROVE_REFUSE.equalsCode(formData.status)
        "
        style="text-align: center; background-color: #ffffff; padding: 8px 0"
      >
        <a-space>
          <a-button
            v-permission="['purchase:order:approve']"
            type="primary"
            :loading="loading"
            @click="approvePassOrder"
            >审核通过</a-button
          >
          <a-button
            v-if="$enums.PURCHASE_ORDER_STATUS.CREATED.equalsCode(formData.status)"
            v-permission="['purchase:order:approve']"
            danger
            :loading="loading"
            @click="approveRefuseOrder"
            >审核拒绝</a-button
          >
          <a-button :loading="loading" @click="closeDialog">关闭</a-button>
        </a-space>
      </div>
    </div>
    <approve-refuse ref="approveRefuseDialog" @confirm="doApproveRefuse" />
  </div>
</template>
<script>
  import { defineComponent } from 'vue';
  import ApproveRefuse from '@/components/ApproveRefuse';
  import * as api from '@/api/sc/purchase/order';
  import { multiplePageMix } from '@/mixins/multiplePageMix';
  import Viewer from './viewer.vue';

  export default defineComponent({
    name: 'ApprovePurchaseOrder',
    components: {
      Viewer,
      ApproveRefuse,
    },
    mixins: [multiplePageMix],
    data() {
      return {
        id: this.$route.params.id,
        // 是否显示加载框
        loading: false,
        // 当前激活的标签
        activeKey: 'detail',
        // 表单数据
        formData: {},
      };
    },
    computed: {},
    created() {
      this.openDialog();
    },
    methods: {
      // 打开对话框 由父页面触发
      openDialog() {
        // 初始化表单数据
        this.initFormData();
      },
      // 关闭对话框
      closeDialog() {
        this.closeCurrentPage();
      },
      // 初始化表单数据
      initFormData() {
        this.formData = {};
        this.activeKey = 'detail';
      },
      // 审核通过
      approvePassOrder() {
        this.$msg.createConfirm('对采购单据执行审核通过操作？').then(() => {
          this.loading = true;
          api
            .approvePass({
              id: this.id,
              description: this.formData.description,
            })
            .then((res) => {
              this.$msg.createSuccess('审核通过！');

              this.$emit('confirm');
              this.closeDialog();
            })
            .finally(() => {
              this.loading = false;
            });
        });
      },
      // 审核拒绝
      approveRefuseOrder() {
        this.$refs.approveRefuseDialog.openDialog();
      },
      // 开始审核拒绝
      doApproveRefuse(reason) {
        this.loading = true;
        api
          .approveRefuse({
            id: this.id,
            refuseReason: reason,
          })
          .then(() => {
            this.$msg.createSuccess('审核拒绝！');

            this.$emit('confirm');
            this.closeDialog();
          })
          .finally(() => {
            this.loading = false;
          });
      },
    },
  });
</script>
<style></style>
