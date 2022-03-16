<template>
  <div :class="['page-header', layout, pageWidth]">
    <div class="page-header-wide">
      <div class="breadcrumb">
        <a-breadcrumb>
          <a-breadcrumb-item v-for="(item, index) in breadcrumb" :key="index">
            <span>{{ item }}</span>
          </a-breadcrumb-item>
        </a-breadcrumb>
      </div>
      <div class="detail">
        <div class="main">
          <div class="row">
            <h1 v-if="showPageTitle && title" class="title">{{ title }}</h1>
            <div class="action"><slot name="action" /></div>
          </div>
          <div class="row">
            <div v-if="this.$slots.content" class="content">
              <div v-if="avatar" class="avatar"><a-avatar :src="avatar" :size="72" /></div>
              <slot name="content" />
            </div>
            <div v-if="this.$slots.extra" class="extra"><slot name="extra" /></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  name: 'PageHeader',
  props: {
    title: {
      type: [String, Boolean],
      default: ''
    },
    breadcrumb: {
      type: Array,
      default: () => {
        return []
      }
    },
    logo: {
      type: String,
      default: ''
    },
    avatar: {
      type: String,
      default: ''
    }
  },
  computed: {
    ...mapState('setting', ['layout', 'showPageTitle', 'pageWidth'])
  }
}
</script>

<style lang="less" scoped>
  @import "index";
</style>
