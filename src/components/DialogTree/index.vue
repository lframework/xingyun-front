<template>
  <div>
    <a-input
      v-model="_label"
      read-only
      :disabled="disabled"
      :placeholder="placeholder"
      class="dialog-tree--input"
      @click.native="onOpen"
    >
      <a-icon slot="suffix" type="search" />
    </a-input>

    <a-modal
      v-model="dialogVisible"
      :title="title"
      :width="dialogWidth"
      :mask-closable="false"
      :keyboard="false"
      :dialog-style="{ top: '20px' }"
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

      <template slot="footer">
        <div>
          <a-button @click="handleClose">取 消</a-button>
          <a-button :loading="loading" @click="clear">清 空</a-button>
          <a-button type="primary" :loading="loading" @click="doSelect">确 定</a-button>
        </div>
      </template>
    </a-modal>
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
      if (this.disabled) {
        return
      }
      const result = this.beforeOpen()
      if (this.$utils.isPromise(result)) {
        result.then(() => {
          this.dialogVisible = true
        })
      } else {
        if (result) {
          this.dialogVisible = true
        }
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

<style lang="less">
.dialog-tree--input {
  input {
    cursor: pointer;
  }
}
</style>
