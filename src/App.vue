<template>
  <a-config-provider :locale="locale" :get-popup-container="popContainer">
    <router-view />
  </a-config-provider>
</template>

<script>
import { enquireScreen } from './utils/util'
import { mapState, mapMutations } from 'vuex'
import themeUtil from '@/utils/themeUtil'
import { getI18nKey } from '@/utils/routerUtil'
import { getAuthorization } from '@/utils/request'
import UserConnectTip from '@/components/UserConnectTip'

export default {
  name: 'App',
  components: {
    // eslint-disable-next-line vue/no-unused-components
    UserConnectTip
  },
  data() {
    return {
      locale: {},
      socket: undefined,
      wsTimer: undefined,
      retryWs: false
    }
  },
  computed: {
    ...mapState('setting', ['layout', 'theme', 'weekMode', 'lang'])
  },
  watch: {
    weekMode(val) {
      this.setWeekModeTheme(val)
    },
    lang(val) {
      this.setLanguage(val)
      this.setHtmlTitle()
    },
    $route() {
      this.setHtmlTitle()
    },
    'theme.mode': function(val) {
      const closeMessage = this.$message.loading(`您选择了主题模式 ${val}, 正在切换...`)
      themeUtil.changeThemeColor(this.theme.color, val).then(closeMessage)
    },
    'theme.color': function(val) {
      const closeMessage = this.$message.loading(`您选择了主题色 ${val}, 正在切换...`)
      themeUtil.changeThemeColor(val, this.theme.mode).then(closeMessage)
    },
    'layout': function() {
      window.dispatchEvent(new Event('resize'))
    }
  },
  created() {
    this.setHtmlTitle()
    this.setLanguage(this.lang)
    enquireScreen(isMobile => this.setDevice(isMobile))
  },
  mounted() {
    this.setWeekModeTheme(this.weekMode)
    this.wsTimer = setInterval(this.wsConnectDaemon, 3000)
    this.$eventBus.$on(this.$eventBus.$pullEvent.CONNECT, this.onUserConnect)
    this.$eventBus.$on(this.$eventBus.$pullEvent.DIS_CONNECT, this.onUserDisconnect)
  },
  beforeDestroy() {
    clearInterval(this.wsTimer)
  },
  methods: {
    ...mapMutations('setting', ['setDevice']),
    setWeekModeTheme(weekMode) {
      if (weekMode) {
        document.body.classList.add('week-mode')
      } else {
        document.body.classList.remove('week-mode')
      }
    },
    setLanguage(lang) {
      this.$i18n.locale = lang
      switch (lang) {
        case 'CN':
          this.locale = require('ant-design-vue/es/locale-provider/zh_CN').default
          break
        case 'HK':
          this.locale = require('ant-design-vue/es/locale-provider/zh_TW').default
          break
        case 'US':
        default:
          this.locale = require('ant-design-vue/es/locale-provider/en_US').default
          break
      }
    },
    connectWs() {
      const token = getAuthorization()
      if (this.$utils.isEmpty(token)) {
        this.retryWs = false
        return
      }
      try {
        // 创建WebSocket连接
        this.socket = new WebSocket(process.env.VUE_APP_MESSAGE_BUS_WS_URL + '?X-Auth-Token=' + token)

        // 监听WebSocket连接打开事件
        this.socket.onopen = () => {
          this.retryWs = false
        }

        // 监听WebSocket接收到消息事件
        this.socket.onmessage = (event) => {
          const msg = event.data
          const msgObj = JSON.parse(msg)
          let pushObj = msgObj.data
          try {
            // 这里尝试解析数据为json，如果解析不了那么直接推送字符串
            pushObj = JSON.parse(pushObj)
            // eslint-disable-next-line no-empty
          } catch {

          }
          this.$eventBus.$emit(msgObj.bizType, pushObj)
        }

        // 监听WebSocket连接关闭事件
        this.socket.onclose = () => {
          // 这里重连ws
          this.socket = undefined
        }
      } catch {
        this.socket = undefined
        this.retryWs = false
      }
    },
    wsConnectDaemon() {
      if (this.retryWs) {
        return
      }
      if (this.socket === undefined) {
        this.retryWs = true
        this.connectWs()
      }
    },
    setHtmlTitle() {
      const route = this.$route
      const key = route.path === '/' ? 'home.name' : getI18nKey(route.matched[route.matched.length - 1].path)
      document.title = process.env.VUE_APP_NAME + ' | ' + this.$t(key)
    },
    popContainer() {
      return document.getElementById('popContainer')
    },
    onUserConnect(e) {
      this.$notification.open({
        message: `用户上线`,
        description: (h) => h(UserConnectTip, { props: { name: e.name, ip: e.ip, createTime: e.createTime }}),
        duration: 2,
        placement: 'bottomRight',
        icon: (h) => h('a-icon', { props: { type: 'login' }, style: { color: '#108ee9' }})
      })
    },
    onUserDisconnect(e) {
      this.$notification.open({
        message: `用户下线`,
        description: (h) => h(UserConnectTip, { props: { name: e.name, ip: e.ip, createTime: e.createTime }}),
        duration: 2,
        placement: 'bottomRight',
        icon: (h) => h('a-icon', { props: { type: 'logout' }, style: { color: '#108ee9' }})
      })
    }
  }
}
</script>

<style lang="less" scoped>
  #id{
  }
</style>
