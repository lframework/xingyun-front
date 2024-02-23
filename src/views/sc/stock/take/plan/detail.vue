<template>
  <a-modal
    v-model:open="visible"
    :mask-closable="false"
    width="75%"
    title="查看"
    :style="{ top: '20px' }"
    :footer="null"
  >
    <div v-if="visible" v-permission="['stock:take:plan:query']" v-loading="loading">
      <j-border>
        <j-form>
          <j-form-item label="仓库">
            {{ formData.scName }}
          </j-form-item>
          <j-form-item label="盘点类别">
            {{ $enums.TAKE_STOCK_PLAN_TYPE.getDesc(formData.takeType) }}
          </j-form-item>
          <j-form-item label="盘点状态">
            {{ $enums.TAKE_STOCK_PLAN_STATUS.getDesc(formData.takeStatus) }}
          </j-form-item>
          <j-form-item label="备注" :span="24">
            <a-textarea v-model:value.trim="formData.description" readonly />
          </j-form-item>
          <j-form-item label="创建人">
            <span>{{ formData.createBy }}</span>
          </j-form-item>
          <j-form-item label="创建时间" :span="16">
            <span>{{ formData.createTime }}</span>
          </j-form-item>
          <j-form-item label="操作人">
            <span>{{ formData.updateBy }}</span>
          </j-form-item>
          <j-form-item label="操作时间" :span="16">
            <span>{{ formData.updateTime }}</span>
          </j-form-item>
        </j-form>
      </j-border>

      <!-- 数据列表 -->
      <vxe-grid
        ref="grid"
        resizable
        show-overflow
        highlight-hover-row
        keep-source
        row-id="id"
        height="500"
        :data="tableData"
        :columns="tableColumn"
        :toolbar-config="toolbarConfig"
      >
        <!-- 工具栏 -->
        <template #toolbar_buttons>
          <a-form layout="inline">
            <a-form-item label="筛选数据">
              <a-checkbox-group v-model:value="checkedFilterType" @change="changeFilterType">
                <a-checkbox v-for="item in filterType" :key="item.code" :value="item.code">{{
                  item.desc
                }}</a-checkbox>
              </a-checkbox-group>
            </a-form-item>
          </a-form>
        </template>
      </vxe-grid>
    </div>
  </a-modal>
</template>
<script>
  import { defineComponent } from 'vue';
  import * as constants from './constants';
  import * as api from '@/api/sc/stock/take/plan';

  export default defineComponent({
    // 使用组件
    components: {},
    props: {
      id: {
        type: String,
        required: true,
      },
    },
    data() {
      return {
        // 是否可见
        visible: false,
        // 是否显示加载框
        loading: false,
        // 表单数据
        formData: {},
        // 工具栏配置
        toolbarConfig: {
          // 缩放
          zoom: false,
          // 自定义表头
          custom: false,
          // 右侧是否显示刷新按钮
          refresh: false,
          // 自定义左侧工具栏
          slots: {
            buttons: 'toolbar_buttons',
          },
        },
        // 列表数据配置
        tableColumn: [
          { field: 'productCode', title: '商品编号', width: 120 },
          { field: 'productName', title: '商品名称', width: 260 },
          { field: 'skuCode', title: '商品SKU编号', width: 120 },
          { field: 'externalCode', title: '商品外部编号', width: 120 },
          { field: 'unit', title: '单位', width: 80 },
          { field: 'spec', title: '规格', width: 80 },
          { field: 'categoryName', title: '商品类目', width: 120 },
          { field: 'brandName', title: '商品品牌', width: 120 },
          { field: 'stockNum', title: '系统库存数量', width: 120, align: 'right' },
          { field: 'oriTakeNum', title: '盘点数量', width: 120, align: 'right' },
          { field: 'takeNum', title: '修改后盘点数量', width: 120, align: 'right' },
          { field: 'totalOutNum', title: '出项数量', width: 120, align: 'right' },
          { field: 'totalInNum', title: '进项数量', width: 120, align: 'right' },
          { field: 'diffNum', title: '盘点差异数量', width: 120, align: 'right' },
          { field: 'description', title: '备注', width: 200 },
        ],
        tableData: [],
        oriTableData: [],
        checkedFilterType: [],
      };
    },
    computed: {
      filterType() {
        return constants.filterType;
      },
    },
    created() {
      this.initFormData();
    },
    methods: {
      // 打开对话框 由父页面触发
      openDialog() {
        this.visible = true;

        this.$nextTick(() => this.open());
      },
      // 关闭对话框
      closeDialog() {
        this.visible = false;
        this.$emit('close');
      },
      // 初始化表单数据
      initFormData() {
        this.formData = {
          scName: '',
          takeType: '',
          takeStatus: '',
          description: '',
          createBy: '',
          createTime: '',
          updateBy: '',
          updateTime: '',
        };

        this.checkedFilterType = this.$utils
          .keys(this.filterType)
          .map((item) => this.filterType[item].code);

        this.tableData = [];
        this.oriTableData = [];
      },
      // 页面显示时触发
      open() {
        // 初始化数据
        this.initFormData();

        // 查询数据
        this.loadFormData();
      },
      // 查询数据
      loadFormData() {
        this.loading = true;
        api
          .getDetail(this.id)
          .then((data) => {
            this.formData = data;
            this.tableData = data.details;
            this.oriTableData = this.tableData;
          })
          .finally(() => {
            this.loading = false;
          });
      },
      changeFilterType() {
        this.tableData = this.oriTableData;
        this.tableData = this.tableData.filter((item) => {
          if (this.checkedFilterType.includes(this.filterType.LOSS.code)) {
            if (item.diffNum < 0) {
              return true;
            }
          }

          if (this.checkedFilterType.includes(this.filterType.OVERFLOW.code)) {
            if (item.diffNum > 0) {
              return true;
            }
          }

          if (this.checkedFilterType.includes(this.filterType.NONE.code)) {
            if (item.diffNum === 0 || this.$utils.isEmpty(item.diffNum)) {
              return true;
            }
          }

          return false;
        });
      },
    },
  });
</script>
