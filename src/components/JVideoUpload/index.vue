<template>
  <div>
    <video-player v-if="disabled && !$utils.isEmpty(value)" style="width: 200px;height: 200px;" :options="options" />
    <span v-else-if="disabled && $utils.isEmpty(value)" />
    <a-upload
      v-else
      accept=".avi,.wmv,.mpeg,.mp4,.m4v,.mov,.asf,.flv,.f4v,.rmvb,.rm,.3gp,.vob"
      list-type="picture-card"
      :show-upload-list="true"
      :file-list.sync="fileList"
      :custom-request="onRequest"
      @preview="handlePreview"
      @change="handleChange"
    >
      <div v-if="fileList.length < 1">
        <a-icon style="font-size: 32px; color: #999;" :type="loading ? 'loading' : 'video-camera'" />
        <div style="margin-top: 8px; color: #666;">
          上传视频
        </div>
      </div>
    </a-upload>
    <a-modal :visible="previewVisible" :footer="null" @cancel="handleCancel">
      <video-player v-if="previewVisible" :options="options" />
    </a-modal>
  </div>
</template>
<script>
import Vue from 'vue'
import { request } from '@/utils/request'
import { videoPlayer } from 'vue-video-player'

export default {
  name: 'JVideoUpload',

  componentName: 'JVideoUpload',

  components: {
    videoPlayer
  },

  props: {
    value: {
      type: String,
      required: true
    },
    url: {
      type: [String, Function],
      default: e => {
        return Vue.prototype.$api.components.uploadVideo
      }
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
      loading: false,
      previewVisible: false,
      fileList: [],
      previewImage: ''
    }
  },
  computed: {
    options() {
      return {
        autoplay: false,
        muted: true,
        preload: 'auto',
        language: 'zh-CN',
        fluid: true,
        playbackRates: [0.7, 1.0, 1.5, 2.0],
        sources: [
          {
            src: this.value
          }
        ],
        notSupportedMessage: '此视频暂无法播放',
        controlBar: {
          timeDivider: true,
          durationDisplay: true,
          remainingTimeDisplay: false,
          fullscreenToggle: true, // 全屏按钮
          currentTimeDisplay: true, // 当前时间
          volumeControl: false, // 声音控制键
          playToggle: true, // 暂停和播放键
          progressControl: true // 进度条
        }
      }
    }
  },
  watch: {
    value(val) {
      this.loadVideo()
    }
  },
  mounted() {
    this.loadVideo()
  },
  methods: {
    loadVideo() {
      if (!this.$utils.isEmpty(this.value)) {
        this.fileList = [{
          url: this.value,
          uid: this.$utils.uuid()
        }]
      } else {
        this.fileList = []
      }
    },
    handleCancel() {
      this.previewVisible = false
    },
    handleChange(e) {
      if (this.$utils.isEmpty(e.fileList)) {
        this.fileList = []
        this.$emit('input', undefined)
      }
    },
    async handlePreview(file) {
      if (!file.url) {
        return
      }
      this.previewImage = file.url || file.preview
      this.previewVisible = true
    },
    onRequest(e) {
      this.loading = true
      const requestPromise = this.$utils.isFunction(this.url) ? this.url : this.doRequest
      requestPromise({
        file: e.file
      }, this.params).then(res => {
        e.onSuccess({ status: 'success' }, e.file)
        this.$emit('input', res)
      }).catch(() => {
        e.onError({ status: 'error' }, e.file)
        this.$emit('input', undefined)
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
