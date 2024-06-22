<template>
  <div class="simple-app-container">
    <div v-permission="['stock:sc-transfer:modify']" v-loading="loading">
      <j-border>
        <j-form>
          <j-form-item label="转出仓库" required>
            {{ formData.sourceScName }}
          </j-form-item>
          <j-form-item label="转入仓库" required>
            {{ formData.targetScName }}
          </j-form-item>
          <j-form-item :span="8" />
          <j-form-item label="备注" :span="24">
            <a-textarea v-model:value.trim="formData.description" maxlength="200" />
          </j-form-item>
          <j-form-item label="状态">
            <span
              v-if="$enums.SC_TRANSFER_ORDER_STATUS.APPROVE_PASS.equalsCode(formData.status)"
              style="color: #52c41a"
              >{{ $enums.SC_TRANSFER_ORDER_STATUS.getDesc(formData.status) }}</span
            >
            <span
              v-else-if="$enums.SC_TRANSFER_ORDER_STATUS.APPROVE_REFUSE.equalsCode(formData.status)"
              style="color: #f5222d"
              >{{ $enums.SC_TRANSFER_ORDER_STATUS.getDesc(formData.status) }}</span
            >
            <span v-else style="color: #303133">{{
              $enums.SC_TRANSFER_ORDER_STATUS.getDesc(formData.status)
            }}</span>
          </j-form-item>
          <j-form-item label="拒绝理由" :span="16" :content-nest="false">
            <a-input
              v-if="$enums.SC_TRANSFER_ORDER_STATUS.APPROVE_REFUSE.equalsCode(formData.status)"
              v-model:value="formData.refuseReason"
              readonly
            />
          </j-form-item>
          <j-form-item label="操作人">
            <span>{{ formData.updateBy }}</span>
          </j-form-item>
          <j-form-item label="操作时间" :span="16">
            <span>{{ formData.updateTime }}</span>
          </j-form-item>
          <j-form-item
            v-if="
              $enums.SC_TRANSFER_ORDER_STATUS.APPROVE_PASS.equalsCode(formData.status) ||
              $enums.SC_TRANSFER_ORDER_STATUS.APPROVE_REFUSE.equalsCode(formData.status)
            "
            label="审核人"
          >
            <span>{{ formData.approveBy }}</span>
          </j-form-item>
          <j-form-item
            v-if="
              $enums.SC_TRANSFER_ORDER_STATUS.APPROVE_PASS.equalsCode(formData.status) ||
              $enums.SC_TRANSFER_ORDER_STATUS.APPROVE_REFUSE.equalsCode(formData.status)
            "
            label="审核时间"
            :span="16"
          >
            <span>{{ formData.approveTime }}</span>
          </j-form-item>
        </j-form>
      </j-border>

      <!-- 数据列表 -->
      <vxe-grid
        ref="grid"
        resizable
        show-overflow
        highlight-hover-row
        keep-source
        row-id="id"
        height="500"
        :data="tableData"
        :columns="tableColumn"
      />

      <order-time-line :id="id" />

      <j-border title="合计">
        <j-form label-width="140px">
          <j-form-item label="调拨数量" :span="6">
            <a-input v-model:value="formData.totalNum" class="number-input" readonly />
          </j-form-item>
        </j-form>
      </j-border>

      <div style="text-align: center; background-color: #ffffff; padding: 8px 0">
        <a-space>
          <a-button
            v-permission="['stock:sc-transfer:approve']"
            type="primary"
            :loading="loading"
            @click="approvePass"
            >审核通过</a-button
          >
          <a-button
            v-if="$enums.SC_TRANSFER_ORDER_STATUS.CREATED.equalsCode(formData.status)"
            v-permission="['stock:sc-transfer:approve']"
            danger
            :loading="loading"
            @click="approveRefuse"
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
  import * as api from '@/api/sc/stock/transfer-sc';

  export default defineComponent({
    components: {
      ApproveRefuse,
    },
    data() {
      return {
        id: this.$route.params.id,
        // 是否显示加载框
        loading: false,
        // 表单数据
        formData: {},
        // 列表数据配置
        tableColumn: [
          { type: 'seq', width: 50 },
          { field: 'productCode', title: '商品编号', width: 120 },
          { field: 'productName', title: '商品名称', width: 260 },
          { field: 'skuCode', title: '商品SKU编号', width: 120 },
          { field: 'externalCode', title: '商品外部编号', width: 120 },
          { field: 'unit', title: '单位', width: 80 },
          { field: 'spec', title: '规格', width: 80 },
          { field: 'categoryName', title: '商品类目', width: 120 },
          { field: 'brandName', title: '商品品牌', width: 120 },
          { field: 'curStockNum', title: '库存数量', width: 120, align: 'right' },
          { field: 'transferNum', title: '调拨数量', width: 120, align: 'right' },
          { field: 'description', title: '备注', width: 200 },
        ],
        tableData: [],
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
        this.loadData();
      },
      // 关闭对话框
      closeDialog() {
        this.$utils.closeCurrentPage();
      },
      // 初始化表单数据
      initFormData() {
        this.formData = {
          sourceScName: '',
          targetScName: '',
          description: '',
          updateBy: '',
          updateTime: '',
          approveBy: '',
          approveTime: '',
          status: '',
          refuseReason: '',
          totalNum: 0,
        };

        this.tableData = [];
      },
      // 页面显示时触发
      open() {
        // 初始化表单数据
        this.initFormData();
      },
      calcSum() {
        let totalNum = 0;
        this.tableData.forEach((item) => {
          if (!this.$utils.isEmpty(item.productId)) {
            if (this.$utils.isIntegerGeZero(item.transferNum)) {
              totalNum = this.$utils.add(item.transferNum, totalNum);
            }
          }
        });

        this.formData.totalNum = totalNum;
      },
      async loadData() {
        this.loading = true;
        api
          .get(this.id)
          .then((res) => {
            Object.assign(this.formData, {
              sourceScName: res.sourceScName,
              targetScName: res.targetScName,
              description: res.description,
              updateBy: res.updateBy,
              updateTime: res.updateTime,
              approveBy: res.approveBy,
              approveTime: res.approveTime,
              status: res.status,
              refuseReason: res.refuseReason,
            });

            this.tableData = res.details;
            this.calcSum();
          })
          .finally(() => {
            this.loading = false;
          });
      },
      // 审核通过
      approvePass() {
        this.$msg.createConfirm('对仓库调拨单执行审核通过操作？').then(() => {
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
      approveRefuse() {
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
