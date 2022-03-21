<template>
  <common-layout>
    <div class="top">
      <div class="header">
        <img alt="logo" class="logo" src="@/assets/img/logo.png">
        <span class="title">{{ systemName }}</span>
      </div>
      <div class="desc">{{ systemDescription }}</div>
    </div>
    <div class="login">
      <a-tabs v-model="activeKey" size="large" :tab-bar-style="{textAlign: 'center'}" style="padding: 0 2px;">
        <a-tab-pane key="1" tab="账户密码登录">
          <a-form-model ref="form" :model="user" :rules="rules" @submit="onSubmit">
            <a-form-model-item prop="username">
              <a-input
                v-model="user.username"
                size="large"
                placeholder="请输入用户名"
              >
                <a-icon slot="prefix" type="user" />
              </a-input>
            </a-form-model-item>
            <a-form-model-item prop="password">
              <a-input-password
                v-model="user.password"
                size="large"
                placeholder="请输入密码"
              >
                <a-icon slot="prefix" type="lock" />
              </a-input-password>
            </a-form-model-item>
            <a-form-model-item v-if="allowCaptcha" prop="captcha">
              <div style="display: flex; flex-direction: row; flex-wrap: nowrap; align-items: center;">
                <a-input
                  v-model="user.captcha"
                  style="width: 240px;"
                  size="large"
                  placeholder="请输入验证码"
                >
                  <a-icon slot="prefix" type="safety-certificate" />
                </a-input>
                <a-avatar shape="square" style="width: 128px !important; height: 40px; border-radius: 0; cursor: pointer;" :src="captchaUrl" @click="buildCaptcha" />
              </div>
            </a-form-model-item>
            <a-form-item>
              <a-button :loading="loading" style="width: 100%;margin-top: 6px" size="large" html-type="submit" type="primary">登录</a-button>
              <a-button v-if="allowRegist" :loading="loading" style="width: 100%;margin-top: 10px" size="large" @click="e => activeKey = '3'">注册</a-button>
            </a-form-item>
          </a-form-model>
        </a-tab-pane>
        <a-tab-pane key="2" tab="手机号登录">
          <a-form-model @submit="onTelSubmit">
            <a-form-model-item>
              <a-input size="large" placeholder="请输入手机号">
                <a-icon slot="prefix" type="mobile" />
              </a-input>
            </a-form-model-item>
            <a-form-model-item>
              <a-row :gutter="8" style="margin: 0 -4px">
                <a-col :span="16">
                  <a-input size="large" placeholder="请输入验证码">
                    <a-icon slot="prefix" type="mail" />
                  </a-input>
                </a-col>
                <a-col :span="8" style="padding-left: 4px">
                  <a-button style="width: 100%" class="captcha-button" size="large">获取验证码</a-button>
                </a-col>
              </a-row>
            </a-form-model-item>
            <a-form-model-item>
              <a-button :loading="loading" style="width: 100%;margin-top: 6px" size="large" html-type="submit" type="primary">登录</a-button>
            </a-form-model-item>
          </a-form-model>
        </a-tab-pane>
        <a-tab-pane v-if="allowRegist" key="3" tab="注册">
          <a-form-model ref="registForm" :model="regist" :rules="registRules" @submit="onRegist">
            <a-form-model-item label="用户名" prop="username">
              <a-input v-model.trim="regist.username" allow-clear />
            </a-form-model-item>
            <a-form-model-item label="姓名" prop="name">
              <a-input v-model.trim="regist.name" allow-clear />
            </a-form-model-item>
            <a-form-model-item label="密码" prop="password">
              <a-input-password v-model="regist.password" allow-clear />
            </a-form-model-item>
            <a-form-model-item label="邮箱" prop="email">
              <a-input v-model.trim="regist.email" allow-clear />
            </a-form-model-item>
            <a-form-model-item label="联系电话" prop="telephone">
              <a-input v-model.trim="regist.telephone" allow-clear />
            </a-form-model-item>
            <a-form-model-item>
              <a-button :loading="loading" style="width: 100%;margin-top: 6px" size="large" html-type="submit" type="primary">注册</a-button>
              <a-button :loading="loading" style="width: 100%;margin-top: 10px" size="large" @click="e => activeKey = '1'">返回</a-button>
            </a-form-model-item>
          </a-form-model>
        </a-tab-pane>
      </a-tabs>
    </div>
  </common-layout>
