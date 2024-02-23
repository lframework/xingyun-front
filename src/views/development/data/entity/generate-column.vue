<template>
  <div>
    <!-- 数据列表 -->
    <vxe-grid
      ref="grid"
      stripe
      resizable
      show-overflow
      highlight-hover-row
      keep-source
      row-id="id"
      :row-config="{ useKey: true, isCurrent: true, isHover: true }"
      :columns="tableColumn"
      :data="columns"
      :loading="loading"
      :max-height="600"
    >
      <!-- 数据类型 列自定义内容 -->
      <template #name_default="{ row }">
        <a-input v-model:value="row.name" />
      </template>

      <!-- 数据类型 列自定义内容 -->
      <template #dataType_default="{ row }">
        <a-select
          v-model:value="row.dataType"
          :disabled="row.viewType === $enums.GEN_VIEW_TYPE.DATA_DIC.code"
        >
          <a-select-option
            v-for="item in $enums.GEN_DATA_TYPE.values()"
            :key="item.code"
            :value="item.code"
            >{{ item.desc }}</a-select-option
          >
        </a-select>
      </template>

      <!-- 显示类型 列自定义内容 -->
      <template #viewType_header>
        <a-space>
          <span>显示类型</span>
          <a-tooltip
            title="表示前端使用的组件类型。注：当属性名是available并且显示类型是选择器时，会将该字段转换为内置的状态字段"
            ><QuestionCircleOutlined
          /></a-tooltip>
        </a-space>
      </template>

      <!-- 显示类型 列自定义内容 -->
      <template #viewType_default="{ row }">
        <a-select
          v-model:value="row.viewType"
          :disabled="row.isKey || row.fixEnum"
          @change="(e) => changeViewType(row, e)"
        >
          <a-select-option
            v-for="item in $enums.GEN_VIEW_TYPE.values()"
            :key="item.code"
            :value="item.code"
            >{{ item.desc }}</a-select-option
          >
        </a-select>
      </template>

      <!-- 显示类型配置 列自定义内容 -->
      <template #viewTypeConfig_default="{ row }">
        <sys-data-dic-selector
          v-if="row.viewType === $enums.GEN_VIEW_TYPE.DATA_DIC.code"
          v-model:value="row.dataDicId"
          :request-params="{ available: true }"
        />
        <gen-custom-selector-selector
          v-else-if="row.viewType === $enums.GEN_VIEW_TYPE.CUSTOM_SELECTOR.code"
          v-model:value="row.customSelectorId"
          :request-params="{ available: true }"
        />
      </template>

      <!-- 是否内置枚举 列自定义内容 -->
      <template #fixEnum_default="{ row }">
        <a-select
          v-model:value="row.fixEnum"
          :disabled="row.isKey"
          @change="(e) => changeFixEnum(row, e)"
        >
          <a-select-option :value="true">是</a-select-option>
          <a-select-option :value="false">否</a-select-option>
        </a-select>
      </template>

      <!-- 后端枚举名 列自定义内容 -->
      <template #enumBack_header>
        <a-space>
          <span>后端枚举名</span>
          <a-tooltip title="填写后端枚举类的全名称，如：com.lframework.xingyun.enums.BizType"
            ><QuestionCircleOutlined
          /></a-tooltip>
        </a-space>
      </template>

      <!-- 后端枚举名 列自定义内容 -->
      <template #enumBack_default="{ row }">
        <a-input v-if="row.fixEnum" v-model:value="row.enumBack" />
      </template>

      <!-- 前端枚举名 列自定义内容 -->
      <template #enumFront_header>
        <a-space>
          <span>前端枚举名</span>
          <a-tooltip title="填写前端枚举的全名称，如：BIZ_TYPE"
            ><QuestionCircleOutlined
          /></a-tooltip>
        </a-space>
      </template>

      <!-- 前端枚举名 列自定义内容 -->
      <template #enumFront_default="{ row }">
        <a-input v-if="row.fixEnum" v-model:value="row.enumFront" />
      </template>

      <!-- 备注 列自定义内容 -->
      <template #description_default="{ row }">
        <a-input v-model:value="row.description" />
      </template>

      <!-- 正则表达式 列自定义内容 -->
      <template #regularExpression_header>
        <a-space>
          <span>正则表达式</span>
          <a-tooltip title="填写正则表达式，如：^[0-9]*$"><QuestionCircleOutlined /></a-tooltip>
        </a-space>
      </template>

      <!-- 正则表达式 列自定义内容 -->
      <template #regularExpression_default="{ row }">
        <a-input-group v-if="!row.isKey" compact>
          <a-input
            v-model:value="row.regularExpression"
            style="width: 50%"
            :disabled="
              row.viewType !== $enums.GEN_VIEW_TYPE.INPUT.code &&
              row.viewType !== $enums.GEN_VIEW_TYPE.TEXTAREA.code
            "
          />
          <a-select
            placeholder="常用表达式"
            allow-clear
            style="width: 50%"
            :disabled="
              row.viewType !== $enums.GEN_VIEW_TYPE.INPUT.code &&
              row.viewType !== $enums.GEN_VIEW_TYPE.TEXTAREA.code
            "
            @change="(e) => (row.regularExpression = e)"
          >
            <a-select-option value="[\u4e00-\u9fa5]">中文字符</a-select-option>
            <a-select-option value="[^\x00-\xff]">双字节字符(包括汉字在内)</a-select-option>
            <a-select-option value="\n\s*\r">空白行</a-select-option>
            <a-select-option
              value="[\w!#$%&'*+/=?^_`{|}~-]+(?:\.[\w!#$%&'*+/=?^_`{|}~-]+)*@(?:[\w](?:[\w-]*[\w])?\.)+[\w](?:[\w-]*[\w])?"
            >
              Email地址
            </a-select-option>
            <a-select-option value="[a-zA-z]+://[^\s]*">网址URL</a-select-option>
            <a-select-option value="\d{3}-\d{8}|\d{4}-\{7,8}">国内电话号码</a-select-option>
            <a-select-option value="[1-9][0-9]{4,}">腾讯QQ号</a-select-option>
            <a-select-option value="[1-9]\d{5}(?!\d)">中国邮政编码</a-select-option>
            <a-select-option value="^(\d{6})(\d{4})(\d{2})(\d{2})(\d{3})([0-9]|X)$"
              >18位身份证号</a-select-option
            >
            <a-select-option
              value="([0-9]{3}[1-9]|[0-9]{2}[1-9][0-9]{1}|[0-9]{1}[1-9][0-9]{2}|[1-9][0-9]{3})-(((0[13578]|1[02])-(0[1-9]|[12][0-9]|3[01]))|((0[469]|11)-(0[1-9]|[12][0-9]|30))|(02-(0[1-9]|[1][0-9]|2[0-8])))"
            >
              (年-月-日)格式日期
            </a-select-option>
            <a-select-option value="^[1-9]\d*$">正整数</a-select-option>
            <a-select-option value="^-[1-9]\d*$">负整数</a-select-option>
            <a-select-option value="^-?[1-9]\d*$">整数</a-select-option>
            <a-select-option value="^[1-9]\d*|0$">非负整数</a-select-option>
            <a-select-option value="^-[1-9]\d*|0$">非正整数</a-select-option>
            <a-select-option value="^[1-9]\d*\.\d*|0\.\d*[1-9]\d*$">正浮点数</a-select-option>
            <a-select-option value="^-[1-9]\d*\.\d*|-0\.\d*[1-9]\d*$">负浮点数</a-select-option>
          </a-select>
        </a-input-group>
      </template>

      <!-- 是否排序字段 列自定义内容 -->
      <template #isOrder_default="{ row }">
        <a-select v-model:value="row.isOrder" @change="(e) => changeIsOrder(row, e)">
          <a-select-option :value="true">是</a-select-option>
          <a-select-option :value="false">否</a-select-option>
        </a-select>
      </template>

      <!-- 排序类型 列自定义内容 -->
      <template #orderType_default="{ row }">
        <a-select v-if="row.isOrder" v-model:value="row.orderType">
          <a-select-option
            v-for="item in $enums.GEN_ORDER_TYPE.values()"
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

      <!-- 字段长度 列自定义内容 -->
      <template #fieldLength_default="{ row }">
        <div
          v-if="
            !row.isKey &&
            ($enums.GEN_VIEW_TYPE.INPUT.equalsCode(row.viewType) ||
              $enums.GEN_VIEW_TYPE.TEXTAREA.equalsCode(row.viewType))
          "
        >
          <a-input
            v-if="
              $enums.GEN_DATA_TYPE.STRING.equalsCode(row.dataType) ||
              $enums.GEN_DATA_TYPE.isNumberType(row.dataType)
            "
            v-model:value="row.len"
            class="number-input"
            style="width: 70px"
          />
          <span v-if="$enums.GEN_DATA_TYPE.isDecimalType(row.dataType)" style="margin: 0 5px"
            >.</span
          >
          <a-input
            v-if="$enums.GEN_DATA_TYPE.isDecimalType(row.dataType)"
            v-model:value="row.decimals"
            class="number-input"
            style="width: 70px"
          />
        </div>
      </template>
    </vxe-grid>
  </div>
