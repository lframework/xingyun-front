<template>
  <a-modal
    v-model:open="visible"
    :mask-closable="false"
    width="60%"
    title="授权"
    :style="{ top: '20px' }"
  >
    <div v-if="visible" v-permission="['system:user:permission']" v-loading="loading">
      <vxe-grid
        ref="grid"
        resizable
        show-overflow
        highlight-hover-row
        keep-source
        row-id="id"
        :tree-config="{}"
        :export-config="{}"
        :data="tableData"
        :checkbox-config="{ checkField: 'selected' }"
        :columns="tableColumn"
        :max-height="300"
      />
    </div>

    <template #footer>
      <div class="form-modal-footer">
        <a-space>
          <a-button type="primary" :loading="loading" @click="submit">保存</a-button>
          <a-button :loading="loading" @click="closeDialog">取消</a-button>
        </a-space>
      </div>
    </template>
  </a-modal>
</template>
<script>
  import { defineComponent } from 'vue';
  import * as api from '@/api/system/user-role';

  export default defineComponent({
    // 使用组件
    components: {},
    props: {
      ids: {
        type: Array,
        required: true,
      },
    },
    data() {
      return {
        // 是否可见
        visible: false,
        // 是否显示加载框
        loading: false,
        // 表格数据
        tableData: [],
        // 表格列配置
        tableColumn: [
          { type: 'checkbox', width: 45 },
          { field: 'code', title: '编号', width: 100 },
          { field: 'name', title: '名称', minWidth: 160 },
          { field: 'permission', title: '权限', width: 220 },
        ],
      };
    },
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
      // 页面显示时触发
      open() {
        // 查询数据
        this.query();
      },
      // 列表查询数据
      query() {
        this.loading = true;
        const params = {};
        if (!this.$utils.isEmpty(this.ids) && this.ids.length === 1) {
          params.userId = this.ids[0];
        }
        api
          .roles(params)
          .then((res) => {
            this.tableData = res;
          })
          .finally(() => {
            this.loading = false;
          });
      },
      // 提交数据
      submit() {
        this.loading = true;
        const records = this.$refs.grid.getCheckboxRecords();
        const roleIds = this.$utils.isEmpty(records) ? [] : records.map((item) => item.id);
        api
          .setting({
            userIds: this.ids,
            roleIds: roleIds,
          })
          .then(() => {
            this.$msg.createSuccess('授权成功！');
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
