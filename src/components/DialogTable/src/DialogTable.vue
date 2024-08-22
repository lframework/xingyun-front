<template>
  <div>
    <a-space v-if="showSum">
      <a-input
        v-model:value="label"
        readonly
        :placeholder="placeholder"
        class="j-dialog-table--input"
        @click="onOpen"
      >
        <template #suffix>
          <SearchOutlined />
        </template>
      </a-input>
      <span v-if="multiple"
        >已选择 <span class="j-dialog-table-selected-span">{{ selectRow.length }}</span> 项</span
      >
      <a v-if="multiple && selectRow.length > 0" @click="sumDialogVisible = true">点此查看</a>
    </a-space>
    <a-input
      v-else
      v-model:value="label"
      readonly
      :placeholder="placeholder"
      class="j-dialog-table--input"
      @click="onOpen"
    >
      <template #suffix>
        <SearchOutlined />
      </template>
    </a-input>

    <a-form-item class="form-item-alone">
      <a-modal
        v-model:open="sumDialogVisible"
        title="已选择"
        :width="dialogWidth"
        :mask-closable="false"
        :keyboard="false"
        :style="{ top: '20px' }"
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
            <template #available_default="{ row }">
              <available-tag :available="row.available" />
            </template>
          </vxe-grid>
        </div>

        <template #footer>
          <div>
            <a-button @click="sumDialogVisible = false">关 闭</a-button>
          </div>
        </template>
      </a-modal>
    </a-form-item>

    <a-form-item class="form-item-alone">
      <a-modal
        v-model:open="dialogVisible"
        :title="title"
        :width="dialogWidth"
        :mask-closable="false"
        :keyboard="false"
        :style="{ top: '20px' }"
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
            :toolbar-config="{
              refresh: true,
              slots: {
                buttons: 'toolbar_buttons',
              },
            }"
            :radio-config="_radioConfig"
            :checkbox-config="_checkboxConfig"
            :pager-config="{}"
            :loading="loading"
            @cell-dblclick="() => !multiple && doSelect()"
          >
            <template #form>
              <slot name="form"></slot>
            </template>

            <template #toolbar_buttons>
              <slot name="toolbar_buttons"></slot>
            </template>

            <!-- 状态 列自定义内容 -->
            <template #available_default="{ row }">
              <available-tag :available="row.available" />
            </template>
          </vxe-grid>
        </div>

        <template #footer>
          <div>
            <a-button @click="handleClose">取 消</a-button>
            <a-button :loading="loading" @click="clear">清 空</a-button>
            <a-button type="primary" :loading="loading" @click="doSelect">确 定</a-button>
          </div>
        </template>
      </a-modal>
    </a-form-item>
  </div>
