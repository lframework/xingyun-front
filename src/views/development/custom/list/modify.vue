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
        <j-form :enable-collapse="false" label-width="80px">
          <j-form-item :span="12" label="名称" :required="true">
            <a-input v-model:value="formData.name" allow-clear />
          </j-form-item>
          <j-form-item :span="12" label="分类">
            <gen-custom-list-category-selector v-model:value="formData.categoryId" />
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
        <j-form :enable-collapse="false" label-width="80px">
          <j-form-item :span="12" label="数据对象" :required="true">
            <span>{{ formData.dataObjName }}</span>
          </j-form-item>
        </j-form>
      </j-border>

      <div style="height: 10px"></div>

      <j-border title="基础配置">
        <j-form :enable-collapse="false" label-width="160px">
          <j-form-item :span="8" label="是否允许导出" :required="true">
            <a-select v-model:value="formData.allowExport" allow-clear>
              <a-select-option :value="true">是</a-select-option>
              <a-select-option :value="false">否</a-select-option>
            </a-select>
          </j-form-item>
          <j-form-item :span="8" label="列表类型" :required="true">
            <a-select v-model:value="formData.listType" allow-clear>
              <a-select-option
                v-for="item in $enums.GEN_CUSTOM_LIST_TYPE.values()"
                :key="item.code"
                :value="item.code"
                >{{ item.desc }}</a-select-option
              >
            </a-select>
          </j-form-item>
          <j-form-item :span="8" label="表单Label宽度（px）" :required="true">
            <a-input-number
              v-model:value="formData.labelWidth"
              class="number-input"
              :min="1"
              :precision="0"
            />
          </j-form-item>
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
          <j-form-item v-if="!formData.treeData" :span="8" label="是否分页" :required="true">
            <a-select v-model:value="formData.hasPage" allow-clear>
              <a-select-option :value="true">是</a-select-option>
              <a-select-option :value="false">否</a-select-option>
            </a-select>
          </j-form-item>
          <j-form-item :span="8" label="是否树形列表" :required="true">
            <a-select v-model:value="formData.treeData" allow-clear>
              <a-select-option :value="true">是</a-select-option>
              <a-select-option :value="false">否</a-select-option>
            </a-select>
          </j-form-item>
          <j-form-item v-if="formData.treeData" :span="8" label="父级ID字段" :required="true">
            <a-tree-select
              v-model:value="formData.treePidColumn"
              :replace-fields="{ title: 'name', key: 'id', value: 'id', children: 'columns' }"
              style="width: 100%"
              :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
              :tree-data="treeColumns"
              tree-default-expand-all
            />
          </j-form-item>
          <j-form-item v-if="formData.treeData" :span="8" label="树形节点字段" :required="true">
            <a-tree-select
              v-model:value="formData.treeNodeColumn"
              :replace-fields="{ title: 'name', key: 'id', value: 'id', children: 'columns' }"
              style="width: 100%"
              :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
              :tree-data="treeColumns"
              tree-default-expand-all
            />
          </j-form-item>
          <j-form-item v-if="formData.treeData" :span="8" label="子节点Key值" :required="true">
            <a-input v-model:value="formData.treeChildrenKey" allow-clear />
          </j-form-item>
        </j-form>
      </j-border>

      <div style="height: 10px"></div>

      <j-border title="工具栏配置">
        <toolbar ref="toolbar" />
      </j-border>

      <div style="height: 10px"></div>

      <j-border title="查询条件">
        <query-params ref="queryParams" :columns="queryColumns" />
      </j-border>

      <div style="height: 10px"></div>

      <j-border title="列表配置">
        <query-detail ref="queryDetail" :columns="columns" />
      </j-border>

      <div style="height: 10px"></div>

      <j-border title="操作列配置">
        <handle-column ref="handleColumn" />
      </j-border>

      <div style="height: 10px"></div>

      <j-border title="查询前置SQL语句">
        <a-textarea
          v-model:value="formData.queryPrefixSql"
          :auto-size="{ minRows: 4, maxRows: 4 }"
        />
      </j-border>

      <div style="height: 10px"></div>

      <j-border title="查询后置SQL语句">
        <a-textarea
          v-model:value="formData.querySuffixSql"
          :auto-size="{ minRows: 4, maxRows: 4 }"
        />
      </j-border>

      <div style="height: 10px"></div>

      <j-border title="后置SQL语句">
        <a-textarea v-model:value="formData.suffixSql" :auto-size="{ minRows: 4, maxRows: 4 }" />
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
  import QueryDetail from './query-detail.vue';
  import QueryParams from './query-params.vue';
  import Toolbar from './toolbar.vue';
  import HandleColumn from './handle-column.vue';
  import * as api from '@/api/development/custom/list';
  import * as dataObjApi from '@/api/development/data/obj';

  export default defineComponent({
    components: {
      QueryDetail,
      QueryParams,
      Toolbar,
      HandleColumn,
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
        // 所有字段
        columns: [],
        // 查询条件的字段，排除掉自定义查询条件
        queryColumns: [],
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
          id: '',
          name: '',
          categoryId: '',
          description: '',
          available: '',
        };

        this.columns = [];
        this.queryColumns = [];
        this.treeColumns = [];
      },
      // 页面显示时由父页面触发
      open() {
        // 初始化表单数据
        this.initFormData();

        this.loadFormData();
      },
      // 查询数据
      loadFormData() {
        this.loading = true;
        api
          .get(this.id)
          .then((data) => {
            this.formData = data;

            this.changeTable().then((res) => {
              this.columns = res;
              this.columns.forEach((item) => {
                item.checkable = false;
                return item;
              });
              this.queryColumns = res.filter((item) => item.id !== 'customQuery');
              this.queryColumns.forEach((item) => {
                item.checkable = false;
                return item;
              });

              this.$refs.queryParams.setTableData(data.queryParams || []);

              this.$refs.queryDetail.setTableData(data.details || []);

              this.treeColumns = res.filter((item) => item.id !== 'customQuery');
              this.treeColumns.forEach((item) => {
                item.selectable = false;
                return item;
              });
            });

            this.formData.toolbars = this.$utils.isEmpty(this.formData.toolbars)
              ? []
              : this.formData.toolbars;
            this.$refs.toolbar.setTableData(
              this.formData.toolbars.map((item) => {
                return Object.assign({}, item, {
                  customForm: item.customFormId,
                });
              }),
            );

            this.formData.handleColumns = this.$utils.isEmpty(this.formData.handleColumns)
              ? []
              : this.formData.handleColumns;
            this.$refs.handleColumn.setTableData(
              this.formData.handleColumns.map((item) => {
                return Object.assign({}, item, {
                  customForm: item.customFormId,
                });
              }),
            );
          })
          .finally(() => {
            this.loading = false;
          });
      },
      changeTable() {
        this.columns = [];
        return dataObjApi.getColumns(this.formData.dataObjId);
      },
      submit() {
        if (this.$utils.isEmpty(this.formData.name)) {
          this.$msg.createError('请输入名称');
          return;
        }
        if (this.$utils.isEmpty(this.formData.available)) {
          this.$msg.createError('请选择状态');
          return;
        }
        if (this.$utils.isEmpty(this.formData.listType)) {
          this.$msg.createError('请选择列表类型');
          return;
        }
        if (this.$utils.isEmpty(this.formData.labelWidth)) {
          this.$msg.createError('请输入表单Label宽度');
          return;
        }
        if (this.$utils.isEmpty(this.formData.treeData)) {
          this.$msg.createError('请选择是否树形列表');
          return;
        }

        if (this.$utils.isEmpty(this.formData.idColumn)) {
          this.$msg.createError('请选择ID字段');
          return;
        }

        if (this.$utils.isEmpty(this.formData.allowExport)) {
          this.$msg.createError('请选择是否允许导出');
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

        if (this.formData.treeData) {
          this.formData.hasPage = false;
          if (this.$utils.isEmpty(this.formData.treePidColumn)) {
            this.$msg.createError('请选择父级ID字段');
            return;
          }
          if (this.$utils.isEmpty(this.formData.treeNodeColumn)) {
            this.$msg.createError('请选择树形节点字段');
            return;
          }
          if (this.$utils.isEmpty(this.formData.treeChildrenKey)) {
            this.$msg.createError('请输入子节点Key值');
            return;
          }

          this.formData.treePidColumnRelaId = treeColumns.filter(
            (item) => item.id === this.formData.treePidColumn,
          )[0].relaId;
          this.formData.treeNodeColumnRelaId = treeColumns.filter(
            (item) => item.id === this.formData.treeNodeColumn,
          )[0].relaId;
        } else {
          if (this.$utils.isEmpty(this.formData.hasPage)) {
            this.$msg.createError('请选择是否分页');
            return;
          }
        }
        if (!this.$refs.toolbar.validDate()) {
          return;
        }
        if (!this.$refs.handleColumn.validDate()) {
          return;
        }
        if (!this.$refs.queryParams.validDate()) {
          return;
        }
        if (!this.$refs.queryDetail.validDate()) {
          return;
        }
        const params = Object.assign(this.formData, {
          id: this.id,
          categoryId: this.formData.categoryId,
          queryParams: this.$refs.queryParams.getTableData(),
          details: this.$refs.queryDetail.getTableData(),
          toolbars: this.$refs.toolbar.getTableData(),
          handleColumns: this.$refs.handleColumn.getTableData(),
        });

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
