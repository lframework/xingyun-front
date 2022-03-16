<template>
  <div ref="root" class="search-area">
    <div ref="selectRoot" class="select-root" />
    <div v-for="(col, index) in searchCols" :key="index" class="search-item">
      <div v-if="col.dataType === 'boolean'" :class="['title', {active: col.search.value !== undefined}]">
        <template v-if="col.title">
          {{ col.title }}:
        </template>
        <slot v-else-if="col.slots && col.slots.title" :name="col.slots.title" />
        <a-switch
          v-model="col.search.value"
          class="switch"
          size="small"
          :checked-children="(col.search.switchOptions && col.search.switchOptions.checkedText) || '是'"
          :un-checked-children="(col.search.switchOptions && col.search.switchOptions.uncheckedText) || '否'"
          @change="onSwitchChange(col)"
        />
        <a-icon v-if="col.search.value !== undefined" class="close" type="close-circle" theme="filled" @click="e => onCloseClick(e, col)" />
      </div>
      <div v-else-if="col.dataType === 'time'" :class="['title', {active: col.search.value}]">
        <template v-if="col.title">
          {{ col.title }}:
        </template>
        <slot v-else-if="col.slots && col.slots.title" :name="col.slots.title" />
        <a-time-picker v-model="col.search.value" :format="col.search.format" placeholder="选择时间" class="time-picker" size="small" :get-popup-container="() => $refs.root" @change="(time, timeStr) => onCalendarChange(time, timeStr, col)" @openChange="open => onCalendarOpenChange(open, col)" />
      </div>
      <div v-else-if="col.dataType === 'date'" :class="['title', {active: col.search.value}]">
        <template v-if="col.title">
          {{ col.title }}:
        </template>
        <slot v-else-if="col.slots && col.slots.title" :name="col.slots.title" />
        <a-date-picker v-model="col.search.value" placeholder="" :format="col.search.format" class="date-picker" size="small" :get-calendar-container="() => $refs.root" @change="onDateChange(col)" />
      </div>
      <div v-else-if="col.dataType === 'datetime'" class="title datetime active">
        <template v-if="col.title">
          {{ col.title }}:
        </template>
        <slot v-else-if="col.slots && col.slots.title" :name="col.slots.title" />
        <a-date-picker v-model="col.search.value" placeholder="" :format="col.search.format" class="datetime-picker" size="small" show-time :get-calendar-container="() => $refs.root" @change="(date, dateStr) => onCalendarChange(date, dateStr, col)" @openChange="open => onCalendarOpenChange(open, col)" />
      </div>
      <div v-else-if="col.dataType === 'select'" :class="['title', {active: col.search.value !== undefined}]">
        <template v-if="col.title">
          {{ col.title }}:
        </template>
        <slot v-else-if="col.slots && col.slots.title" :name="col.slots.title" />
        <a-select slot="content" v-model="col.search.value" :allow-clear="true" :options="col.search.selectOptions" placeholder="请选择..." class="select" size="small" :get-popup-container="() => $refs.selectRoot" @change="onSelectChange(col)" />
      </div>
      <div v-else :class="['title', {active: col.search.value}]">
        <a-popover v-model="col.search.visible" placement="bottom" :trigger="['click']" :get-popup-container="() => $refs.root" @visibleChange="onVisibleChange(col, index)">
          <template v-if="col.title">
            {{ col.title }}
          </template>
          <slot v-else-if="col.slots && col.slots.title" :name="col.slots.title" />
          <div v-if="col.search.value" class="value ">:&nbsp;&nbsp;{{ col.search.format && typeof col.search.format === 'function' ? col.search.format(col.search.value) : col.search.value }}</div>
          <a-icon v-if="!col.search.value" class="icon-down" type="down" />
          <div slot="content" class="operations">
            <a-button class="btn" size="small" type="link" @click="onCancel(col)">取消</a-button>
            <a-button class="btn" size="small" type="primary" @click="onConfirm(col)">确认</a-button>
          </div>
          <div slot="title" class="search-overlay">
            <a-input :id="`${searchIdPrefix}${index}`" v-model="col.search.value" :allow-clear="true" size="small" @keyup.esc="onCancel(col)" @keyup.enter="onConfirm(col)" />
          </div>
        </a-popover>
        <a-icon v-if="col.search.value" class="close" type="close-circle" theme="filled" @click="e => onCloseClick(e, col)" />
      </div>
    </div>
  </div>
</template>

<script>
import fastEqual from 'fast-deep-equal'
import moment from 'moment'

