<template>
  <div>
    <img v-if="disabled && !$utils.isEmpty(value)" :src="value" class="img-uploader-container">
    <span v-else-if="disabled && $utils.isEmpty(value)" />
    <a-upload
      v-else
      accept="image/png, image/jpeg, image/bmp, image/jpg, image/gif"
      list-type="picture-card"
      :show-upload-list="false"
      :custom-request="onRequest"
    >
      <img v-if="!$utils.isEmpty(value)" :src="value" class="img-uploader-container">
      <div v-else>
        <a-icon :type="loading ? 'loading' : 'plus'" />
        <div class="ant-upload-text">
          上传
        </div>
      </div>
    </a-upload>
  </div>
</template>
<script>
import { request } from '@/utils/request'

export default {
  name: 'JImgUpload',

  componentName: 'JImgUpload',

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
    disabled: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      loading: false
    }
  },
  computed: {

  },
  methods: {
    onRequest(e) {
      this.loading = true
      const requestPromise = this.$utils.isFunction(this.url) ? this.url : this.doRequest
      requestPromise({
        file: e.file
      }, this.params).then(res => {
        this.$emit('input', res)
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
