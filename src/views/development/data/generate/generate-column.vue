<template>
  <div class="gen-container">
    <!-- 数据列表 -->
    <vxe-grid
      ref="grid"
      stripe
      resizable
      show-overflow
      highlight-hover-row
      keep-source
      row-id="id"
      :columns="tableColumn"
      :data="columns"
      :loading="loading"
    >
      <!-- 数据类型 列自定义内容 -->
      <template v-slot:name_default="{ row }">
        <a-input v-model="row.name" />
      </template>

      <!-- 数据类型 列自定义内容 -->
      <template v-slot:dataType_default="{ row }">
        <a-select v-model="row.dataType">
          <a-select-option v-for="item in $enums.GEN_DATA_TYPE.values()" :key="item.code" :value="item.code">{{ item.desc }}</a-select-option>
        </a-select>
      </template>

      <!-- 显示类型 列自定义内容 -->
      <template v-slot:viewType_header>
        <a-space>
          <span>显示类型</span>
          <a-tooltip title="表示前端使用的组件类型。注：当属性名是available并且显示类型是选择器时，会将该字段转换为内置的状态字段"><a-icon type="question-circle" /></a-tooltip>
        </a-space>
      </template>

      <!-- 显示类型 列自定义内容 -->
      <template v-slot:viewType_default="{ row }">
        <a-select v-model="row.viewType" :disabled="row.fixEnum" @change="e => changeViewType(row, e)">
          <a-select-option v-for="item in $enums.GEN_VIEW_TYPE.values()" :key="item.code" :value="item.code">{{ item.desc }}</a-select-option>
        </a-select>
      </template>

      <!-- 是否内置枚举 列自定义内容 -->
      <template v-slot:fixEnum_default="{ row }">
        <a-select v-model="row.fixEnum" :disabled="row.isKey" @change="e => changeFixEnum(row, e)">
          <a-select-option :value="true">是</a-select-option>
          <a-select-option :value="false">否</a-select-option>
        </a-select>
      </template>

      <!-- 后端枚举名 列自定义内容 -->
      <template v-slot:enumBack_header>
        <a-space>
          <span>后端枚举名</span>
          <a-tooltip title="填写后端枚举类的全名称，如：com.lframework.xingyun.enums.BizType"><a-icon type="question-circle" /></a-tooltip>
        </a-space>
      </template>

      <!-- 后端枚举名 列自定义内容 -->
      <template v-slot:enumBack_default="{ row }">
        <a-input v-if="row.fixEnum" v-model="row.enumBack" />
      </template>

      <!-- 前端枚举名 列自定义内容 -->
      <template v-slot:enumFront_header>
        <a-space>
          <span>前端枚举名</span>
          <a-tooltip title="填写前端枚举的全名称，如：BIZ_TYPE"><a-icon type="question-circle" /></a-tooltip>
        </a-space>
      </template>

      <!-- 前端枚举名 列自定义内容 -->
      <template v-slot:enumFront_default="{ row }">
        <a-input v-if="row.fixEnum" v-model="row.enumFront" />
      </template>

      <!-- 备注 列自定义内容 -->
      <template v-slot:description_default="{ row }">
        <a-input v-model="row.description" />
      </template>

      <!-- 正则表达式 列自定义内容 -->
      <template v-slot:regularExpression_header>
        <a-space>
          <span>正则表达式</span>
          <a-tooltip title="填写正则表达式，如：^[0-9]*$"><a-icon type="question-circle" /></a-tooltip>
        </a-space>
      </template>

      <!-- 正则表达式 列自定义内容 -->
      <template v-slot:regularExpression_default="{ row }">
        <a-input v-model="row.regularExpression" :disabled="row.viewType !== $enums.GEN_VIEW_TYPE.INPUT.code && row.viewType !== $enums.GEN_VIEW_TYPE.TEXTAREA.code" />
      </template>

      <!-- 是否排序字段 列自定义内容 -->
      <template v-slot:isOrder_default="{ row }">
        <a-select v-model="row.isOrder" @change="e => changeIsOrder(row, e)">
          <a-select-option :value="true">是</a-select-option>
          <a-select-option :value="false">否</a-select-option>
        </a-select>
      </template>

      <!-- 排序类型 列自定义内容 -->
      <template v-slot:orderType_default="{ row }">
        <a-select v-if="row.isOrder" v-model="row.orderType">
          <a-select-option v-for="item in $enums.GEN_ORDER_TYPE.values()" :key="item.code" :value="item.code">{{ item.desc }}</a-select-option>
        </a-select>
      </template>

      <!-- 排序 列自定义内容 -->
      <template v-slot:orderNo_default="{ row, rowIndex }">
        <span class="sort-btn" @click="() => moveRowTop(rowIndex)"><a-icon type="caret-up" /></span>
        <span class="sort-btn" @click="() => moveRowBottom(rowIndex)"><a-icon type="caret-down" /></span>
      </template>
    </vxe-grid>
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
      tableColumn: [
        { field: 'name', title: '显示名称', width: 160, slots: { default: 'name_default' }},
        { field: 'columnName', title: '属性名', width: 120 },
        { field: 'isKey', title: '是否主键', width: 80, formatter: ({ cellValue }) => { return cellValue ? '是' : '否' } },
        { field: 'dataType', title: '数据类型', width: 180, slots: { default: 'dataType_default' }},
        { field: 'viewType', title: '显示类型', width: 180, slots: { default: 'viewType_default', header: 'viewType_header' }},
        { field: 'fixEnum', title: '是否内置枚举', width: 120, slots: { default: 'fixEnum_default' }},
        { field: 'enumBack', title: '后端枚举名', width: 180, slots: { default: 'enumBack_default', header: 'enumBack_header' }},
        { field: 'enumFront', title: '前端枚举名', width: 180, slots: { default: 'enumFront_default', header: 'enumFront_header' }},
        { field: 'regularExpression', title: '正则表达式', width: 200, slots: { default: 'regularExpression_default', header: 'regularExpression_header' }},
        { field: 'isOrder', title: '是否排序字段', width: 120, slots: { default: 'isOrder_default' }},
        { field: 'orderType', title: '排序类型', width: 120, slots: { default: 'orderType_default' }},
        { field: 'description', title: '备注', width: 200, slots: { default: 'description_default' }},
        { field: 'orderNo', title: '排序', width: 80, slots: { default: 'orderNo_default' }}
      ],
      tableData: []
    }
  },
  computed: {
  },
  created() {
  },
  methods: {
    validDate() {
      if (this.$utils.isEmpty(this.columns)) {
        this.$msg.error('字段信息不能为空！')
        return false
      }
      for (let i = 0; i < this.columns.length; i++) {
        const column = this.columns[i]

        if (this.$utils.isEmpty(column.name)) {
          this.$msg.error('第' + (i + 1) + '行字段显示名称不能为空！')
          return false
        }

        if (this.$utils.isEmpty(column.dataType)) {
          this.$msg.error('字段【' + column.name + '】数据类型不能为空！')
          return false
        }

        if (this.$utils.isEmpty(column.viewType)) {
          this.$msg.error('字段【' + column.name + '】显示类型不能为空！')
          return false
        }

        if (this.$utils.isEmpty(column.fixEnum)) {
          this.$msg.error('字段【' + column.name + '】是否内置枚举不能为空！')
          return false
        }

        if (this.$utils.isEmpty(column.columnOrder)) {
          this.$msg.error('字段【' + column.name + '】字段排序不能为空！')
          return false
        }

        if (column.fixEnum) {
          if (this.$utils.isEmpty(column.enumBack)) {
            this.$msg.error('字段【' + column.name + '】后端枚举名不能为空！')
            return false
          }

          if (this.$utils.isEmpty(column.enumFront)) {
            this.$msg.error('字段【' + column.name + '】前端枚举名不能为空！')
            return false
          }
        }

        if (this.$utils.isEmpty(column.isOrder)) {
          this.$msg.error('字段【' + column.name + '】是否排序字段不能为空！')
          return false
        }

        if (column.isOrder) {
          if (this.$utils.isEmpty(column.orderType)) {
            this.$msg.error('字段【' + column.name + '】排序类型不能为空！')
            return false
          }
        }
      }

      return true
    },
    moveRowTop(rowIndex) {
      const tableData = this.columns
      this.columns = this.$utils.swapArrayItem(tableData, rowIndex, rowIndex - 1)
      this.$emit('sortColumns', this.columns)
    },
    moveRowBottom(rowIndex) {
      this.columns = this.$utils.swapArrayItem(this.columns, rowIndex, rowIndex + 1)
      this.$emit('sortColumns', this.columns)
    },
    changeFixEnum(row, val) {
      if (val) {
        // 是内置枚举
        // viewType必须是SELECT
        row.viewType = this.$enums.GEN_VIEW_TYPE.SELECT.code
        this.changeViewType(row, this.$enums.GEN_VIEW_TYPE.SELECT.code)
      } else {
        row.enumBack = ''
        row.enumFront = ''
      }
    },
    changeViewType(row, val) {
      if (val !== this.$enums.GEN_VIEW_TYPE.INPUT.code && val !== this.$enums.GEN_VIEW_TYPE.TEXTAREA.code) {
        // 如果viewType不是INPUT、TEAXTAREA，正则必须是空
        row.regularExpression = ''
      }
    },
    changeIsOrder(row, val) {
      if (!val) {
        row.orderType = ''
      }
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
