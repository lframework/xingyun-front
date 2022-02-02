<template>
  <div>
    <el-input
      v-model="_label"
      type="text"
      readonly
      :placeholder="placeholder"
      :disabled="disabled"
      @focus="onOpen"
    >
      <i slot="suffix" class="el-input__icon el-icon-search" />
    </el-input>

    <el-dialog
      :title="title"
      :visible.sync="dialogVisible"
      :width="dialogWidth"
      append-to-body
      :close-on-click-modal="false"
      :close-on-press-escape="false"

      top="5vh"
      @open="open"
    >
      <div>
        <!-- 数据列表 -->
        <vxe-grid
          v-if="dialogVisible"
          ref="grid"
          resizable
          show-overflow
          highlight-hover-row
          keep-source
          :row-id="columnOption.value"
          :proxy-config="proxyConfig"
          :columns="_tableColumn"
          :tree-config="{ expandAll: true }"
          :radio-config="_radioConfig"
          :checkbox-config="_checkBoxConfig"
          :loading="loading"
          :toolbar-config="{
            refresh: true,
            slots: {
              buttons: 'toolbar_buttons'
            }
          }"
        >
          <template v-slot:form>
            <slot name="form" />
          </template>

          <template v-slot:toolbar_buttons>
            <slot name="toolbar_buttons" />
          </template>

          <!-- 状态 列自定义内容 -->
          <template v-slot:available_default="{ row }">
            <available-tag :available="row.available" />
          </template>
        </vxe-grid>
      </div>

      <template v-slot:footer>
        <div class="select-dialog-footer">
          <div>
            <el-button @click="handleClose">取 消</el-button>
            <el-button :loading="loading" @click="clear">清 空</el-button>
            <el-button type="primary" :loading="loading" @click="doSelect">确 定</el-button>
          </div>
        </div>
      </template>
    </el-dialog>
  </div>
</template>
<script>

import AvailableTag from '@/components/Tag/Available'
export default {
  components: {
    AvailableTag
  },
  props: {
    conditionLabel: {
      type: String,
      default: ''
    },
    dialogWidth: {
      type: String,
      default: '60%'
    },
    multiple: { type: Boolean, default: false },
    value: { type: [Object, Array], required: true },
    placeholder: { type: String, default: '' },
    title: { type: String, default: '选择' },
    option: {
      type: Object, default: () => {
        return { label: 'name', value: 'id' }
      }
    },
    columnOption: {
      type: Object, default: () => {
        return { label: 'name', value: 'id' }
      }
    },
    request: {
      type: Function,
      required: true
    },
    requestParams: {
      type: Object,
      default: e => {}
    },
    tableColumn: {
      type: Array,
      default: e => {
        return [
          { field: 'name', title: '名称', minWidth: 160, treeNode: true },
          { field: 'available', title: '状态', width: 80, slots: { default: 'available_default' }}
        ]
      }
    },
    onlyFinal: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    },
    beforeOpen: {
      type: Function,
      default: e => {
        return () => {
          return true
        }
      }
    },
    handleSearch: {
      type: Function,
      default: e => {
        return () => {
          return []
        }
      }
    }
  },
  data() {
    return {
      loading: false,
      dialogVisible: false
    }
  },
  computed: {
    _tableColumn() {
      if (this.multiple) {
        return [{ type: 'checkbox', width: 40 }, ...this.tableColumn]
      } else {
        return [{ type: 'radio', width: 40 }, ...this.tableColumn]
      }
    },
    _label() {
      if (this.multiple) {
        return this.value.map(item => item[this.option.label]).join('，')
      } else {
        return this.value[this.option.label]
      }
    },
    proxyConfig() {
      return {
        ajax: {
          // 查询接口
          query: () => this.request(this.requestParams).then(res => {
            // 将带层级的列表转成树结构
            res = this.$utils.toArrayTree(res, { key: 'id', parentKey: 'parentId', children: 'children', strict: true })

            const results = this.handleSearch(res)

            // 搜索之后默认展开所有子节点
            this.$nextTick(() => {
              this.$refs.grid.setAllTreeExpand(true)
            })

            return results
          })
        }
      }
    },
    _radioConfig() {
      if (this.onlyFinal) {
        return {
          checkMethod: ({ row }) => {
            return this.$utils.isEmpty(row.children)
          }
        }
      }

      return {}
    },
    _checkBoxConfig() {
      if (this.onlyFinal) {
        return {
          checkMethod: ({ row }) => {
            return this.$utils.isEmpty(row.children)
          }
        }
      }

      return {}
    }
  },
  methods: {
    onOpen() {
      if (this.beforeOpen()) {
        this.dialogVisible = true
      }
    },
    clear() {
      if (this.multiple) {
        this.$emit('input', [])
      } else {
        this.$emit('input', {})
      }

      this.$emit('clear')
      this.handleClose()
    },
    open() {
    },
    doSelect() {
      let selectData
      if (this.multiple) {
        selectData = this.$refs.grid.getCheckboxRecords()
      } else {
        selectData = this.$refs.grid.getRadioRecord()
      }

      if (this.$utils.isEmpty(selectData)) {
        if (!this.$utils.isEmpty(this.value)) {
          this.handleClose()
          return
        }
        if (this.multiple) {
          selectData = []
        } else {
          selectData = {}
        }
      } else {
        if (this.multiple) {
          selectData = selectData.map(item => {
            const data = {}
            data[this.option.label] = item[this.columnOption.label]
            data[this.option.value] = item[this.columnOption.value]

            return data
          })
          if (!this.$utils.isEmpty(this.value) && this.$utils.isArray(this.value)) {
            if (selectData.length === this.value.length) {
              let isSame = true
              for (let i = 0; i < this.value.length; i++) {
                if (this.value[i][this.option.value] !== selectData[i][this.option.value]) {
                  isSame = false
                  break
                }
              }

              if (isSame) {
                this.handleClose()
                return
              }
            }
          }
        } else {
          const data = {}
          data[this.option.label] = selectData[this.columnOption.label]
          data[this.option.value] = selectData[this.columnOption.value]
          selectData = data

          if (!this.$utils.isEmpty(this.value)) {
            if (selectData[this.option.value] === this.value[this.option.value]) {
              this.handleClose()
              return
            }
          }
        }
      }

      this.$emit('input', selectData)
      this.handleClose()
    },
    handleClose() {
      this.dialogVisible = false
    },
    // 列表发生查询时的事件
    search() {
      this.$refs.grid.commitProxy('reload')
    }
  }
}
</script>

<style lang="scss">
</style>
