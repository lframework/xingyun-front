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
            <gen-data-entity-category-selector v-model:value="formData.categoryId" />
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
          <j-form-item :span="12" label="数据表" :required="true">
            <a-space>
              <span>{{ formData.tableName }}</span>
              <a-button
                type="link"
                :icon="h(ReloadOutlined)"
                :loading="loading"
                @click="syncTable"
              />
            </a-space>
          </j-form-item>
        </j-form>
      </j-border>

      <div style="height: 10px"></div>

      <j-border>
        <generate-column
          ref="generateColumn"
          :columns="columns"
          @refreshColumns="(e) => (columns = e)"
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
  import { h, defineComponent } from 'vue';
  import GenerateColumn from './generate-column.vue';
  import * as api from '@/api/development/data/entity';
  import { ReloadOutlined } from '@ant-design/icons-vue';

  export default defineComponent({
    components: {
      GenerateColumn,
    },
    props: {
      id: {
        type: String,
        required: true,
      },
    },
    setup() {
      return {
        h,
        ReloadOutlined,
      };
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
      ReloadOutlined,
      // 打开对话框 由父页面触发
      openDialog() {
        this.visible = true;

        this.$nextTick(() => {
          this.$nextTick(() => this.open());
        });
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
          tableName: '',
          available: '',
        };

        this.columns = [];
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
            let columns = data.columns;
            columns = columns.map((item) => {
              return Object.assign(
                {
                  dataDicId: item.dataDicId,
                  customSelectorId: item.customSelectorId,
                  regularExpression: '',
                },
                item,
              );
            });
            this.columns = columns;
            delete data.columns;
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
        if (this.$utils.isEmpty(this.formData.available)) {
          this.$msg.createError('请选择状态');
          return;
        }
        if (!this.$refs.generateColumn.validDate()) {
          return;
        }
        const params = Object.assign(
          {
            categoryId: this.formData.categoryId,
            columns: this.$refs.generateColumn.getColumns(),
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
      syncTable() {
        this.$msg
          .createConfirm('是否确认同步表结构？注：同步表结构可能会丢失差异字段配置')
          .then(() => {
            this.loading = true;
            api.syncTable(this.id).then(() => {
              this.$msg.createSuccessTip('同步成功，正在重载数据...');
              this.$nextTick(() => this.open());
            });
          });
      },
    },
  });
</script>
