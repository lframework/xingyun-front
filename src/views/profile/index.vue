<template>
  <div class="app-container">
    <div v-if="user">
      <el-row :gutter="20">

        <el-col :span="6" :xs="24">
          <user-card :user="user" @changeActiveName="e => activeName = e" />
        </el-col>

        <el-col :span="18" :xs="24">
          <el-card>
            <transition name="el-zoom-in-center">
              <div v-if="activeName === 'log'">
                <log />
              </div>
              <email v-else-if="activeName === 'email'" @confirm="e => {initActiveName(); getUser()}" @close="initActiveName" />
              <telephone v-else-if="activeName === 'telephone'" @confirm="e => {initActiveName(); getUser()}" @close="initActiveName" />
              <password v-else-if="activeName === 'password'" @confirm="e => {initActiveName(); getUser()}" @close="initActiveName" />
            </transition>
          </el-card>
        </el-col>

      </el-row>
    </div>
  </div>
</template>

<script>
import UserCard from './components/UserCard'
import Email from './components/Email'
import Telephone from './components/Telephone'
import Password from './components/Password'
import Log from './components/Log'

export default {
  name: 'Profile',
  components: { UserCard, Email, Telephone, Password, Log },
  data() {
    return {
      activeName: 'log',
      user: {}
    }
  },
  computed: {
  },
  created() {
    this.getUser()
  },
  methods: {
    getUser() {
      this.$api.userCenter.getInfo().then(res => {
        this.user = res
      })
    },
    initActiveName() {
      this.activeName = 'log'
    }
  }
}
</script>
