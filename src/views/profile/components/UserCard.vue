<template>
  <el-card style="margin-bottom:20px;">
    <div class="user-profile">
      <div class="box-center">
        <el-avatar v-if="!$utils.isEmpty(user.name)" class="user-avatar"> {{ user.name.substring(0, 1) }} </el-avatar>
      </div>
      <div class="box-center">
        <div class="user-name text-center">{{ user.username }}</div>
      </div>
    </div>

    <div class="user-bio">
      <div class="user-bio-section">
        <div class="user-bio-section-header"><svg-icon icon-class="user" /><span>个人信息</span></div>
        <div class="user-bio-section-body">
          <div class="user-info-item">
            <span class="title">编号</span>
            <span class="content" :title="user.code">{{ user.code }}</span>
          </div>
          <div class="user-info-item">
            <span class="title">姓名</span>
            <span class="content" :title="user.name">{{ user.name }}</span>
          </div>
          <div class="user-info-item">
            <span class="title">电子邮箱</span>
            <span class="content" :title="user.email">{{ user.email }}</span>
            <span class="btn"><el-link type="primary" :underline="false" @click="$emit('changeActiveName', 'email')">修改</el-link></span>
          </div>
          <div class="user-info-item">
            <span class="title">联系电话</span>
            <span class="content" :title="user.telephone">{{ user.telephone }}</span>
            <span class="btn"><el-link type="primary" :underline="false" @click="$emit('changeActiveName', 'telephone')">修改</el-link></span>
          </div>
          <div class="user-info-item">
            <span class="title">性别</span>
            <span class="content">{{ $enums.GENDER.getDesc(user.gender) }}</span>
          </div>
        </div>
        <div class="user-bio-section-footer">
          <el-button type="text" @click="$emit('changeActiveName', 'password')">修改密码</el-button>
          <el-button type="text" @click="logout">退出登录</el-button>
        </div>
      </div>
    </div>
  </el-card>
</template>

<script>

export default {
  components: { },
  props: {
    user: {
      type: Object,
      default: () => {
        return {
          code: '',
          username: '',
          name: '',
          email: '',
          telephone: '',
          gender: ''
        }
      }
    }
  },
  methods: {
    logout() {
      this.$msg.confirm('是否确认退出登录？').then(() => {
        this.doLogout()
      })
    },
    async doLogout() {
      await this.$store.dispatch('user/logout')
      this.$router.push(`/login?redirect=${this.$route.fullPath}`)
    }
  }
}
</script>

<style lang="scss" scoped>
.user-avatar {
  background: #1890ff;
}
.box-center {
  margin: 0 auto;
  display: table;
}

.text-muted {
  color: #777;
}

.user-profile {
  .user-name {
    font-weight: bold;
  }

  .box-center {
    padding-top: 10px;
  }
}

.user-bio {
  margin-top: 20px;
  color: #606266;

  .user-bio-section {
    font-size: 14px;
    padding: 15px 0;

    .user-bio-section-header {
      border-bottom: 1px solid #dfe6ec;
      padding-bottom: 10px;
      margin-bottom: 10px;
      font-weight: bold;
    }

    .user-bio-section-body {
      .user-info-item {
        display: flex;
        flex-direction: row;
        flex-wrap: nowrap;
        justify-content: flex-start;
        align-items: center;
        margin-bottom: 10px;
        font-size: 14px;

        .title {
          color: #909399;
          margin-left: 5px;
        }

        .content {
          display: inline-block;
          margin-left: 10px;
          max-width: 120px;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .btn {
          margin-left: 5px;
        }
      }
    }

    .user-bio-section-footer {
      display: flex;
      flex-direction: row;
      flex-wrap: nowrap;
      justify-content: space-around;
      align-items: center;
    }
  }
}
</style>
