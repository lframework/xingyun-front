<template>
  <a-modal
    v-model:open="visible"
    :mask-closable="false"
    width="60%"
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
        max-height="520"
      />
    </div>
  </a-modal>
</template>

<script>
  import { defineComponent } from 'vue';

  export default defineComponent({
    props: {
      queryFn: {
        type: Function,
        required: true,
      },
    },
    data() {
      return {
        visible: false,
        loading: false,
        propertyId: '',
        propertyName: '',
        tableData: [],
        tableColumn: [
          { field: 'code', title: '编号', width: 120 },
          { field: 'name', title: '名称', minWidth: 160 },
          { field: 'description', title: '备注', minWidth: 180 },
        ],
      };
    },
    computed: {
      title() {
        return this.propertyName ? `已关联商品分类 - ${this.propertyName}` : '已关联商品分类';
      },
    },
    methods: {
      openDialog(row) {
        this.propertyId = row.id;
        this.propertyName = row.name;
        this.visible = true;
        this.$nextTick(() => this.search());
      },
      search() {
        if (!this.propertyId) {
          return;
        }

        this.loading = true;
        this.queryFn(this.propertyId)
          .then((res) => {
            this.tableData = res || [];
          })
          .finally(() => {
            this.loading = false;
          });
      },
    },
  });
</script>
