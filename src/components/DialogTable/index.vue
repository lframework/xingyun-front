<template>
  <div>
    <a-input
      v-model="_label"
      read-only
      :disabled="disabled"
      :placeholder="placeholder"
      class="dialog-table--input"
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
            return this.request(Object.assign({
              pageIndex: page.currentPage,
              pageSize: page.pageSize
            }, this.requestParams))
          }
        }
      }
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

<style lang="less">
.dialog-table--input {
  input {
    cursor: pointer;
  }
}
</style>
