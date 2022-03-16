<template>
  <div class="page-header-wrapper-grid-content-main app-container">
    <a-row :gutter="24">
      <a-col :md="24" :lg="7">
        <a-card :bordered="false">
          <div class="account-center-avatarHolder">
            <a-avatar class="avatar" :size="120" shape="circle" style="backgroundColor: #1890ff; font-size: 60px;">{{ user.name.substring(0, 1) }}</a-avatar>
            <div class="username">{{ user.username }}</div>
          </div>
          <div class="account-center-detail">
            <p>
              <a-icon type="idcard" />{{ user.code }}
            </p>
            <p>
              <a-icon type="user" />{{ user.name }}
            </p>
            <p>
              <a-icon type="mail" />{{ user.email }}
            </p>
            <p>
              <a-icon type="phone" />{{ user.telephone }}
            </p>
            <p>
              <svg-icon icon-class="gender" />{{ $enums.GENDER.getDesc(user.gender) }}
            </p>
          </div>
          <a-divider style="margin: 10px 0;" />
          <div class="account-center-actions">
            <router-link to="/settings">
              <a>个人设置</a>
            </router-link>
            <a @click="logout">退出登录</a>
          </div>
        </a-card>
      </a-col>
      <a-col :md="24" :lg="17">
        <a-card
          style="width:100%"
          :bordered="false"
          :tab-list="tabListNoTitle"
          :active-tab-key="noTitleKey"
          @tabChange="key => handleTabChange(key, 'noTitleKey')"
        >
          <template slot="opLogsRender">
            <a-badge :count="tabListNoTitle[0].totalCount" :overflow-count="999" :offset="[20, 6]">
              <div>操作日志</div>
            </a-badge>
          </template>
          <div v-if="noTitleKey === 'opLogs'">
            <log @loaded="e => tabListNoTitle[0].totalCount = e" />
          </div>
        </a-card>
      </a-col>
    </a-row>
  </div>
</template>

<script>

import { logout } from '@/services/user'
import Log from './components/Log'

export default {
  components: {
    Log
  },
  data() {
    return {
      tabListNoTitle: [
        {
          key: 'opLogs',
          totalCount: '0',
          scopedSlots: { tab: 'opLogsRender' }
        }
      ],
      noTitleKey: 'opLogs',
      user: {
        code: '',
        username: '',
        name: '',
        email: '',
        telephone: '',
        gender: ''
      }
    }
  },
  computed: {
  },
  created() {
    this.getUser()
  },
  mounted() {
  },
  methods: {
    getUser() {
      this.$api.userCenter.getInfo().then(res => {
        this.user = res
      })
    },
    handleTabChange(key, type) {
      this[type] = key
    },
    logout() {
      this.$msg.confirm('确定退出登录？').then(() => {
        logout()
        this.$router.push('/login')
      })
    }
  }
}
</script>

<style lang="less" scoped>
.page-header-wrapper-grid-content-main {
  width: 100%;
  height: 100%;
  min-height: 100%;
  transition: 0.3s;

  .account-center-avatarHolder {
    text-align: center;
    margin-bottom: 24px;

    .avatar {
      margin-bottom: 20px;
    }

    .username {
      color: rgba(0, 0, 0, 0.85);
      font-size: 20px;
      line-height: 28px;
      font-weight: 500;
      margin-bottom: 4px;
    }
  }

  .account-center-detail {
    p {
      margin-bottom: 8px;
      padding-left: 26px;
      position: relative;
    }

    i {
      position: absolute;
      height: 14px;
      width: 14px;
      left: 0;
      top: 4px;
    }
  }

  .account-center-actions {
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    justify-content: space-around;
    align-items: center;
  }
}
</style>