</template>

<script>
import CommonLayout from '@/layouts/CommonLayout'
import { setAuthorization } from '@/utils/request'
import { loadRoutes } from '@/utils/routerUtil'
import { mapMutations } from 'vuex'
import * as constants from '@/views/system/user/constants'

export default {
  name: 'Login',
  components: { CommonLayout },
  data() {
    return {
      loading: false,
      error: '',
      user: {
        username: 'admin',
        password: 'admin',
        captcha: ''
      },
      regist: {},
      rules: {
        username: [
          { required: true, message: '请输入用户名' }
        ],
        password: [
          { required: true, message: '请输入密码' }
        ],
        captcha: [
          { required: true, message: '请输入验证码' }
        ]
      },
      // 表单校验规则
      registRules: {
        username: [
          { required: true, message: '请输入用户名' }
        ],
        name: [
          { required: true, message: '请输入姓名' }
        ],
        password: [
          { required: true, message: '请输入密码' },
          { required: true, validator: constants.validPassword }
        ],
        email: [
          { validator: constants.validEmail }
        ],
        telephone: [
          { validator: constants.validTelephone }
        ]
      },
      captchaUrl: '',
      sn: '',
      activeKey: '1',
      allowRegist: false,
      allowCaptcha: false
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
    this.initRegist()
    this.$api.user.getInit().then(res => {
      this.allowRegist = res.allowRegist
      this.allowCaptcha = res.allowCaptcha

      if (this.allowCaptcha) {
        this.buildCaptcha()
      }
    }).catch(() => {
      this.$msg.errorDialog('系统初始化失败，请稍后刷新页面重试')
    })
  },
  methods: {
    ...mapMutations('account', ['setUser', 'setRoles']),
    onSubmit(e) {
      e.preventDefault()
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.loading = true
          const username = this.user.username
          const password = this.user.password
          const captcha = this.user.captcha
          this.$api.user.login({
            username: username,
            password: password,
            captcha: captcha,
            sn: this.sn
          }).then(this.afterLogin).catch(() => {
            if (this.allowCaptcha) {
              this.buildCaptcha()
            }
          }).finally(() => {
            this.loading = false
          })
        }
      })
    },
    onTelSubmit(e) {
      this.$msg.error('暂不支持手机号登录')
    },
    afterLogin(res) {
      setAuthorization({ token: res.token })
      this.$api.user.getInfo().then(info => {
        this.setUser(info.user)
        this.setRoles(info.roles)

        // 获取路由配置
        this.$api.user.getMenus().then(menus => {
          const routesConfig = this.$utils.toArrayTree(menus, {
            strict: true
          })
          loadRoutes(routesConfig)
          this.$router.push('/dashboard/workplace')
          this.loginSuccessTip()
        })
      })
    },
    buildCaptcha() {
      this.$api.user.getCaptcha().then(data => {
        this.sn = data.sn
        this.captchaUrl = data.image
      })
    },
    onRegist() {
      this.$refs.registForm.validate((valid) => {
        if (valid) {
          this.loading = true
          this.$api.user.regist(this.regist).then(() => {
            this.$msg.success('注册成功！')
            this.initRegist()
            this.activeKey = '1'
          }).finally(() => {
            this.loading = false
          })
        }
      })
    },
    initRegist() {
      this.regist = {
        username: '',
        name: '',
        password: '',
        email: '',
        telephone: ''
      }
    },
    loginSuccessTip() {
      const hour = this.$utils.getCurrentDateTime().get('h')
      let msg = ''
      if (hour < 4) {
        msg = '夜深了，'
      } else if (hour < 6) {
        msg = '凌晨好，'
      } else if (hour < 9) {
        msg = '早上好，'
      } else if (hour < 12) {
        msg = '上午好，'
      } else if (hour < 14) {
        msg = '中午好，'
      } else if (hour < 17) {
        msg = '下午好，'
      } else if (hour < 19) {
        msg = '傍晚好，'
      } else if (hour < 22) {
        msg = '晚上好，'
      } else {
        msg = '夜深了，'
      }

      msg += '欢迎回来'
      this.$msg.successTip(msg)
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
    .login{
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
