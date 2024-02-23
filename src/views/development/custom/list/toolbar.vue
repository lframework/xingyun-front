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
      :row-config="{ useKey: true }"
      :toolbar-config="toolbarConfig"
      :columns="tableColumn"
      :data="tableData"
      :loading="loading"
      :max-height="600"
    >
      <!-- 工具栏 -->
      <template #toolbar_buttons>
        <a-space>
          <a-button type="primary" :icon="h(PlusOutlined)" @click="addRow">新增</a-button>
          <a-button danger :icon="h(DeleteOutlined)" @click="deleteRow">删除</a-button>
        </a-space>
      </template>

      <!-- 排序 列自定义内容 -->
      <template #orderNo_default>
        <span class="sort-btn"><DragOutlined /></span>
      </template>

      <!-- 名称 列自定义内容 -->
      <template #name_default="{ row }">
        <a-input v-model:value="row.name" />
      </template>

      <!-- 图标 列自定义内容 -->
      <template #icon_default="{ row }">
        <icon-picker v-model:value="row.icon" />
      </template>

      <!-- 显示类型 列自定义内容 -->
      <template #viewType_default="{ row }">
        <a-select v-model:value="row.viewType" placeholder="">
          <a-select-option
            v-for="item in $enums.GEN_CUSTOM_LIST_BTN_VIEW_TYPE.values()"
            :key="item.code"
            :value="item.code"
            >{{ item.desc }}</a-select-option
          >
        </a-select>
      </template>

      <!-- 按钮类型 列自定义内容 -->
      <template #btnType_default="{ row }">
        <a-select v-model:value="row.btnType" placeholder="">
          <a-select-option
            v-for="item in $enums.GEN_CUSTOM_LIST_BTN_TYPE.values()"
            :key="item.code"
            :value="item.code"
            >{{ item.desc }}</a-select-option
          >
        </a-select>
      </template>

      <!-- 按钮配置 列自定义内容 -->
      <template #btnConfig_default="{ row }">
        <a-input
          v-if="$enums.GEN_CUSTOM_LIST_BTN_TYPE.EXTERNAL.equalsCode(row.btnType)"
          v-model:value="row.btnConfig"
        />
        <a-input
          v-if="$enums.GEN_CUSTOM_LIST_BTN_TYPE.ROUTE.equalsCode(row.btnType)"
          v-model:value="row.btnConfig"
        />
        <a
          v-if="$enums.GEN_CUSTOM_LIST_BTN_TYPE.EXCUTE_SCRIPT.equalsCode(row.btnType)"
          @click="(e) => $refs['excuteScriptEditor' + row.id].openDialog()"
          >编辑脚本</a
        >
        <code-editor
          :ref="'excuteScriptEditor' + row.id"
          v-model:value="row.btnConfig"
          if="$enums.GEN_CUSTOM_LIST_BTN_TYPE.EXCUTE_SCRIPT.equalsCode(row.btnType)"
          mode="javascript"
          :description="`点击按钮后执行的JS代码，脚本会填充在function excute(_this){}中。`"
        />
      </template>

      <!-- 请求参数 列自定义内容 -->
      <template #requestParam_default="{ row }">
      </template>
    </vxe-grid>
  </div>
</template>
<script>
  import { h, defineComponent } from 'vue';
  import Sortable from 'sortablejs';
  import CodeEditor from './code-editor.vue';
  import {PlusOutlined, DeleteOutlined, DragOutlined} from "@ant-design/icons-vue";

  export default defineComponent({
    // 使用组件
    components: {
      CodeEditor,
    },
    props: {},
    setup() {
      return {
        h,
        PlusOutlined,
        DeleteOutlined,
      };
    },
    data() {
      return {
        // 是否显示加载框
        loading: false,
        // 工具栏配置
        toolbarConfig: {
          // 自定义左侧工具栏
          slots: {
            buttons: 'toolbar_buttons',
          },
        },
        tableColumn: [
          { type: 'checkbox', width: 50 },
          { field: 'orderNo', title: '排序', width: 50, slots: { default: 'orderNo_default' } },
          { field: 'name', title: '显示名称', width: 160, slots: { default: 'name_default' } },
          { field: 'icon', title: '图标', width: 200, slots: { default: 'icon_default' } },
          {
            field: 'viewType',
            title: '显示类型',
            width: 120,
            slots: { default: 'viewType_default' },
          },
          {
            field: 'btnType',
            title: '按钮类型',
            width: 140,
            slots: { default: 'btnType_default' },
          },
          {
            field: 'btnConfig',
            title: '按钮配置',
            width: 260,
            slots: { default: 'btnConfig_default' },
          },
          {
            field: 'requestParam',
            title: '请求参数',
            width: 120,
            slots: { default: 'requestParam_default' },
          },
        ],
        tableData: [],
      };
    },
    computed: {},
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
          if (this.$utils.isEmpty(column.name)) {
            this.$msg.createError('第' + (i + 1) + '行显示名称不能为空');
            return false;
          }
          if (this.$utils.isEmpty(column.viewType)) {
            this.$msg.createError('第' + (i + 1) + '行显示类型不能为空');
            return false;
          }
          if (this.$utils.isEmpty(column.btnType)) {
            this.$msg.createError('第' + (i + 1) + '行按钮类型不能为空');
            return false;
          }

          if (
            this.$enums.GEN_CUSTOM_LIST_BTN_TYPE.EXTERNAL.equalsCode(column.btnType) ||
            this.$enums.GEN_CUSTOM_LIST_BTN_TYPE.ROUTE.equalsCode(column.btnType) ||
            this.$enums.GEN_CUSTOM_LIST_BTN_TYPE.EXCUTE_SCRIPT.equalsCode(column.btnType)
          ) {
            if (this.$utils.isEmpty(column.btnConfig)) {
              this.$msg.createError('第' + (i + 1) + '行按钮配置不能为空');
              return false;
            }
          }
        }
        return true;
      },
      emptyLine() {
        return {
          id: this.$utils.uuid(),
          customForm: '',
          orderNo: '',
          name: '',
          viewType: '',
          btnType: '',
          btnConfig: '',
          requestParam: '',
        };
      },
      setTableData(datas) {
        this.tableData = datas || [];
      },
      getTableData() {
        const that = this;
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
      addRow() {
        this.tableData.push(this.emptyLine());
      },
      deleteRow() {
        const records = this.$refs.grid.getCheckboxRecords();

        if (this.$utils.isEmpty(records)) {
          this.$msg.createError('请选择要删除的行！');
          return;
        }

        this.$msg.createConfirm('是否确定删除选择的行？').then(() => {
          const ids = records.map((t) => t.id);
          this.tableData = this.tableData.filter((item) => !ids.includes(item.id));
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
