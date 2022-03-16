<template>
  <a-modal v-model="visible" :mask-closable="false" width="40%" title="设置" :dialog-style="{ top: '20px' }" :footer="null">
    <div v-if="visible">
      <simple-db v-if="$enums.DATAOBJECT_TYPE.SIMPLE_DB.equalsCode(type)" :id="id" ref="setting" @confirm="e => {$emit('confirm', e);closeDialog()}" @close="closeDialog" />
    </div>
  </a-modal>
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
      // 是否可见
      visible: false,
      // 是否显示加载框
      loading: false
    }
  },
  created() {
    this.initFormData()
  },
  methods: {
    // 打开对话框 由父页面触发
    openDialog() {
      this.visible = true

      this.open()
    },
    // 关闭对话框
    closeDialog() {
      this.visible = false
      this.$emit('close')
    },
    // 初始化表单数据
    initFormData() {
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
    async loadFormData() {
    }
  }
}
</script>
