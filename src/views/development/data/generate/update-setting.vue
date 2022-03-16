<template>
  <div class="gen-container">
    <a-row>
      <a-col :span="4">
        <a-tree
          ref="tree"
          v-model="checkedKeys"
          :tree-data="_columns"
          :checkable="true"
          node-key="id"
          :replace-fields="{
            children: 'children',
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
          :columns="tableColumn"
          :data="tableData"
          :loading="loading"
        >
          <!-- 是否必填 列自定义内容 -->
          <template v-slot:required_default="{ row }">
            <a-select v-model="row.required">
              <a-select-option :value="true">是</a-select-option>
              <a-select-option :value="false">否</a-select-option>
            </a-select>
          </template>

          <!-- 是否必填 列自定义内容 -->
          <template v-slot:orderNo_default="{ row, rowIndex }">
            <span class="sort-btn" @click="() => moveRowTop(rowIndex)"><a-icon type="caret-up" /></span>
            <span class="sort-btn" @click="() => moveRowBottom(rowIndex)"><a-icon type="caret-down" /></span>
          </template>
        </vxe-grid>
      </a-col>
    </a-row>
  </div>
</template>
<script>
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
        { field: 'name', title: '显示名称', width: 160, formatter: ({ cellValue, row }) => { return this.convertToColumn(row.id).name } },
        { field: 'columnName', title: '属性名', width: 120, formatter: ({ cellValue, row }) => { return this.convertToColumn(row.id).columnName } },
        { field: 'required', title: '是否必填', width: 120, slots: { default: 'required_default' }},
        { field: 'orderNo', title: '排序', width: 80, slots: { default: 'orderNo_default' }}
      ],
      tableData: []
    }
  },
  computed: {
    _columns() {
      return this.columns.filter(item => !item.isKey)
    }
  },
  created() {

  },
  methods: {
    validDate() {
      return true
    },
    emptyLine() {
      return {
        id: '',
        required: true,
        orderNo: ''
      }
    },
    onCheckChange(checkedKeys, { checked, checkedNodes, node, event }) {
      const tableData = this.tableData
      const tableKeys = tableData.map(item => item.id)
      if (checked) {
        checkedKeys.filter(item => !tableKeys.includes(item)).forEach(item => {
          const data = this._columns.filter(c => c.id === item)[0]
          tableData.push(Object.assign(this.emptyLine(), { id: data.id, orderNo: data.columnOrder }))
          tableData.sort((t1, t2) => {
            return t1.orderNo - t2.orderNo
          })
        })

        this.tableData = tableData
      } else {
        this.tableData = tableData.filter(item => checkedKeys.includes(item.id))
      }
    },
    convertToColumn(id) {
      return this.columns.filter(item => item.id === id)[0]
    },
    setTableData(datas) {
      this.tableData = datas || []
      this.checkedKeys = this.tableData.map(item => item.id)
    },
    getTableData() {
      return this.tableData
    },
    moveRowTop(rowIndex) {
      const tableData = this.tableData
      this.tableData = this.$utils.swapArrayItem(tableData, rowIndex, rowIndex - 1)
    },
    moveRowBottom(rowIndex) {
      this.tableData = this.$utils.swapArrayItem(this.tableData, rowIndex, rowIndex + 1)
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
