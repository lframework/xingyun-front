<template>
  <a-modal
    v-model:open="visible"
    :mask-closable="false"
    width="40%"
    title="设置消息通知组"
    :style="{ top: '20px' }"
    :footer="null"
  >
    <div v-if="visible" v-permission="['stock:warning:notify']" v-loading="loading">
      <a-alert
        :message="
          '列表中的状态显示的是消息通知组的状态，如果消息通知组的状态是“' +
          $enums.AVAILABLE.UNABLE.desc +
          '”，那么即使配置了该消息通知组，也不会发送预警消息。'
        "
        type="info"
        show-icon
      />
      <vxe-grid
        ref="grid"
        resizable
        show-overflow
        highlight-hover-row
        keep-source
        row-id="index"
        :height="$vh * 40"
        :tree-config="{}"
        :export-config="{}"
        :toolbar-config="toolbarConfig"
        :proxy-config="proxyConfig"
        :data="tableData"
        :columns="tableColumn"
      >
        <!-- 工具栏 -->
        <template #toolbar_buttons>
          <a-space>
            <a-button type="primary" :icon="h(PlusOutlined)" @click="addRow">新增</a-button>
          </a-space>
        </template>

        <!-- 名称 列自定义内容 -->
        <template #name_default="{ row }">
          <span v-if="!$utils.isEmpty(row.id)">{{ row.name }}</span>
          <sys-notify-group-selector
            v-else
            v-model:value="row.id"
            @input-row="(e) => onSelectNotifyGroup(e, row)"
          />
        </template>

        <!-- 状态 列自定义内容 -->
        <template #available_default="{ row }">
          <available-tag v-if="!$utils.isEmpty(row.id)" :available="row.available" />
          <div v-else></div>
        </template>

        <!-- 操作 列自定义内容 -->
        <template #action_default="{ row }">
          <table-action v-if="!$utils.isEmpty(row.id)" outside :actions="createActions(row)" />
        </template>
      </vxe-grid>
    </div>
  </a-modal>
</template>
<script>
  import { h, defineComponent } from 'vue';
  import { PlusOutlined } from '@ant-design/icons-vue';
  import * as api from '@/api/sc/stock/warning';

  export default defineComponent({
    // 使用组件
    components: {},
    setup() {
      return {
        h,
        PlusOutlined,
      };
    },
    data() {
      return {
        // 是否可见
        visible: false,
        // 是否显示加载框
        loading: false,
        // 表格数据
        tableData: [],
        // 表格列配置
        tableColumn: [
          { type: 'seq', width: 45 },
          { field: 'name', title: '名称', slots: { default: 'name_default' } },
          { field: 'available', title: '状态', width: 80, slots: { default: 'available_default' } },
          { title: '操作', width: 80, fixed: 'right', slots: { default: 'action_default' } },
        ],
        // 工具栏配置
        toolbarConfig: {
          // 自定义左侧工具栏
          slots: {
            buttons: 'toolbar_buttons',
          },
        },
        // 请求接口配置
        proxyConfig: {
          ajax: {
            // 查询接口
            query: () => {
              return api.getSetting();
            },
          },
        },
      };
    },
    created() {},
    methods: {
      // 打开对话框 由父页面触发
      openDialog() {
        this.visible = true;

        this.open();
      },
      // 关闭对话框
      closeDialog() {
        this.visible = false;
        this.$emit('close');
      },
      // 页面显示时触发
      open() {
        // 查询数据
        this.tableData = [];
        // this.query();
      },
      // 列表查询数据
      query() {
        this.loading = true;
        api
          .getSetting()
          .then((res) => {
            this.tableData = res;
          })
          .finally(() => {
            this.loading = false;
          });
      },
      // 提交数据
      submit() {
        this.loading = true;
        api
          .saveSetting(this.tableData.map((item) => item.id))
          .then(() => {
            this.$msg.createSuccess('保存成功！');
            this.$emit('confirm');
            this.visible = false;
          })
          .finally(() => {
            this.loading = false;
          });
      },
      createActions(row) {
        return [
          {
            danger: true,
            label: '取消通知',
            onClick: () => {
              this.deleteRow(row.id);
            },
          },
        ];
      },
      addRow() {
        const { tableData } = this.$refs.grid.getTableData();
        if (!this.$utils.isEmpty(tableData.filter((item) => this.$utils.isEmpty(item.id)))) {
          this.$msg.createWarning('请先选择消息通知组后再新增');
          return;
        }

        this.$refs.grid.insert({});
      },
      deleteRow(id) {
        this.$msg.createConfirm('是否确定不再通知此消息通知组？').then(() => {
          this.loading = true;
          api
            .deleteSetting(id)
            .then(() => {
              this.$msg.createSuccess('取消成功！');
              this.$refs.grid.commitProxy('reload');
            })
            .finally(() => {
              this.loading = false;
            });
        });
      },
      onSelectNotifyGroup(e, row) {
        this.loading = true;
        api
          .createSetting(e.id)
          .then(() => {
            this.$refs.grid.commitProxy('reload');
          })
          .catch(() => {
            row.id = '';
          })
          .finally(() => {
            this.loading = false;
          });
      },
    },
  });
</script>
