<template>
  <a-modal v-model="visible" :mask-closable="false" width="80%" title="修改" :dialog-style="{ top: '20px' }" :footer="null">
    <div v-if="visible" v-permission="['system:notice:modify']" v-loading="loading">
      <a-form-model ref="form" :label-col="{span: 4}" :wrapper-col="{span: 16}" :model="formData" :rules="rules">
        <a-form-model-item label="标题" prop="title">
          <a-input v-model="formData.title" allow-clear />
        </a-form-model-item>
        <a-form-model-item label="状态" prop="available">
          <a-select v-model="formData.available" allow-clear>
            <a-select-option v-for="item in $enums.AVAILABLE.values()" :key="item.code" :value="item.code">{{ item.desc }}</a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item prop="content" :label-col="{span: 0}" :wrapper-col="{span: 24}">
          <j-editor v-model="formData.content" style="margin-bottom: 5px;" />
        </a-form-model-item>
        <div class="form-modal-footer">
          <a-space>
            <a-button v-if="!formData.published" type="primary" :loading="loading" html-type="submit" @click="e => submit(false)">保存</a-button>
            <a-button type="primary" :loading="loading" html-type="submit" @click="e => submit(true)">保存并发布</a-button>
            <a-button :loading="loading" @click="closeDialog">取消</a-button>
          </a-space>
        </div>
      </a-form-model>
    </div>
  </a-modal>
</template>
<script>
export default {
  // 使用组件
  components: {
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
      // 表单校验规则
      rules: {
        title: [
          { required: true, message: '请输入标题' }
        ],
        content: [
          { required: true, message: '请输入内容' }
        ],
        available: [
          { required: true, message: '请选择状态' }
        ]
      }
    }
  },
  created() {
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
        id: '',
        title: '',
        content: '',
        available: '',
        published: false
      }
    },
    // 提交表单事件
    submit(published) {
      this.$refs.form.validate((valid) => {
        if (valid) {
          if (this.formData.published && published) {
            this.$msg.confirm('重新发布后，会重置所有人的已读状态，是否确认继续执行？').then(() => {
              this.onPublish(published)
            })
          } else {
            if (published) {
              this.$msg.confirm('是否确认执行发布操作？').then(() => {
                this.onPublish(published)
              })
            } else {
              this.onPublish(published)
            }
          }
        }
      })
    },
    onPublish(published) {
      this.loading = true
      this.$api.system.notice.modify(Object.assign(this.formData, { published: published })).then(() => {
        this.$msg.success(published ? '发布成功，发布状态更新稍有延迟，请耐心等待！' : '修改成功！')
        this.$emit('confirm')
        this.visible = false
      }).finally(() => {
        this.loading = false
      })
    },
    // 页面显示时触发
    open() {
      // 初始化数据
      this.initFormData()

      // 查询数据
      this.loadFormData()
    },
    // 查询数据
    async loadFormData() {
      this.loading = true
      await this.$api.system.notice.get(this.id).then(data => {
        this.formData = data
      }).finally(() => {
        this.loading = false
      })
    }
  }
}
</script>
