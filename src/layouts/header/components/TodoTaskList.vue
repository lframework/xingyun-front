<template>
  <a-list class="tab-pane">
    <a-list-item v-for="item in taskList" :key="item.title">
      <a :href="item.jumpUrl" target="_blank">
        <a-list-item-meta :title="item.title" :description="item.createTime">
          <a-avatar slot="avatar" shape="square" style="background-color: #FFFFFF; font-size: 32px;" :size="36">
            <svg-icon slot="icon" style="color: #1AA5DD;" icon-class="todo-task" />
          </a-avatar>
        </a-list-item-meta>
      </a>
    </a-list-item>
  </a-list>
</template>

<script>
export default {
  name: 'TodoTaskList',
  props: {
    taskList: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  data() {
    return {
    }
  },
  computed: {
  },
  created() {

  },
  mounted() {
  },
  beforeDestroy() {
  },
  methods: {

  }
}
</script>

<style lang="less">
</style>
