<template>
  <div class="gen-container">
    <a-row>
      <a-col :span="4">
        <a-tree
          ref="tree"
          v-model="checkedKeys"
          :tree-data="columns"
          :checkable="true"
          node-key="id"
          :replace-fields="{
            children: 'columns',
            title: 'name',
            key: 'id'
          }"
          @check="onCheckChange"
        />
      </a-col>
      <a-col :span="20">
        <!-- 数据列表 -->
        <vxe-grid
          ref="grid"
          resizable
          show-overflow
          highlight-hover-row
          keep-source
          row-id="id"
          :row-config="{useKey: true}"
          :columns="tableColumn"
          :data="tableData"
          :loading="loading"
        >
          <!-- 查询类型 列自定义内容 -->
          <template v-slot:queryType_default="{ row }">
            <a-select v-model="row.queryType">
              <a-select-option v-for="item in $enums.GEN_QUERY_TYPE.values()" :key="item.code" :value="item.code">{{ item.desc }}</a-select-option>
            </a-select>
          </template>

          <!-- 表单宽度 列自定义内容 -->
          <template v-slot:formWidth_default="{ row }">
            <a-input-number v-model="row.formWidth" class="number-input" :min="1" :max="24" />
          </template>

          <!-- 默认值 列自定义内容 -->
          <template v-slot:defaultValue_default="{ row }">
            <a-input v-if="!$enums.GEN_VIEW_TYPE.DATE_RANGE.equalsCode(row.viewType)" v-model="row.defaultValue" allow-clear />
            <div v-else>
              <span style="margin: 0 5px;">近</span><a-input-number v-model="row.defaultValue" :min="0" /><span style="margin: 0 5px;">天</span>
            </div>
          </template>

          <!-- 排序 列自定义内容 -->
          <template v-slot:orderNo_default>
            <span class="sort-btn"><a-icon type="drag" /></span>
          </template>
        </vxe-grid>
      </a-col>
    </a-row>
  </div>
</template>
<script>
import Sortable from 'sortablejs'

export default {
  // 使用组件
  components: {
  },

  props: {
    columns: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      // 是否显示加载框
      loading: false,
      defaultProps: {
        label: 'name'
      },
      tableColumn: [
        { field: 'orderNo', title: '排序', width: 50, slots: { default: 'orderNo_default' }},
        { field: 'name', title: '显示名称', width: 160, formatter: ({ cellValue, row }) => { return this.convertToColumn(row.id)?.name } },
        { field: 'queryType', title: '查询类型', width: 140, slots: { default: 'queryType_default' }},
        { field: 'formWidth', title: '表单宽度', align: 'right', width: 100, slots: { default: 'formWidth_default' }},
        { field: 'defaultValue', title: '默认值', width: 240, slots: { default: 'defaultValue_default' }}
      ],
      tableData: [],
      checkedKeys: []
    }
  },
  computed: {
    _columns() {
      const columns = []
      this.columns.map(item => this.$utils.isEmpty(item.columns) ? [] : item.columns).forEach(item => {
        columns.push(...item)
      })

      return columns
    }
  },
  created() {
    this.rowDrop()
  },
  beforeDestroy() {
    if (this.sortable) {
      this.sortable.destroy()
    }
  },
  methods: {
    validDate() {
      if (this.$utils.isEmpty(this.tableData)) {
        return true
      }
      for (let i = 0; i < this.tableData.length; i++) {
        const column = this.tableData[i]
        if (this.$utils.isEmpty(column.queryType)) {
          this.$msg.error('字段【' + column.name + '】查询类型不能为空')
          return false
        }
      }
      return true
    },
    emptyLine() {
      return {
        id: '',
        queryType: this.$enums.GEN_QUERY_TYPE.EQ.code,
        formWidth: 6,
        orderNo: ''
      }
    },
    onCheckChange(checkedKeys, { checked, checkedNodes, node, event }) {
      const tableData = this.tableData
      const tableKeys = tableData.map(item => item.id)
      if (checked) {
        checkedKeys.filter(item => !tableKeys.includes(item)).forEach(item => {
          const data = this._columns.filter(c => c.id === item)[0]
          tableData.push(Object.assign(this.emptyLine(), { id: data.id, type: data.type, relaId: data.relaId, viewType: data.viewType }))
        })

        this.tableData = tableData
      } else {
        this.tableData = tableData.filter(item => checkedKeys.includes(item.id))
      }
    },
    convertToColumn(id) {
      return this._columns.filter(item => item.id === id)[0]
    },
    setTableData(datas) {
      this.tableData = datas || []
      this.checkedKeys = this.tableData.map(item => item.id)
    },
    getTableData() {
      return this.tableData
    },
    rowDrop() {
      this.$nextTick(() => {
        const grid = this.$refs.grid
        this.sortable = Sortable.create(grid.$el.querySelector('.body--wrapper>.vxe-table--body tbody'), {
          handle: '.sort-btn',
          onEnd: ({ newIndex, oldIndex }) => {
            const currRow = this.tableData.splice(oldIndex, 1)[0]
            this.tableData.splice(newIndex, 0, currRow)
          }
        })
      })
    }
  }
}
</script>

<style scoped>
.sort-btn {
  margin: 0 5px;
  cursor: pointer;
}
</style>
