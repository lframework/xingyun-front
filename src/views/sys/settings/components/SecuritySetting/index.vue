<template>
  <div>
    <a-list item-layout="horizontal" :data-source="data">
      <template #renderItem="{ item }">
        <a-list-item>
          <a-list-item-meta>
            <template #title>
              <a>{{ item.title }}</a>
            </template>
            <template #description>
              <span>
                <span class="security-list-description">{{ item.description }}</span>
                <span v-if="item.value"> : </span>
                <span class="security-list-value">{{ item.value }}</span>
              </span>
            </template>
          </a-list-item-meta>
          <template v-if="item.actions" #actions>
            <a @click="item.actions.callback">{{ item.actions.title }}</a>
          </template>
        </a-list-item>
      </template>
    </a-list>

    <update-password ref="updatePasswordDialog" @confirm="confirmUpdatePassword" />
    <update-email ref="updateEmailDialog" />
    <update-telephone ref="updateTelephoneDialog" />
  </div>
</template>

<script>
  import { defineComponent } from 'vue';
  import UpdatePassword from './UpdatePassword.vue';
  import UpdateEmail from './UpdateEmail.vue';
  import UpdateTelephone from './UpdateTelephone.vue';
  import { useUserStore } from '@/store/modules/user';

  export default defineComponent({
    components: {
      UpdateEmail,
      UpdatePassword,
      UpdateTelephone,
    },
    setup() {
      const userStore = useUserStore();
      return {
        userStore,
      };
    },
    computed: {
      data() {
        return [
          {
            title: '账户密码',
            description: '点击右侧按钮可以修改密码',
            value: '',
            actions: {
              title: '修改',
              callback: () => {
                this.$refs.updatePasswordDialog.openDialog();
              },
            },
          },
          {
            title: '电子邮箱',
            description: '点击右侧按钮可以修改电子邮箱',
            value: '',
            actions: {
              title: '修改',
              callback: () => {
                this.$refs.updateEmailDialog.openDialog();
              },
            },
          },
          {
            title: '联系电话',
            description: '点击右侧按钮可以修改联系电话',
            value: '',
            actions: {
              title: '修改',
              callback: () => {
                this.$refs.updateTelephoneDialog.openDialog();
              },
            },
          },
        ];
      },
    },
    methods: {
      confirmUpdatePassword() {
        this.userStore.logout(true);
      },
    },
  });
</script>

<style scoped></style>
