<template>
  <a-modal
    v-model:open="visible"
    :mask-closable="false"
    width="80%"
    :style="{ top: '20px' }"
    title="字典值管理"
    :footer="null"
  >
    <div v-if="visible" v-permission="['system:dic:query']">
      <page-wrapper content-full-height fixed-height>
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
          height="auto"
        >
          <template #form>
            <j-border>
              <j-form label-width="80px" @collapse="$refs.grid.refreshColumn()">
                <j-form-item label="编号">
                  <a-input v-model:value="searchFormData.code" allow-clear />
                </j-form-item>
                <j-form-item label="名称">
                  <a-input v-model:value="searchFormData.name" allow-clear />
                </j-form-item>
              </j-form>
            </j-border>
          </template>
          <!-- 工具栏 -->
          <template #toolbar_buttons>
            <a-space>
              <a-button type="primary" :icon="h(SearchOutlined)" @click="search">查询</a-button>
              <a-button
                v-permission="['system:dic-item:add']"
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

      <!-- 新增窗口 -->
      <add ref="addDialog" :dic-id="dicId" @confirm="search" />

      <!-- 修改窗口 -->
      <modify ref="updateDialog" :item-id="id" @confirm="search" />
    </div>
  </a-modal>
</template>
<script>
  import { h, defineComponent } from 'vue';
  import Add from './add.vue';
  import Modify from './modify.vue';
  import * as api from '@/api/system/dic-item';
  import { SearchOutlined, PlusOutlined } from '@ant-design/icons-vue';

  export default defineComponent({
    components: {
      Modify,
      Add,
    },
    props: {
      dicId: {
        type: String,
        required: true,
      },
    },
    setup() {
      return {
        h,
        SearchOutlined,
        PlusOutlined,
      };
    },
    data() {
      return {
        // 是否可见
        visible: false,
        // 是否显示加载框
        loading: false,
        id: '',
        // 查询列表的查询条件
        searchFormData: {
          code: '',
          name: '',
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
          { type: 'seq', width: 50 },
          { field: 'code', title: '编号', width: 120, sortable: true },
          { field: 'name', title: '名称', minWidth: 160, sortable: true },
          { field: 'orderNo', title: '排序', width: 80, align: 'right' },
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
            query: ({ page, sorts, filters }) => {
              return api.query(this.buildQueryParams(page, sorts));
            },
          },
        },
      };
    },
    computed: {},
    created() {},
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
      // 列表发生查询时的事件
      search() {
        this.$refs.grid.commitProxy('reload');
      },
      // 查询前构建查询参数结构
      buildQueryParams(page, sorts) {
        return {
          ...this.$utils.buildSortPageVo(page, sorts),
          ...this.buildSearchFormData(),
        };
      },
      // 查询前构建具体的查询参数
      buildSearchFormData() {
        return Object.assign({ dicId: this.dicId }, this.searchFormData);
      },
      createActions(row) {
        return [
          {
            permission: ['system:dic-item:modify'],
            label: '修改',
            onClick: () => {
              this.id = row.id;
              this.$nextTick(() => this.$refs.updateDialog.openDialog());
            },
          },
          {
            permission: ['system:dic-item:delete'],
            color: 'error',
            label: '删除',
            onClick: () => {
              this.deleteRow(row);
            },
          },
        ];
      },
      // 页面显示时触发
      open() {},
      deleteRow(row) {
        this.$msg.createConfirm('是否确认删除此数据字典值？').then(() => {
          api.deleteById(row.id).then(() => {
            this.$msg.createSuccess('删除成功！');
            this.search();
          });
        });
      },
    },
  });
</script>
