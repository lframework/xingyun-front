<template>
  <div v-if="visible">
    <div v-loading="loading">
      <a-card>
        <a-tabs v-model:active-key.sync="activeName">
          <a-tab-pane key="baseSetting" tab="基本设置" :force-render="true">
            <base-setting ref="baseSettingDialog" :form-data="formData.generateInfo" />
          </a-tab-pane>
          <a-tab-pane key="addSetting" tab="新增功能配置" :force-render="true">
            <add-setting ref="addSettingDialog" :columns="formData.columns" />
          </a-tab-pane>
          <a-tab-pane key="updateSetting" tab="修改功能配置" :force-render="true">
            <update-setting ref="updateSettingDialog" :columns="formData.columns" />
          </a-tab-pane>
          <a-tab-pane key="queryParamsSetting" tab="查询功能参数配置" :force-render="true">
            <query-params-setting ref="queryParamsSettingDialog" :columns="formData.columns" />
          </a-tab-pane>
          <a-tab-pane key="querySetting" tab="查询功能配置" :force-render="true">
            <query-setting ref="querySettingDialog" :columns="formData.columns" />
          </a-tab-pane>
          <a-tab-pane key="detailSetting" tab="详情功能配置" :force-render="true">
            <detail-setting ref="detailSettingDialog" :columns="formData.columns" />
          </a-tab-pane>
        </a-tabs>
        <div class="form-modal-footer">
          <a-space>
            <a-button :loading="loading" type="primary" @click="submitEvent">保存</a-button>
            <a-button :loading="loading" @click="closeDialog">关闭</a-button>
          </a-space>
        </div>
      </a-card>
    </div>
  </div>
</template>
<script>
  import { defineComponent } from 'vue';
  import BaseSetting from './generate/base-setting.vue';
  import AddSetting from './generate/add-setting.vue';
  import UpdateSetting from './generate/update-setting.vue';
  import QuerySetting from './generate/query-setting.vue';
  import QueryParamsSetting from './generate/query-params-setting.vue';
  import DetailSetting from './generate/detail-setting.vue';
  import * as api from '@/api/development/data/entity';

  export default defineComponent({
    // 使用组件
    components: {
      BaseSetting,
      AddSetting,
      UpdateSetting,
      QuerySetting,
      QueryParamsSetting,
      DetailSetting,
    },

    props: {
      id: {
        type: String,
        required: true,
      },
    },
    data() {
      return {
        // 是否显示加载框
        loading: false,
        visible: false,
        // 表单数据
        formData: {},
        activeName: '',
      };
    },
    created() {
      this.initFormData();
    },
    methods: {
      // 打开对话框 由父页面触发
      openDialog() {
        // 初始化表单数据
        this.initFormData();
        this.visible = true;
        this.loadData();
      },
      // 关闭对话框
      closeDialog() {
        this.visible = false;
        this.$emit('close');
      },
      // 初始化表单数据
      initFormData() {
        this.formData = {
          columns: [],
          generateInfo: {
            templateType: '',
            packageName: '',
            moduleName: '',
            bizName: '',
            className: '',
            classDescription: '',
            parentMenuId: '',
            keyType: '',
            author: '',
            menuCode: '9000',
            menuName: '',
            detailSpan: 4,
          },
          createConfigs: [],
          updateConfigs: [],
          queryParamsConfigs: [],
          queryConfigs: [],
          detailConfigs: [],
        };

        this.activeName = 'baseSetting';
      },
      async validData() {
        if (!(await this.$refs.baseSettingDialog.validDate())) {
          this.activeName = 'baseSetting';
          return false;
        }

        if (!this.$refs.addSettingDialog.validDate()) {
          this.activeName = 'addSetting';
          return false;
        }

        if (!this.$refs.updateSettingDialog.validDate()) {
          this.activeName = 'updateSetting';
          return false;
        }

        if (!this.$refs.queryParamsSettingDialog.validDate()) {
          this.activeName = 'queryParamsSetting';
          return false;
        }

        if (!this.$refs.querySettingDialog.validDate()) {
          this.activeName = 'querySetting';
          return false;
        }

        if (!this.$refs.detailSettingDialog.validDate()) {
          this.activeName = 'detailSetting';
          return false;
        }

        return true;
      },
      // 提交表单事件
      async submitEvent() {
        if (await this.validData()) {
          this.loading = true;
          const params = {
            id: this.id,
            generateInfo: this.formData.generateInfo,
            createConfigs: this.$refs.addSettingDialog.getTableData(),
            updateConfigs: this.$refs.updateSettingDialog.getTableData(),
            queryParamsConfigs: this.$refs.queryParamsSettingDialog.getTableData(),
            queryConfigs: this.$refs.querySettingDialog.getTableData(),
            detailConfigs: this.$refs.detailSettingDialog.getTableData(),
          };

          api
            .updateGenerate(params)
            .then(() => {
              this.$msg.createSuccess('修改成功！');
              this.$emit('confirm');
              this.closeDialog();
            })
            .finally(() => {
              this.loading = false;
            });
        }
      },
      // 查询数据
      loadData() {
        this.loading = true;
        api
          .getGenerate(this.id)
          .then((data) => {
            this.formData = Object.assign(this.formData, data);
            this.$refs.addSettingDialog.setTableData(this.formData.createConfigs);
            this.$refs.updateSettingDialog.setTableData(this.formData.updateConfigs);
            this.$refs.queryParamsSettingDialog.setTableData(this.formData.queryParamsConfigs);
            this.$refs.querySettingDialog.setTableData(this.formData.queryConfigs);
            this.$refs.detailSettingDialog.setTableData(this.formData.detailConfigs);
          })
          .finally(() => {
            this.loading = false;
          });
      },
    },
  });
</script>
<style></style>
