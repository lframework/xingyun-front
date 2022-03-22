<template>
  <a-form-model ref="form" :model="formData" :rules="rules" @submit="onSubmit">
    <a-form-model-item prop="password">
      <a-input-password
        v-model="formData.password"
        size="large"
        placeholder="请输入新密码"
      >
        <a-icon slot="prefix" type="lock" />
      </a-input-password>
    </a-form-model-item>
    <a-form-model-item prop="captcha">
      <div style="display: flex; flex-direction: row; flex-wrap: nowrap; align-items: center;">
        <a-input
          v-model="formData.captcha"
          style="width: 100%;"
          size="large"
          placeholder="请输入验证码"
        >
          <a-icon slot="prefix" type="safety-certificate" />
        </a-input>
        <a-button v-if="!hasCaptcha" size="large" :loading="loading" @click="getCaptcha">获取验证码</a-button>
        <a-button v-else size="large" disabled>{{ captchaSeconds }}秒后重新获取</a-button>
      </div>
    </a-form-model-item>
    <a-form-item>
      <a-button :loading="loading" style="width: 100%;margin-top: 6px" size="large" html-type="submit" type="primary">确定</a-button>
      <router-link to="/login">
        <a-button style="width: 100%;margin-top: 10px" size="large">返回</a-button>
      </router-link>
    </a-form-item>
  </a-form-model>
</template>

<script>

export default {
  components: { },
  props: {
    user: {
      type: Object,
      default: () => {
        return {
          username: '',
          telephone: ''
        }
      }
    }
  },
  data() {
    return {
      loading: false,
      formData: {
        password: ''
      },
      rules: {
        password: [
          { required: true, message: '请输入新密码' }
        ],
        captcha: [
          { required: true, message: '请输入验证码' }
        ]
      },
      hasCaptcha: false,
      captchaSeconds: 60,
      timer: undefined
    }
  },
  computed: {
  },
  beforeDestroy() {
    clearInterval(this.timer)
  },
  created() {
  },
  methods: {
    onSubmit(e) {
      e.preventDefault()
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.loading = true
          const params = Object.assign({ username: this.user.username }, this.formData)
          this.$api.user.resetPswBySms(params).then(res => {
            this.$msg.success('密码重置成功')
            this.$router.push('/login')
          }).finally(() => {
            this.loading = false
          })
        }
      })
    },
    getCaptcha() {
      this.loading = true
      this.$api.user.getSmsCaptcha(this.user.username).then(() => {
        this.hasCaptcha = true
        this.timer = setInterval(this.onTimer, 1000)
        this.$msg.successTip('短信验证码已发送，请注意查收手机号【' + this.user.telephone + '】短信')
      }).finally(() => {
        this.loading = false
      })
    },
    onTimer() {
      this.captchaSeconds--
      if (this.captchaSeconds <= 1) {
        this.hasCaptcha = false
        this.captchaSeconds = 60
        clearInterval(this.timer)
      }
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
