<template>
  <simple-db v-if="$enums.DATAOBJECT_TYPE.SIMPLE_DB.equalsCode(type)" :id="id" ref="setting" @confirm="$emit('confirm')" @close="$emit('close')" />
</template>
<script>

import SimpleDb from '@/views/development/data/settings/simple-db'
export default {
  // 使用组件
  components: {
    SimpleDb
  },

  props: {
    id: {
      type: String,
      required: true
    },
    type: {
      type: Number,
      required: true
    }
  },
  data() {
    return {
      // 是否显示加载框
      loading: false,
      // 表单数据
      formData: {},
      // 表单校验规则
      rules: {
        code: [
          { required: true, message: '请输入编号' }
        ],
        name: [
          { required: true, message: '请输入名称' }
        ],
        type: [
          { required: true, message: '请选择类型' }
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
    // 初始化表单数据
    initFormData() {
      this.formData = {
        id: '',
        code: '',
        name: '',
        available: '',
        description: ''
      }
    },
    // 提交表单事件
    submitEvent() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.loading = true
          this.$api.development.data.modify(this.formData).then(() => {
            this.$msg.success('修改成功！')
            this.$emit('confirm')
          }).finally(() => {
            this.loading = false
          })
        }
      })
    },
    // 页面显示时由父页面触发
    open() {
      // 初始化数据
      this.initFormData()

      // 查询数据
      this.loadFormData()

      this.$nextTick(() => {
        this.$refs.setting.open()
      })
    },
    // 查询数据
    loadFormData() {
      this.loading = true
      this.$api.development.data.get(this.id).then(data => {
        this.formData = data
      }).finally(() => {
        this.loading = false
      })
    }
  }
}
</script>
