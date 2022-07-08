<template>
  <a-modal v-model="visible" :mask-closable="false" width="40%" title="新增" :dialog-style="{ top: '20px' }" :footer="null">
    <div v-if="visible" v-loading="loading">
      <a-form-model ref="form" :label-col="{span: 4}" :wrapper-col="{span: 16}" :model="formData" :rules="rules">
        <a-form-model-item label="名称" prop="name">
          <a-input v-model="formData.name" allow-clear />
        </a-form-model-item>
        <a-form-model-item label="文件" prop="url">
          <a-space>
            <a-upload
              name="file"
              :max-count="1"
              :file-list="fileList"
              :show-upload-list="{
                showRemoveIcon: false
              }"
              :custom-request="uploadFile"
            >
              <a-button>
                选择文件
              </a-button>
            </a-upload>
          </a-space>
        </a-form-model-item>
        <a-form-model-item label="备注" prop="description">
          <a-textarea v-model="formData.description" allow-clear />
        </a-form-model-item>
        <div class="form-modal-footer">
          <a-space>
            <a-button type="primary" :loading="loading" html-type="submit" @click="submit">保存</a-button>
            <a-button :loading="loading" @click="closeDialog">取消</a-button>
          </a-space>
        </div>
      </a-form-model>
    </div>
  </a-modal>
</template>
<script>
export default {
  components: {
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
        name: [
          { required: true, message: '请输入名称' }
        ],
        url: [
          { required: true, message: '请选择文件', trigger: 'change' }
        ]
      },
      fileList: []
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
        name: '',
        url: '',
        description: ''
      }
      this.fileList = []
    },
    // 提交表单事件
    submit() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.loading = true
          this.$api.sw.filebox.create(this.formData).then(() => {
            this.$msg.success('新增成功！')
            this.$emit('confirm')
            this.visible = false
          }).finally(() => {
            this.loading = false
          })
        }
      })
    },
    // 页面显示时触发
    open() {
      // 初始化表单数据
      this.initFormData()
    },
    uploadFile(e) {
      const file = e.file
      this.fileList = []
      this.formData.url = ''
      this.loading = true
      this.$api.sw.filebox.upload({
        file: file
      }).then(res => {
        this.formData.url = res
        this.fileList.push(Object.assign(file, { status: 'done' }))
        if (this.$utils.isEmpty(this.formData.name)) {
          this.formData.name = file.name
        }
        this.$refs.form.clearValidate()
      }).finally(() => {
        this.loading = false
      })
    }
  }
}
</script>
