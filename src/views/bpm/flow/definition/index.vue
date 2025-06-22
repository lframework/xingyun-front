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
              id="DesignFlowDefinition"
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
                    <j-form-item label="流程编号" :span="6">
                      <a-input v-model:value="searchFormData.code" allow-clear />
                    </j-form-item>
                    <j-form-item label="流程名称" :span="6">
                      <a-input v-model:value="searchFormData.name" allow-clear />
                    </j-form-item>
                    <j-form-item label="版本号" :span="6">
                      <a-input v-model:value="searchFormData.version" allow-clear />
                    </j-form-item>
                    <j-form-item label="是否发布" :span="6">
                      <a-select
                        placeholder="全部"
                        v-model:value="searchFormData.isPublish"
                        allow-clear
                      >
                        <a-select-option
                          v-for="item in $enums.FLOW_DEFINITION_IS_PUBLISH.values()"
                          :key="item.code"
                          :value="item.code"
                          >{{ item.desc }}</a-select-option
                        >
                      </a-select>
                    </j-form-item>
                    <j-form-item label="激活状态" :span="6">
                      <a-select
                        placeholder="全部"
                        v-model:value="searchFormData.activityStatus"
                        allow-clear
                      >
                        <a-select-option
                          v-for="item in $enums.FLOW_DEFINITION_ACTIVITY_STATUS.values()"
                          :key="item.code"
                          :value="item.code"
                          >{{ item.desc }}</a-select-option
                        >
                      </a-select>
                    </j-form-item>
                    <j-form-item label="版本号" :span="6">
                      <a-input v-model:value="searchFormData.version" allow-clear />
                    </j-form-item>
                  </j-form>
                </j-border>
              </template>
              <!-- 工具栏 -->
              <template #toolbar_buttons>
                <a-space>
                  <a-button type="primary" :icon="h(SearchOutlined)" @click="search">查询</a-button>
                  <a-button
                    type="primary"
                    :icon="h(PlusOutlined)"
                    @click="$refs.addDialog.openDialog()"
                    >新增</a-button
                  >
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

      <!-- 复制窗口 -->
      <copy :id="id" ref="copyDialog" @confirm="search" />

      <!-- 流程设计窗口 -->
      <design :id="id" ref="designDialog" />
    </div>
  </div>
</template>