export default {
  name: 'SearchArea',
  props: {
    columns: {
      type: Array,
      default: () => {
        return []
      }
    },
    formatConditions: {
      type: Boolean,
      default: false
    }
  },
  inject: ['table'],
  data() {
    return {
      conditions: {},
      searchOptions: []
    }
  },
  computed: {
    searchCols() {
      return this.columns.filter(item => item.searchAble)
    },
    searchIdPrefix() {
      return this.table.id + '-ipt-'
    }
  },
  watch: {
    columns(newVal, oldVal) {
      if (newVal !== oldVal) {
        this.formatColumns(newVal)
      }
    },
    searchCols(newVal, oldVal) {
      if (newVal.length !== oldVal.length) {
        const newConditions = this.getConditions(newVal)
        const newSearchOptions = this.getSearchOptions(newVal)
        if (!fastEqual(newConditions, this.conditions)) {
          this.conditions = newConditions
          this.searchOptions = newSearchOptions
          this.$emit('change', this.conditions, this.searchOptions)
        }
      }
    }
  },
  created() {
    this.formatColumns(this.columns)
  },
  methods: {
    onCloseClick(e, col) {
      e.preventDefault()
      e.stopPropagation()
      col.search.value = undefined
      const { backup, value } = col.search
      if (backup !== value) {
        this.backupAndEmitChange(col)
      }
    },
    onCancel(col) {
      col.search.value = col.search.backup
      col.search.visible = false
    },
    onConfirm(col) {
      const { backup, value } = col.search
      col.search.visible = false
      if (backup !== value) {
        this.backupAndEmitChange(col)
      }
    },
    onSwitchChange(col) {
      const { backup, value } = col.search
      if (backup !== value) {
        this.backupAndEmitChange(col)
      }
    },
    onSelectChange(col) {
      this.backupAndEmitChange(col)
    },
    onCalendarOpenChange(open, col) {
      col.search.visible = open
      const { momentEqual, backupAndEmitChange } = this
      const { value, backup, format } = col.search
      if (!open && !momentEqual(value, backup, format)) {
        backupAndEmitChange(col, moment(value))
      }
    },
    onCalendarChange(date, dateStr, col) {
      const { momentEqual, backupAndEmitChange } = this
      const { value, backup, format } = col.search
      if (!col.search.visible && !momentEqual(value, backup, format)) {
        backupAndEmitChange(col, moment(value))
      }
    },
    onDateChange(col) {
      const { momentEqual, backupAndEmitChange } = this
      const { value, backup, format } = col.search
      if (!momentEqual(value, backup, format)) {
        backupAndEmitChange(col, moment(value))
      }
    },
    getFormat(col) {
      if (col.search && col.search.format) {
        return col.search.format
      }
      const dataType = col.dataType
      switch (dataType) {
        case 'time': return 'HH:mm:ss'
        case 'date': return 'YYYY-MM-DD'
        case 'datetime': return 'YYYY-MM-DD HH:mm:ss'
        default: return undefined
      }
    },
    backupAndEmitChange(col, backValue = col.search.value) {
      const { getConditions, getSearchOptions } = this
      col.search.backup = backValue
      this.conditions = getConditions(this.searchCols)
      this.searchOptions = getSearchOptions(this.searchCols)
      this.$emit('change', this.conditions, this.searchOptions)
    },
    getConditions(columns) {
      const conditions = {}
      columns.filter(item => item.search.value !== undefined && item.search.value !== '' && item.search.value !== null)
        .forEach(col => {
          const { value, format } = col.search
          if (this.formatConditions && format) {
            if (typeof format === 'function') {
              conditions[col.dataIndex] = format(col.search.value)
            } else if (typeof format === 'string' && value.constructor.name === 'Moment') {
              conditions[col.dataIndex] = value.format(format)
            } else {
              conditions[col.dataIndex] = value
            }
          } else {
            conditions[col.dataIndex] = value
          }
        })
      return conditions
    },
    getSearchOptions(columns) {
      return columns.filter(item => item.search.value !== undefined && item.search.value !== '' && item.search.value !== null)
        .map(({ dataIndex, search }) => ({ field: dataIndex, value: search.value, format: search.format }))
    },
    onVisibleChange(col, index) {
      if (!col.search.visible) {
        col.search.value = col.search.backup
      } else {
        let input = document.getElementById(`${this.searchIdPrefix}${index}`)
        if (input) {
          setTimeout(() => { input.focus() }, 0)
        } else {
          this.$nextTick(() => {
            input = document.getElementById(`${this.searchIdPrefix}${index}`)
            input.focus()
          })
        }
      }
    },
    momentEqual(target, source, format) {
      if (target === source) {
        return true
      } else if (target && source && target.format(format) === source.format(format)) {
        return true
      }
      return false
    },
    formatColumns(columns) {
      columns.forEach(item => {
        this.$set(item, 'search', { ...item.search, visible: false, value: undefined, format: this.getFormat(item) })
      })
    }
  }
}
</script>

<style scoped lang="less">
.search-area{
  .select-root{
    text-align: left;
  }
  margin: -4px 0;
  .search-item{
    margin: 4px 4px;
    display: inline-block;
    .title{
      padding: 4px 8px;
      cursor: pointer;
      border-radius: 4px;
      user-select: none;
      display: inline-flex;
      align-items: center;
      .close{
        color: @text-color-second;
        margin-left: 4px;
        font-size: 12px;
        vertical-align: middle;
        :hover{
          color: @text-color;
        }
      }
      .switch{
        margin-left: 4px;
      }
      .time-picker{
        margin-left: 4px;
        width: 96px;
      }
      .date-picker{
        margin-left: 4px;
        width: 120px;
      }
      .datetime-picker{
        margin-left: 4px;
        width: 195px;
      }
      .value{
        display: inline-block;
        overflow: hidden;
        flex:1;
        vertical-align: middle;
        max-width: 144px;
        text-overflow: ellipsis;
        word-break: break-all;
        white-space: nowrap;
      }
      &.active{
        background-color: @layout-bg-color;
      }
    }
    .icon-down{
      vertical-align: middle;
      font-size: 12px;
    }
  }
  .search-overlay{
    padding: 8px 0px;
    text-align: center;
  }
  .select{
    margin-left: 4px;
    max-width: 144px;
    min-width: 96px;
    text-align: left;
  }
  .operations{
    display: flex;
    margin: -6px 0;
    justify-content: space-between;
    .btn{
    }
  }
}
</style>
