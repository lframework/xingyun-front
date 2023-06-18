<template>
  <div class="dashboard-container">
    <component :is="currentRole" />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import AdminDashboard from './admin'
import EditorDashboard from './editor'

export default {
  name: 'WorkPlace',
  components: { AdminDashboard, EditorDashboard },
  data() {
    return {
      currentRole: 'adminDashboard'
    }
  },
  computed: {
    ...mapGetters([
      'roles'
    ])
  },
  created() {
    // 去掉这个判断，所有的权限都会显示adminDashboard，如果需要根据不同的权限展示不同的页面，再自行修改
    /* if (!this.$store.getters['account/roles'].includes('admin')) {
      this.currentRole = 'editorDashboard'
    } */
  }
}
</script>
