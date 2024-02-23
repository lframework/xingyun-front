<template>
  <div>
    <div v-show="visible">
      <a-row>
        <a-col :span="4">
          <page-wrapper content-full-height fixed-height content-class="!mr-0">
            <category-tree style="height: 100%" @change="(e) => doSearch(e)" />
          </page-wrapper>
        </a-col>
        <a-col :span="20">
          <page-wrapper content-full-height fixed-height>
            <!-- 数据列表 -->
            <vxe-grid
              id="CustomPage"
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
                  <j-form label-width="60px" @collapse="$refs.grid.refreshColumn()">
                    <j-form-item label="页面ID" :span="6">
                      <a-input v-model:value="searchFormData.id" allow-clear />
                    </j-form-item>
                    <j-form-item label="名称" :span="6">
                      <a-input v-model:value="searchFormData.name" allow-clear />
                    </j-form-item>
                  </j-form>
                </j-border>
              </template>
              <!-- 工具栏 -->
              <template #toolbar_buttons>
                <a-space>
                  <a-button type="primary" :icon="h(SearchOutlined)" @click="search">查询</a-button>
                  <a-button type="primary" :icon="h(PlusOutlined)" @click="$refs.addDialog.openDialog()"
                    >新增</a-button
                  >
                  <a-button danger :icon="h(DeleteOutlined)" @click="batchDelete">批量删除</a-button>
                </a-space>
              </template>

              <!-- 操作 列自定义内容 -->
              <template #action_default="{ row }">
                <table-action outside :actions="createActions(row)" />
              </template>
            </vxe-grid>
          </page-wrapper>
        </a-col>
      </a-row>

      <!-- 新增窗口 -->
      <add ref="addDialog" @confirm="search" />

      <!-- 修改窗口 -->
      <modify :id="id" ref="updateDialog" @confirm="search" />

      <!-- 查看窗口 -->
      <detail :id="id" ref="viewDialog" />
    </div>
  </div>
</template>

<script>
  import { h, defineComponent } from 'vue';
  import Add from './add.vue';
  import Modify from './modify.vue';
  import Detail from './detail.vue';
  import CategoryTree from './category-tree.vue';
  import {SearchOutlined, PlusOutlined, DeleteOutlined} from "@ant-design/icons-vue";
  import * as api from '@/api/development/custom/page';

  export default defineComponent({
    name: 'CustomPage',
    // 使用组件
    components: {
      Add,
      Modify,
      Detail,
      CategoryTree,
    },
    setup() {
      return {
        h,
        SearchOutlined,
        PlusOutlined,
        DeleteOutlined,
      };
    },
    data() {
      return {
        // 当前行数据
        id: '',
        // 是否显示加载框
        loading: false,
        visible: true,
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
          { field: 'id', title: '页面ID', width: 120 },
          { field: 'name', title: '名称', minWidth: 180 },
          { field: 'categoryName', title: '分类', width: 120 },
          { field: 'description', title: '备注', minWidth: 200 },
          { field: 'createBy', title: '创建人', width: 100 },
          { field: 'createTime', title: '创建时间', width: 170 },
          { title: '操作', width: 160, fixed: 'right', slots: { default: 'action_default' } },
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
              return api.query(this.buildQueryParams(page));
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
      doSearch(categoryId) {
        if (!this.$utils.isEmpty(categoryId)) {
          if (this.$utils.isEqualWithStr(0, categoryId)) {
            this.searchFormData.categoryId = '';
          } else {
            this.searchFormData.categoryId = categoryId;
          }
        } else {
          this.searchFormData.categoryId = '';
        }

        this.search();
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
        return Object.assign({}, this.searchFormData);
      },
      // 删除
      deleteRow(row) {
        this.$msg.createConfirm('是否确定删除该自定义页面？').then(() => {
          this.loading = true;
          api
            .deleteById(row.id)
            .then(() => {
              this.$msg.createSuccess('删除成功！');
              this.search();
            })
            .finally(() => {
              this.loading = false;
            });
        });
      },
      // 批量删除
      batchDelete() {
        const records = this.$refs.grid.getCheckboxRecords();

        if (this.$utils.isEmpty(records)) {
          this.$msg.createError('请选择要删除的自定义页面！');
          return;
        }

        this.$msg.createConfirm('是否确定删除选择的自定义页面？').then(() => {
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
              this.$nextTick(() => {
                this.$refs.viewDialog.openDialog();
              });
            },
          },
          {
            label: '修改',
            onClick: () => {
              this.id = row.id;
              this.$refs.updateDialog.openDialog();
            },
          },
          {
            label: '删除',
            color: 'error',
            onClick: () => {
              this.deleteRow(row);
            },
          },
        ];
      },
    },
  });
</script>
