<template>
  <a-modal
    v-model:open="visible"
    :mask-closable="false"
    width="70%"
    title="选择已有分类属性"
    :style="{ top: '20px' }"
    :footer="null"
  >
    <div v-if="visible" v-loading="loading">
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
      >
        <template #form>
          <j-border>
            <j-form bordered label-width="80px" @collapse="$refs.grid.refreshColumn()">
              <j-form-item label="编号">
                <a-input v-model:value="searchFormData.code" allow-clear />
              </j-form-item>
              <j-form-item label="名称">
                <a-input v-model:value="searchFormData.name" allow-clear />
              </j-form-item>
            </j-form>
          </j-border>
        </template>
        <template #toolbar_buttons>
          <a-space>
            <a-button type="primary" :icon="h(SearchOutlined)" @click="search">查询</a-button>
            <a-button type="primary" :icon="h(CheckOutlined)" @click="submit">确定</a-button>
            <a-button @click="closeDialog">取消</a-button>
          </a-space>
        </template>
      </vxe-grid>
    </div>
  </a-modal>
</template>
<script>
  import { h, defineComponent } from 'vue';
  import * as propertyApi from '@/api/base-data/product/property';
  import * as api from '@/api/base-data/product/category-property';
  import { CheckOutlined, SearchOutlined } from '@ant-design/icons-vue';
  import { buildSortPageVo, isEmpty } from '@/utils/utils';
  import { createError, createSuccess } from '@/hooks/web/msg';
  import { COLUMN_TYPE } from '@/enums/biz/columnType';

  export default defineComponent({
    props: {
      categoryId: {
        type: String,
        required: true,
      },
    },
    setup() {
      return {
        h,
        CheckOutlined,
        SearchOutlined,
      };
    },
    data() {
      return {
        visible: false,
        loading: false,
        searchFormData: {
          code: '',
          name: '',
        },
        toolbarConfig: {
          slots: {
            buttons: 'toolbar_buttons',
          },
        },
        tableColumn: [
          { type: 'checkbox', width: 45 },
          { field: 'code', title: '编号', width: 120, sortable: true },
          { field: 'name', title: '名称', minWidth: 160, sortable: true },
          {
            field: 'isRequired',
            title: '是否必填',
            width: 80,
            formatter: ({ cellValue }) => {
              return cellValue ? '是' : '否';
            },
          },
          {
            field: 'columnType',
            title: '字段类型',
            width: 100,
            formatter: ({ cellValue }) => {
              return COLUMN_TYPE.getDesc(cellValue);
            },
          },
          { field: 'description', title: '备注', minWidth: 160 },
        ],
        proxyConfig: {
          response: {
            result: 'datas',
            total: 'totalCount',
          },
          ajax: {
            query: ({ page, sorts }) => {
              return propertyApi.query({
                ...buildSortPageVo(page, sorts),
                ...this.searchFormData,
              });
            },
          },
        },
      };
    },
    methods: {
      openDialog() {
        this.visible = true;
        this.$nextTick(() => this.search());
      },
      closeDialog() {
        this.visible = false;
      },
      search() {
        this.$refs.grid.commitProxy('reload');
      },
      submit() {
        const records = this.$refs.grid.getCheckboxRecords();
        if (isEmpty(records)) {
          createError('请选择分类属性！');
          return;
        }

        this.loading = true;
        api
          .bind({
            categoryId: this.categoryId,
            propertyIds: records.map((item) => item.id),
          })
          .then(() => {
            createSuccess('绑定成功！');
            this.$emit('confirm');
            this.visible = false;
          })
          .finally(() => {
            this.loading = false;
          });
      },
    },
  });
</script>