</template>
<script>
  import { defineComponent } from 'vue';
  import { isEmpty, isPromise, uuid } from '@/utils/utils';
  import { SearchOutlined } from '@ant-design/icons-vue';

  export default defineComponent({
    components: {
      SearchOutlined,
    },
    props: {
      value: { type: [String, Array], required: true },
      dialogWidth: {
        type: String,
        default: '60%',
      },
      multiple: { type: Boolean, default: false },
      placeholder: { type: String, default: '' },
      title: { type: String, default: '选择' },
      option: {
        type: Object,
        default: () => {
          return { label: 'name', value: 'id' };
        },
      },
      columnOption: {
        type: Object,
        default: () => {
          return { label: 'name', value: 'id' };
        },
      },
      request: {
        type: Function,
        required: true,
      },
      load: {
        type: Function,
        required: true,
      },
      tableColumn: {
        type: Array,
        default: () => {
          return [
            { field: 'code', title: '编号', width: 120 },
            { field: 'name', title: '名称', minWidth: 160 },
            {
              field: 'available',
              title: '状态',
              width: 80,
              slots: { default: 'available_default' },
            },
          ];
        },
      },
      disabled: {
        type: Boolean,
        default: false,
      },
      beforeOpen: {
        type: Function,
        default: () => {
          return () => {
            return true;
          };
        },
      },
      showSum: {
        type: Boolean,
        default: false,
      },
      requestParams: {
        type: Object,
        required: true,
      },
    },
    data() {
      return {
        loading: false,
        sumDialogVisible: false,
        dialogVisible: false,
        label: '',
        selectValue: [],
        selectRow: [],
        reloadSeq: '',
        proxyConfig: {
          props: {
            // 响应结果列表字段
            result: 'datas',
            // 响应结果总条数字段
            total: 'totalCount',
          },
          ajax: {
            // 查询接口
            query: ({ page }) => {
              return this.request({
                pageIndex: page.currentPage,
                pageSize: page.pageSize,
                ...this.requestParams,
              });
            },
          },
        },
      };
    },
    computed: {
      _tableColumn() {
        if (this.multiple) {
          return [{ type: 'checkbox', width: 45 }, ...this.tableColumn];
        } else {
          return [{ type: 'radio', width: 45 }, ...this.tableColumn];
        }
      },
      _sumTableColumn() {
        return [{ type: 'seq', width: 50 }, ...this.tableColumn];
      },
      _radioConfig() {
        if (!this.multiple) {
          return {
            trigger: 'row',
            highlight: true,
          };
        }
        return {};
      },
      _checkboxConfig() {
        if (this.multiple) {
          return {
            trigger: 'row',
          };
        }
        return {};
      },
      _requireReloadValue() {
        if (!isEmpty(this.reloadSeq)) {
          return true;
        }
        if (this.multiple) {
          const value = this.value || [];
          const selectValueVal = this.selectValue;
          if (selectValueVal.length !== value.length) {
            return true;
          }
          if (selectValueVal.length === 0) {
            return false;
          }
          return selectValueVal.some((item) => !value.includes(item));
        } else {
          return this.value !== this.selectValue[0];
        }
      },
    },
    watch: {
      value() {
        this.reloadValue();
      },
    },
    mounted() {
      this.reloadValue();
    },
    methods: {
      reloadValue() {
        if (this._requireReloadValue) {
          this.reloadSeq = uuid();
          const reloadSeq = this.reloadSeq;
          let params;
          if (this.multiple) {
            params = this.value;
          } else {
            params = [this.value];
          }

          this.load(params).then((res) => {
            if (reloadSeq === this.reloadSeq) {
              if (!isEmpty(res)) {
                if (this.multiple) {
                  this.selectValue = res.map((item) => item[this.columnOption]);
                  this.selectRow = res;
                  const tmpRes = res.map((item) => item[this.columnOption.label]);
                  this.label = tmpRes.join('，');
                } else {
                  this.label = res[0][this.columnOption.label];
                  this.selectValue = [res[0][this.columnOption]];
                  this.selectRow = [res[0]];
                }
              } else {
                this.label = '';
                this.selectValue = [];
                this.selectRow = [];
              }
              this.reloadSeq = '';
            }
          });
        }
      },
      onOpen() {
        if (this.disabled) {
          return;
        }
        const result = this.beforeOpen();
        if (isPromise(result)) {
          result.then(() => {
            this.dialogVisible = true;
          });
        } else {
          if (result) {
            this.dialogVisible = true;
          }
        }
      },
      clear() {
        if (this.multiple) {
          this.$emit('update:value', [], this.value);
          this.$emit('input-label', []);
          this.$emit('input-row', []);
        } else {
          this.$emit('update:value', undefined, this.value);
          this.$emit('input-label', undefined);
          this.$emit('input-row', undefined);
        }

        this.label = '';
        this.selectValue = [];
        this.selectRow = [];

        this.$emit('clear');

        this.handleClose();
      },
      open() {
        if (this.disabled) {
          return;
        }
        const result = this.beforeOpen();
        if (isPromise(result)) {
          result.then(() => {
            this.dialogVisible = true;
          });
        } else {
          if (result) {
            this.dialogVisible = true;
          }
        }
      },
      doSelect() {
        let selectData;
        let label;
        if (this.multiple) {
          selectData = this.$refs.grid.getCheckboxRecords();
        } else {
          selectData = this.$refs.grid.getRadioRecord();
        }

        if (isEmpty(selectData)) {
          if (!isEmpty(this.value)) {
            this.handleClose();
            return;
          }
          if (this.multiple) {
            selectData = [];
            label = '';
            this.selectRow = [];
          } else {
            selectData = undefined;
            label = '';
            this.selectRow = undefined;
          }
        } else {
          this.label = '';
          this.selectValue = [];
          this.selectRow = [];
          if (this.multiple) {
            label = selectData.map((item) => {
              return item[this.columnOption.label];
            });
            this.label = label.join('，');
            this.selectValue = selectData.map((item) => {
              return item[this.columnOption.value];
            });
            this.selectRow = selectData;
            selectData = selectData.map((item) => {
              return item[this.columnOption.value];
            });
          } else {
            this.selectRow = selectData;
            label = selectData[this.columnOption.label];
            this.label = label;
            selectData = selectData[this.columnOption.value];
            this.selectValue = [selectData];
          }
        }

        this.$emit('update:value', selectData, this.value);
        this.$emit('input-label', label);
        this.$emit('input-row', this.selectRow);
        this.handleClose();
      },
      handleClose() {
        this.dialogVisible = false;
      },
      // 列表发生查询时的事件
      search() {
        this.$refs.grid.commitProxy('reload');
      },
    },
  });
</script>
<style lang="less">
  .j-dialog-table--input {
    input {
      cursor: pointer;
    }
  }

  .j-dialog-table-selected-span {
    color: @danger-color;
    font-weight: bold;
  }
</style>