</template>
<script>
  import { defineComponent } from 'vue';
  import Sortable from 'sortablejs';
  import { QuestionCircleOutlined, DragOutlined } from '@ant-design/icons-vue';

  export default defineComponent({
    // 使用组件
    components: {
      QuestionCircleOutlined,
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
        tableColumn: [
          { field: 'orderNo', title: '排序', width: 50, slots: { default: 'orderNo_default' } },
          { field: 'name', title: '显示名称', width: 160, slots: { default: 'name_default' } },
          { field: 'columnName', title: '属性名', width: 120 },
          {
            field: 'isKey',
            title: '是否主键',
            width: 80,
            formatter: ({ cellValue }) => {
              return cellValue ? '是' : '否';
            },
          },
          {
            field: 'dataType',
            title: '数据类型',
            width: 180,
            slots: { default: 'dataType_default' },
          },
          {
            field: 'fieldLength',
            title: '字段长度',
            width: 180,
            slots: { default: 'fieldLength_default' },
          },
          {
            field: 'viewType',
            title: '显示类型',
            width: 180,
            slots: { default: 'viewType_default', header: 'viewType_header' },
          },
          {
            field: 'viewTypeConfig',
            title: '显示类型配置',
            width: 180,
            slots: { default: 'viewTypeConfig_default' },
          },
          {
            field: 'fixEnum',
            title: '是否内置枚举',
            width: 120,
            slots: { default: 'fixEnum_default' },
          },
          {
            field: 'enumBack',
            title: '后端枚举名',
            width: 180,
            slots: { default: 'enumBack_default', header: 'enumBack_header' },
          },
          {
            field: 'enumFront',
            title: '前端枚举名',
            width: 180,
            slots: { default: 'enumFront_default', header: 'enumFront_header' },
          },
          {
            field: 'regularExpression',
            title: '正则表达式',
            width: 300,
            slots: { default: 'regularExpression_default', header: 'regularExpression_header' },
          },
          {
            field: 'isOrder',
            title: '是否排序字段',
            width: 120,
            slots: { default: 'isOrder_default' },
          },
          {
            field: 'orderType',
            title: '排序类型',
            width: 120,
            slots: { default: 'orderType_default' },
          },
          {
            field: 'description',
            title: '备注',
            width: 200,
            slots: { default: 'description_default' },
          },
        ],
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
        if (this.$utils.isEmpty(this.columns)) {
          this.$msg.createError('字段信息不能为空！');
          return false;
        }
        for (let i = 0; i < this.columns.length; i++) {
          const column = this.columns[i];

          if (this.$utils.isEmpty(column.name)) {
            this.$msg.createError('第' + (i + 1) + '行字段显示名称不能为空！');
            return false;
          }

          if (this.$utils.isEmpty(column.dataType)) {
            this.$msg.createError('字段【' + column.name + '】数据类型不能为空！');
            return false;
          }

          if (this.$utils.isEmpty(column.viewType)) {
            this.$msg.createError('字段【' + column.name + '】显示类型不能为空！');
            return false;
          }

          if (this.$utils.isEmpty(column.fixEnum)) {
            this.$msg.createError('字段【' + column.name + '】是否内置枚举不能为空！');
            return false;
          }

          if (this.$utils.isEmpty(column.columnOrder)) {
            this.$msg.createError('字段【' + column.name + '】字段排序不能为空！');
            return false;
          }

          if (column.fixEnum) {
            if (this.$utils.isEmpty(column.enumBack)) {
              this.$msg.createError('字段【' + column.name + '】后端枚举名不能为空！');
              return false;
            }

            if (this.$utils.isEmpty(column.enumFront)) {
              this.$msg.createError('字段【' + column.name + '】前端枚举名不能为空！');
              return false;
            }
          }

          if (this.$utils.isEmpty(column.isOrder)) {
            this.$msg.createError('字段【' + column.name + '】是否排序字段不能为空！');
            return false;
          }

          if (column.isOrder) {
            if (this.$utils.isEmpty(column.orderType)) {
              this.$msg.createError('字段【' + column.name + '】排序类型不能为空！');
              return false;
            }
          }

          if (!this.$utils.isEmpty(column.len)) {
            if (!this.$utils.isIntegerGtZero(column.len)) {
              this.$msg.createError('字段【' + column.name + '】长度的整数部分必须是大于0的整数！');
              return false;
            }
          }

          if (!this.$utils.isEmpty(column.decimals)) {
            if (!this.$utils.isIntegerGeZero(column.decimals)) {
              this.$msg.createError('字段【' + column.name + '】长度的小数部分必须是不小于0整数！');
              return false;
            }
          }

          if (this.$enums.GEN_VIEW_TYPE.DATA_DIC.equalsCode(column.viewType)) {
            if (this.$utils.isEmpty(column.dataDicId)) {
              this.$msg.createError('字段【' + column.name + '】数据字典不能为空！');
              return false;
            }
          }

          if (this.$enums.GEN_VIEW_TYPE.CUSTOM_SELECTOR.equalsCode(column.viewType)) {
            if (this.$utils.isEmpty(column.customSelectorId)) {
              this.$msg.createError('字段【' + column.name + '】自定义选择器不能为空！');
              return false;
            }
          }
        }

        return true;
      },
      changeFixEnum(row, val) {
        if (val) {
          // 是内置枚举
          // viewType必须是SELECT
          row.viewType = this.$enums.GEN_VIEW_TYPE.SELECT.code;
          this.changeViewType(row, this.$enums.GEN_VIEW_TYPE.SELECT.code);
        } else {
          row.enumBack = '';
          row.enumFront = '';
        }
      },
      changeViewType(row, val) {
        if (
          val !== this.$enums.GEN_VIEW_TYPE.INPUT.code &&
          val !== this.$enums.GEN_VIEW_TYPE.TEXTAREA.code
        ) {
          // 如果viewType不是INPUT、TEAXTAREA，正则必须是空
          row.regularExpression = '';
        }

        if (val === this.$enums.GEN_VIEW_TYPE.DATA_DIC.code) {
          // 数据字典 类型必须是String
          row.dataType = this.$enums.GEN_DATA_TYPE.STRING.code;
        }
      },
      changeIsOrder(row, val) {
        if (!val) {
          row.orderType = '';
        }
      },
      rowDrop() {
        this.$nextTick(() => {
          const grid = this.$refs.grid;
          this.sortable = Sortable.create(
            grid.$el.querySelector('.body--wrapper>.vxe-table--body tbody'),
            {
              handle: '.sort-btn',
              onEnd: ({ newIndex, oldIndex }) => {
                const currRow = this.columns.splice(oldIndex, 1)[0];
                this.columns.splice(newIndex, 0, currRow);
              },
            },
          );
        });
      },
      getColumns() {
        const that = this;
        const columns = this.columns.map((item) => {
          const column = Object.assign({}, item);
          if (column.isKey) {
            // 如果是主键
            delete column.len;
            delete column.decimals;
            column.viewType = this.$enums.GEN_VIEW_TYPE.INPUT.code;
            column.dataDicId = '';
            column.customSelectorId = '';
            column.fixEnum = false;
            delete column.enumBack;
            delete column.enumFront;
            delete column.regularExpression;
          } else {
            if (!that.$enums.GEN_DATA_TYPE.isDecimalType(column.dataType)) {
              delete column.decimals;
            }
            if (
              !that.$enums.GEN_DATA_TYPE.STRING.equalsCode(column.dataType) &&
              !that.$enums.GEN_DATA_TYPE.isNumberType(column.dataType)
            ) {
              delete column.len;
              delete column.decimals;
            }

            if (!that.$enums.GEN_VIEW_TYPE.DATA_DIC.equalsCode(column.viewType)) {
              column.dataDicId = '';
            }

            if (!that.$enums.GEN_VIEW_TYPE.CUSTOM_SELECTOR.equalsCode(column.viewType)) {
              column.customSelectorId = '';
            }

            if (
              !that.$enums.GEN_VIEW_TYPE.INPUT.equalsCode(column.viewType) &&
              !that.$enums.GEN_VIEW_TYPE.TEXTAREA.equalsCode(column.viewType)
            ) {
              delete column.regularExpression;
              delete column.len;
              delete column.decimals;
            }

            if (!column.fixEnum) {
              delete column.enumBack;
              delete column.enumFront;
            }
          }

          return column;
        });

        return columns;
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
