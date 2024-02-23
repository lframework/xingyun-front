<template>
  <a-modal
    v-model:open="visible"
    :mask-closable="false"
    width="85%"
    title="新增"
    :style="{ top: '20px' }"
    :footer="null"
  >
    <div v-if="visible" v-loading="loading">
      <j-border>
        <j-form :enable-collapse="false" label-width="80px">
          <j-form-item :span="12" label="名称" :required="true">
            <a-input v-model:value="formData.name" allow-clear />
          </j-form-item>
          <j-form-item :span="12" label="分类">
            <gen-data-entity-category-selector v-model:value="formData.categoryId" />
          </j-form-item>
          <j-form-item :span="24" label="备注" :content-nest="false">
            <a-textarea v-model:value="formData.description" />
          </j-form-item>
        </j-form>
      </j-border>

      <div style="height: 10px"></div>

      <j-border>
        <j-form :enable-collapse="false" label-width="80px">
          <j-form-item :span="12" label="数据表" :required="true">
            <simple-db-table-selector
              v-model:value="formData.tableId"
              @update:value="changeTable"
            />
          </j-form-item>
        </j-form>
      </j-border>

      <div style="height: 10px"></div>

      <j-border>
        <generate-column ref="generateColumn" :columns="columns" />
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
  import GenerateColumn from './generate-column.vue';
  import * as api from '@/api/development/data/entity';

  export default defineComponent({
    components: {
      GenerateColumn,
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
          name: '',
          categoryId: '',
          description: '',
          tableId: '',
        };

        this.columns = [];
      },
      // 页面显示时由父页面触发
      open() {
        // 初始化表单数据
        this.initFormData();
      },
      changeTable(e) {
        this.columns = [];
        if (this.$utils.isEmpty(e)) {
          return;
        }
        this.loading = true;
        api
          .getColumns({
            tableName: e,
          })
          .then((res) => {
            res = res.map((item) => {
              return Object.assign(
                {
                  dataDic: {
                    id: item.dataDicId,
                    name: item.dataDicName,
                  },
                  customSelector: {
                    id: item.customSelectorId,
                    name: item.customSelectorName,
                  },
                  regularExpression: '',
                },
                item,
              );
            });
            this.columns = res;
          })
          .catch(() => {
            this.formData.tableId = '';
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
        if (!this.$refs.generateColumn.validDate()) {
          return;
        }
        const params = Object.assign(
          {
            tableName: this.formData.tableId,
            categoryId: this.formData.categoryId,
            columns: this.$refs.generateColumn.getColumns().map((item) => {
              item.dataDicId = item.dataDic.id;
              item.customSelectorId = item.customSelector.id;
              return item;
            }),
          },
          this.formData,
        );

        this.loading = true;
        api
          .create(params)
          .then(() => {
            this.$msg.createSuccess('新增成功！');
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
