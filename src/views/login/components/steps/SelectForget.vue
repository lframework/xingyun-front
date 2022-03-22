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
    <div>
      <router-link to="/login">
        <a-button style="width: 100%;margin-top: 10px" size="large">返回</a-button>
      </router-link>
    </div>
  </div>
</template>

<script>
export default {
  components: {
  },
  props: {
    useMail: {
      type: Boolean,
      default: false
    },
    useTelephone: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    data() {
      const datas = []
      if (this.useTelephone) {
        datas.push({ title: '已绑定手机号', description: '可通过短信验证码重置密码', value: '', actions: { title: '重置', callback: () => { this.$emit('confirm', '3') } }})
      }

      if (this.useMail) {
        datas.push({ title: '已绑定邮箱', description: '可通过邮箱验证码重置密码', value: '', actions: { title: '重置', callback: () => { this.$emit('confirm', '4') } }})
      }
      return datas
    }
  },
  methods: {
  }
}
</script>

<style scoped>
</style>
