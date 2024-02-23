<template>
  <a-modal
    v-model:open="visible"
    :mask-closable="false"
    width="60%"
    title="授权"
    :style="{ top: '20px' }"
  >
    <div v-if="visible" v-permission="['system:tenant:module']" v-loading="loading">
      <a-row :gutter="[16, 16]">
        <a-col v-for="item in tableData" :key="item.id" :span="6">
          <a-card>
            <a-space style="height: 30px">
              <a-switch v-model:checked="item.enabled" size="small" />
              <a-date-picker
                v-show="item.enabled"
                v-model:value="item.expireTime"
                size="small"
                placeholder="过期时间"
                value-format="YYYY-MM-DD 23:59:59"
              />
            </a-space>
            <a-card-meta :title="item.name" style="height: 100px; margin-top: 10px">
              <template #description>
                <span style="color: rgba(0, 0, 0, 0.45); font-size: 12px">{{
                  item.description
                }}</span>
              </template>
            </a-card-meta>
          </a-card>
        </a-col>
      </a-row>
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
  import * as api from '@/api/system/module';

  export default defineComponent({
    // 使用组件
    components: {},

    props: {
      id: {
        type: String,
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
        selectedRows: [],
        // 表格列配置
        tableColumn: [
          { type: 'checkbox', width: 45 },
          { field: 'code', title: '编号', width: 100 },
          { field: 'title', title: '标题', treeNode: true },
          { field: 'display', title: '类型', width: 80, slots: { default: 'menuDisplay_default' } },
          { field: 'permission', title: '权限', width: 220 },
          { field: 'available', title: '状态', width: 80, slots: { default: 'available_default' } },
        ],
      };
    },
    created() {},
    methods: {
      // 打开对话框 由父页面触发
      openDialog() {
        this.visible = true;
        this.tableData = [];

        this.$nextTick(() => {
          this.open();
        });
      },
      // 关闭对话框
      closeDialog() {
        this.visible = false;
        this.$emit('close');
      },
      // 页面显示时触发
      open() {
        this.query();
      },
      // 列表查询数据
      query() {
        this.loading = true;
        api
          .query(this.id)
          .then((res) => {
            this.tableData = res;
          })
          .finally(() => {
            this.loading = false;
          });
      },
      // 提交数据
      submit() {
        for (let i = 0; i < this.tableData.length; i++) {
          const item = this.tableData[i];
          if (item.enabled) {
            if (this.$utils.isEmpty(item.expireTime)) {
              this.$msg.createError(item.name + '过期时间不能为空');
              return;
            }
          }
        }
        this.loading = true;
        const modules = this.tableData
          .filter((item) => item.enabled)
          .map((item) => {
            return {
              moduleId: item.id,
              expireTime: item.expireTime,
            };
          });
        api
          .setting({
            tenantId: this.id,
            modules: modules,
          })
          .then(() => {
            this.$msg.createSuccess('授权成功！');
            this.$emit('confirm');
            this.closeDialog();
          })
          .finally(() => {
            this.loading = false;
          });
      },
    },
  });
</script>
