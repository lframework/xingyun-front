<template>
  <a-modal
    v-model:open="visible"
    :mask-closable="false"
    width="30%"
    title="收货记录"
    :style="{ top: '20px' }"
  >
    <div v-if="visible" v-permission="['stock:sc-transfer:query']">
      <!-- 数据列表 -->
      <vxe-grid
        v-if="visible"
        ref="grid"
        resizable
        show-overflow
        highlight-hover-row
        keep-source
        row-id="id"
        height="500"
        :proxy-config="proxyConfig"
        :columns="tableColumn"
        :toolbar-config="undefined"
        :pager-config="{}"
        :loading="loading"
      />
    </div>
    <template #footer>
      <a-space>
        <a-button @click="closeDialog">关 闭</a-button>
      </a-space>
    </template>
  </a-modal>
</template>
<script>
  import { defineComponent } from 'vue';

  export default defineComponent({
    // 使用组件
    components: {},
    props: {
      orderId: {
        type: String,
        required: true,
      },
      detailId: {
        type: String,
        required: true,
      },
    },
    data() {
      return {
        // 是否可见
        visible: false,
        // 是否显示加载框
        loading: false,
        // 工具栏配置
        toolbarConfig: {
          // 自定义左侧工具栏
          slots: {
            buttons: 'toolbar_buttons',
          },
        },
        // 列表数据配置
        tableColumn: [
          { type: 'seq', width: 50 },
          { field: 'createBy', title: '收货人', minWidth: 120 },
          { field: 'createTime', title: '收货时间', width: 170 },
          { field: 'receiveNum', title: '收货数量', width: 120, align: 'right' },
        ],
        // 请求接口配置
        proxyConfig: {
          props: {
            // 响应结果列表字段
            result: 'datas',
            // 响应结果总条数字段
            total: 'totalCount',
          },
          ajax: {
            // 查询接口
            query: ({ page, sorts, filters }) => {
              return api.receiveDetail({
                orderId: this.orderId,
                detailId: this.detailId,
              });
            },
          },
        },
      };
    },
    created() {},
    methods: {
      // 列表发生查询时的事件
      search() {
        this.$refs.grid.commitProxy('reload');
      },
      // 打开对话框 由父页面触发
      openDialog() {
        this.visible = true;

        this.$nextTick(() => this.open());
      },
      // 关闭对话框
      closeDialog() {
        this.visible = false;
        this.$emit('close');
      },
      // 页面显示时触发
      open() {},
    },
  });
</script>
