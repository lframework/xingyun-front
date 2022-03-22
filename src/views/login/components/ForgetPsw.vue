<template>
  <common-layout>
    <div class="top">
      <div class="header">
        <img alt="logo" class="logo" src="@/assets/img/logo.png">
        <span class="title">{{ systemName }}</span>
      </div>
      <div class="desc">{{ systemDescription }}</div>
    </div>
    <div class="forget-container">
      <div v-if="activeKey === '1'">
        <username @confirm="confirmUsername" />
      </div>
      <div v-else-if="activeKey === '2'">
        <select-forget :use-mail="forgetPswRequireMail && !$utils.isEmpty(user.email)" :use-telephone="forgetPswRequireSms && !$utils.isEmpty(user.telephone)" @confirm="confirmSelectForget" />
      </div>
      <div v-else-if="activeKey === '3'">
        <use-sms :user="user" />
      </div>
      <div v-else-if="activeKey === '4'">
        <use-email :user="user" />
      </div>
    </div>
  </common-layout>
</template>

<script>
import CommonLayout from '@/layouts/CommonLayout'
import Username from './steps/Username'
import SelectForget from './steps/SelectForget'
import UseEmail from './steps/UseEmail'
import UseSms from './steps/UseSms'

export default {
  name: 'Login',
  components: { CommonLayout, Username, SelectForget, UseEmail, UseSms },
  data() {
    return {
      loading: false,
      activeKey: '1',
      user: {
        email: '',
        telephone: ''
      },
      forgetPswRequireMail: false,
      forgetPswRequireSms: false
    }
  },
  computed: {
    systemName() {
      return this.$store.state.setting.systemName
    },
    systemDescription() {
      return this.$store.state.setting.systemDescription
    }
  },
  created() {
    this.$api.user.getInit().then(res => {
      this.forgetPswRequireMail = res.forgetPswRequireMail
      this.forgetPswRequireSms = res.forgetPswRequireSms
    }).catch(() => {
      this.$msg.errorDialog('系统初始化失败，请稍后刷新页面重试')
    })
  },
  methods: {
    confirmUsername(e) {
      this.user = e

      this.activeKey = '2'
    },
    confirmSelectForget(e) {
      this.activeKey = e
    }
  }
}
</script>

<style lang="less" scoped>
  .common-layout{
    .top {
      text-align: center;
      .header {
        height: 44px;
        line-height: 44px;
        a {
          text-decoration: none;
        }
        .logo {
          height: 44px;
          vertical-align: top;
          margin-right: 16px;
        }
        .title {
          font-size: 33px;
          color: @title-color;
          font-family: 'Myriad Pro', 'Helvetica Neue', Arial, Helvetica, sans-serif;
          font-weight: 600;
          position: relative;
          top: 2px;
        }
      }
      .desc {
        font-size: 14px;
        color: @text-color-second;
        margin-top: 12px;
        margin-bottom: 40px;
      }
    }
    .forget-container{
      width: 368px;
      margin: 0 auto;
      @media screen and (max-width: 576px) {
        width: 95%;
      }
      @media screen and (max-width: 320px) {
        .captcha-button{
          font-size: 14px;
        }
      }
      .icon {
        font-size: 24px;
        color: @text-color-second;
        margin-left: 16px;
        vertical-align: middle;
        cursor: pointer;
        transition: color 0.3s;

        &:hover {
          color: @primary-color;
        }
      }
    }
  }
</style>
