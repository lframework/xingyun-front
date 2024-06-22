<template>
  <a-modal
    v-model:open="visible"
    :mask-closable="false"
    width="75%"
    title="查看"
    :style="{ top: '20px' }"
    :footer="null"
  >
    <div v-permission="['logistics:sheet:query']" v-loading="loading">
      <j-border>
        <j-form>
          <j-form-item label="单据号">
            <span>{{ formData.code }}</span>
          </j-form-item>
          <j-form-item label="状态" :span="16">
            <span
              v-if="$enums.LOGISTICS_SHEET_STATUS.DELIVERY.equalsCode(formData.status)"
              style="color: #52c41a"
              >{{ $enums.LOGISTICS_SHEET_STATUS.getDesc(formData.status) }}</span
            >
            <span v-else style="color: #303133">{{
              $enums.LOGISTICS_SHEET_STATUS.getDesc(formData.status)
            }}</span>
          </j-form-item>
          <j-form-item label="操作人">
            <span>{{ formData.createBy }}</span>
          </j-form-item>
          <j-form-item label="操作时间" :span="16">
            <span>{{ formData.createTime }}</span>
          </j-form-item>
          <j-form-item
            v-if="$enums.LOGISTICS_SHEET_STATUS.DELIVERY.equalsCode(formData.status)"
            label="发货人"
          >
            <span>{{ formData.deliveryBy }}</span>
          </j-form-item>
          <j-form-item
            v-if="$enums.LOGISTICS_SHEET_STATUS.DELIVERY.equalsCode(formData.status)"
            label="发货时间"
            :span="16"
          >
            <span>{{ formData.deliveryTime }}</span>
          </j-form-item>
        </j-form>
      </j-border>
      <j-border title="业务单据">
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
          <!-- 业务单据号 列自定义内容 -->
          <template #bizCode_default="{ row }">
            <div
              v-if="$enums.LOGISTICS_SHEET_DETAIL_BIZ_TYPE.SALE_OUT_SHEET.equalsCode(row.bizType)"
            >
              <a
                v-permission="['sale:out:query']"
                @click="
                  (e) => {
                    bizId = row.bizId;
                    $refs.detailSaleOutSheetDialog.openDialog();
                  }
                "
                >{{ row.bizCode }}</a
              >
              <span v-no-permission="['sale:out:query']">{{ row.bizCode }}</span>
            </div>
            <div
              v-else-if="
                $enums.LOGISTICS_SHEET_DETAIL_BIZ_TYPE.RETAIL_OUT_SHEET.equalsCode(row.bizType)
              "
            >
              <a
                v-permission="['retail:out:query']"
                @click="
                  (e) => {
                    bizId = row.bizId;
                    $refs.detailRetailOutSheetDialog.openDialog();
                  }
                "
                >{{ row.bizCode }}</a
              >
              <span v-no-permission="['retail:out:query']">{{ row.bizCode }}</span>
            </div>
          </template>
        </vxe-grid>
      </j-border>
      <j-border title="寄件人信息">
        <j-form label-width="140px" :enable-collapse="false">
          <j-form-item label="姓名" :required="true">
            <a-input v-model:value="formData.senderName" readonly />
          </j-form-item>
          <j-form-item label="联系电话" :required="true">
            <a-input v-model:value="formData.senderTelephone" readonly />
          </j-form-item>
          <j-form-item label="地区" :required="true">
            <a-input v-model:value="formData.senderCity" readonly />
          </j-form-item>
          <j-form-item label="详细地址" :span="24" :content-nest="false" :required="true">
            <a-textarea v-model:value.trim="formData.senderAddress" readonly />
          </j-form-item>
        </j-form>
      </j-border>
      <j-border title="收件人信息">
        <j-form label-width="140px" :enable-collapse="false">
          <j-form-item label="姓名" :required="true">
            <a-input v-model:value="formData.receiverName" readonly />
          </j-form-item>
          <j-form-item label="联系电话" :required="true">
            <a-input v-model:value="formData.receiverTelephone" readonly />
          </j-form-item>
          <j-form-item label="地区" :required="true">
            <a-input v-model:value="formData.receiverCity" readonly />
          </j-form-item>
          <j-form-item label="详细地址" :span="24" :content-nest="false" :required="true">
            <a-textarea v-model:value.trim="formData.receiverAddress" readonly />
          </j-form-item>
        </j-form>
      </j-border>
      <j-border title="物流单信息">
        <j-form label-width="140px" :enable-collapse="false">
          <j-form-item label="物流公司" :required="true">
            <logistics-company-selector v-model:value="formData.logisticsCompanyId" disabled />
          </j-form-item>
          <j-form-item label="物流单号">
            <a-input v-model:value="formData.logisticsNo" readonly />
          </j-form-item>
          <j-form-item label="总重量（kg）">
            <a-input v-model:value="formData.totalWeight" readonly />
          </j-form-item>
          <j-form-item label="总体积（cm³）">
            <a-input v-model:value="formData.totalVolume" readonly />
          </j-form-item>
          <j-form-item label="物流费（元）">
            <a-input v-model:value="formData.totalAmount" readonly />
          </j-form-item>
          <j-form-item label="备注" :span="24" :content-nest="false">
            <a-textarea v-model:value.trim="formData.description" maxlength="200" readonly />
          </j-form-item>
        </j-form>
      </j-border>
    </div>
    <detail-sale-out-sheet :id="bizId" ref="detailSaleOutSheetDialog" />
    <detail-retail-out-sheet :id="bizId" ref="detailRetailOutSheetDialog" />
  </a-modal>
