<template>
  <div class="standard-table">
    <div class="alert">
      <a-alert v-if="selectedRows" type="info" :show-icon="true">
        <div slot="message" class="message">
          已选择&nbsp;<a>{{ selectedRows.length }}</a>&nbsp;项 <a class="clear" @click="onClear">清空</a>
          <template v-for="(item, index) in needTotalList">
            <div v-if="item.needTotal" :key="index">
              {{ item.title }}总计&nbsp;
              <a>{{ item.customRender ? item.customRender(item.total) : item.total }}</a>
            </div>
          </template>
        </div>
      </a-alert>
    </div>
    <a-table
      :bordered="bordered"
      :loading="loading"
      :columns="columns"
      :data-source="dataSource"
      :row-key="rowKey"
      :pagination="pagination"
      :expanded-row-keys="expandedRowKeys"
      :expanded-row-render="expandedRowRender"
      :row-selection="selectedRows ? {type: multiple ? 'checkbox' : 'radio', selectedRowKeys: selectedRowKeys, onChange: updateSelect} : undefined"
      @change="onChange"
    >
      <template v-for="slot in Object.keys($scopedSlots).filter(key => key !== 'expandedRowRender') " :slot="slot" slot-scope="text, record, index">
        <slot :name="slot" v-bind="{text, record, index}" />
      </template>
      <template v-for="slot in Object.keys($slots)" :slot="slot">
        <slot :name="slot" />
      </template>
      <template :slot="$scopedSlots.expandedRowRender ? 'expandedRowRender' : ''" slot-scope="record, index, indent, expanded">
        <slot v-bind="{record, index, indent, expanded}" :name="$scopedSlots.expandedRowRender ? 'expandedRowRender' : ''" />
      </template>
    </a-table>
  </div>
</template>

<script>
export default {
  name: 'StandardTable',
  props: {
    bordered: Boolean,
    // eslint-disable-next-line vue/require-default-prop
    loading: [Boolean, Object],
    // eslint-disable-next-line vue/require-default-prop
    columns: Array,
    // eslint-disable-next-line vue/require-default-prop
    dataSource: Array,
    rowKey: {
      type: [String, Function],
      default: 'key'
    },
    pagination: {
      type: [Object, Boolean],
      default: true
    },
    // eslint-disable-next-line vue/require-default-prop
    selectedRows: Array,
    // eslint-disable-next-line vue/require-default-prop
    expandedRowKeys: Array,
    // eslint-disable-next-line vue/require-default-prop
    expandedRowRender: Function,
    multiple: { type: Boolean, default: true }
  },
  data() {
    return {
      needTotalList: []
    }
  },
  computed: {
    selectedRowKeys() {
      return this.selectedRows.map(record => {
        return (typeof this.rowKey === 'function') ? this.rowKey(record) : record[this.rowKey]
      })
    }
  },
  watch: {
    selectedRows(selectedRows) {
      this.needTotalList = this.needTotalList.map(item => {
        return {
          ...item,
          total: selectedRows.reduce((sum, val) => {
            let v
            try {
              // eslint-disable-next-line no-eval
              v = val[item.dataIndex] ? val[item.dataIndex] : eval(`val.${item.dataIndex}`)
            } catch (_) {
              v = val[item.dataIndex]
            }
            v = !isNaN(parseFloat(v)) ? parseFloat(v) : 0
            return sum + v
          }, 0)
        }
      })
    }
  },
  created() {
    this.needTotalList = this.initTotalList(this.columns)
  },
  methods: {
    updateSelect(selectedRowKeys, selectedRows) {
      this.$emit('update:selectedRows', selectedRows)
      this.$emit('selectedRowChange', selectedRowKeys, selectedRows)
    },
    initTotalList(columns) {
      const totalList = columns.filter(item => item.needTotal)
        .map(item => {
          return {
            ...item,
            total: 0
          }
        })
      return totalList
    },
    onClear() {
      this.updateSelect([], [])
      this.$emit('clear')
    },
    onChange(pagination, filters, sorter, { currentDataSource }) {
      this.$emit('change', pagination, filters, sorter, { currentDataSource })
    }
  }
}
</script>

<style scoped lang="less">
.standard-table{
  .alert{
    margin-bottom: 16px;
    .message{
      a{
        font-weight: 600;
      }
    }
    .clear{
      float: right;
    }
  }
}
</style>
