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
    if (!this.$store.getters['account/roles'].includes('admin')) {
      this.currentRole = 'editorDashboard'
    }
  }
}
</script>
