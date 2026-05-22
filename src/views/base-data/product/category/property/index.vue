<template>
  <a-modal
    v-model:open="visible"
    :mask-closable="false"
    width="80%"
    :title="title"
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
        :data="tableData"
        :columns="tableColumn"
        :toolbar-config="toolbarConfig"
      >
        <template #toolbar_buttons>
          <a-space>
            <a-button type="primary" :icon="h(PlusOutlined)" @click="$refs.addDialog.openDialog()"
              >新增分类属性</a-button
            >
            <a-button
              type="primary"
              :icon="h(CheckOutlined)"
              @click="$refs.selectDialog.openDialog()"
              >选择已有分类属性</a-button
            >
            <a-button :icon="h(ReloadOutlined)" @click="search">刷新</a-button>
          </a-space>
        </template>

        <template #action_default="{ row }">
          <table-action outside :actions="createActions(row)" />
        </template>
      </vxe-grid>

      <add ref="addDialog" :category-id="categoryId" @confirm="handleConfirm" />
      <select-property ref="selectDialog" :category-id="categoryId" @confirm="handleConfirm" />
      <modify :id="propertyId" ref="updateDialog" @confirm="search" />
      <item ref="itemDialog" :property-id="propertyId" />
    </div>
  </a-modal>
</template>

<script>
  import { h, defineComponent } from 'vue';
  import Add from './add.vue';
  import SelectProperty from './select.vue';
  import Modify from '../../property/modify.vue';
  import Item from '../../property/item/index.vue';
  import * as api from '@/api/base-data/product/category-property';
  import { CheckOutlined, PlusOutlined, ReloadOutlined } from '@ant-design/icons-vue';
  import { createConfirm, createSuccess } from '@/hooks/web/msg';
  import { COLUMN_TYPE } from '@/enums/biz/columnType';

  export default defineComponent({
    components: {
      Add,
      SelectProperty,
      Modify,
      Item,
    },
    setup() {
      return {
        h,
        CheckOutlined,
        PlusOutlined,
        ReloadOutlined,
      };
    },
    data() {
      return {
        visible: false,
        loading: false,
        categoryId: '',
        categoryName: '',
        propertyId: '',
        tableData: [],
        toolbarConfig: {
          slots: {
            buttons: 'toolbar_buttons',
          },
        },
        tableColumn: [
          { field: 'code', title: '编号', width: 120 },
          { field: 'name', title: '名称', minWidth: 160 },
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
          {
            title: '操作',
            field: 'action',
            width: 180,
            fixed: 'right',
            slots: { default: 'action_default' },
          },
        ],
      };
    },
    computed: {
      title() {
        return this.categoryName ? `分类属性配置 - ${this.categoryName}` : '分类属性配置';
      },
    },
    methods: {
      openDialog(row) {
        this.categoryId = row.id;
        this.categoryName = row.name;
        this.visible = true;
        this.$nextTick(() => this.search());
      },
      search() {
        if (!this.categoryId) {
          return;
        }

        this.loading = true;
        api
          .query(this.categoryId)
          .then((res) => {
            this.tableData = res || [];
          })
          .finally(() => {
            this.loading = false;
          });
      },
      createActions(row) {
        return [
          {
            permission: ['base-data:product:property-item:query'],
            label: '分类属性值管理',
            ifShow: () => {
              return !COLUMN_TYPE.CUSTOM.equalsCode(row.columnType);
            },
            onClick: () => {
              this.propertyId = row.id;
              this.$nextTick(() => this.$refs.itemDialog.openDialog());
            },
          },
          {
            permission: ['base-data:product:property:modify'],
            label: '修改',
            onClick: () => {
              this.propertyId = row.id;
              this.$nextTick(() => this.$refs.updateDialog.openDialog());
            },
          },
          {
            permission: ['base-data:product:category:modify'],
            label: '移除',
            danger: true,
            onClick: () => {
              createConfirm('是否确认从当前分类移除此分类属性？').then(() => {
                api.remove(this.categoryId, row.id).then(() => {
                  createSuccess('移除成功！');
                  this.handleConfirm();
                });
              });
            },
          },
        ];
      },
      handleConfirm() {
        this.search();
        this.$emit('confirm');
      },
    },
  });
</script>
