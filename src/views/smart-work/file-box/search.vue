<template>
  <a-modal
    v-model:open="visible"
    :mask-closable="false"
    width="80%"
    title="全盘搜索"
    :style="{ top: '20px' }"
    :footer="null"
  >
    <!-- 数据列表 -->
    <vxe-grid
      ref="grid"
      resizable
      show-overflow
      highlight-hover-row
      keep-source
      row-id="id"
      :proxy-config="proxyConfig"
      :columns="tableColumn"
      :toolbar-config="toolbarConfig"
      :pager-config="{}"
      :loading="loading"
      :height="500"
    >
      <template #form>
        <j-border>
          <j-form label-width="100px">
            <j-form-item label="检索关键字">
              <a-input v-model:value="searchFormData.name" allow-clear />
            </j-form-item>
          </j-form>
        </j-border>
      </template>
      <!-- 工具栏 -->
      <template #toolbar_buttons>
        <a-space>
          <a-button type="primary" :icon="h(SearchOutlined)" @click="search">查询</a-button>
        </a-space>
      </template>

      <!-- 文件名 列自定义内容 -->
      <template #name_default="{ row }">
        <a @click="() => clickRow(row)">
          <a-space>
            <icon
              v-if="$enums.FILE_BOX_FILE_TYPE.DIR.equalsCode(row.fileType)"
              icon="flat-color-icons:folder"
            />
            <icon v-else icon="flat-color-icons:file" />
            <span>{{ row.name }}</span>
          </a-space>
        </a>
      </template>

      <!-- 路径 列自定义内容 -->
      <template #filePath_default="{ row }">
        <a @click="() => changeFolder(row)">{{ row.filePath === '/' ? '根目录' : '根目录' + row.filePath }}</a>
      </template>

      <!-- 操作 列自定义内容 -->
      <template #action_default="{ row }">
        <table-action outside :actions="createActions(row)" />
      </template>
    </vxe-grid>

    <!-- 修改窗口 -->
    <modify :id="id" ref="updateDialog" @confirm="search" />

    <!-- 查看窗口 -->
    <detail :id="id" ref="viewDialog" />
  </a-modal>
</template>
<script>
  import { defineComponent, h } from 'vue';
  import { SearchOutlined } from '@ant-design/icons-vue';
  import Icon from '@/components/Icon/Icon.vue';
  import Modify from './modify.vue';
  import Detail from './detail.vue';
  import * as api from '@/api/smart-work/file-box';

  export default defineComponent({
    components: {
      Icon,
      Modify,
      Detail,
    },
    props: {
      parentPath: {
        type: String,
        required: true,
      },
    },
    setup() {
      return {
        h,
        SearchOutlined,
      };
    },
    data() {
      return {
        id: '',
        // 是否可见
        visible: false,
        // 是否显示加载框
        loading: false,
        // 查询列表的查询条件
        searchFormData: {},
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
          { field: 'name', title: '文件', minWidth: 100, slots: { default: 'name_default' } },
          { field: 'fileSize', title: '大小', width: 180 },
          { field: 'filePath', title: '路径', width: 180, slots: { default: 'filePath_default' } },
          { field: 'createTime', title: '上传时间', width: 170 },
          { title: '操作', width: 120, fixed: 'right', slots: { default: 'action_default' } },
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
            query: ({ page }) => {
              return api.query(this.buildQueryParams(page));
            },
          },
        },
      };
    },
    computed: {},
    created() {
      // 初始化表单数据
      this.initFormData();
    },
    methods: {
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
      // 初始化表单数据
      initFormData() {
        this.searchFormData = {};
      },
      // 页面显示时触发
      open() {
        // 初始化表单数据
        this.initFormData();
      },
      // 列表发生查询时的事件
      search() {
        this.$refs.grid.commitProxy('reload');
      },
      // 查询前构建查询参数结构
      buildQueryParams(page) {
        return Object.assign(
          {
            pageIndex: page.currentPage,
            pageSize: page.pageSize,
          },
          this.buildSearchFormData(),
        );
      },
      // 查询前构建具体的查询参数
      buildSearchFormData() {
        return {
          ...this.searchFormData,
        };
      },
      createActions(row) {
        return [
          {
            label: '查看',
            onClick: () => {
              this.id = row.id;
              this.$nextTick(() => this.$refs.viewDialog.openDialog());
            },
          },
          {
            label: '修改',
            onClick: () => {
              this.id = row.id;
              this.$nextTick(() => this.$refs.updateDialog.openDialog());
            },
          },
        ];
      },
      changeFolder(row) {
        this.$emit('change-folder', row.filePath);
        this.visible = false;
      },
      clickRow(row) {
        this.id = row.id;
        this.$refs.viewDialog.openDialog();
      },
    },
  });
</script>
