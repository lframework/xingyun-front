<template>
  <a-modal v-model="visible" :mask-closable="false" width="85%" title="修改" :dialog-style="{ top: '20px' }" :footer="null">
    <div v-if="visible" v-loading="loading">
      <j-border>
        <j-form :enable-collapse="false" label-width="80px">
          <j-form-item :span="12" label="名称" :required="true">
            <a-input v-model="formData.name" allow-clear />
          </j-form-item>
          <j-form-item :span="12" label="分类">
            <gen-custom-form-category-selector v-model="formData.category" />
          </j-form-item>
          <j-form-item :span="24" label="备注" :content-nest="false">
            <a-textarea v-model="formData.description" />
          </j-form-item>
        </j-form>
      </j-border>

      <div style="height: 10px;" />

      <j-border title="基础配置">
        <j-form :enable-collapse="false" label-width="160px">
          <j-form-item :span="6" label="是否对话框表单" :content-nest="false" :required="true">
            <a-switch v-model="formData.isDialog" checked-children="是" un-checked-children="否" />
          </j-form-item>
          <j-form-item v-if="formData.isDialog" :span="6" label="对话框标题" :required="true">
            <a-input v-model="formData.dialogTittle" />
          </j-form-item>
          <j-form-item v-if="formData.isDialog" :span="6" label="对话框宽度" :required="true">
            <a-input v-model="formData.dialogWidth" />
          </j-form-item>
        </j-form>
      </j-border>

      <div style="height: 10px;" />

      <j-border title="前端配置">
        <j-form :enable-collapse="false" label-width="160px">
          <j-form-item :span="6" label="表单提交前置脚本">
            <a @click="e => $refs.prefixSubmitEditor.openDialog()">编辑脚本</a>
          </j-form-item>
          <j-form-item :span="6" label="表单提交后置脚本">
            <a @click="e => $refs.suffixSubmitEditor.openDialog()">编辑脚本</a>
          </j-form-item>
        </j-form>
      </j-border>

      <div style="height: 10px;" />

      <j-border title="后端配置">
        <j-form :enable-collapse="false" label-width="160px">
          <j-form-item :span="6" label="是否需要查询" :content-nest="false" :required="true">
            <a-switch v-model="formData.requireQuery" checked-children="是" un-checked-children="否" />
          </j-form-item>
          <j-form-item v-if="formData.requireQuery" :span="6" label="查询数据Bean名称" :required="true">
            <a-input v-model.trim="formData.queryBean" />
          </j-form-item>
          <j-form-item :span="6" label="操作数据Bean名称">
            <a-input v-model.trim="formData.handleBean" />
          </j-form-item>
        </j-form>
      </j-border>

      <div style="height: 10px;" />

      <j-border title="表单设计">
        <div style="padding: 5px">
          <fc-designer v-if="visible" ref="designer" />
        </div>
      </j-border>

      <div class="form-modal-footer">
        <a-space>
          <a-button type="primary" :loading="loading" html-type="submit" @click="submit">保存</a-button>
          <a-button :loading="loading" @click="closeDialog">取消</a-button>
        </a-space>
      </div>
    </div>
    <code-editor ref="prefixSubmitEditor" v-model="formData.prefixSubmit" mode="javascript" :description="`1、用于在表单提交前的操作，脚本会填充在function beforeSubmit(formData, _this){}中，即：在脚本中可以直接使用formData访问表单数据。\n2、return true即为阻止后续提交表单操作；return false或没有return即为不阻止后续表单提交操作。`" />
    <code-editor ref="suffixSubmitEditor" v-model="formData.suffixSubmit" mode="javascript" :description="`1、用于在表单提交前的操作，脚本会填充在function afterSubmit(formData, _this){}中，即：在脚本中可以直接使用formData访问表单数据。\n2、return true即为阻止提交表单后的操作；return false或没有return即为不阻止提交表单后的操作。注：当表单为“对话框表单”时，阻止提交表单后的操作后，需要手动关闭对话框，代码：_this.dialogVisible = false`" />
  </a-modal>
</template>
<script>
import GenCustomFormCategorySelector from '@/components/Selector/GenCustomFormCategorySelector'
import FcDesigner from '@/components/FcDesigner'
import CodeEditor from './code-editor'

export default {
  components: {
    GenCustomFormCategorySelector, FcDesigner, CodeEditor
  },
  props: {
    id: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      // 是否可见
      visible: false,
      // 是否显示加载框
      loading: false,
      // 表单数据
      formData: {},
      // 树形菜单需要的字段
      treeColumns: []
    }
  },
  computed: {
  },
  created() {
    // 初始化表单数据
    this.initFormData()
  },
  methods: {
    // 打开对话框 由父页面触发
    openDialog() {
      this.visible = true

      this.$nextTick(() => {
        this.open()
      })
    },
    // 关闭对话框
    closeDialog() {
      this.visible = false
      this.$emit('close')
    },
    // 初始化表单数据
    initFormData() {
      this.formData = {
        id: '',
        name: '',
        category: {},
        description: '',
        isDialog: false,
        dialogTittle: '',
        dialogWidth: '',
        form_config: undefined,
        isConfig: false,
        prefixSubmit: '',
        suffixSubmit: '',
        requireQuery: false,
        queryBean: '',
        handleBean: ''
      }
    },
    // 页面显示时由父页面触发
    open() {
      // 初始化表单数据
      this.initFormData()

      this.loadFormData()
    },
    // 查询数据
    async loadFormData() {
      this.loading = true
      await this.$api.development.customForm.get(this.id).then(data => {
        data.category = {
          id: data.categoryId,
          name: data.categoryName
        }

        this.formData = data

        const formConfig = JSON.parse(this.$utils.isEmpty(this.formData.formConfig) ? '{}' : this.formData.formConfig)

        if (!this.$utils.isEmpty(formConfig.rule)) {
          this.$refs.designer.setRule(formConfig.rule)
        }

        if (!this.$utils.isEmpty(formConfig.option)) {
          this.$refs.designer.setOption(formConfig.option)
        }

        delete this.formData.formConfig
      }).finally(() => {
        this.loading = false
      })
    },
    submit() {
      if (this.$utils.isEmpty(this.formData.name)) {
        this.$msg.error('请输入名称')
        return
      }

      if (this.formData.isDialog) {
        if (this.$utils.isEmpty(this.formData.dialogTittle)) {
          this.$msg.error('请输入对话框标题')
          return
        }
        if (this.$utils.isEmpty(this.formData.dialogWidth)) {
          this.$msg.error('请输入对话框宽度')
          return
        }
      }

      if (this.formData.requireQuery) {
        if (this.$utils.isEmpty(this.formData.queryBean)) {
          this.$msg.error('请输入查询数据Bean名称')
          return
        }
      }

      const params = Object.assign({
        id: this.id,
        categoryId: this.formData.category.id,
        formConfig: JSON.stringify({
          rule: this.$refs.designer.getRule(),
          option: this.$refs.designer.getOption()
        })
      }, this.formData)

      this.loading = true
      this.$api.development.customForm.modify(params).then(() => {
        this.$msg.success('修改成功！')
        this.$emit('confirm')
        this.closeDialog()
      }).finally(() => {
        this.loading = false
      })
    }
  }
}
</script>
