<template>
  <i v-if="collectFlag" class="el-icon-star-on user-collect" style="color: rgb(247, 186, 42)" @click="cancelCollect" />
  <i v-else class="el-icon-star-off user-collect" style="color: rgb(191, 203, 217)" @click="onCollect" />
</template>

<script>
export default {
  name: 'CollectItem',
  props: {
    isCollect: {
      type: Boolean,
      default: false
    },
    id: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      loading: false,
      selfControl: false,
      tmpCollect: false
    }
  },
  computed: {
    collectFlag() {
      if (this.selfControl) {
        return this.tmpCollect
      }

      return this.isCollect
    }
  },
  methods: {
    onCollect() {
      if (this.loading) {
        return
      }
      this.loading = true
      this.$api.user.collectMenu(this.id).then(res => {
        this.loading = false
        this.selfControl = true
        this.tmpCollect = true
        this.$msg.successTip('收藏成功，左侧菜单栏需要刷新页面才能生效')
      })
    },
    cancelCollect() {
      if (this.loading) {
        return
      }
      this.loading = true
      this.$api.user.cancelCollectMenu(this.id).then(res => {
        this.loading = false
        this.selfControl = true
        this.tmpCollect = false
        this.$msg.successTip('取消收藏成功，左侧菜单栏需要刷新页面才能生效')
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.user-collect {
  position: absolute;
  top: 35%;
  right: 10px;
  cursor: pointer;
}
</style>
