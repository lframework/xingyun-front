<template>
  <div
    ref="container"
    class="monaco-editor"
    :style="`height: ${$defaultTableHeight}px`"
  />
</template>
<script>
import * as monaco from 'monaco-editor'
export default {
  components: {
  },
  props: {
    value: {
      type: String,
      required: true
    },
    mode: {
      type: String,
      required: true
    },
    opts: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data() {
    return {
      defaultOpts: {
        value: '', // 编辑器的值
        theme: 'vs-dark', // 编辑器主题：vs, hc-black, or vs-dark，更多选择详见官网
        roundedSelection: true, // 右侧不显示编辑器预览框
        autoIndent: true // 自动缩进
      },
      // 编辑器对象
      monacoEditor: {}
    }
  },
  computed: {
  },
  mounted() {
    this.init()
  },
  created() {
    this.openDialog()
  },
  methods: {
    init() {
      // 初始化container的内容，销毁之前生成的编辑器
      this.$refs.container.innerHTML = ''
      // 生成编辑器配置
      const editorOptions = Object.assign(this.defaultOpts, this.opts, {
        value: this.value
      })
      // 生成编辑器对象
      this.monacoEditor = monaco.editor.create(this.$refs.container, editorOptions)
      // 编辑器内容发生改变时触发
      this.monacoEditor.onDidChangeModelContent(() => {
        this.$emit('input', this.monacoEditor.getValue())
      })
    },
    // 打开对话框 由父页面触发
    openDialog() {
      this.$nextTick(() => this.open())
    },
    // 初始化表单数据
    initFormData() {
      if (this.monacoEditor) {
        this.monacoEditor.setValue('')
      }
    },
    // 页面显示时由父页面触发
    open() {
      // 初始化表单数据
      this.initFormData()
    },
    setValue(val) {
      this.monacoEditor.setValue(val)
    }
  }
}
</script>
<style lang="less">
</style>
