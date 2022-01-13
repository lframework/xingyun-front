<template>
  <div class="login-wrapper">
    <div class="ui-container">
      <div class="container-left">
        <div class="inner-con">
          <p class="logo"><img :src="logo"><span class="title">{{ title }}</span></p>
          <p class="sub-title">{{ subTitle }}</p>
          <p class="des">{{ description }}</p>
          <div class="bottom" />
        </div>
      </div>
      <div class="container-right">
        <el-form>
          <div class="form-header">登录</div>
          <div class="form-con">
            <div :class="{'error': validate.username.error}" class="input-username input-type">
              <input
                v-model="form.username"
                class="form-input"
                :class="{'error': validate.username.error}"
                placeholder="请输入用户名"
                type="text"
              >
            </div>
            <div :class="{'error': validate.password.error}" class="input-password input-type">
              <input
                v-model="form.password"
                class="form-input"
                :class="{'error': validate.password.error}"
                placeholder="请输入密码"
                type="password"
              >
            </div>
            <el-row>
              <el-col :span="16">
                <div :class="{'error': validate.captcha.error}" class="input-captcha input-type">
                  <input
                    v-model="form.captcha"
                    class="form-input"
                    :class="{'error': validate.captcha.error}"
                    placeholder="请输入验证码"
                    type="text"
                  >
                </div>
              </el-col>
              <el-col :span="8">
                <span @click="buildCaptcha">
                  <el-image class="captcha-image" :src="captchaUrl" />
                </span>
              </el-col>
            </el-row>
          </div>
          <button class="form-button" :disabled="loading" @click="loginAction">{{ loading ? '登录中...' : '登 录' }}</button>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
import settings from '@/settings'

export default {
  name: 'Login',
  components: { },
  data() {
    return {
      // 图形验证码url
      captchaUrl: '',
      loading: false,
      form: {
        username: 'admin',
        password: 'admin',
        captcha: '',
        sn: ''
      },
      validate: {
        username: { required: true, msg: '用户名不能为空', error: false },
        password: { required: true, msg: '密码不能为空', error: false },
        captcha: { required: true, msg: '验证码不能为空', error: false }
      }
    }
  },
  computed: {
    title() {
      return settings.title
    },
    subTitle() {
      return settings.subTitle
    },
    logo() {
      return settings.logo
    },
    description() {
      return settings.description
    }
  },
  watch: {
    $route: {
      handler: function(route) {
        const query = route.query
        if (query) {
          this.redirect = query.redirect
          this.otherQuery = this.getOtherQuery(query)
        }
      },
      immediate: true
    }
  },
  created() {
    this.buildCaptcha()
  },
  mounted() {
  },
  destroyed() {
  },
  methods: {
    buildCaptcha() {
      this.$api.user.getCaptcha().then(data => {
        this.form.sn = data.sn
        this.captchaUrl = data.image
      })
    },
    getOtherQuery(query) {
      return Object.keys(query).reduce((acc, cur) => {
        if (cur !== 'redirect') {
          acc[cur] = query[cur]
        }
        return acc
      }, {})
    },
    submitBefore() {
      this.$set(this.validate.username, 'error', false)
      this.$set(this.validate.password, 'error', false)
      this.$set(this.validate.captcha, 'error', false)

      if (this.$utils.isEmpty(this.form.username)) {
        this.$set(this.validate.username, 'error', true)
        return false
      }

      if (this.$utils.isEmpty(this.form.password)) {
        this.$set(this.validate.password, 'error', true)
        return false
      }

      if (this.$utils.isEmpty(this.form.captcha)) {
        this.$set(this.validate.captcha, 'error', true)
        return false
      }

      return true
    },
    loginAction() {
      if (!this.submitBefore()) {
        return
      }

      this.loading = true
      this.$store.dispatch('user/login', this.form)
        .then(() => {
          this.$router.push({ path: this.redirect || '/', query: this.otherQuery })
        })
        .catch(() => {
          this.buildCaptcha()
          this.loading = false
        })
    }
  }
}
</script>

