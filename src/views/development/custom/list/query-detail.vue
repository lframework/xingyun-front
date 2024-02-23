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
          <!-- 宽度类型 列自定义内容 -->
          <template #widthType_default="{ row }">
            <a-select v-model:value="row.widthType" placeholder="">
              <a-select-option
                v-for="item in $enums.GEN_QUERY_WIDTH_TYPE.values()"
                :key="item.code"
                :value="item.code"
                >{{ item.desc }}</a-select-option
              >
            </a-select>
          </template>

          <!-- 宽度 列自定义内容 -->
          <template #width_default="{ row }">
            <a-input v-model:value="row.width" class="number-input" />
          </template>

          <!-- 是否页面排序 列自定义内容 -->
          <template #sortable_default="{ row }">
            <a-select v-model:value="row.sortable" placeholder="">
              <a-select-option :value="true">是</a-select-option>
              <a-select-option :value="false">否</a-select-option>
            </a-select>
          </template>

          <!-- 排序 列自定义内容 -->
          <template #orderNo_default>
            <span class="sort-btn"><DragOutlined /></span>
          </template>

          <!-- 自定义格式化 列自定义内容 -->
          <template #formatter_default="{ row }">
            <a @click="(e) => onFormatterClick(row)">编辑脚本</a>
            <code-editor
              :ref="'formatterEditor' + row.id"
              v-model:value="row.formatter"
              mode="javascript"
              :description="`用于格式化显示的数据，脚本会填充在function formatter(cellValue, row){}中。注：返回值即为显示的数据。`"
            />
          </template>
        </vxe-grid>
      </a-col>
    </a-row>
  </div>
</template>
<script>
  import { defineComponent } from 'vue';
  import Sortable from 'sortablejs';
  import CodeEditor from './code-editor.vue';
  import { DragOutlined } from '@ant-design/icons-vue';

  export default defineComponent({
    // 使用组件
    components: {
      CodeEditor,
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
            field: 'widthType',
            title: '宽度类型',
            width: 140,
            slots: { default: 'widthType_default' },
          },
          {
            field: 'width',
            title: '宽度',
            width: 100,
            slots: { default: 'width_default' },
            align: 'right',
          },
          {
            field: 'sortable',
            title: '是否页面排序',
            width: 140,
            slots: { default: 'sortable_default' },
          },
          {
            field: 'formatter',
            title: '自定义格式化',
            width: 140,
            slots: { default: 'formatter_default' },
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
          this.$msg.createError('列表配置不能为空');
          return false;
        }

        for (let i = 0; i < this.tableData.length; i++) {
          const column = this.tableData[i];
          if (this.$utils.isEmpty(column.widthType)) {
            this.$msg.createError('字段【' + column.name + '】宽度类型不能为空');
            return false;
          }

          if (this.$utils.isEmpty(column.width)) {
            this.$msg.createError('字段【' + column.name + '】宽度不能为空');
            return false;
          }

          if (this.$utils.isEmpty(column.sortable)) {
            this.$msg.createError('字段【' + column.name + '】是否页面排序不能为空');
            return false;
          }

          if (!this.$utils.isIntegerGtZero(column.width)) {
            this.$msg.createError('字段【' + column.name + '】宽度必须是整数并且大于0');
            return false;
          }
        }
        return true;
      },
      emptyLine() {
        return {
          id: '',
          widthType: this.$enums.GEN_QUERY_WIDTH_TYPE.FIX.code,
          width: 100,
          sortable: false,
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
        this.checkedKeys = this.tableData.map((item) => item.id);
      },
      getTableData() {
        return this.tableData;
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
      onFormatterClick(row) {
        this.$refs['formatterEditor' + row.id].openDialog();
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
