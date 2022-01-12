<template>
  <iframe ref="iframe" :src="iframeUrl" class="iframe" />
</template>

<script>
export default {
  name: 'Iframes',
  props: {
    src: {
      type: String,
      required: true
    }
  },
  data() {
    return {
    }
  },
  computed: {
    iframeUrl() {
      let url = ''
      if (!this.$utils.isEmpty(this.$attrs)) {
        for (const attr in this.$attrs) {
          if (!this.$utils.isEmpty(this.$attrs[attr])) {
            url += attr + '=' + this.$attrs[attr] + '&'
          }
        }
      }

      if (!this.$utils.isEmpty(url)) {
        url = url.substring(0, url.length - 1)
        url = '?' + url
      }
      return this.src + url
    }
  },
  created() {
  },
  mounted() {
    this.iframeInit()
    window.onresize = () => {
      this.iframeInit()
    }
  },
  methods: {
    iframeInit() {
      const iframe = this.$refs.iframe
      const clientHeight = document.documentElement.clientHeight - 90
      iframe.style.height = `${clientHeight}px`
    }
  }
}
</script>

<style>
.iframe {
  width: 100%;
  height: 100%;
  border: 0;
  overflow: hidden;
  box-sizing: border-box;
}
</style>
