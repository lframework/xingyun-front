<template>
  <a-modal
    v-model:open="visible"
    :mask-closable="false"
    width="75%"
    title="查看"
    :style="{ top: '20px' }"
    :footer="null"
  >
    <div v-if="visible" v-permission="['stock:take:pre:query']" v-loading="loading">
      <j-border>
        <j-form>
          <j-form-item label="仓库">
            {{ formData.scName }}
          </j-form-item>
          <j-form-item label="预先盘点状态" :span="16">
            <a-checkbox-group v-model:value="checkedStatus">
              <a-checkbox :value="$enums.PRE_TAKE_STOCK_SHEET_STATUS.FIRST_TAKE.code" disabled>{{
                $enums.PRE_TAKE_STOCK_SHEET_STATUS.FIRST_TAKE.desc
              }}</a-checkbox>
              <a-checkbox :value="$enums.PRE_TAKE_STOCK_SHEET_STATUS.SECOND_TAKE.code" disabled>{{
                $enums.PRE_TAKE_STOCK_SHEET_STATUS.SECOND_TAKE.desc
              }}</a-checkbox>
              <a-checkbox :value="$enums.PRE_TAKE_STOCK_SHEET_STATUS.RAND_TAKE.code" disabled>{{
                $enums.PRE_TAKE_STOCK_SHEET_STATUS.RAND_TAKE.desc
              }}</a-checkbox>
            </a-checkbox-group>
          </j-form-item>
          <j-form-item label="备注" :span="24">
            <a-textarea v-model:value.trim="formData.description" readonly />
          </j-form-item>
          <j-form-item label="操作人">
            <span>{{ formData.updateBy }}</span>
          </j-form-item>
          <j-form-item label="操作时间">
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
      >
        <!-- 复盘初盘差异数量 列自定义内容 -->
        <template #secondDiffNum_default="{ row }">
          <span
            v-if="
              formData.takeStatus === $enums.PRE_TAKE_STOCK_SHEET_STATUS.SECOND_TAKE.code ||
              formData.takeStatus === $enums.PRE_TAKE_STOCK_SHEET_STATUS.RAND_TAKE.code
            "
            >{{
              $utils.sub(
                $utils.isInteger(row.secondNum) ? row.secondNum : 0,
                $utils.isInteger(row.firstNum) ? row.firstNum : 0,
              )
            }}</span
          >
        </template>

        <!-- 抽盘复盘差异数量 列自定义内容 -->
        <template #randDiffNum_default="{ row }">
          <span v-if="formData.takeStatus === $enums.PRE_TAKE_STOCK_SHEET_STATUS.RAND_TAKE.code">{{
            $utils.sub(
              $utils.isInteger(row.randNum) ? row.randNum : 0,
              $utils.isInteger(row.secondNum) ? row.secondNum : 0,
            )
          }}</span>
        </template>
      </vxe-grid>
    </div>
  </a-modal>
</template>
<script>
  import { defineComponent } from 'vue';
  import * as api from '@/api/sc/stock/take/pre';

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
        // 列表数据配置
        tableColumn: [
          { type: 'seq', width: 50 },
          { field: 'productCode', title: '商品编号', width: 120 },
          { field: 'productName', title: '商品名称', width: 260 },
          { field: 'skuCode', title: '商品SKU编号', width: 120 },
          { field: 'externalCode', title: '商品外部编号', width: 120 },
          { field: 'unit', title: '单位', width: 80 },
          { field: 'spec', title: '规格', width: 80 },
          { field: 'categoryName', title: '商品类目', width: 120 },
          { field: 'brandName', title: '商品品牌', width: 120 },
          { field: 'firstNum', title: '初盘数量', width: 120, align: 'right' },
          { field: 'secondNum', title: '复盘数量', width: 120, align: 'right' },
          { field: 'randNum', title: '抽盘数量', width: 120, align: 'right' },
          {
            field: 'secondDiffNum',
            title: '复盘初盘差异数量',
            width: 140,
            slots: { default: 'secondDiffNum_default' },
            align: 'right',
          },
          {
            field: 'randDiffNum',
            title: '抽盘复盘差异数量',
            width: 140,
            slots: { default: 'randDiffNum_default' },
            align: 'right',
          },
        ],
        tableData: [],
        // 已选择的预先盘点状态
        checkedStatus: [],
      };
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
          id: '',
          code: '',
          scName: '',
          takeStatus: '',
          description: '',
        };

        this.checkedStatus = [this.$enums.PRE_TAKE_STOCK_SHEET_STATUS.FIRST_TAKE.code];

        this.tableData = [];
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
          .get(this.id)
          .then((res) => {
            this.formData = {
              scName: res.scName,
              description: res.description,
              takeStatus: res.takeStatus,
              updateBy: res.updateBy,
              updateTime: res.updateTime,
            };

            this.tableData = res.details.map((item) => {
              return Object.assign(this.emptyProduct(), item);
            });

            if (this.$enums.PRE_TAKE_STOCK_SHEET_STATUS.FIRST_TAKE.equalsCode(res.takeStatus)) {
              this.checkedStatus = [this.$enums.PRE_TAKE_STOCK_SHEET_STATUS.FIRST_TAKE.code];
            } else if (
              this.$enums.PRE_TAKE_STOCK_SHEET_STATUS.SECOND_TAKE.equalsCode(res.takeStatus)
            ) {
              this.checkedStatus = [
                this.$enums.PRE_TAKE_STOCK_SHEET_STATUS.FIRST_TAKE.code,
                this.$enums.PRE_TAKE_STOCK_SHEET_STATUS.SECOND_TAKE.code,
              ];
            } else if (
              this.$enums.PRE_TAKE_STOCK_SHEET_STATUS.RAND_TAKE.equalsCode(res.takeStatus)
            ) {
              this.checkedStatus = [
                this.$enums.PRE_TAKE_STOCK_SHEET_STATUS.FIRST_TAKE.code,
                this.$enums.PRE_TAKE_STOCK_SHEET_STATUS.SECOND_TAKE.code,
                this.$enums.PRE_TAKE_STOCK_SHEET_STATUS.RAND_TAKE.code,
              ];
            }
          })
          .finally(() => {
            this.loading = false;
          });
      },
      emptyProduct() {
        return {
          id: this.$utils.uuid(),
          productId: '',
          productCode: '',
          productName: '',
          skuCode: '',
          externalCode: '',
          unit: '',
          spec: '',
          categoryName: '',
          brandName: '',
          firstNum: '',
          secondNum: '',
          randNum: '',
          secondDiffNum: '',
          randDiffNum: '',
        };
      },
    },
  });
</script>
