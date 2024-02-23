<template>
  <div>
    <page-wrapper content-full-height fixed-height>
      <!-- 数据列表 -->
      <vxe-grid
        id="FileBox"
        ref="grid"
        resizable
        show-overflow
        highlight-hover-row
        keep-source
        row-id="id"
        :proxy-config="proxyConfig"
        :columns="tableColumn"
        :toolbar-config="toolbarConfig"
        :custom-config="{}"
        :pager-config="{}"
        :loading="loading"
        height="auto"
      >
        <template #form>
          <j-border>
            <a-breadcrumb>
              <a-breadcrumb-item href="" @click="changeFolder(-1)"
                ><FolderOutlined /> 根目录</a-breadcrumb-item
              >
              <a-breadcrumb-item
                href=""
                @click="changeFolder(index)"
                v-for="(item, index) in currentPathList"
                :key="index"
                >{{ item }}</a-breadcrumb-item
              >
            </a-breadcrumb>
          </j-border>
        </template>
        <!-- 工具栏 -->
        <template #toolbar_buttons>
          <a-space>
            <a-button type="primary" :icon="h(SearchOutlined)" @click="doSearch">全盘搜索</a-button>
            <a-button
              type="primary"
              :icon="h(CloudUploadOutlined)"
              @click="$refs.uploadFileDialog.openDialog()"
              >上传文件</a-button
            >
            <a-button :icon="h(FolderAddOutlined)" @click="$refs.createDirDialog.openDialog()"
              >创建文件夹</a-button
            >
            <a-dropdown>
              <template #overlay>
                <a-menu @click="handleCommand">
                  <a-menu-item key="batchDelete" :icon="h(DeleteOutlined)"> 删除所选 </a-menu-item>
                </a-menu>
              </template>
              <a-button>更多<DownOutlined /></a-button>
            </a-dropdown>
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

        <!-- 操作 列自定义内容 -->
        <template #action_default="{ row }">
          <table-action outside :actions="createActions(row)" />
        </template>
      </vxe-grid>
    </page-wrapper>

    <create-dir :parent-path="currentPath" ref="createDirDialog" @confirm="search()" />

    <upload-file :parent-path="currentPath" ref="uploadFileDialog" @confirm="search()" />

    <search-dialog ref="searchDialog" @change-folder="changeFolderAndSearch" />

    <!-- 修改窗口 -->
    <modify :id="id" ref="updateDialog" @confirm="search" />

    <!-- 查看窗口 -->
    <detail :id="id" ref="viewDialog" />
  </div>
</template>

<script>
  import { h, defineComponent } from 'vue';
  import {
    SearchOutlined,
    DeleteOutlined,
    FolderOutlined,
    FolderAddOutlined,
    CloudUploadOutlined,
    DownOutlined,
  } from '@ant-design/icons-vue';
  import CreateDir from './create-dir.vue';
  import UploadFile from './upload-file.vue';
  import SearchDialog from './search.vue';
  import Modify from './modify.vue';
  import Detail from './detail.vue';
  import * as api from '@/api/smart-work/file-box';
  import Icon from '@/components/Icon/Icon.vue';

  export default defineComponent({
    name: 'FileBox',
    components: {
      Icon,
      DownOutlined,
      FolderOutlined,
      CreateDir,
      UploadFile,
      SearchDialog,
      Modify,
      Detail,
    },
    setup() {
      return {
        h,
        SearchOutlined,
        DeleteOutlined,
        CloudUploadOutlined,
        FolderAddOutlined,
      };
    },
    data() {
      return {
        currentPath: '/',
        loading: false,
        // 当前行数据
        id: '',
        ids: [],
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
          { type: 'checkbox', width: 45 },
          { field: 'name', title: '文件', minWidth: 100, slots: { default: 'name_default' } },
          { field: 'fileSize', title: '大小', width: 180 },
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
    computed: {
      currentPathList() {
        if (!this.currentPath) {
          return [];
        }

        if (this.currentPath === '/') {
          return [];
        }

        const arr = this.currentPath.split('/');
        arr.shift();

        return arr;
      },
    },
    created() {},
    methods: {
      doSearch() {
        this.$refs.searchDialog.openDialog();
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
          path: this.currentPath,
        };
      },
      handleCommand({ key }) {
        if (key === 'batchDelete') {
          this.batchDelete();
        }
      },
      // 批量删除
      batchDelete() {
        const records = this.$refs.grid.getCheckboxRecords();

        if (this.$utils.isEmpty(records)) {
          this.$msg.createError('请选择要删除的文件或目录！');
          return;
        }

        this.$msg.createConfirm('是否确定删除选择的文件？').then(() => {
          this.loading = true;
          const ids = records.map((t) => t.id);
          api
            .batchDelete(ids)
            .then((data) => {
              this.$msg.createSuccess('删除成功！');
              this.search();
            })
            .finally(() => {
              this.loading = false;
            });
        });
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
      clickRow(row) {
        if (this.$enums.FILE_BOX_FILE_TYPE.DIR.equalsCode(row.fileType)) {
          this.currentPath += (this.currentPath === '/' ? '' : '/') + row.name;
          this.search();
        } else {
          this.id = row.id;
          this.$refs.viewDialog.openDialog();
        }
      },
      changeFolder(index) {
        if (index < 0) {
          this.currentPath = '/';
          this.search();
        } else {
          let currentPath = [];
          for (let i = 0; i <= index; i++) {
            currentPath.push(this.currentPathList[i]);
          }

          this.currentPath = '/' + currentPath.join('/');
          this.search();
        }
      },
      changeFolderAndSearch(val) {
        this.currentPath = val ? val : '/';
        this.search();
      },
    },
  });
</script>
<style scoped></style>
