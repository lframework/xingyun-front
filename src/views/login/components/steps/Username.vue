<template>
  <a-form-model ref="form" :model="user" :rules="rules" @submit="onSubmit">
    <a-form-model-item prop="username">
      <a-input
        v-model="user.username"
        size="large"
        placeholder="请输入需要重置密码的用户名"
      >
        <a-icon slot="prefix" type="user" />
      </a-input>
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
  name: 'Login',
  components: { },
  data() {
    return {
      loading: false,
      user: {
        username: ''
      },
      rules: {
        username: [
          { required: true, message: '请输入需要重置密码的用户名' }
        ]
      }
    }
  },
  computed: {
  },
  created() {
  },
  methods: {
    onSubmit(e) {
      e.preventDefault()
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.loading = true
          const username = this.user.username
          this.$api.user.forgetUsername(username).then(res => {
            this.$emit('confirm', res)
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
</style>
