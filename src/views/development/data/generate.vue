<template>
  <div v-if="visible" class="app-container">
    <div v-loading="loading" class="gen-container">
      <a-tabs v-model="activeName">
        <a-tab-pane key="baseSetting" tab="基本设置" :force-render="true">
          <base-setting ref="baseSettingDialog" :form-data="formData.generateInfo" />
        </a-tab-pane>
        <a-tab-pane key="generate" tab="字段配置" :force-render="true">
          <generate-columns ref="generateColumnsDialog" :columns="formData.columns" @sortColumns="e => formData.columns = e" />
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
    </div>
  </div>
</template>
<script>

import GenerateColumns from './generate/generate-column'
import BaseSetting from './generate/base-setting'
import AddSetting from './generate/add-setting'
import UpdateSetting from './generate/update-setting'
import QuerySetting from './generate/query-setting'
import QueryParamsSetting from './generate/query-params-setting'
import DetailSetting from './generate/detail-setting'
export default {
  // 使用组件
  components: {
    GenerateColumns, BaseSetting, AddSetting, UpdateSetting, QuerySetting, QueryParamsSetting, DetailSetting
  },

  props: {
    id: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      // 是否显示加载框
      loading: false,
      visible: false,
      // 表单数据
      formData: {},
      activeName: ''
    }
  },
  created() {
    this.initFormData()
  },
  methods: {
    // 打开对话框 由父页面触发
    openDialog() {
      // 初始化表单数据
      this.initFormData()
      this.visible = true
      this.loadData()
    },
    // 关闭对话框
    closeDialog() {
      this.visible = false
      this.$emit('close')
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
          detailSpan: 4
        },
        createConfigs: [],
        updateConfigs: [],
        queryParamsConfigs: [],
        queryConfigs: [],
        detailConfigs: []
      }

      this.activeName = 'baseSetting'
    },
    async validData() {
      if (!this.$refs.generateColumnsDialog.validDate()) {
        this.activeName = 'generate'
        return false
      }

      if (!await this.$refs.baseSettingDialog.validDate()) {
        this.activeName = 'baseSetting'
        return false
      }

      if (!this.$refs.addSettingDialog.validDate()) {
        this.activeName = 'addSetting'
        return false
      }

      if (!this.$refs.updateSettingDialog.validDate()) {
        this.activeName = 'updateSetting'
        return false
      }

      if (!this.$refs.queryParamsSettingDialog.validDate()) {
        this.activeName = 'queryParamsSetting'
        return false
      }

      if (!this.$refs.querySettingDialog.validDate()) {
        this.activeName = 'querySetting'
        return false
      }

      if (!this.$refs.detailSettingDialog.validDate()) {
        this.activeName = 'detailSetting'
        return false
      }

      return true
    },
    // 提交表单事件
    async submitEvent() {
      if (await this.validData()) {
        this.loading = true
        const params = {
          id: this.id,
          columns: this.formData.columns,
          generateInfo: this.formData.generateInfo,
          createConfigs: this.$refs.addSettingDialog.getTableData(),
          updateConfigs: this.$refs.updateSettingDialog.getTableData(),
          queryParamsConfigs: this.$refs.queryParamsSettingDialog.getTableData(),
          queryConfigs: this.$refs.querySettingDialog.getTableData(),
          detailConfigs: this.$refs.detailSettingDialog.getTableData()
        }

        this.$api.development.data.updateGenerate(params).then(() => {
          this.$msg.success('修改成功！')
          this.$emit('confirm')
          this.closeDialog()
        }).finally(() => {
          this.loading = false
        })
      }
    },
    // 查询数据
    loadData() {
      this.loading = true
      this.$api.development.data.getGenerate(this.id).then(data => {
        this.formData = Object.assign(this.formData, data)
        this.$refs.addSettingDialog.setTableData(this.formData.createConfigs)
        this.$refs.updateSettingDialog.setTableData(this.formData.updateConfigs)
        this.$refs.queryParamsSettingDialog.setTableData(this.formData.queryParamsConfigs)
        this.$refs.querySettingDialog.setTableData(this.formData.queryConfigs)
        this.$refs.detailSettingDialog.setTableData(this.formData.detailConfigs)
      }).finally(() => {
        this.loading = false
      })
    }
  }
}
</script>
<style>
.gen-container {
  border: 1px solid #ebebeb;
  border-radius: 3px;
  padding: 10px;
}
</style>
