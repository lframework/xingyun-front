<template>
  <a-modal
    v-model:open="visible"
    :mask-closable="false"
    width="60%"
    :style="{ top: '20px' }"
    title="选择"
  >
    <div v-permission="['logistics:sheet:add', 'logistics:sheet:modify']">
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
        :toolbar-config="toolbarConfig"
        :radio-config="{
          trigger: 'row',
          highlight: true,
        }"
        :pager-config="{}"
        :loading="loading"
        @cell-dblclick="submit"
      >
        <!-- 工具栏 -->
        <template #toolbar_buttons>
          <a-space>
            <a-button type="primary" :icon="h(SearchOutlined)" @click="search">查询</a-button>
          </a-space>
        </template>
      </vxe-grid>
    </div>
    <template #footer>
      <a-space>
        <a-button :loading="loading" @click="closeDialog">取消</a-button>
        <a-button type="primary" :loading="loading" @click="submit">确定</a-button>
      </a-space>
    </template>
  </a-modal>
</template>
<script>
  import { h, defineComponent } from 'vue';
  import { SearchOutlined } from '@ant-design/icons-vue';
  import * as api from '@/api/base-data/address';

  export default defineComponent({
    components: {},
    props: {
      entityId: {
        type: String,
        required: true,
      },
      entityType: {
        type: Number,
        required: true,
      },
      addressType: {
        type: Number,
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
        visible: false,
        // 是否显示加载框
        loading: false,
        // 工具栏配置
        toolbarConfig: {
          slots: {
            buttons: 'toolbar_buttons',
          },
        },
        // 列表数据配置
        tableColumn: [
          { type: 'radio', width: 50 },
          { field: 'name', title: '姓名', width: 100 },
          { field: 'telephone', title: '手机号', width: 160 },
          { field: 'areaFullName', title: '地区', width: 200 },
          { field: 'address', title: '详细地址', minWidth: 240 },
          {
            field: 'isDefault',
            title: '是否默认地址',
            width: 120,
            formatter: ({ cellValue }) => {
              return cellValue ? '是' : '否';
            },
          },
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
              return api.selector(this.buildQueryParams(page));
            },
          },
        },
      };
    },
    computed: {},
    created() {
      this.initFormData();
    },
    methods: {
      // 列表发生查询时的事件
      search() {
        this.$refs.grid.commitProxy('reload');
      },
      // 打开对话框 由父页面触发
      openDialog() {
        // 初始化表单数据
        this.visible = true;

        this.$nextTick(() => this.open());
      },
      // 页面显示时触发
      open() {
        // 初始化表单数据
        this.initFormData();
      },
      // 关闭对话框
      closeDialog() {
        this.visible = false;
        this.$emit('close');
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
          entityId: this.entityId,
          entityType: this.entityType,
          addressType: this.addressType,
        };
      },
      // 初始化表单数据
      initFormData() {},
      submit() {
        const records = this.$refs.grid.getRadioRecord();
        if (!this.$utils.isEmpty(records)) {
          this.$emit('confirm', records, this.addressType);
        }
        this.closeDialog();
      },
    },
  });
</script>
<style></style>