<script>
  import { h, defineComponent } from 'vue';
  import Add from './add.vue';
  import Modify from './modify.vue';
  import Design from './design.vue';
  import Copy from './copy.vue';
  import CategoryTree from './category-tree.vue';
  import { SearchOutlined, PlusOutlined, DeleteOutlined } from '@ant-design/icons-vue';
  import * as api from '@/api/bpm/flow/definition';

  export default defineComponent({
    name: 'DesignFlowDefinition',
    // 使用组件
    components: {
      Add,
      Modify,
      Design,
      Copy,
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
        searchFormData: {
          code: '',
          name: '',
          version: '',
        },
        // 工具栏配置
        toolbarConfig: {
          // 自定义左侧工具栏
          slots: {
            buttons: 'toolbar_buttons',
          },
        },
        // 列表数据配置
        tableColumn: [
          { type: 'seq', width: 45 },
          { field: 'flowCode', title: '流程编号', width: 100 },
          { field: 'flowName', title: '流程名称', minWidth: 180 },
          { field: 'categoryName', title: '流程分类', width: 120 },
          { field: 'version', title: '版本号', width: 60 },
          {
            field: 'isPublish',
            title: '是否发布',
            width: 80,
            formatter: ({ cellValue }) => {
              return this.$enums.FLOW_DEFINITION_IS_PUBLISH.getDesc(cellValue);
            },
          },
          {
            field: 'activityStatus',
            title: '激活状态',
            width: 80,
            formatter: ({ cellValue }) => {
              return this.$enums.FLOW_DEFINITION_ACTIVITY_STATUS.getDesc(cellValue);
            },
          },
          { field: 'createTime', title: '创建时间', width: 170 },
          { title: '操作', width: 340, fixed: 'right', slots: { default: 'action_default' } },
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
        batchHandleDatas: [],
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
        this.$msg.createConfirm('是否确定删除该流程？').then(() => {
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
      createActions(row) {
        return [
          {
            label: '流程设计',
            ifShow: () => {
              return this.$enums.FLOW_DEFINITION_IS_PUBLISH.N.equalsCode(row.isPublish);
            },
            onClick: () => {
              this.id = row.id;
              this.$nextTick(() => {
                this.$refs.designDialog.openDialog();
              });
            },
          },
          {
            label: '查看',
            onClick: () => {
              this.id = row.id;
              this.$nextTick(() => {
                this.$refs.designDialog.openDialog();
              });
            },
          },
          {
            label: '修改',
            ifShow: () => {
              return this.$enums.FLOW_DEFINITION_IS_PUBLISH.N.equalsCode(row.isPublish);
            },
            onClick: () => {
              this.id = row.id;
              this.$nextTick(() => {
                this.$refs.updateDialog.openDialog();
              });
            },
          },
          {
            label: '发布',
            ifShow: () => {
              return this.$enums.FLOW_DEFINITION_IS_PUBLISH.N.equalsCode(row.isPublish);
            },
            onClick: () => {
              this.$msg.createConfirm('是否确定发布该流程？').then(() => {
                api
                  .setPublishStatus({
                    id: row.id,
                    isPublish: this.$enums.FLOW_DEFINITION_IS_PUBLISH.Y.code,
                  })
                  .then(() => {
                    this.$msg.createSuccess('发布成功！');

                    this.search();
                  });
              });
            },
          },
          {
            label: '取消发布',
            ifShow: () => {
              return this.$enums.FLOW_DEFINITION_IS_PUBLISH.Y.equalsCode(row.isPublish);
            },
            onClick: () => {
              this.$msg.createConfirm('是否确定取消发布该流程？').then(() => {
                api
                  .setPublishStatus({
                    id: row.id,
                    isPublish: this.$enums.FLOW_DEFINITION_IS_PUBLISH.N.code,
                  })
                  .then(() => {
                    this.$msg.createSuccess('取消发布成功！');

                    this.search();
                  });
              });
            },
          },
          {
            label: '激活',
            ifShow: () => {
              return this.$enums.FLOW_DEFINITION_ACTIVITY_STATUS.DEACTIVATE.equalsCode(
                row.activityStatus,
              );
            },
            onClick: () => {
              this.$msg.createConfirm('是否确定激活该流程？').then(() => {
                api
                  .setActivityStatus({
                    id: row.id,
                    activityStatus: this.$enums.FLOW_DEFINITION_ACTIVITY_STATUS.ACTIVATE.code,
                  })
                  .then(() => {
                    this.$msg.createSuccess('激活成功！');

                    this.search();
                  });
              });
            },
          },
          {
            label: '挂起',
            ifShow: () => {
              return this.$enums.FLOW_DEFINITION_ACTIVITY_STATUS.ACTIVATE.equalsCode(
                row.activityStatus,
              );
            },
            onClick: () => {
              this.$msg.createConfirm('是否确定挂起该流程？').then(() => {
                api
                  .setActivityStatus({
                    id: row.id,
                    activityStatus: this.$enums.FLOW_DEFINITION_ACTIVITY_STATUS.DEACTIVATE.code,
                  })
                  .then(() => {
                    this.$msg.createSuccess('挂起成功！');

                    this.search();
                  });
              });
            },
          },
          {
            label: '生成新版本',
            ifShow: () => {
              return this.$enums.FLOW_DEFINITION_IS_PUBLISH.Y.equalsCode(row.isPublish);
            },
            onClick: () => {
              this.id = row.id;
              this.$nextTick(() => {
                this.$refs.copyDialog.openDialog();
              });
            },
          },
          {
            label: '删除',
            danger: true,
            ifShow: () => {
              return this.$enums.FLOW_DEFINITION_IS_PUBLISH.N.equalsCode(row.isPublish);
            },
            onClick: () => {
              this.deleteRow(row);
            },
          },
        ];
      },
    },
  });
</script>
