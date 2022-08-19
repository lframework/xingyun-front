<template>
  <a-modal v-model="visible" :mask-closable="false" width="80%" title="新增" :dialog-style="{ top: '20px' }" :footer="null">
    <div v-if="visible" v-permission="['system:notice:add']" v-loading="loading">
      <a-form-model ref="form" :label-col="{span: 4}" :wrapper-col="{span: 16}" :model="formData" :rules="rules">
        <a-form-model-item label="标题" prop="title">
          <a-input v-model="formData.title" allow-clear />
        </a-form-model-item>

        <rich-text-editor ref="editor" style="margin-bottom: 5px;" />

        <div class="form-modal-footer">
          <a-space>
            <a-button type="primary" :loading="loading" html-type="submit" @click="e => submit(false)">保存</a-button>
            <a-button type="primary" :loading="loading" html-type="submit" @click="e => submit(true)">保存并发布</a-button>
            <a-button :loading="loading" @click="closeDialog">取消</a-button>
          </a-space>
        </div>
      </a-form-model>
    </div>
  </a-modal>
</template>
<script>
import RichTextEditor from '@/components/RichTextEditor'
export default {
  components: {
    RichTextEditor
  },
  data() {
    return {
      // 是否可见
      visible: false,
      // 是否显示加载框
      loading: false,
      // 表单数据
      formData: {},
      // 表单校验规则
      rules: {
        title: [
          { required: true, message: '请输入标题' }
        ]
      }
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
        title: '',
        content: ''
      }
    },
    // 提交表单事件
    submit(published) {
      this.$refs.form.validate((valid) => {
        if (valid) {
          if (this.$refs.editor.isEmpty()) {
            this.$msg.error('请输入内容')
            return
          }
          this.formData.content = this.$refs.editor.getHtml()
          if (published) {
            this.$msg.confirm('是否确认执行发布操作？').then(() => {
              this.onPublish(published)
            })
          } else {
            this.onPublish(published)
          }
        }
      })
    },
    onPublish(published) {
      this.loading = true
      this.$api.system.notice.create(Object.assign({ published: published }, this.formData)).then(() => {
        this.$msg.success(published ? '发布成功，发布状态更新稍有延迟，请耐心等待！' : '新增成功！')
        this.$emit('confirm')
        this.visible = false
      }).finally(() => {
        this.loading = false
      })
    },
    // 页面显示时触发
    open() {
      // 初始化表单数据
      this.initFormData()
    }
  }
}
</script>
