
<template>
  <div class="tinymce-editor">
    <Editor
      :id="tinymceId"
      v-model="html"
      :init="init"
    />
  </div>
</template>
<script>
import tinymce from 'tinymce/tinymce' // tinymce默认hidden，不引入不显示
import Editor from '@tinymce/tinymce-vue'// 编辑器引入
import 'tinymce/themes/silver/theme'// 编辑器主题
import 'tinymce/icons/default' // 引入编辑器图标icon，不引入则不显示对应图标
import 'tinymce/plugins/advlist' // 高级列表
import 'tinymce/plugins/autolink' // 自动链接
import 'tinymce/plugins/link' // 超链接
import 'tinymce/plugins/image' // 插入编辑图片
import 'tinymce/plugins/lists' // 列表插件
import 'tinymce/plugins/charmap' // 特殊字符
import 'tinymce/plugins/table'// 表格
import 'tinymce/plugins/emoticons'// emoji
import 'tinymce/plugins/emoticons/js/emojis'// emoji

const fonts = [
  '宋体=宋体',
  '微软雅黑=微软雅黑',
  '新宋体=新宋体',
  '黑体=黑体',
  '楷体=楷体',
  '隶书=隶书',
  'Courier New=courier new,courier',
  'AkrutiKndPadmini=Akpdmi-n',
  'Andale Mono=andale mono,times',
  'Arial=arial,helvetica,sans-serif',
  'Arial Black=arial black,avant garde',
  'Book Antiqua=book antiqua,palatino',
  'Comic Sans MS=comic sans ms,sans-serif',
  'Courier New=courier new,courier',
  'Georgia=georgia,palatino',
  'Helvetica=helvetica',
  'Impact=impact,chicago',
  'Symbol=symbol',
  'Tahoma=tahoma,arial,helvetica,sans-serif',
  'Terminal=terminal,monaco',
  'Times New Roman=times new roman,times',
  'Trebuchet MS=trebuchet ms,geneva',
  'Verdana=verdana,geneva',
  'Webdings=webdings',
  'Wingdings=wingdings,zapf dingbats'
]
export default {
  components: {
    Editor
  },
  props: {
    // 插件
    plugins: {
      type: [String, Array],
      default: 'advlist autolink link table image lists charmap emoticons'
    },
    // 工具栏
    toolbar: {
      type: [String, Array],
      default: 'undo redo |  formatselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | lists image media table'
    }
  },
  data() {
    return {
      // 初始化配置
      tinymceId: 'tinymce',
      html: ''
    }
  },
  computed: {
    init() {
      const that = this
      const config = {
        selector: '#tinymce',
        language_url: '/tinymce/langs/zh_CN.js',
        language: 'zh_CN',
        skin_url: '/tinymce/skins/ui/oxide', // 皮肤
        plugins: this.plugins, // 插件
        // 工具栏
        toolbar: this.toolbar,
        toolbar_location: '/',
        fontsize_formats: '12px 14px 16px 18px 20px 22px 24px 28px 32px 36px 48px 56px 72px', // 字体大小
        font_formats: fonts.join(';'),

        height: 500, // 高度
        placeholder: '在这里输入文字',

        branding: false, // 隐藏右下角技术支持
        // 图片上传
        images_upload_handler: function(blobInfo, success, failure) {
          that.$api.components.editorUploadImage(blobInfo.blob()).then(res => {
            success(res.url)
          })
        }
      }

      return config
    }
  },
  mounted() {
    this.$nextTick(() => {
      tinymce.init({})
    })
  },
  methods: {
    getHtml() {
      return this.html
    },
    setHtml(html) {
      this.html = html
    },
    isEmpty() {
      return this.$utils.isEmpty(this.html)
    }
  }
}

</script>
