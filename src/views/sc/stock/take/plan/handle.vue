<template>
  <a-modal
    v-model:open="visible"
    :mask-closable="false"
    width="75%"
    title="差异处理"
    :style="{ top: '20px' }"
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
            <a-textarea v-model:value.trim="formData.description" maxlength="200" />
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

        <!-- 修改后盘点数量 列自定义内容 -->
        <template #takeNum_default="{ row }">
          <a-input
            v-if="config.allowChangeNum"
            v-model:value="row.takeNum"
            class="number-input"
            @change="(e) => changeTakeNum(e.target.value)"
          />
          <span v-else>{{ row.takeNum }}</span>
        </template>

        <!-- 差异数量 列自定义内容 -->
        <template #diffNum_default="{ row }">
          <span v-if="$utils.isInteger(row.takeNum)">{{
            $utils.sub(row.takeNum, row.stockNum)
          }}</span>
        </template>

        <!-- 备注 列自定义内容 -->
        <template #description_default="{ row }">
          <a-input v-model:value="row.description" />
        </template>
      </vxe-grid>
    </div>
    <template #footer>
      <div class="form-modal-footer">
        <a-space>
          <a-button
            v-permission="['stock:take:plan:create-diff']"
            type="primary"
            :loading="loading"
            @click="submit"
            >差异处理</a-button
          >
          <a-button :loading="loading" @click="closeDialog">关闭</a-button>
        </a-space>
      </div>
    </template>
  </a-modal>
</template>
<script>
  import { defineComponent } from 'vue';
  import * as constants from './constants';
  import * as configApi from '@/api/sc/stock/take/config';
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
          {
            field: 'takeNum',
            title: '修改后盘点数量',
            width: 120,
            align: 'right',
            slots: { default: 'takeNum_default' },
          },
          { field: 'totalOutNum', title: '出项数量', width: 120, align: 'right' },
          { field: 'totalInNum', title: '进项数量', width: 120, align: 'right' },
          {
            field: 'diffNum',
            title: '盘点差异数量',
            width: 120,
            align: 'right',
            slots: { default: 'diffNum_default' },
          },
          {
            field: 'description',
            title: '备注',
            width: 200,
            slots: { default: 'description_default' },
          },
        ],
        tableData: [],
        oriTableData: [],
        checkedFilterType: [],
        config: {},
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
        this.config = {};
      },
      // 页面显示时触发
      async open() {
        // 初始化数据
        this.initFormData();

        // 查询设置信息
        await this.loadConfig();

        // 查询数据
        await this.loadFormData();
      },
      loadConfig() {
        this.loading = true;
        configApi
          .get()
          .then((res) => {
            this.config = {
              autoChangeStock: res.autoChangeStock,
              allowChangeNum: res.allowChangeNum,
            };
          })
          .finally(() => {
            this.loading = false;
          });
      },
      // 查询数据
      loadFormData() {
        this.loading = true;
        api
          .getDetail(this.id)
          .then((data) => {
            this.formData = data;
            const details = data.details.map((item) => {
              return Object.assign({ takeNum: item.oriTakeNum }, item);
            });
            details.forEach((item) => {
              if (this.config.autoChangeStock) {
                item.takeNum = this.$utils.sub(
                  this.$utils.add(item.takeNum, item.totalOutNum),
                  item.totalInNum,
                );
              }
            });
            this.tableData = details;
            this.oriTableData = this.tableData;
          })
          .finally(() => {
            this.loading = false;
          });
      },
      changeFilterType() {
        this.oriTableData.forEach((oriItem) => {
          oriItem = this.tableData.filter((item) => item.id === oriItem.id)[0];
        });
        this.tableData = this.oriTableData;
        this.tableData = this.tableData.filter((item) => {
          if (!this.$utils.isInteger(item.takeNum)) {
            return true;
          }

          if (this.checkedFilterType.includes(this.filterType.LOSS.code)) {
            if (this.$utils.sub(item.takeNum, item.stockNum) < 0) {
              return true;
            }
          }

          if (this.checkedFilterType.includes(this.filterType.OVERFLOW.code)) {
            if (this.$utils.sub(item.takeNum, item.stockNum) > 0) {
              return true;
            }
          }

          if (this.checkedFilterType.includes(this.filterType.NONE.code)) {
            if (this.$utils.sub(item.takeNum, item.stockNum) === 0) {
              return true;
            }
          }

          return false;
        });
      },
      submit() {
        const unTakeRecords = this.oriTableData.filter((item) =>
          this.$utils.isEmpty(item.oriTakeNum),
        );
        if (!this.$utils.isEmpty(unTakeRecords)) {
          this.$msg
            .createConfirm('盘点任务中存在盘点数量为空的商品，是否将此部分商品的盘点数量置为0？')
            .then(() => {
              this.doSubmit();
            });
        } else {
          this.doSubmit();
        }
      },
      doSubmit() {
        for (let i = 0; i < this.oriTableData.length; i++) {
          const data = this.oriTableData[i];
          if (this.config.allowChangeNum) {
            if (!this.$utils.isEmpty(data.takeNum)) {
              if (!this.$utils.isInteger(data.takeNum)) {
                this.$msg.createError('第' + (i + 1) + '行商品修改后盘点数量必须是整数！');
                return;
              }

              if (!this.$utils.isIntegerGeZero(data.takeNum)) {
                this.$msg.createError('第' + (i + 1) + '行商品修改后盘点数量不允许小于0！');
                return;
              }
            }
          }
        }
        const params = {
          id: this.id,
          products: this.oriTableData.map((item) => {
            return {
              productId: item.productId,
              takeNum: this.config.allowChangeNum ? item.takeNum : '',
              description: item.description,
            };
          }),
          allowChangeNum: this.config.allowChangeNum,
          autoChangeStock: this.config.autoChangeStock,
          description: this.formData.description,
        };
        this.$msg.createConfirm('确认对此盘点任务进行差异处理？').then(() => {
          this.loading = true;
          api
            .handleDiff(params)
            .then(() => {
              this.$msg.createSuccess('盘点任务完成差异处理！');
              this.$emit('confirm');

              this.closeDialog();
            })
            .finally(() => {
              this.loading = false;
            });
        });
      },
      changeTakeNum() {
        this.changeFilterType();
      },
    },
  });
</script>