<style lang="scss">
.login-wrapper {
    min-width: 1040px;
    min-height: 99.9vh;
    position: relative;
    &:before {
      display:block;
      content: '';
      width: 394px;
      height: 468px;
      left: 0;
      position: fixed;
      bottom: 0;
      background-size: contain;
      background-repeat: no-repeat;
    }
    &:after {
      content: '';
      width: 487px;
      height: 412px;
      right: 0;
      position: fixed;
      bottom: 0;
      background-size: contain;
      background-repeat: no-repeat;
    }
    .ui-container {
      position: absolute;
      top: 50%;
      left: 50%;
      width: 1000px;
      height: 570px;
      padding: 0;
      z-index: 1;
      -webkit-transform: translate(-50%, -55%);
      transform: translate(-50%, -55%);
      margin: 0 auto;
      box-shadow: 0 20px 80px 0 rgba(0,0,0,0.3);
      background: #FFF;
      display: flex;
      .container-left {
        color: #FFF;
        position: relative;
        padding: 80px 80px 48px;
        background: -webkit-gradient(linear, left bottom, left top, from(#3A485A), to(#607089));
        background: linear-gradient(0deg, #3A485A 0%, #607089 100%);
        margin: 0 auto;
        width: 50%;
        min-height: 564px;
        &:before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          bottom: 0;
          right: 0;
        }
        &:after {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          bottom: 0;
          right: 0;
        }
        .inner-con {
          position: relative;
          z-index: 1;
          height: 100%;
          display: -webkit-box;
          display: -ms-flexbox;
          display: flex;
          -webkit-box-orient: vertical;
          -webkit-box-direction: normal;
          -ms-flex-direction: column;
          flex-direction: column;
          -webkit-box-pack: justify;
          -ms-flex-pack: justify;
          justify-content: space-between;
          p {
            margin:0;
          }
          .logo {
            display: flex;
            flex-direction: row;
            flex-wrap: nowrap;
            justify-content: flex-start;
            align-items: center;
          }
          .logo img{
            width: 100px;
          }
          .title{
            margin-left: 10px;
            font-size: 32px;
          }
          .sub-title {
            font-size: 24px;
            margin-top: 20px;
          }
          .des {
            font-size: 14px;
            line-height: 20px;
          }
          .bottom {
            font-size: 14px;
            padding-top: 40px;
            margin-top: 114px;
            border-top: 1px solid rgba(255,255,255,0.2);
            display: flex;
            align-items: center;
          }
        }
      }
      .container-right {
         margin: 0 auto;
         width: 50%;
         min-height: 564px;
         height: 100%;
         padding: 64px 70px 48px;
         position: relative;
         .form-header {
           font-size: 25px;
           font-weight: bold;
           color: #333;
         }
         .form-con {
           margin:30px 0;
           p.error-msg {
             margin:5px;
             color: #F56C6C;
             font-size: 12px;
           }
          .form-input {
             display: block;
             width: 100%;
             height: 40px;
             border-radius: 3px;
             border: 1px solid #DFE3E9;
             margin-bottom:20px;
             padding:5px 15px;
             color: #666;
             font-size: 14px;
             &:focus {
               outline: 0.5px solid #66B1FF;
             }
           }
           .input-type.error {
              position: relative;
              &:after {
                display: block;
                width: 100%;
                color: #F56C6C;
                content: '';
                font-size: 12px;
                margin: -10px 5px 20px;
              }
              &:focus {
                outline: 0 solid #66B1FF;
              }
              .form-input {
                background: #FFF0F0;
                border-color: #DBB1B1;
                color: #F56C6C;
                border-radius: 0 0.2857rem 0.2857rem 0;
                -webkit-box-shadow: 2px 0 0 0 #F56C6C inset;
                box-shadow: 2px 0 0 0 #F56C6C inset;
                &:focus {
                  outline: 0 solid #66B1FF;
                }
              }
            }
            .input-username.error {
               &:after {
                content: '用户名不能为空';
              }
            }
           .input-password.error {
             &:after {
               content: '密码不能为空';
             }
           }
           .input-captcha.error {
             &:after {
               content: '验证码不能为空';
             }
           }
           input::-webkit-input-placeholder{
              color:#CCC;
              font-size:13px;
           }
           input::-moz-placeholder{   /* Mozilla Firefox 19+ */
              color:#CCC;
              font-size:13px;
           }
           input:-moz-placeholder{    /* Mozilla Firefox 4 to 18 */
              color:#CCC;
              font-size:13px;
           }
           input:-ms-input-placeholder{  /* Internet Explorer 10-11 */
              color:#CCC;
              font-size:13px;
           }
         }
        .form-button {
           font-size: 18px;
           line-height: 22px;
           padding: 8px 26px;
           font-weight: 500;
           background: #66B1FF;
           color: #FFF;
           text-align: center;
           cursor: pointer;
           opacity: 0.9;
           width: 100%;
           border: 0;
           &:focus {
             outline: 0 solid #66B1FF;
             background: #53A8FF;
          }
           &:hover {
             opacity: 1;
           }
        }
      }
    }
}

.captcha-image {
  height: 40px;
  width: 100%;
  cursor: pointer;
}
</style>