</template>
<script>
  import { defineComponent } from 'vue';
  import DetailSaleOutSheet from '@/views/sc/sale/out/detail.vue';
  import DetailRetailOutSheet from '@/views/sc/retail/out/detail.vue';
  import * as api from '@/api/sc/logistics/sheet';

  export default defineComponent({
    components: {
      DetailSaleOutSheet,
      DetailRetailOutSheet,
    },
    props: {
      id: {
        type: String,
        required: true,
      },
    },
    data() {
      return {
        visible: false,
        // 是否显示加载框
        loading: false,
        bizId: '',
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
        },
        // 列表数据配置
        tableColumn: [
          { type: 'seq', width: 50 },
          {
            field: 'bizCode',
            title: '业务单据号',
            minWidth: 120,
            slots: { default: 'bizCode_default' },
          },
          {
            field: 'bizType',
            title: '业务类型',
            width: 120,
            formatter: ({ cellValue }) => {
              return this.$enums.LOGISTICS_SHEET_DETAIL_BIZ_TYPE.getDesc(cellValue);
            },
          },
          { field: 'scName', title: '仓库名称', width: 100 },
          { field: 'receiverName', title: '收件人', width: 120 },
          { field: 'createTime', title: '操作时间', width: 170 },
          { field: 'createBy', title: '操作人', width: 100 },
        ],
        tableData: [],
      };
    },
    computed: {},
    created() {
      this.initFormData();
    },
    methods: {
      // 打开对话框 由父页面触发
      openDialog() {
        this.visible = true;

        this.$nextTick(() => this.open());
      },
      open() {
        // 初始化表单数据
        this.initFormData();
        this.loadData();
      },
      // 关闭对话框
      closeDialog() {
        this.visible = false;
        this.$emit('close');
      },
      // 初始化表单数据
      initFormData() {
        this.formData = {
          senderName: '',
          senderTelephone: '',
          senderCity: '',
          senderAddress: '',
          receiverName: '',
          receiverTelephone: '',
          receiverCity: '',
          receiverAddress: '',
          logisticsCompanyId: '',
          logisticsNo: '',
          totalWeight: '',
          totalVolume: '',
          totalAmount: '',
          description: '',
        };

        this.tableData = [];
        this.entityId = '';
      },
      emptyRow() {
        return {
          id: this.$utils.uuid(),
        };
      },
      // 加载数据
      loadData() {
        this.loading = true;
        api
          .get(this.id)
          .then((res) => {
            this.formData = Object.assign(this.formData, {
              code: res.code,
              logisticsNo: res.logisticsNo,
              logisticsCompanyId: res.logisticsCompanyId,
              senderName: res.senderName,
              senderTelephone: res.senderTelephone,
              senderCity: res.senderCity,
              senderAddress: res.senderAddress,
              receiverName: res.receiverName,
              receiverTelephone: res.receiverTelephone,
              receiverCity: res.receiverCity,
              receiverAddress: res.receiverAddress,
              status: res.status,
              description: res.description,
              totalWeight: res.totalWeight,
              totalVolume: res.totalVolume,
              totalAmount: res.totalAmount,
              createBy: res.createBy,
              createTime: res.createTime,
              deliveryBy: res.deliveryBy,
              deliveryTime: res.deliveryTime,
            });

            const tableData = res.details || [];
            this.tableData = tableData.map((item) => Object.assign(this.emptyRow(), item));
          })
          .finally(() => {
            this.loading = false;
          });
      },
    },
  });
</script>
<style></style>
