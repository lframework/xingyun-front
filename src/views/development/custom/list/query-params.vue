<template>
  <div>
    <a-row>
      <a-col :span="4">
        <a-tree
          ref="tree"
          v-model:checked-keys="checkedKeys"
          :tree-data="columns"
          :checkable="true"
          node-key="id"
          :replace-fields="{
            children: 'columns',
            title: 'name',
            key: 'id',
          }"
          @check="onCheckChange"
        />
      </a-col>
      <a-col :span="20">
        <!-- 数据列表 -->
        <vxe-grid
          ref="grid"
          resizable
          show-overflow
          highlight-hover-row
          keep-source
          row-id="id"
          :row-config="{ useKey: true }"
          :columns="tableColumn"
          :data="tableData"
          :loading="loading"
          :max-height="600"
        >
          <!-- 前端显示 列自定义内容 -->
          <template #frontShow_default="{ row }">
            <a-select v-model:value="row.frontShow">
              <a-select-option :value="true">是</a-select-option>
              <a-select-option :value="false">否</a-select-option>
            </a-select>
          </template>

          <!-- 查询类型 列自定义内容 -->
          <template #queryType_default="{ row }">
            <a-select v-model:value="row.queryType">
              <a-select-option
                v-for="item in $enums.GEN_QUERY_TYPE.values()"
                :key="item.code"
                :value="item.code"
                >{{ item.desc }}</a-select-option
              >
            </a-select>
          </template>

          <!-- 表单宽度 列自定义内容 -->
          <template #formWidth_default="{ row }">
            <a-input-number
              v-model:value="row.formWidth"
              class="number-input"
              :min="1"
              :max="24"
              :precision="0"
            />
          </template>

          <!-- 默认值 列自定义内容 -->
          <template #defaultValue_default="{ row }">
            <a-input
              v-if="!$enums.GEN_VIEW_TYPE.DATE_RANGE.equalsCode(row.viewType)"
              v-model:value="row.defaultValue"
              allow-clear
            />
            <div v-else>
              <a-space>
                <a-select v-model:value="row.defaultValue.dateType" style="width: 100px">
                  <a-select-option :value="1">相对时间</a-select-option>
                  <a-select-option :value="2">绝对时间</a-select-option>
                </a-select>
                <div v-if="row.defaultValue.dateType === 1">
                  <a-space>
                    <span>近</span>
                    <a-input-number
                      v-model:value="row.defaultValue.dateNum"
                      :min="0"
                      :precision="0"
                    />
                    <a-select v-model:value="row.defaultValue.dateUnit" style="width: 50px">
                      <a-select-option value="d">天</a-select-option>
                      <a-select-option value="w">周</a-select-option>
                      <a-select-option value="M">月</a-select-option>
                      <a-select-option value="y">年</a-select-option>
                    </a-select>
                  </a-space>
                </div>
                <div v-else-if="row.defaultValue.dateType === 2">
                  <a-range-picker
                    v-model:value="row.defaultValue.dateRange"
                    value-format="YYYY-MM-DD"
                  />
                </div>
              </a-space>
            </div>
          </template>

          <!-- 排序 列自定义内容 -->
          <template #orderNo_default>
            <span class="sort-btn"><DragOutlined /></span>
          </template>
        </vxe-grid>
      </a-col>
    </a-row>
  </div>
