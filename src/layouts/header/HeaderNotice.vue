<template>
  <a-dropdown v-model="show" :trigger="['hover']">
    <div slot="overlay">
      <a-tabs class="dropdown-tabs" :tab-bar-style="{textAlign: 'center'}" :style="{width: '297px'}">
        <a-tab-pane key="1">
          <template v-slot:tab>
            <a-badge :dot="noticeTasks.filter(item => !item.readed).length > 0">
              <span>通知</span>
            </a-badge>
          </template>
          <notice-task-list :task-list="noticeTasks" @close="e => show = false" />
        </a-tab-pane>
        <a-tab-pane key="2">
          <template v-slot:tab>
            <a-badge :dot="false">
              <span>消息</span>
            </a-badge>
          </template>
          <a-list class="tab-pane" />
        </a-tab-pane>
        <a-tab-pane key="3">
          <template v-slot:tab>
            <a-badge :dot="todoTasks.filter(item => !item.readed).length > 0">
              <span>待办</span>
            </a-badge>
          </template>
          <todo-task-list :task-list="todoTasks" />
        </a-tab-pane>
      </a-tabs>
    </div>
    <span class="header-notice">
      <a-badge class="notice-badge" :dot="todoTaskBadge">
        <a-icon :class="['header-notice-icon']" type="bell" />
      </a-badge>
    </span>
  </a-dropdown>
</template>

<script>
import TodoTaskList from '@/layouts/header/components/TodoTaskList'
import NoticeTaskList from '@/layouts/header/components/NoticeTaskList'

export default {
  name: 'HeaderNotice',
  components: {
    TodoTaskList, NoticeTaskList
  },
  data() {
    return {
      timer: null,
      show: false,
      interval: 5000,
      errorCount: 0,
      todoTasks: [],
      noticeTasks: []
    }
  },
  computed: {
    todoTaskBadge() {
      return this.todoTasks.filter(item => !item.readed).length > 0 || this.noticeTasks.filter(item => !item.readed).length > 0
    }
  },
  created() {
    this.timer = setInterval(this.onTimer, this.interval)
  },
  beforeDestroy() {
    clearInterval(this.timer)
  },
  mounted() {
  },
  methods: {
    onTimer() {
      this.$api.message.messageBus.query().then(res => {
        this.todoTasks = !this.$utils.isEmpty(res.todo) ? (res.todo.datas || []) : []
        this.noticeTasks = !this.$utils.isEmpty(res.notice) ? (res.notice.datas || []) : []
        if (this.errorCount > 0) {
          this.errorCount = 0
          clearInterval(this.timer)
          this.timer = setInterval(this.onTimer, this.interval)
        }
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
  .header-notice{
    display: inline-block;
    transition: all 0.3s;
    span {
      vertical-align: initial;
    }
    .notice-badge{
      color: inherit;
      .header-notice-icon{
        font-size: 16px;
        padding: 4px;
      }
    }
  }
  .dropdown-tabs{
    background-color: @base-bg-color;
    box-shadow: 0 2px 8px @shadow-color;
    border-radius: 4px;
    .tab-pane{
      padding: 0 24px 12px;
      min-height: 250px;
    }
  }
</style>
