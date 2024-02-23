<template>
  <div>
    <a-row>
      <a-col :span="4">
        <j-border class="mr-4">
          <a-tree
            ref="tree"
            v-model:checked-keys="checkedKeys"
            :tree-data="_columns"
            :checkable="true"
            node-key="id"
            :field-names="{
              children: 'children',
              title: 'name',
              key: 'id',
            }"
            @check="onCheckChange"
          />
        </j-border>
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
              return this.convertToColumn(row.id).name;
            },
          },
          {
            field: 'columnName',
            title: '属性名',
            width: 120,
            formatter: ({ cellValue, row }) => {
              return this.convertToColumn(row.id).columnName;
            },
          },
          {
            field: 'queryType',
            title: '查询类型',
            width: 140,
            slots: { default: 'queryType_default' },
          },
        ],
        tableData: [],
        checkedKeys: [],
      };
    },
    computed: {
      _columns() {
        return this.columns.filter((item) => !item.isKey);
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
          this.$msg.createError('查询功能参数必须配置');
          return false;
        }
        for (let i = 0; i < this.tableData.length; i++) {
          const column = this.tableData[i];
          if (this.$utils.isEmpty(column.queryType)) {
            this.$msg.createError('字段【' + column.name + '】查询类型不能为空');
            return false;
          }
        }
        return true;
      },
      emptyLine() {
        return {
          id: '',
          queryType: this.$enums.GEN_QUERY_TYPE.EQ.code,
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
                Object.assign(this.emptyLine(), { id: data.id, orderNo: data.columnOrder }),
              );
              tableData.sort((t1, t2) => {
                return t1.orderNo - t2.orderNo;
              });
            });

          this.tableData = tableData;
        } else {
          this.tableData = tableData.filter((item) => checkedKeys.includes(item.id));
        }
      },
      convertToColumn(id) {
        return this.columns.filter((item) => item.id === id)[0];
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
    },
  });
</script>

<style scoped>
  .sort-btn {
    margin: 0 5px;
    cursor: pointer;
  }
</style>