</template>
<script>
  import { defineComponent } from 'vue';
  import Sortable from 'sortablejs';
  import { DragOutlined } from '@ant-design/icons-vue';

  export default defineComponent({
    // 使用组件
    components: {
      DragOutlined,
    },

    props: {
      columns: {
        type: Array,
        required: true,
      },
    },
    data() {
      return {
        // 是否显示加载框
        loading: false,
        defaultProps: {
          label: 'name',
        },
        tableColumn: [
          { field: 'orderNo', title: '排序', width: 50, slots: { default: 'orderNo_default' } },
          {
            field: 'name',
            title: '显示名称',
            width: 160,
            formatter: ({ cellValue, row }) => {
              return this.convertToColumn(row.id)?.name;
            },
          },
          {
            field: 'frontShow',
            title: '前端显示',
            width: 140,
            slots: { default: 'frontShow_default' },
          },
          {
            field: 'queryType',
            title: '查询类型',
            width: 140,
            slots: { default: 'queryType_default' },
          },
          {
            field: 'formWidth',
            title: '表单宽度',
            align: 'right',
            width: 100,
            slots: { default: 'formWidth_default' },
          },
          {
            field: 'defaultValue',
            title: '默认值',
            width: 350,
            slots: { default: 'defaultValue_default' },
          },
        ],
        tableData: [],
        checkedKeys: [],
      };
    },
    computed: {
      _columns() {
        const columns = [];
        this.columns
          .map((item) => (this.$utils.isEmpty(item.columns) ? [] : item.columns))
          .forEach((item) => {
            columns.push(...item);
          });

        return columns;
      },
    },
    created() {
      this.rowDrop();
    },
    beforeUnmount() {
      if (this.sortable) {
        this.sortable.destroy();
      }
    },
    methods: {
      validDate() {
        if (this.$utils.isEmpty(this.tableData)) {
          return true;
        }
        for (let i = 0; i < this.tableData.length; i++) {
          const column = this.tableData[i];
          column.name = this.convertToColumn(column.id)?.name;
          if (this.$utils.isEmpty(column.queryType)) {
            this.$msg.createError('字段【' + column.name + '】查询类型不能为空');
            return false;
          }
          if (this.$utils.isEmpty(column.frontShow)) {
            this.$msg.createError('字段【' + column.name + '】前端显示不能为空');
            return false;
          }

          if (this.$enums.GEN_VIEW_TYPE.DATE_RANGE.equalsCode(column.viewType)) {
            if (!this.$utils.isEmpty(column.defaultValue)) {
              if (this.$utils.isEmpty(column.defaultValue.dateType)) {
                this.$msg.createError('字段【' + column.name + '】默认值请选择日期类型');
                return false;
              }
              if (column.defaultValue.dateType === 1) {
                if (this.$utils.isEmpty(column.defaultValue.dateNum)) {
                  this.$msg.createError('字段【' + column.name + '】默认值天数不能为空');
                  return false;
                }
                if (!this.$utils.isIntegerGeZero(column.defaultValue.dateNum)) {
                  this.$msg.createError(
                    '字段【' + column.name + '】默认值天数必须为大于或等于0的整数',
                  );
                  return false;
                }
                if (this.$utils.isEmpty(column.defaultValue.dateUnit)) {
                  this.$msg.createError('字段【' + column.name + '】默认值日期单位不能为空');
                  return false;
                }
              } else if (column.defaultValue.dateType === 2) {
                if (this.$utils.isEmpty(column.defaultValue.dateRange)) {
                  this.$msg.createError('字段【' + column.name + '】默认值日期范围不能为空');
                  return false;
                }
              }
            }
          }
        }
        return true;
      },
      emptyLine() {
        return {
          id: '',
          queryType: this.$enums.GEN_QUERY_TYPE.EQ.code,
          frontShow: true,
          formWidth: 6,
          orderNo: '',
        };
      },
      onCheckChange(checkedKeys, { checked, checkedNodes, node, event }) {
        const tableData = this.tableData;
        const tableKeys = tableData.map((item) => item.id);
        if (checked) {
          checkedKeys
            .filter((item) => !tableKeys.includes(item))
            .forEach((item) => {
              const data = this._columns.filter((c) => c.id === item)[0];
              tableData.push(
                Object.assign(this.emptyLine(), {
                  id: data.id,
                  type: data.type,
                  relaId: data.relaId,
                  viewType: data.viewType,
                  defaultValue: this.$enums.GEN_VIEW_TYPE.DATE_RANGE.equalsCode(data.viewType)
                    ? {}
                    : '',
                }),
              );
            });

          this.tableData = tableData;
        } else {
          this.tableData = tableData.filter((item) => checkedKeys.includes(item.id));
        }
      },
      convertToColumn(id) {
        return this._columns.filter((item) => item.id === id)[0];
      },
      setTableData(datas) {
        this.tableData = datas || [];
        this.tableData
          .filter((item) => {
            return this.$enums.GEN_VIEW_TYPE.DATE_RANGE.equalsCode(item.viewType);
          })
          .forEach((item) => {
            if (this.$utils.isEmpty(item.defaultValue)) {
              item.defaultValue = {};
            } else {
              item.defaultValue = JSON.parse(item.defaultValue);
            }
          });
        this.checkedKeys = this.tableData.map((item) => item.id);
      },
      getTableData() {
        const tableData = this.tableData.map((item) => {
          if (this.$enums.GEN_VIEW_TYPE.DATE_RANGE.equalsCode(item.viewType)) {
            return Object.assign({}, item, {
              defaultValue: this.$utils.isEmpty(item.defaultValue)
                ? ''
                : JSON.stringify(item.defaultValue),
            });
          } else {
            return Object.assign({}, item);
          }
        });
        return tableData;
      },
      rowDrop() {
        this.$nextTick(() => {
          const grid = this.$refs.grid;
          this.sortable = Sortable.create(
            grid.$el.querySelector('.body--wrapper>.vxe-table--body tbody'),
            {
              handle: '.sort-btn',
              onEnd: ({ newIndex, oldIndex }) => {
                const currRow = this.tableData.splice(oldIndex, 1)[0];
                this.tableData.splice(newIndex, 0, currRow);
              },
            },
          );
        });
      },
    },
  });
</script>

<style scoped>
  .sort-btn {
    margin: 0 5px;
    cursor: pointer;
  }
</style>
