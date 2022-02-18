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
          :toolbar-config="{
            refresh: true,
            slots: {
              buttons: 'toolbar_buttons'
            }
          }"
          :pager-config="{}"
          :loading="loading"
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
      required: true
    },
    tableColumn: {
      type: Array,
      default: e => {
        return [
          { field: 'code', title: '编号', width: 120 },
          { field: 'name', title: '名称', minWidth: 160 },
          { field: 'available', title: '状态', width: 80, slots: { default: 'available_default' }}
        ]
      }
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
        props: {
          // 响应结果列表字段
          result: 'datas',
          // 响应结果总条数字段
          total: 'totalCount'
        },
        ajax: {
          // 查询接口
          query: ({ page, sorts, filters }) => {
            return this.request(this.requestParams)
          }
        }
      }
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
        this.$emit('input', [], this.value)
      } else {
        this.$emit('input', {}, this.value)
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
        } else {
          const data = {}
          data[this.option.label] = selectData[this.columnOption.label]
          data[this.option.value] = selectData[this.columnOption.value]
          selectData = data
        }
      }

      this.$emit('input', selectData, this.value)
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
