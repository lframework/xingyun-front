<template>
  <div class="header-search">
    <a-icon type="search" class="search-icon" @click="enterSearchMode" />
    <a-auto-complete
      ref="input"
      v-model="searchNode"
      placeholder="站内搜索"
      :get-popup-container="e => {return e.parentNode || document.body}"
      :data-source="dataSource"
      :class="['search-input', searchMode ? 'enter' : 'leave']"
      @blur="leaveSearchMode"
      @search="queryMenu"
      @select="handleSelectMenu"
    >
      <template slot="dataSource">
        <a-select-option v-for="(item, index) in dataSource" :key="index" :value="item.id">
          {{ item.title }}
        </a-select-option>
      </template>
    </a-auto-complete>
  </div>
</template>

<script>

export default {
  name: 'HeaderSearch',
  data() {
    return {
      searchMode: false,
      searchNode: '',
      dataSource: []
    }
  },
  computed: {
    routes() {
      const results = []
      const tree = this.$utils.searchTree(this.$store.getters['account/routesConfig'], item => this.$utils.isEmpty(item.children))
      const oriTree = this.$utils.toTreeArray(tree)
      this.$utils.eachTree(tree, item => {
        if (this.$enums.MENU_DISPLAY.FUNCTION.equalsCode(item.display) && !item.hidden) {
          let path = item.path
          let title = item.meta.title

          let parent = oriTree.filter(o => o.id === item.parentId)[0] || undefined
          while (parent) {
            if (!this.$utils.isEmpty(parent.path) && parent.path !== '/') {
              path = parent.path + path
            }
            if (!this.$utils.isEmpty(parent.meta.title)) {
              title = parent.meta.title + '/' + title
            }
            parent = oriTree.filter(o => o.id === parent.parentId)[0] || undefined
          }

          results.push({
            id: this.$utils.uuid(),
            path: path,
            title: title
          })
        }
      })

      return results
    }
  },
  methods: {
    enterSearchMode() {
      this.searchNode = undefined
      this.dataSource = this.routes

      this.searchMode = true
      this.$emit('active', true)
      setTimeout(() => this.$refs.input.focus(), 300)
    },
    leaveSearchMode() {
      this.searchMode = false
      setTimeout(() => this.$emit('active', false), 300)
    },
    // 搜索菜单
    queryMenu(queryString) {
      if (this.$utils.isEmpty(queryString)) {
        this.dataSource = this.routes
        return
      }

      this.$nextTick(() => {
        this.dataSource = this.routes.filter(item => item.title.indexOf(queryString) > -1)
      })
    },
    // 选择菜单
    handleSelectMenu(value) {
      value = this.routes.filter(item => item.id === value)[0]
      this.searchNode = value.title
      this.$router.push(value.path)

      this.searchNode = undefined
      this.dataSource = this.routes
    }
  }
}
</script>

<style lang="less">
  .header-search{
    .search-icon{
      font-size: 16px;
      cursor: pointer;
    }
    .search-input{
      border: 0;
      border-bottom: 1px solid @border-color-split;
      transition: width 0.3s ease-in-out;
      input{
        border: 0;
        box-shadow: 0 0 0 0;
      }
      &.leave{
        width: 0px;
        input{
          display: none;
        }
      }
      &.enter{
        width: 200px;
        input:focus{
          box-shadow: 0 0 0 0;
        }
      }
    }
  }
</style>
