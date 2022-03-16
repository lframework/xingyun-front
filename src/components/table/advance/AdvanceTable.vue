<template>
  <div :id="id" ref="table" class="advanced-table">
    <a-spin :spinning="loading">
      <div :class="['header-bar', size]">
        <div class="title">
          <template v-if="title">{{ title }}</template>
          <slot v-else-if="$slots.title" name="title" />
          <template v-else>高级表格</template>
        </div>
        <div class="search">
          <search-area :format-conditions="formatConditions" :columns="columns" @change="onSearchChange">
            <template v-for="slot in slots" :slot="slot">
              <slot :name="slot" />
            </template>
          </search-area>
        </div>
        <div class="actions">
          <a-tooltip title="刷新">
            <a-icon class="action" :type="loading ? 'loading' : 'reload'" @click="refresh" />
          </a-tooltip>
          <action-size v-model="sSize" class="action" />
          <a-tooltip title="列配置">
            <action-columns :columns="columns" class="action" @reset="onColumnsReset">
              <template v-for="slot in slots" :slot="slot">
                <slot :name="slot" />
              </template>
            </action-columns>
          </a-tooltip>
          <a-tooltip title="全屏">
            <a-icon class="action" :type="fullScreen ? 'fullscreen-exit' : 'fullscreen'" @click="toggleScreen" />
          </a-tooltip>
        </div>
      </div>
      <a-table
        v-bind="{...$props, columns: visibleColumns, title: undefined, loading: false}"
        :size="sSize"
        @expandedRowsChange="onExpandedRowsChange"
        @change="onChange"
        @expand="onExpand"
      >
        <template v-for="slot in scopedSlots " :slot="slot" slot-scope="text, record, index">
          <slot :name="slot" v-bind="{text, record, index}" />
        </template>
        <template v-for="slot in slots" :slot="slot">
          <slot :name="slot" />
        </template>
        <template :slot="$scopedSlots.expandedRowRender ? 'expandedRowRender' : ''" slot-scope="record, index, indent, expanded">
          <slot v-bind="{record, index, indent, expanded}" :name="$scopedSlots.expandedRowRender ? 'expandedRowRender' : ''" />
        </template>
      </a-table>
    </a-spin>
  </div>
</template>

