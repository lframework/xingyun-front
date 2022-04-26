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
                <a-avatar shape="square" class="img-captcha" :src="captchaUrl" @click="buildCaptcha" />
              </div>
            </a-form-model-item>
            <a-form-item>
              <a-button :loading="loading" style="width: 100%;margin-top: 6px" size="large" html-type="submit" type="primary">登录</a-button>
              <a-button v-if="allowRegist" style="width: 100%;margin-top: 10px" size="large" @click="e => activeKey = '3'">注册</a-button>
              <div v-if="allowForgetPsw" style="text-align: center;">
                <router-link to="/forget-psw">
                  <a>忘记密码？</a>
                </router-link>
              </div>
            </a-form-item>
          </a-form-model>
        </a-tab-pane>
        <a-tab-pane v-if="allowTelephoneLogin" key="2" tab="手机号登录">
          <a-form-model ref="telephoneLoginForm" :model="telephoneLogin" :rules="telephoneLoginRules" @submit="onTelSubmit">
            <a-form-model-item prop="telephone">
              <a-input v-model="telephoneLogin.telephone" size="large" placeholder="请输入手机号">
                <a-icon slot="prefix" type="mobile" />
              </a-input>
            </a-form-model-item>
            <a-form-model-item prop="captcha">
              <a-row>
                <a-col :span="14">
                  <a-input v-model="telephoneLogin.captcha" size="large" placeholder="请输入验证码">
                    <a-icon slot="prefix" type="mail" />
                  </a-input>
                </a-col>
                <a-col :span="10">
                  <a-button v-if="smsCaptchaSeconds < 60" style="width: 100%" class="captcha-button" size="large" disabled>{{ '重新获取(' + smsCaptchaSeconds + ')' }}</a-button>
                  <a-button v-else style="width: 100%" :loading="loading" class="captcha-button" size="large" @click="sendSmsCaptcha">获取验证码</a-button>
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
            <a-form-model-item prop="username">
              <a-input v-model.trim="regist.username" size="large" placeholder="请输入用户名" allow-clear>
                <a-icon slot="prefix" type="user" />
              </a-input>
            </a-form-model-item>
            <a-form-model-item prop="name">
              <a-input v-model.trim="regist.name" size="large" placeholder="请输入姓名" allow-clear>
                <a-icon slot="prefix" type="idcard" />
              </a-input>
            </a-form-model-item>
            <a-form-model-item prop="password">
              <a-input-password v-model="regist.password" size="large" placeholder="请输入密码" allow-clear>
                <a-icon slot="prefix" type="key" />
              </a-input-password>
            </a-form-model-item>
            <a-form-model-item prop="email">
              <a-input v-model.trim="regist.email" size="large" placeholder="请输入邮箱，如果不填则无法使用邮箱找回密码" allow-clear>
                <a-icon slot="prefix" type="mail" />
              </a-input>
            </a-form-model-item>
            <a-form-model-item prop="telephone">
              <a-input v-model.trim="regist.telephone" size="large" placeholder="请输入联系电话，如果不填则无法使用短信找回密码" allow-clear>
                <a-icon slot="prefix" type="phone" />
              </a-input>
            </a-form-model-item>
            <a-form-model-item>
              <a-button :loading="loading" style="width: 100%;margin-top: 6px" size="large" html-type="submit" type="primary">注册</a-button>
              <a-button :loading="loading" style="width: 100%;margin-top: 10px" size="large" @click="e => activeKey = '1'">返回</a-button>
            </a-form-model-item>
          </a-form-model>
        </a-tab-pane>
      </a-tabs>
      <a-modal v-model="telephoneBindUserVisible" :mask-closable="false" width="30%" title="绑定账户" :dialog-style="{ top: '20px' }" :footer="null">
        <div>
          <a-form-model ref="telephoneBindUserForm" :label-col="{span: 6}" :wrapper-col="{span: 14}" :model="telephoneBindUser" :rules="telephoneBindUserRules" @submit="onTelephoneBindUser">
            <a-form-model-item label="用户名" prop="username">
              <a-input v-model.trim="telephoneBindUser.username" allow-clear />
            </a-form-model-item>
            <a-form-model-item label="密码" prop="password">
              <a-input-password v-model="telephoneBindUser.password" allow-clear />
            </a-form-model-item>
            <div class="form-modal-footer">
              <a-space>
                <a-button :loading="loading" type="primary" html-type="submit">确定</a-button>
                <a-button @click="telephoneBindUserVisible = false">取消</a-button>
              </a-space>
            </div>
          </a-form-model>
        </div>
      </a-modal>
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
      // 账号密码登录表单校验规则
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
      telephoneLogin: {
        telephone: '',
        captcha: ''
      },
      // 手机号登录表单校验规则
      telephoneLoginRules: {
        telephone: [
          { required: true, message: '请输入手机号' },
          { validator: constants.validTelephone }
        ],
        captcha: [
          { required: true, message: '请输入验证码' }
        ]
      },
      regist: {},
      // 注册表单校验规则
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
      // 是否允许注册
      allowRegist: false,
      // 是否允许验证码
      allowCaptcha: false,
      // 是否允许忘记密码
      allowForgetPsw: false,
      // 是否允许手机号登录
      allowTelephoneLogin: false,
      // 短信验证码定时器
      smsCaptchaTimer: null,
      // 短信验证码计时
      smsCaptchaSeconds: 60,
      // 绑定账户对话框
      telephoneBindUserVisible: false,
      telephoneBindUser: {},
      // 绑定账户表单校验规则
      telephoneBindUserRules: {
        username: [
          { required: true, message: '请输入用户名' }
        ],
        password: [
          { required: true, message: '请输入密码' }
        ]
      }
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
      this.allowForgetPsw = res.allowForgetPsw
      this.allowTelephoneLogin = res.allowTelephoneLogin

      if (this.allowCaptcha) {
        this.buildCaptcha()
      }
    }).catch(() => {
      this.$msg.errorDialog('系统初始化失败，请稍后刷新页面重试')
    })
  },
  destroyed() {
    if (this.smsCaptchaTimer) {
      clearInterval(this.smsCaptchaTimer)
    }
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
      e.preventDefault()
      this.$refs.telephoneLoginForm.validate((valid) => {
        if (valid) {
          this.loading = true
          this.$api.user.telephoneLogin({
            telephone: this.telephoneLogin.telephone,
            captcha: this.telephoneLogin.captcha
          }).then(res => {
            if (res.isBind) {
              this.afterLogin(res.loginInfo)
            } else {
              this.telephoneBindUserVisible = true
            }
          }).finally(() => {
            this.loading = false
          })
        }
      })
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
    onRegist(e) {
      e.preventDefault()
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
    },
    sendSmsCaptcha() {
      if (this.smsCaptchaSeconds < 60) {
        return
      }

      this.$refs.telephoneLoginForm.validateField('telephone', (valid) => {
        if (this.$utils.isEmpty(valid)) {
          this.loading = true

          this.$api.user.getTelephoneLoginSmsCaptcha({
            telephone: this.telephoneLogin.telephone
          }).then(() => {
            this.smsCaptchaSeconds--
            this.smsCaptchaTimer = setInterval(this.doSmsCaptchaTimer, 1000)
          }).finally(() => {
            this.loading = false
          })
        }
      })
    },
    doSmsCaptchaTimer() {
      this.smsCaptchaSeconds--
      if (this.smsCaptchaSeconds <= 0) {
        this.smsCaptchaSeconds = 60
        clearInterval(this.smsCaptchaTimer)
        this.smsCaptchaTimer = null
      }
    },
    onTelephoneBindUser(e) {
      e.preventDefault()

      this.$refs.telephoneBindUserForm.validate((valid) => {
        if (valid) {
          this.loading = true
          this.$api.user.telephoneBindUser({
            telephone: this.telephoneLogin.telephone,
            ...this.telephoneBindUser
          }).then(res => {
            this.afterLogin(res)
          }).finally(() => {
            this.loading = false
          })
        }
      })
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

  .img-captcha {
    width: 128px !important;
    height: 40px;
    border-radius: 0;
    cursor: pointer;
  }
</style>
