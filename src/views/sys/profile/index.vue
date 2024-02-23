<template>
  <page-wrapper content-full-height>
    <div class="page-header-wrapper-grid-content-main">
      <a-row :gutter="24">
        <a-col :md="24" :lg="7">
          <a-card :bordered="false">
            <div v-if="!loading">
              <div class="account-center-avatarHolder">
                <avatar :size="70" style="font-size: 36px">{{ user.name.substring(0, 1) }}</avatar>
                <div class="username">{{ user.username }}</div>
              </div>
              <div class="account-center-detail">
                <p> <IdcardOutlined /> {{ user.code }} </p>
                <p> <AlertOutlined /> {{ user.name }} </p>
                <p> <MailOutlined /> {{ user.email }} </p>
                <p> <PhoneOutlined /> {{ user.telephone }} </p>
                <p> <UserOutlined /> {{ $enums.GENDER.getDesc(user.gender) }} </p>
              </div>
              <a-divider style="margin: 10px 0" />
              <div class="account-center-actions">
                <router-link to="/settings">
                  <a>个人设置</a>
                </router-link>
                <a @click="logout">退出登录</a>
              </div>
            </div>
            <a-skeleton v-else />
          </a-card>
        </a-col>
        <a-col :md="24" :lg="17">
          <dynamic-info />
        </a-col>
      </a-row>
    </div>
  </page-wrapper>
</template>

<script>
  import { defineComponent } from 'vue';
  import * as api from '@/api/sys/center';
  import { useUserStore } from '@/store/modules/user';
  import Avatar from '@/layouts/default/header/components/avatar/Avatar.vue';
  import { PageWrapper } from '@/components/Page';
  import DynamicInfo from '@/views/dashboard/workbench/components/DynamicInfo.vue';
  import {
    IdcardOutlined,
    UserOutlined,
    MailOutlined,
    PhoneOutlined,
    AlertOutlined,
  } from '@ant-design/icons-vue';

  export default defineComponent({
    components: {
      PageWrapper,
      Avatar,
      IdcardOutlined,
      UserOutlined,
      MailOutlined,
      PhoneOutlined,
      AlertOutlined,
      DynamicInfo,
    },
    setup() {
      const userStore = useUserStore();
      return {
        userStore,
      };
    },
    data() {
      return {
        loading: false,
        user: {
          code: '',
          username: '',
          name: '',
          email: '',
          telephone: '',
          gender: '',
        },
      };
    },
    computed: {},
    created() {
      this.getUser();
    },
    mounted() {},
    methods: {
      getUser() {
        this.loading = true;
        api
          .getInfo()
          .then((res) => {
            this.user = res;
          })
          .finally(() => {
            this.loading = false;
          });
      },
      handleTabChange(key, type) {
        this[type] = key;
      },
      logout() {
        this.$msg.createConfirm('确定退出登录？').then(() => {
          this.userStore.logout(true);
        });
      },
    },
  });
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