<script>
import ActionSize from '@/components/table/advance/ActionSize'
import ActionColumns from '@/components/table/advance/ActionColumns'
import SearchArea from '@/components/table/advance/SearchArea'
export default {
  name: 'AdvanceTable',
  components: { SearchArea, ActionColumns, ActionSize },
  props: {
    // eslint-disable-next-line vue/require-default-prop
    tableLayout: String,
    bordered: Boolean,
    childrenColumnName: { type: String, default: 'children' },
    // eslint-disable-next-line vue/require-default-prop
    columns: Array,
    // eslint-disable-next-line vue/require-default-prop
    components: Object,
    // eslint-disable-next-line vue/require-default-prop
    dataSource: Array,
    // eslint-disable-next-line vue/require-default-prop
    defaultExpandAllRows: Array[String],
    // eslint-disable-next-line vue/require-default-prop
    expandedRowKeys: Array[String],
    // eslint-disable-next-line vue/require-default-prop
    expandedRowRender: Function,
    // eslint-disable-next-line vue/require-default-prop
    expandIcon: Function,
    expandRowByClick: Boolean,
    // eslint-disable-next-line vue/require-default-prop
    expandIconColumnIndex: Number,
    // eslint-disable-next-line vue/require-default-prop
    footer: Function,
    // eslint-disable-next-line vue/require-default-prop
    indentSize: Number,
    loading: Boolean,
    // eslint-disable-next-line vue/require-default-prop
    locale: Object,
    // eslint-disable-next-line vue/require-default-prop
    pagination: [Object, Boolean],
    // eslint-disable-next-line vue/require-default-prop
    rowClassName: Function,
    // eslint-disable-next-line vue/require-default-prop
    rowKey: [String, Function],
    // eslint-disable-next-line vue/require-default-prop
    rowSelection: Object,
    // eslint-disable-next-line vue/require-default-prop
    scroll: Object,
    showHeader: { type: Boolean, default: true },
    // eslint-disable-next-line vue/require-default-prop
    size: String,
    // eslint-disable-next-line vue/require-default-prop
    title: String,
    // eslint-disable-next-line vue/require-default-prop
    customHeaderRow: Function,
    // eslint-disable-next-line vue/require-default-prop
    customRow: Function,
    // eslint-disable-next-line vue/require-default-prop
    getPopupContainer: Function,
    // eslint-disable-next-line vue/require-default-prop
    transformCellText: Function,
    formatConditions: Boolean
  },
  provide() {
    return {
      table: this
    }
  },
  data() {
    return {
      id: `${new Date().getTime()}-${Math.floor(Math.random() * 10)}`,
      sSize: this.size || 'default',
      fullScreen: false,
      conditions: {}
    }
  },
  computed: {
    slots() {
      return Object.keys(this.$slots).filter(slot => slot !== 'title')
    },
    scopedSlots() {
      return Object.keys(this.$scopedSlots).filter(slot => slot !== 'expandedRowRender' && slot !== 'title')
    },
    visibleColumns() {
      return this.columns.filter(col => col.visible)
    }
  },
  created() {
    this.addListener()
  },
  beforeDestroy() {
    this.removeListener()
  },
  methods: {
    refresh() {
      this.$emit('refresh', this.conditions)
    },
    onSearchChange(conditions, searchOptions) {
      this.conditions = conditions
      this.$emit('search', conditions, searchOptions)
    },
    toggleScreen() {
      if (this.fullScreen) {
        this.outFullScreen()
      } else {
        this.inFullScreen()
      }
    },
    inFullScreen() {
      const el = this.$refs.table
      el.classList.add('beauty-scroll')
      if (el.requestFullscreen) {
        el.requestFullscreen()
        return true
      } else if (el.webkitRequestFullScreen) {
        el.webkitRequestFullScreen()
        return true
      } else if (el.mozRequestFullScreen) {
        el.mozRequestFullScreen()
        return true
      } else if (el.msRequestFullscreen) {
        el.msRequestFullscreen()
        return true
      }
      this.$message.warn('对不起，您的浏览器不支持全屏模式')
      el.classList.remove('beauty-scroll')
      return false
    },
    outFullScreen() {
      if (document.exitFullscreen) {
        document.exitFullscreen()
      } else if (document.webkitCancelFullScreen) {
        document.webkitCancelFullScreen()
      } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen()
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen()
      }
      this.$refs.table.classList.remove('beauty-scroll')
    },
    onColumnsReset(conditions) {
      this.$emit('reset', conditions)
    },
    onExpandedRowsChange(expandedRows) {
      this.$emit('expandedRowsChange', expandedRows)
    },
    onChange(pagination, filters, sorter, options) {
      this.$emit('change', pagination, filters, sorter, options)
    },
    onExpand(expanded, record) {
      this.$emit('expand', expanded, record)
    },
    addListener() {
      document.addEventListener('fullscreenchange', this.fullScreenListener)
      document.addEventListener('webkitfullscreenchange', this.fullScreenListener)
      document.addEventListener('mozfullscreenchange', this.fullScreenListener)
      document.addEventListener('msfullscreenchange', this.fullScreenListener)
    },
    removeListener() {
      document.removeEventListener('fullscreenchange', this.fullScreenListener)
      document.removeEventListener('webkitfullscreenchange', this.fullScreenListener)
      document.removeEventListener('mozfullscreenchange', this.fullScreenListener)
      document.removeEventListener('msfullscreenchange', this.fullScreenListener)
    },
    fullScreenListener(e) {
      if (e.target.id === this.id) {
        this.fullScreen = !this.fullScreen
      }
    }
  }
}
</script>

<style scoped lang="less">
.advanced-table{
  overflow-y: auto;
  background-color: @component-background;
  .header-bar{
    padding: 16px 24px;
    display: flex;
    align-items: center;
    border-radius: 4px;
    transition: all 0.3s;
    &.middle{
      padding: 12px 16px;
    }
    &.small{
      padding: 8px 12px;
      border: 1px solid @border-color;
      border-bottom: 0;
      .title{
        font-size: 16px;
      }
    }
    .title{
      transition: all 0.3s;
      font-size: 18px;
      color: @title-color;
      font-weight: 700;
    }
    .search{
      flex: 1;
      text-align: right;
      margin: 0 24px;
    }
    .actions{
      text-align: right;
      font-size: 17px;
      color: @text-color;
      .action{
        margin: 0 8px;
        cursor: pointer;
        &:hover{
          color: @primary-color;
        }
      }
    }
  }
}
</style>
