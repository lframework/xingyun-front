<template>
  <a-list class="tab-pane">
    <a-list-item v-for="item in taskList" :key="item.title">
      <a :href="item.jumpUrl" target="_blank">
        <a-list-item-meta :title="item.title" :description="item.createTime">
          <a-avatar slot="avatar" style="background-color: white" src="https://gw.alipayobjects.com/zos/rmsportal/ThXAXghbEsBCCSDihZxY.png" />
        </a-list-item-meta>
      </a>
    </a-list-item>
  </a-list>
</template>

<script>
export default {
  name: 'TodoTaskList',
  data() {
    return {
      taskList: [],
      timer: null,
      interval: 5000,
      errorCount: 0
    }
  },
  computed: {
  },
  created() {
    this.timer = setInterval(this.onTimer, this.interval)
  },
  mounted() {
    this.$emit('inited')
  },
  beforeDestroy() {
    clearInterval(this.timer)
  },
  methods: {
    onTimer() {
      this.$api.message.todoTask.query().then(res => {
        this.taskList = res.datas
        if (this.errorCount > 0) {
          this.errorCount = 0
          clearInterval(this.timer)
          this.timer = setInterval(this.onTimer, this.interval)
        }

        this.$emit('receive', res.totalCount > 0)
      }).catch(() => {
        this.errorCount++
        clearInterval(this.timer)
        this.timer = setInterval(this.onTimer, this.interval * this.errorCount)
      })
    }
  }
}
</script>

<style lang="less">
</style>
