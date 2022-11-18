<template>
  <div>
    <!-- 数据列表 -->
    <vxe-grid
      ref="grid"
      stripe
      resizable
      show-overflow
      highlight-hover-row
      keep-source
      row-id="id"
      :row-config="{useKey: true, isCurrent: true, isHover: true}"
      :columns="tableColumn"
      :toolbar-config="toolbarConfig"
      :data="columns"
      :loading="loading"
    >

      <!-- 工具栏 -->
      <template v-slot:toolbar_buttons>
        <a-space>
          <a-button type="primary" icon="plus" @click="addLine">新增</a-button>
          <a-button type="danger" icon="delete" @click="delLine">删除</a-button>
        </a-space>
      </template>

      <!-- 排序 列自定义内容 -->
      <template v-slot:orderNo_default>
        <span class="sort-btn"><a-icon type="drag" /></span>
      </template>

      <!-- 显示名称 列自定义内容 -->
      <template v-slot:customName_default="{ row }">
        <a-input v-model="row.customName" allow-clear />
      </template>

      <!-- 自定义SQL 列自定义内容 -->
      <template v-slot:customSql_default="{ row }">
        <a-input v-model="row.customSql" allow-clear />
      </template>

      <!-- 别名 列自定义内容 -->
      <template v-slot:customAlias_default="{ row }">
        <a-input v-model="row.customAlias" allow-clear />
      </template>

      <!-- 数据类型 列自定义内容 -->
      <template v-slot:dataType_default="{ row }">
        <a-select v-model="row.dataType" :disabled="row.viewType === $enums.GEN_VIEW_TYPE.DATA_DIC.code">
          <a-select-option v-for="item in $enums.GEN_DATA_TYPE.values()" :key="item.code" :value="item.code">{{ item.desc }}</a-select-option>
        </a-select>
      </template>
    </vxe-grid>
  </div>
</template>
<script>
import Sortable from 'sortablejs'
export default {
  // 使用组件
  components: {
  },

  props: {
    mainTableId: {
      type: String,
      default: ''
    },
    columns: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      // 是否显示加载框
      loading: false,
      // 工具栏配置
      toolbarConfig: {
        // 自定义左侧工具栏
        slots: {
          buttons: 'toolbar_buttons'
        }
      },
      tableColumn: [
        { field: 'checkbox', type: 'checkbox', width: 50 },
        { field: 'orderNo', title: '排序', width: 50, slots: { default: 'orderNo_default' }},
        { field: 'customName', title: '显示名称', width: 180, slots: { default: 'customName_default' }},
        { field: 'customSql', title: '自定义SQL', minWidth: 260, slots: { default: 'customSql_default' }},
        { field: 'customAlias', title: '别名', width: 200, slots: { default: 'customAlias_default' }},
        { field: 'dataType', title: '数据类型', width: 180, slots: { default: 'dataType_default' }}
      ]
    }
  },
  computed: {
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
    emptyLine() {
      return {
        id: this.$utils.uuid(),
        customName: '',
        customSql: '',
        customAlias: ''
      }
    },
    addLine() {
      if (this.$utils.isEmpty(this.mainTableId)) {
        this.$msg.error('请先选择主表')
        return
      }
      this.columns.push(this.emptyLine())
    },
    delLine() {
      const records = this.$refs.grid.getCheckboxRecords()
      if (this.$utils.isEmpty(records)) {
        this.$msg.error('请选择要删除的行！')
        return
      }
      this.$msg.confirm('是否确定删除选中的行？').then(() => {
        const columns = this.columns.filter(t => {
          const tmp = records.filter(item => item.id === t.id)
          return this.$utils.isEmpty(tmp)
        })

        this.columns = columns
      })
    },
    changeSubTable(e, row) {
      row.subTable = {}
      row.subTableDetailIds = []
      this.$nextTick(() => {
        row.subTable = e
      })
    },
    validDate() {
      if (this.$utils.isEmpty(this.columns)) {
        return true
      }
      for (let i = 0; i < this.columns.length; i++) {
        const column = this.columns[i]

        if (this.$utils.isEmpty(column.customName)) {
          this.$msg.error('第' + (i + 1) + '行字段显示名称不能为空！')
          return false
        }

        if (this.$utils.isEmpty(column.customSql)) {
          this.$msg.error('字段【' + column.customName + '】自定义SQL不能为空！')
          return false
        }

        if (this.$utils.isEmpty(column.customAlias)) {
          this.$msg.error('字段【' + column.customName + '】别名不能为空！')
          return false
        }
      }

      return true
    },
    rowDrop() {
      this.$nextTick(() => {
        const grid = this.$refs.grid
        this.sortable = Sortable.create(grid.$el.querySelector('.body--wrapper>.vxe-table--body tbody'), {
          handle: '.sort-btn',
          onEnd: ({ newIndex, oldIndex }) => {
            const currRow = this.columns.splice(oldIndex, 1)[0]
            this.columns.splice(newIndex, 0, currRow)
          }
        })
      })
    },
    getColumns() {
      return this.columns
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
