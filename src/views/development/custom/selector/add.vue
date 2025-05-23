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
        <j-form bordered :enable-collapse="false" label-width="80px">
          <j-form-item :span="12" label="名称" :required="true">
            <a-input v-model:value="formData.name" allow-clear />
          </j-form-item>
          <j-form-item :span="12" label="分类">
            <gen-custom-selector-category-selector v-model:value="formData.categoryId" />
          </j-form-item>
          <j-form-item :span="24" label="备注" :content-nest="false">
            <a-textarea v-model:value="formData.description" />
          </j-form-item>
        </j-form>
      </j-border>

      <div style="height: 10px"></div>

      <j-border>
        <j-form bordered :enable-collapse="false" label-width="100px">
          <j-form-item :span="8" label="自定义列表" :required="true">
            <gen-custom-list-selector
              v-model:value="formData.customListId"
              :request-params="{ available: true }"
              @update:value-row="(e) => changeTable(e)"
            />
          </j-form-item>
        </j-form>
      </j-border>

      <div style="height: 10px"></div>

      <j-border title="基础配置">
        <j-form bordered :enable-collapse="false" label-width="160px">
          <j-form-item :span="8" label="对话框标题">
            <a-input v-model:value="formData.dialogTittle" />
          </j-form-item>
          <j-form-item :span="8" label="对话框宽度" :required="true">
            <a-input v-model:value="formData.dialogWidth" />
          </j-form-item>
          <j-form-item :span="8" label="占位符">
            <a-input v-model:value="formData.placeholder" />
          </j-form-item>
        </j-form>
      </j-border>

      <div style="height: 10px"></div>

      <j-border title="数据配置">
        <j-form bordered :enable-collapse="false" label-width="160px">
          <j-form-item :span="8" label="ID字段" :required="true">
            <a-tree-select
              v-model:value="formData.idColumn"
              :field-names="{ label: 'name', key: 'id', value: 'id', children: 'columns' }"
              style="width: 100%"
              :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
              :tree-data="treeColumns"
              tree-default-expand-all
            />
          </j-form-item>
          <j-form-item :span="8" label="名称字段" :required="true">
            <a-tree-select
              v-model:value="formData.nameColumn"
              :field-names="{ label: 'name', key: 'id', value: 'id', children: 'columns' }"
              style="width: 100%"
              :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
              :tree-data="treeColumns"
              tree-default-expand-all
            />
          </j-form-item>
        </j-form>
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
  import * as api from '@/api/development/custom/selector';
  import * as dataObjApi from '@/api/development/data/obj';

  export default defineComponent({
    components: {},
    data() {
      return {
        // 是否可见
        visible: false,
        // 是否显示加载框
        loading: false,
        // 表单数据
        formData: {},
        // 树形菜单需要的字段
        treeColumns: [],
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
          customListId: '',
        };

        this.treeColumns = [];
      },
      // 页面显示时由父页面触发
      open() {
        // 初始化表单数据
        this.initFormData();
      },
      changeTable(e) {
        this.columns = [];
        this.queryColumns = [];
        dataObjApi.getColumns(e.dataObjId).then((res) => {
          this.treeColumns = res.filter((item) => item.id !== 'customQuery');
          this.treeColumns.forEach((item) => {
            item.selectable = false;
            return item;
          });
        });
      },
      submit() {
        if (this.$utils.isEmpty(this.formData.name)) {
          this.$msg.createError('请输入名称');
          return;
        }
        if (this.$utils.isEmpty(this.formData.customListId)) {
          this.$msg.createError('请选择自定义列表');
          return;
        }
        if (this.$utils.isEmpty(this.formData.dialogWidth)) {
          this.$msg.createError('请输入对话框宽度');
          return;
        }

        if (this.$utils.isEmpty(this.formData.idColumn)) {
          this.$msg.createError('请选择ID字段');
          return;
        }
        if (this.$utils.isEmpty(this.formData.nameColumn)) {
          this.$msg.createError('请选择父级ID字段');
          return;
        }

        const treeColumns = [];
        const tmpArr = this.treeColumns.map((item) => {
          return item.columns || [];
        });
        tmpArr.forEach((item) => treeColumns.push(...item));

        this.formData.idColumnRelaId = treeColumns.filter(
          (item) => item.id === this.formData.idColumn,
        )[0].relaId;
        this.formData.nameColumnRelaId = treeColumns.filter(
          (item) => item.id === this.formData.nameColumn,
        )[0].relaId;

        const params = Object.assign(
          {
            customListId: this.formData.customListId,
            categoryId: this.formData.categoryId,
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
