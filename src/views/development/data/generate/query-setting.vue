<template>
  <div class="gen-container">
    <el-row>
      <el-col :span="4">
        <el-tree
          ref="tree"
          :data="_columns"
          show-checkbox
          node-key="id"
          :props="defaultProps"
          @check-change="onCheckChange"
        />
      </el-col>
      <el-col :span="20">
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
          <!-- 宽度类型 列自定义内容 -->
          <template v-slot:widthType_default="{ row }">
            <el-select v-model="row.widthType" placeholder="">
              <el-option v-for="item in $enums.GEN_QUERY_WIDTH_TYPE.values()" :key="item.code" :label="item.desc" :value="item.code" />
            </el-select>
          </template>

          <!-- 宽度 列自定义内容 -->
          <template v-slot:width_default="{ row }">
            <el-input v-model="row.width" class="number-input" />
          </template>

          <!-- 是否必填 列自定义内容 -->
          <template v-slot:orderNo_default="{ row, rowIndex }">
            <span class="sort-btn" @click="() => moveRowTop(rowIndex)"><svg-icon icon-class="el-icon-caret-top" /></span>
            <span class="sort-btn" @click="() => moveRowBottom(rowIndex)"><svg-icon icon-class="el-icon-caret-bottom" /></span>
          </template>
        </vxe-grid>
      </el-col>
    </el-row>
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
        { field: 'widthType', title: '宽度类型', width: 140, slots: { default: 'widthType_default' }},
        { field: 'width', title: '宽度', width: 100, slots: { default: 'width_default' }, align: 'right' },
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
      if (this.$utils.isEmpty(this.tableData)) {
        this.$msg.error('查询功能必须配置')
        return false
      }

      for (let i = 0; i < this.tableData.length; i++) {
        const column = this.tableData[i]
        if (this.$utils.isEmpty(column.widthType)) {
          this.$msg.error('字段【' + column.name + '】宽度类型不能为空')
          return false
        }

        if (this.$utils.isEmpty(column.width)) {
          this.$msg.error('字段【' + column.name + '】宽度不能为空')
          return false
        }

        if (!this.$utils.isIntegerGtZero(column.width)) {
          this.$msg.error('字段【' + column.name + '】宽度必须是整数并且大于0')
          return false
        }
      }
      return true
    },
    emptyLine() {
      return {
        id: '',
        widthType: this.$enums.GEN_QUERY_WIDTH_TYPE.FIX.code,
        width: 100,
        orderNo: ''
      }
    },
    onCheckChange(data, checked, indeterminate) {
      const tableData = this.tableData
      if (checked) {
        tableData.push(Object.assign(this.emptyLine(), { id: data.id, orderNo: data.columnOrder }))
        tableData.sort((t1, t2) => {
          return t1.orderNo - t2.orderNo
        })

        this.tableData = tableData
      } else {
        this.tableData = tableData.filter(item => item.id !== data.id)
      }
    },
    convertToColumn(id) {
      return this.columns.filter(item => item.id === id)[0]
    },
    setTableData(datas) {
      this.tableData = datas || []
      this.$refs.tree.setCheckedKeys(this.tableData.map(item => item.id))
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
