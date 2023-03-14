<template>
  <div>
    <a-space v-if="showSum">
      <a-input
        v-model="label"
        read-only
        :disabled="disabled"
        :placeholder="placeholder"
        class="dialog-tree--input"
        @click.native="onOpen"
      >
        <a-icon slot="suffix" type="search" />
      </a-input>
      <span v-if="multiple">已选择 <span style="color: #F5222D; font-weight: bold;">{{ selectRow.length }}</span> 项</span>
      <a v-if="multiple && selectRow.length > 0" @click="sumDialogVisible = true">点此查看</a>
    </a-space>
    <a-input
      v-else
      v-model="label"
      read-only
      :disabled="disabled"
      :placeholder="placeholder"
      class="dialog-tree--input"
      @click.native="onOpen"
    >
      <a-icon slot="suffix" type="search" />
    </a-input>

    <a-modal
      v-model="sumDialogVisible"
      title="已选择"
      :width="dialogWidth"
      :mask-closable="false"
      :keyboard="false"
      :dialog-style="{ top: '20px' }"
    >
      <div>
        <!-- 数据列表 -->
        <vxe-grid
          v-if="sumDialogVisible"
          ref="sumGrid"
          resizable
          show-overflow
          highlight-hover-row
          keep-source
          :max-height="600"
          :row-id="columnOption.value"
          :data="selectRow"
          :columns="_sumTableColumn"
          :pager-config="undefined"
        >
          <!-- 状态 列自定义内容 -->
          <template v-slot:available_default="{ row }">
            <available-tag :available="row.available" />
          </template>
        </vxe-grid>
      </div>

      <template slot="footer">
        <div>
          <a-button @click="sumDialogVisible = false">关 闭</a-button>
        </div>
      </template>
    </a-modal>

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
          :max-height="600"
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
    load: {
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
    },
    showSum: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      loading: false,
      sumDialogVisible: false,
      dialogVisible: false,
      label: '',
      selectValue: [],
      selectRow: [],
      reloadSeq: ''
    }
  },
  computed: {
    _tableColumn() {
      if (this.multiple) {
        return [{ type: 'checkbox', width: 50 }, ...this.tableColumn]
      } else {
        return [{ type: 'radio', width: 50 }, ...this.tableColumn]
      }
    },
    _sumTableColumn() {
      return [{ type: 'seq', width: 50 }, ...this.tableColumn]
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
      let config = {}
      if (this.onlyFinal) {
        config = {
          checkMethod: ({ row }) => {
            return this.$utils.isEmpty(row.children)
          }
        }
      }

      if (!this.multiple) {
        config = Object.assign({ trigger: 'row', highlight: true }, config)
      }

      return config
    },
    _checkBoxConfig() {
      let config = {}
      if (this.onlyFinal) {
        config = {
          trigger: 'row',
          highlight: true,
          checkMethod: ({ row }) => {
            return this.$utils.isEmpty(row.children)
          }
        }
      }

      if (this.multiple) {
        config = Object.assign({ trigger: 'row', highlight: true }, config)
      }

      return config
    },
    _requireReloadValue() {
      if (!this.$utils.isEmpty(this.reloadSeq)) {
        return true
      }
      if (this.multiple) {
        const value = this.value || []
        if (this.selectValue.length !== value.length) {
          return true
        }
        if (this.selectValue.length === 0) {
          return false
        }
        return this.selectValue.some(item => !value.includes(item))
      } else {
        return this.value !== this.selectValue[0]
      }
    }
  },
  watch: {
    value(val) {
      this.reloadValue()
    }
  },
  mounted() {
    this.reloadValue()
  },
  methods: {
    reloadValue() {
      if (this._requireReloadValue) {
        this.reloadSeq = this.$utils.uuid()
        const reloadSeq = this.reloadSeq
        let params
        if (this.multiple) {
          params = this.value
        } else {
          params = [this.value]
        }

        this.load(params).then(res => {
          if (reloadSeq === this.reloadSeq) {
            if (!this.$utils.isEmpty(res)) {
              if (this.multiple) {
                this.selectValue = res.map(item => item[this.columnOption.value])
                this.selectRow = res
                const tmpRes = res.map(item => item[this.columnOption.label])
                this.label = tmpRes.join('，')
              } else {
                this.label = res[0][this.columnOption.label]
                this.selectValue = [res[0][this.columnOption.value]]
                this.selectRow = [res[0]]
              }
            } else {
              this.label = ''
              this.selectValue = []
              this.selectRow = []
            }
            this.reloadSeq = ''
          }
        })
      }
    },
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
        this.$emit('input-label', [])
        this.$emit('input-row', [])
      } else {
        this.$emit('input', undefined)
        this.$emit('input-label', undefined)
        this.$emit('input-row', undefined)
      }

      this.label = ''
      this.selectValue = []
      this.selectRow = []

      this.$emit('clear')
      this.handleClose()
    },
    doSelect() {
      let selectData
      let label
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
          label = ''
          this.selectRow = []
        } else {
          selectData = undefined
          label = ''
          this.selectRow = undefined
        }
      } else {
        this.label = ''
        this.selectValue = []
        this.selectRow = []
        if (this.multiple) {
          this.selectRow = selectData
          selectData = selectData.map(item => {
            const data = {}
            data[this.option.label] = item[this.columnOption.label]
            data[this.option.value] = item[this.columnOption.value]

            return Object.assign({}, item, data)
          })
          this.selectValue = selectData.map(item => item[this.option.value])
          label = selectData.map(item => item[this.option.label])
          this.label = label.join('，')
          selectData = selectData.map(item => item[this.option.value])

          if (!this.$utils.isEmpty(this.value) && this.$utils.isArray(this.value)) {
            if (selectData.length === this.value.length) {
              let isSame = true
              for (let i = 0; i < this.value.length; i++) {
                if (this.value[i] !== selectData[i]) {
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
          this.selectRow = selectData
          label = selectData[this.columnOption.label]
          this.label = label
          this.selectValue = [selectData[this.columnOption.value]]
          selectData = selectData[this.columnOption.value]

          if (!this.$utils.isEmpty(this.value)) {
            if (selectData === this.value) {
              this.handleClose()
              return
            }
          }
        }
      }

      this.$emit('input', selectData)
      this.$emit('input-label', label)
      this.$emit('input-row', this.selectRow)
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
