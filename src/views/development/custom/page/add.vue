<template>
  <a-modal v-model="visible" :mask-closable="false" width="95%" title="新增" :dialog-style="{ top: '20px' }" :footer="null">
    <div v-if="visible" v-loading="loading">
      <j-border>
        <j-form :enable-collapse="false" label-width="80px">
          <j-form-item :span="12" label="名称" :required="true">
            <a-input v-model="formData.name" allow-clear />
          </j-form-item>
          <j-form-item :span="12" label="分类">
            <gen-custom-page-category-selector v-model="formData.categoryId" :only-final="false" />
          </j-form-item>
          <j-form-item :span="24" label="备注" :content-nest="false">
            <a-textarea v-model="formData.description" />
          </j-form-item>
        </j-form>
      </j-border>
      <j-border>
        <a-tabs v-model="activeName" :tab-bar-style="{margin: 0}">
          <a-tab-pane key="page" tab="页面代码" :force-render="true">
            <code-editor
              ref="pageEditor"
              v-model="formData.pageCode"
              :opts="{
                language: 'html'
              }"
            />
          </a-tab-pane>
          <a-tab-pane key="script" tab="脚本代码" :force-render="true">
            <code-editor
              ref="scriptEditor"
              v-model="formData.scriptCode"
              :opts="{
                language: 'javascript'
              }"
            />
          </a-tab-pane>
        </a-tabs>
      </j-border>
      <div class="form-modal-footer">
        <a-space>
          <a-button type="primary" :loading="loading" html-type="submit" @click="submit">保存</a-button>
          <a-button :loading="loading" @click="closeDialog">取消</a-button>
        </a-space>
      </div>
    </div>
  </a-modal>
</template>
<script>
import GenCustomPageCategorySelector from '@/components/Selector/GenCustomPageCategorySelector'
import CodeEditor from './code-editor'

export default {
  components: {
    GenCustomPageCategorySelector, CodeEditor
  },
  data() {
    return {
      activeName: 'page',
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
  mounted() {
  },
  created() {
    // 初始化表单数据
    this.initFormData()
  },
  methods: {
    // 打开对话框 由父页面触发
    openDialog() {
      this.visible = true

      this.$nextTick(() => this.open())
    },
    // 关闭对话框
    closeDialog() {
      this.visible = false
      this.$emit('close')
    },
    // 初始化表单数据
    initFormData() {
      this.formData = {
        name: '',
        categoryId: '',
        description: '',
        pageCode: '',
        scriptCode: ''
      }

      this.activeName = 'page'
    },
    // 页面显示时由父页面触发
    open() {
      // 初始化表单数据
      this.initFormData()
    },
    submit() {
      if (this.$utils.isEmpty(this.formData.name)) {
        this.$msg.error('请输入名称')
        return
      }

      if (this.$utils.isEmpty(this.formData.pageCode)) {
        this.$msg.error('请输入页面代码')
        return
      }

      if (this.$utils.isEmpty(this.formData.scriptCode)) {
        this.$msg.error('请输入脚本代码')
        return
      }

      if (!this.formData.scriptCode.startsWith('export default')) {
        this.$msg.error('脚本代码必须以export default开头')
        return
      }

      const params = Object.assign({}, this.formData)

      this.loading = true
      this.$api.development.customPage.add(params).then(() => {
        this.$msg.success('新增成功！')
        this.$emit('confirm')
        this.closeDialog()
      }).finally(() => {
        this.loading = false
      })
    }
  }
}
</script>
<style scoped>
</style>
