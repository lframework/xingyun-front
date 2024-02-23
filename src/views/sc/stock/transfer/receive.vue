<template>
  <div class="simple-app-container">
    <div v-permission="['stock:sc-transfer:receive']" v-loading="loading">
      <j-border>
        <j-form ref="form">
          <j-form-item label="转出仓库" required>
            <store-center-selector v-model:value="formData.sourceScId" :disabled="true" />
          </j-form-item>
          <j-form-item label="转入仓库" required>
            <store-center-selector v-model:value="formData.targetScId" :disabled="true" />
          </j-form-item>
          <j-form-item :span="8" />
          <j-form-item label="备注" :span="24">
            <a-textarea v-model:value.trim="formData.description" maxlength="200" readonly />
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
        :toolbar-config="{}"
      >
        <!-- 调拨数量 列自定义内容 -->
        <template #transferNum_default="{ row }">
          <span
            v-if="
              $utils.isIntegerGeZero(row.curReceiveNum) &&
              $utils.sub($utils.sub(row.transferNum, row.curReceiveNum), row.receiveNum) < 0
            "
            style="color: #ff4d4f"
            >{{ row.transferNum }}</span
          >
          <span v-else>{{ row.transferNum }}</span>
        </template>

        <!-- 已收货数量 列自定义内容 -->
        <template #receiveNum_default="{ row }">
          <span
            v-if="
              $utils.isIntegerGeZero(row.curReceiveNum) &&
              $utils.sub($utils.sub(row.transferNum, row.curReceiveNum), row.receiveNum) < 0
            "
            style="color: #ff4d4f"
            >{{ row.receiveNum }}</span
          >
          <span v-else>{{ row.receiveNum }}</span>
        </template>

        <!-- 本次收货数量 列自定义内容 -->
        <template #curReceiveNum_default="{ row }">
          <a-input
            v-model:value="row.curReceiveNum"
            class="number-input"
            @input="(e) => curReceiveNumInput(e.target.value)"
          />
        </template>
      </vxe-grid>

      <order-time-line :id="id" />

      <j-border title="合计">
        <j-form label-width="140px">
          <j-form-item label="本次收货数量" :span="6">
            <a-input v-model:value="formData.totalNum" class="number-input" readonly />
          </j-form-item>
        </j-form>
      </j-border>

      <div style="text-align: center; background-color: #ffffff; padding: 8px 0">
        <a-space>
          <a-button
            v-permission="['stock:sc-transfer:modify']"
            type="primary"
            :loading="loading"
            @click="submit"
            >收货</a-button
          >
          <a-button :loading="loading" @click="closeDialog">关闭</a-button>
        </a-space>
      </div>
    </div>
  </div>
</template>
<script>
  import { defineComponent } from 'vue';
  import * as api from '@/api/sc/stock/transfer-sc';

  export default defineComponent({
    components: {},
    data() {
      return {
        id: this.$route.params.id,
        // 是否显示加载框
        loading: false,
        // 表单数据
        formData: {},
        // 工具栏配置
        toolbarConfig: {
          // 缩放
          zoom: false,
          // 自定义表头
          custom: false,
          // 右侧是否显示刷新按钮
          refresh: false,
          // 自定义左侧工具栏
          slots: {
            buttons: 'toolbar_buttons',
          },
        },
        // 列表数据配置
        tableColumn: [
          { type: 'checkbox', width: 45 },
          { field: 'productCode', title: '商品编号', width: 120 },
          { field: 'productName', title: '商品名称', width: 260 },
          { field: 'skuCode', title: '商品SKU编号', width: 120 },
          { field: 'externalCode', title: '商品外部编号', width: 120 },
          { field: 'unit', title: '单位', width: 80 },
          { field: 'spec', title: '规格', width: 80 },
          { field: 'categoryName', title: '商品类目', width: 120 },
          { field: 'brandName', title: '商品品牌', width: 120 },
          {
            field: 'transferNum',
            title: '调拨数量',
            width: 120,
            align: 'right',
            slots: { default: 'transferNum_default' },
          },
          {
            field: 'receiveNum',
            title: '已收货数量',
            width: 120,
            align: 'right',
            slots: { default: 'receiveNum_default' },
          },
          {
            field: 'curReceiveNum',
            title: '本次收货数量',
            width: 120,
            align: 'right',
            slots: { default: 'curReceiveNum_default' },
          },
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
          sourceScId: '',
          targetScId: '',
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
      // 提交表单事件
      submit() {
        if (this.$utils.isEmpty(this.tableData)) {
          this.$msg.createError('请录入商品！');
          return;
        }

        for (let i = 0; i < this.tableData.length; i++) {
          const data = this.tableData[i];
          if (this.$utils.isEmpty(data.curReceiveNum)) {
            continue;
          }
          if (!this.$utils.isInteger(data.curReceiveNum)) {
            this.$msg.createError('第' + (i + 1) + '行本次调拨数量必须是整数！');
            return false;
          }
          if (!this.$utils.isIntegerGtZero(data.curReceiveNum)) {
            this.$msg.createError('第' + (i + 1) + '行本次调拨数量必须大于0！');
            return false;
          }

          if (this.$utils.sub(data.transferNum, data.receiveNum) < data.curReceiveNum) {
            this.$msg.createError(
              '第' +
                (i + 1) +
                '行调拨数量为' +
                data.transferNum +
                '，已收货数量为' +
                data.receiveNum +
                '，本次收货数量不能大于' +
                this.$utils.sub(data.transferNum, data.receiveNum) +
                '！',
            );
            return false;
          }
        }

        const params = {
          id: this.id,
          products: this.tableData
            .filter((data) => {
              return (
                !this.$utils.isEmpty(data.curReceiveNum) &&
                this.$utils.isIntegerGtZero(data.curReceiveNum)
              );
            })
            .map((item) => {
              return {
                productId: item.productId,
                receiveNum: item.curReceiveNum,
              };
            }),
        };
        if (this.$utils.isEmpty(params.products)) {
          this.$msg.createError('不允许所有的商品均不进行收货操作！');
          return false;
        }
        this.loading = true;
        api
          .receive(params)
          .then(() => {
            this.$msg.createSuccess('收货成功！');
            this.$emit('confirm');

            this.closeDialog();
          })
          .finally(() => {
            this.loading = false;
          });
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
            if (this.$utils.isIntegerGeZero(item.curReceiveNum)) {
              totalNum = this.$utils.add(item.curReceiveNum, totalNum);
            }
          }
        });

        this.formData.totalNum = totalNum;
      },
      curReceiveNumInput(e) {
        this.calcSum();
      },
      async loadData() {
        const that = this;
        this.loading = true;
        api
          .get(this.id)
          .then((res) => {
            Object.assign(this.formData, {
              sourceScId: res.sourceScId,
              targetScId: res.targetScId,
              description: res.description,
              updateBy: res.updateBy,
              updateTime: res.updateTime,
              approveBy: res.approveBy,
              approveTime: res.approveTime,
              status: res.status,
              refuseReason: res.refuseReason,
            });

            this.tableData = res.details.map((item) => {
              item.curReceiveNum = that.$utils.sub(item.transferNum, item.receiveNum);
              if (that.$utils.eq(item.curReceiveNum, 0)) {
                item.curReceiveNum = '';
              }
              return item;
            });
            this.calcSum();
          })
          .finally(() => {
            this.loading = false;
          });
      },
    },
  });
</script>
