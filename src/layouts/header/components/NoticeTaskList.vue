<template>
  <div>
    <a-list class="tab-pane">
      <a-list-item v-for="item in taskList" :key="item.id">
        <a @click="e => openDetailDialog(item.id)">
          <a-list-item-meta :title="item.title" :description="item.publishTime">
            <a-avatar slot="avatar" shape="square" style="background-color: #FFFFFF; font-size: 32px;" :size="36">
              <svg-icon slot="icon" style="color: #FE5D58;" icon-class="notice" />
            </a-avatar>
          </a-list-item-meta>
        </a>
      </a-list-item>
    </a-list>
    <notice-detail :id="id" ref="detailDialog" />
  </div>
</template>

<script>
import NoticeDetail from '@/views/system/notice/detail'
export default {
  name: 'NoticeTaskList',
  components: {
    NoticeDetail
  },
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
      id: ''
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
    openDetailDialog(id) {
      this.id = id
      this.$refs.detailDialog.openDialog()
      this.$emit('close')
    }
  }
}
</script>

<style lang="less">
</style>
