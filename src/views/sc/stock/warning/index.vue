<template>
  <div>
    <div v-permission="['stock:warning:query']">
      <page-wrapper content-full-height fixed-height>
        <!-- 数据列表 -->
        <vxe-grid
          id="SysGenerateCode"
          ref="grid"
          resizable
          show-overflow
          highlight-hover-row
          keep-source
          row-id="id"
          :proxy-config="proxyConfig"
          :columns="tableColumn"
          :custom-config="{}"
          :toolbar-config="toolbarConfig"
          :pager-config="{}"
          :loading="loading"
          height="auto"
        >
          <template #form>
            <j-border>
              <j-form bordered label-width="80px" @collapse="$refs.grid.refreshColumn()">
                <j-form-item label="仓库">
                  <store-center-selector v-model:value="searchFormData.scId" />
                </j-form-item>
                <j-form-item label="商品">
                  <product-selector v-model:value="searchFormData.productId" />
                </j-form-item>
                <j-form-item label="操作日期" :content-nest="false">
                  <div class="date-range-container">
                    <a-date-picker
                      v-model:value="searchFormData.updateTimeStart"
                      placeholder=""
                      value-format="YYYY-MM-DD 00:00:00"
                    />
                    <span class="date-split">至</span>
                    <a-date-picker
                      v-model:value="searchFormData.updateTimeEnd"
                      placeholder=""
                      value-format="YYYY-MM-DD 23:59:59"
                    />
                  </div>
                </j-form-item>
                <j-form-item label="状态">
                  <a-select v-model:value="searchFormData.available" placeholder="全部" allow-clear>
                    <a-select-option
                      v-for="item in $enums.AVAILABLE.values()"
                      :key="item.code"
                      :value="item.code"
                      >{{ item.desc }}</a-select-option
                    >
                  </a-select>
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
                v-permission="['stock:warning:add']"
                >新增</a-button
              >
              <a-button
                :icon="h(SettingOutlined)"
                @click="$refs.notifyDialog.openDialog()"
                v-permission="['stock:warning:notify']"
                >设置消息通知组</a-button
              >
            </a-space>
          </template>

          <!-- 状态 列自定义内容 -->
          <template #available_default="{ row }">
            <available-tag :available="row.available" />
          </template>

          <!-- 操作 列自定义内容 -->
          <template #action_default="{ row }">
            <table-action outside :actions="createActions(row)" />
          </template>
        </vxe-grid>
      </page-wrapper>
    </div>
    <!-- 新增窗口 -->
    <add ref="addDialog" @confirm="search" />

    <!-- 修改窗口 -->
    <modify :id="id" ref="updateDialog" @confirm="search" />

    <notify ref="notifyDialog" />
  </div>
</template>

<script>
  import { h, defineComponent } from 'vue';
  import Add from './add.vue';
  import Modify from './modify.vue';
  import Notify from './notify.vue';
  import * as api from '@/api/sc/stock/warning';
  import { SearchOutlined, PlusOutlined, SettingOutlined } from '@ant-design/icons-vue';
  import StoreCenterSelector from '@/components/Selector/src/StoreCenterSelector.vue';

  export default defineComponent({
    name: 'SysGenerateCode',
    components: {
      StoreCenterSelector,
      Add,
      Modify,
      Notify,
    },
    setup() {
      return {
        h,
        SearchOutlined,
        PlusOutlined,
        SettingOutlined,
      };
    },
    data() {
      return {
        loading: false,
        // 当前行数据
        id: '',
        // 查询列表的查询条件
        searchFormData: {
          scId: '',
          productId: '',
          updateTimeStart: '',
          updateTimeEnd: '',
          available: this.$enums.AVAILABLE.ENABLE.code,
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
          { type: 'checkbox', width: 50 },
          { field: 'scCode', title: '仓库编号', width: 100, sortable: true },
          { field: 'scName', title: '仓库名称', width: 140 },
          { field: 'productCode', title: '商品编号', width: 100, sortable: true },
          { field: 'productName', title: '商品名称', width: 140 },
          { field: 'maxLimit', title: '预警上限', width: 100, sortable: true, align: 'right' },
          { field: 'minLimit', title: '预警下限', width: 100, sortable: true, align: 'right' },
          { field: 'updateTime', title: '操作时间', width: 170, sortable: true },
          { field: 'updateBy', title: '操作人', width: 100 },
          { field: 'available', title: '状态', width: 80, slots: { default: 'available_default' } },
          { title: '操作', width: 110, fixed: 'right', slots: { default: 'action_default' } },
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
            query: ({ page, sorts }) => {
              return api.query(this.buildQueryParams(page, sorts));
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
      deleteRow(id) {
        this.$msg.createConfirm('是否确定删除该库存预警？').then(() => {
          this.loading = true;
          api
            .deleteById(id)
            .then(() => {
              this.$msg.createSuccess('删除成功！');
              this.search();
            })
            .finally(() => {
              this.loading = false;
            });
        });
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
        return {
          ...this.searchFormData,
        };
      },
      createActions(row) {
        return [
          {
            permission: ['stock:warning:modify'],
            label: '修改',
            onClick: () => {
              this.id = row.id;
              this.$nextTick(() => this.$refs.updateDialog.openDialog());
            },
          },
          {
            permission: ['stock:warning:delete'],
            danger: true,
            label: '删除',
            onClick: () => {
              this.deleteRow(row.id);
            },
          },
        ];
      },
    },
  });
</script>
<style scoped></style>
