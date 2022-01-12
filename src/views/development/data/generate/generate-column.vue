<template>
  <div>
    <!-- 数据列表 -->
    <vxe-grid
      ref="grid"
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
        <el-input v-model="row.name" />
      </template>

      <!-- 数据类型 列自定义内容 -->
      <template v-slot:dataType_default="{ row }">
        <el-select v-model="row.dataType">
          <el-option v-for="item in $enums.GEN_DATA_TYPE.values()" :key="item.code" :label="item.desc" :value="item.code" />
        </el-select>
      </template>

      <!-- 显示类型 列自定义内容 -->
      <template v-slot:viewType_default="{ row }">
        <el-select v-model="row.viewType">
          <el-option v-for="item in $enums.GEN_VIEW_TYPE.values()" :key="item.code" :label="item.desc" :value="item.code" />
        </el-select>
      </template>

      <!-- 是否内置枚举 列自定义内容 -->
      <template v-slot:fixEnum_default="{ row }">
        <el-select v-model="row.fixEnum">
          <el-option label="是" :value="true" />
          <el-option label="否" :value="false" />
        </el-select>
      </template>

      <!-- 后端枚举名 列自定义内容 -->
      <template v-slot:enumBack_default="{ row }">
        <el-input v-if="row.fixEnum" v-model="row.enumBack" />
      </template>

      <!-- 前端枚举名 列自定义内容 -->
      <template v-slot:enumFront_default="{ row }">
        <el-input v-if="row.fixEnum" v-model="row.enumFront" />
      </template>

      <!-- 备注 列自定义内容 -->
      <template v-slot:description_default="{ row }">
        <el-input v-model="row.description" />
      </template>

      <!-- 正则表达式 列自定义内容 -->
      <template v-slot:regularExpression_default="{ row }">
        <el-input v-model="row.regularExpression" class="number-input" />
      </template>

      <!-- 是否排序字段 列自定义内容 -->
      <template v-slot:isOrder_default="{ row }">
        <el-select v-model="row.isOrder">
          <el-option label="是" :value="true" />
          <el-option label="否" :value="false" />
        </el-select>
      </template>

      <!-- 排序类型 列自定义内容 -->
      <template v-slot:orderType_default="{ row }">
        <el-select v-if="row.isOrder" v-model="row.orderType">
          <el-option v-for="item in $enums.GEN_ORDER_TYPE.values()" :key="item.code" :label="item.desc" :value="item.code" />
        </el-select>
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
        { field: 'viewType', title: '显示类型', width: 180, slots: { default: 'viewType_default' }},
        { field: 'fixEnum', title: '是否内置枚举', width: 120, slots: { default: 'fixEnum_default' }},
        { field: 'enumBack', title: '后端枚举名', width: 180, slots: { default: 'enumBack_default' }},
        { field: 'enumFront', title: '前端枚举名', width: 180, slots: { default: 'enumFront_default' }},
        { field: 'description', title: '备注', width: 200, slots: { default: 'description_default' }},
        { field: 'regularExpression', title: '正则表达式', width: 200, slots: { default: 'regularExpression_default' }},
        { field: 'isOrder', title: '是否排序字段', width: 120, slots: { default: 'isOrder_default' }},
        { field: 'orderType', title: '排序类型', width: 120, slots: { default: 'orderType_default' }}
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
    }
  }
}
</script>
