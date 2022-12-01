<template>
  <div>
    <a v-if="disabled && !$utils.isEmpty(value)" :href="value">点击下载</a>
    <span v-else-if="disabled && $utils.isEmpty(value)" />
    <a-upload
      v-else
      name="file"
      :accept="accept"
      :max-count="1"
      :file-list="fileList"
      :show-upload-list="{
        showRemoveIcon: false
      }"
      :custom-request="onRequest"
    >
      <a-button>
        选择文件
      </a-button>
    </a-upload>
  </div>
</template>
<script>
import { request } from '@/utils/request'

export default {
  name: 'JUpload',

  componentName: 'JUpload',

  props: {
    value: {
      type: String,
      required: true
    },
    url: {
      type: [String, Function],
      required: true
    },
    region: {
      type: String,
      default: ''
    },
    method: {
      type: String,
      default: ''
    },
    params: {
      type: Object,
      default: () => {
        return {}
      }
    },
    accept: {
      type: String,
      default: undefined
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      loading: false,
      fileList: []
    }
  },
  computed: {

  },
  methods: {
    onRequest(e) {
      const file = e.file
      this.fileList = []
      this.loading = true
      const requestPromise = this.$utils.isFunction(this.url) ? this.url : this.doRequest
      requestPromise({
        file: file
      }, this.params).then(res => {
        this.fileList.push(Object.assign(file, { status: 'done' }))
        this.$emit('input', res)
        this.$emit('confirm', res, file)
      }).finally(() => {
        this.loading = false
      })
    },
    doRequest(data) {
      return request({
        url: this.url,
        region: this.region,
        method: this.method,
        dataType: 'file',
        data: data,
        params: this.params
      })
    }
  }
}
</script>
