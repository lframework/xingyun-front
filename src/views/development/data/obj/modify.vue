<template>
  <a-modal
    v-model:open="visible"
    :mask-closable="false"
    width="85%"
    title="修改"
    :style="{ top: '20px' }"
    :footer="null"
  >
    <div v-if="visible" v-loading="loading">
      <j-border>
        <j-form bordered :enable-collapse="false" label-width="80px">
          <j-form-item :span="12" label="名称" :required="true">
            <a-input v-model:value="formData.name" allow-clear />
          </j-form-item>
          <j-form-item :span="12" label="分类">
            <gen-data-obj-category-selector v-model:value="formData.categoryId" />
          </j-form-item>
          <j-form-item :span="12" label="状态" :required="true">
            <a-select v-model:value="formData.available" allow-clear>
              <a-select-option
                v-for="item in $enums.AVAILABLE.values()"
                :key="item.code"
                :value="item.code"
                >{{ item.desc }}</a-select-option
              >
            </a-select>
          </j-form-item>
          <j-form-item :span="24" label="备注" :content-nest="false">
            <a-textarea v-model:value="formData.description" />
          </j-form-item>
        </j-form>
      </j-border>

      <div style="height: 10px"></div>

      <j-border>
        <j-form bordered :enable-collapse="false" label-width="80px">
          <j-form-item :span="12" label="主表" :required="true">
            <span>{{ formData.mainTableName }}</span>
          </j-form-item>
          <j-form-item :span="12" label="主表别名" :required="true">
            <a-input v-model:value="formData.mainTableAlias" />
          </j-form-item>
        </j-form>
      </j-border>

      <div style="height: 10px"></div>

      <j-border title="关联子表">
        <rela-table ref="relaTable" :main-table-id="formData.mainTableId" :columns="columns" />
      </j-border>

      <j-border title="自定义查询">
        <custom-query
          ref="customQuery"
          :main-table-id="formData.mainTableId"
          :columns="queryColumns"
        />
      </j-border>

      <div class="form-modal-footer">
        <a-space>
          <a-button type="primary" :loading="loading" html-type="submit" @click="submit"
            >保存</a-button
          >
          <a-button :loading="loading" @click="closeDialog">取消</a-button>
        </a-space>
      </div>
    </div>
  </a-modal>
</template>
<script>
  import { defineComponent } from 'vue';
  import RelaTable from './rela-table.vue';
  import CustomQuery from './custom-query.vue';
  import * as api from '@/api/development/data/obj';

  export default defineComponent({
    components: {
      RelaTable,
      CustomQuery,
    },
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
        // 表单数据
        formData: {},
        columns: [],
        queryColumns: [],
      };
    },
    computed: {},
    created() {
      // 初始化表单数据
      this.initFormData();
    },
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
      // 初始化表单数据
      initFormData() {
        this.formData = {
          id: '',
          name: '',
          categoryId: '',
          description: '',
          mainTableId: '',
          mainTableAlias: '',
          available: '',
        };

        this.columns = [];
        this.queryColumns = [];
      },
      // 页面显示时由父页面触发
      open() {
        // 初始化表单数据
        this.initFormData();

        this.loadFormData();
      },
      // 查询数据
      async loadFormData() {
        this.loading = true;
        api
          .get(this.id)
          .then((data) => {
            let columns = data.columns || [];
            columns = columns.map((item) => {
              return Object.assign({ subTableId: item.subTableId }, item);
            });
            this.$utils.clearAll(this.columns);
            this.columns.push(...columns);
            delete data.columns;

            const queryColumns = data.queryColumns || [];
            this.queryColumns = queryColumns;
            delete data.queryColumns;

            this.formData = data;
          })
          .finally(() => {
            this.loading = false;
          });
      },
      submit() {
        if (this.$utils.isEmpty(this.formData.name)) {
          this.$msg.createError('请输入名称');
          return;
        }
        if (this.$utils.isEmpty(this.formData.mainTableAlias)) {
          this.$msg.createError('请输入主表别名');
          return;
        }
        if (!this.$refs.relaTable.validDate()) {
          return;
        }
        if (!this.$refs.customQuery.validDate()) {
          return;
        }
        const params = Object.assign(
          {
            categoryId: this.formData.categoryId,
            columns: this.$refs.relaTable.getColumns(),
            queryColumns: this.$refs.customQuery.getColumns(),
          },
          this.formData,
        );

        this.loading = true;
        api
          .update(params)
          .then(() => {
            this.$msg.createSuccess('修改成功！');
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
