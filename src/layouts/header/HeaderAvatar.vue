<template>
  <a-dropdown>
    <div class="header-avatar" style="cursor: pointer">
      <a-avatar class="avatar" size="small" shape="circle" style="background-color: #1890ff;">{{ user.name.substring(0, 1) }}</a-avatar>
      <span class="name">{{ user.name }}</span>
    </div>
    <a-menu slot="overlay" :class="['avatar-menu']">
      <a-menu-item>
        <router-link to="/profile">
          <a-icon style="margin-right: 8px;" type="user" />
          <span>个人中心</span>
        </router-link>
      </a-menu-item>
      <a-menu-item>
        <router-link to="/settings">
          <a-icon style="margin-right: 8px;" type="setting" />
          <span>个人设置</span>
        </router-link>
      </a-menu-item>
      <a-menu-divider />
      <a-menu-item @click="logout">
        <a-icon style="margin-right: 8px;" type="poweroff" />
        <span>退出登录</span>
      </a-menu-item>
    </a-menu>
  </a-dropdown>
</template>

<script>
import { mapGetters } from 'vuex'
import { logout } from '@/services/user'

export default {
  name: 'HeaderAvatar',
  computed: {
    ...mapGetters('account', ['user'])
  },
  methods: {
    logout() {
      logout()
      this.$router.push('/login')
    }
  }
}
</script>

<style lang="less">
  .header-avatar{
    display: inline-flex;
    .avatar, .name{
      align-self: center;
    }
    .avatar{
      margin-right: 8px;
    }
    .name{
      font-weight: 500;
    }
  }
  .avatar-menu{
    width: 150px;
  }

</style>
