<template>
  <div>
    <a-list
      item-layout="horizontal"
      :data-source="data"
    >
      <a-list-item slot="renderItem" :key="index" slot-scope="item, index">
        <a-list-item-meta>
          <a slot="title">{{ item.title }}</a>
          <span slot="description">
            <span class="security-list-description">{{ item.description }}</span>
            <span v-if="item.value"> : </span>
            <span class="security-list-value">{{ item.value }}</span>
          </span>
        </a-list-item-meta>
        <template v-if="item.actions">
          <a slot="actions" @click="item.actions.callback">{{ item.actions.title }}</a>
        </template>
      </a-list-item>
    </a-list>

    <update-password ref="updatePasswordDialog" @confirm="confirmUpdatePassword" />
    <update-email ref="updateEmailDialog" />
    <update-telephone ref="updateTelephoneDialog" />
  </div>
</template>

<script>
import UpdatePassword from './update-password'
import UpdateEmail from './update-email'
import UpdateTelephone from './update-telephone'
import { logout } from '@/services/user'
export default {
  components: {
    UpdateEmail,
    UpdatePassword,
    UpdateTelephone
  },
  computed: {
    data() {
      return [
        { title: '账户密码', description: '点击右侧按钮可以修改密码', value: '', actions: { title: '修改', callback: () => { this.$refs.updatePasswordDialog.openDialog() } }},
        { title: '电子邮箱', description: '点击右侧按钮可以修改电子邮箱', value: '', actions: { title: '修改', callback: () => { this.$refs.updateEmailDialog.openDialog() } }},
        { title: '联系电话', description: '点击右侧按钮可以修改联系电话', value: '', actions: { title: '修改', callback: () => { this.$refs.updateTelephoneDialog.openDialog() } }}
      ]
    }
  },
  methods: {
    confirmUpdatePassword() {
      logout()
      this.$router.push('/login')
    }
  }
}
</script>

<style scoped>

</style>
