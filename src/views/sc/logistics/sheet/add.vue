<template>
  <div class="simple-app-container">
    <div v-permission="['logistics:sheet:add']" v-loading="loading">
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
          <!-- 工具栏 -->
          <template #toolbar_buttons>
            <a-space>
              <a-button type="primary" :icon="h(PlusOutlined)" @click="addBizOrder">新增</a-button>
              <a-button danger :icon="h(DeleteOutlined)" @click="delRow">删除</a-button>
            </a-space>
          </template>

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

          <!-- 仓库名称 列自定义内容 -->
          <template #scName_default="{ row }">
            <a @click="(e) => setSender(row)">{{ row.scName }}</a>
          </template>

          <!-- 收件人 列自定义内容 -->
          <template #receiverName_default="{ row }">
            <a v-if="!$utils.isEmpty(row.receiverName)" @click="(e) => setReceiver(row)">{{
              row.receiverName
            }}</a>
          </template>
        </vxe-grid>
      </j-border>
      <j-border title="寄件人信息">
        <j-form
          ref="senderForm"
          label-width="140px"
          :model="formData"
          :rules="rules"
          :enable-collapse="false"
        >
          <j-form-item label="姓名" :required="true">
            <a-input v-model:value="formData.senderName" />
          </j-form-item>
          <j-form-item label="联系电话" :required="true">
            <a-input v-model:value="formData.senderTelephone" />
          </j-form-item>
          <j-form-item label="地区" :required="true">
            <city-selector v-model:value="formData.senderCity" :only-final="true" />
          </j-form-item>
          <j-form-item label="详细地址" :span="24" :content-nest="false" :required="true">
            <a-textarea v-model:value.trim="formData.senderAddress" />
          </j-form-item>
        </j-form>
      </j-border>
      <j-border title="收件人信息">
        <j-form
          ref="receiverForm"
          label-width="140px"
          :model="formData"
          :rules="rules"
          :enable-collapse="false"
        >
          <j-form-item label="姓名" :required="true">
            <a-input v-model:value="formData.receiverName" />
          </j-form-item>
          <j-form-item label="联系电话" :required="true">
            <a-input v-model:value="formData.receiverTelephone" />
          </j-form-item>
          <j-form-item label="地区" :required="true">
            <city-selector v-model:value="formData.receiverCity" :only-final="true" />
          </j-form-item>
          <j-form-item label="详细地址" :span="24" :content-nest="false" :required="true">
            <a-textarea v-model:value.trim="formData.receiverAddress" />
          </j-form-item>
        </j-form>
      </j-border>
      <j-border title="物流单信息">
        <j-form
          ref="form"
          label-width="140px"
          :model="formData"
          :rules="rules"
          :enable-collapse="false"
        >
          <j-form-item label="物流公司" :required="true">
            <logistics-company-selector v-model:value="formData.logisticsCompanyId" />
          </j-form-item>
          <j-form-item label="物流单号">
            <a-input v-model:value="formData.logisticsNo" />
          </j-form-item>
          <j-form-item label="总重量（kg）">
            <a-input-group compact>
              <a-input v-model:value="formData.totalWeight" style="width: calc(100% - 120px)" />
              <a-button type="primary" @click="calcWeight">计算重量</a-button>
            </a-input-group>
          </j-form-item>
          <j-form-item label="总体积（cm³）">
            <a-input-group compact>
              <a-input v-model:value="formData.totalVolume" style="width: calc(100% - 120px)" />
              <a-button type="primary" @click="calcVolume">计算体积</a-button>
            </a-input-group>
          </j-form-item>
          <j-form-item label="物流费（元）">
            <a-input v-model:value="formData.totalAmount" />
          </j-form-item>
          <j-form-item label="备注" :span="24" :content-nest="false">
            <a-textarea v-model:value.trim="formData.description" maxlength="200" />
          </j-form-item>
        </j-form>
      </j-border>
      <div style="text-align: center; background-color: #ffffff; padding: 8px 0">
        <a-space>
          <a-button
            v-permission="['logistics:sheet:add']"
            type="primary"
            :loading="loading"
            @click="createOrder"
            >保存</a-button
          >
          <a-button :loading="loading" @click="closeDialog">关闭</a-button>
        </a-space>
      </div>
    </div>
    <query-biz-order ref="queryBizOrderDialog" @confirm="confirmAddBizOrder" />
    <detail-sale-out-sheet :id="bizId" ref="detailSaleOutSheetDialog" />
    <detail-retail-out-sheet :id="bizId" ref="detailRetailOutSheetDialog" />
    <address-selector
      ref="addressDialog"
      :entity-id="entityId"
      :entity-type="entityType"
      :address-type="addressType"
      @confirm="confirmAddress"
    />
  </div>
</template>
<script>
  import { h, defineComponent } from 'vue';
  import QueryBizOrder from './query-biz-order.vue';
  import DetailSaleOutSheet from '@/views/sc/sale/out/detail.vue';
  import DetailRetailOutSheet from '@/views/sc/retail/out/detail.vue';
  import AddressSelector from './address-selector.vue';
  import { PlusOutlined, DeleteOutlined } from '@ant-design/icons-vue';
  import * as api from '@/api/sc/logistics/sheet';

  export default defineComponent({
    components: {
      QueryBizOrder,
      DetailSaleOutSheet,
      DetailRetailOutSheet,
      AddressSelector,
    },
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
        bizId: '',
        entityId: '',
        entityType: '',
        addressType: '',
        // 表单数据
        formData: {},
        rules: {
          senderName: [{ required: true, message: '请输入寄件人姓名' }],
          senderTelephone: [{ required: true, message: '请输入寄件人联系电话' }],
          senderCity: [{ required: true, message: '请选择寄件人地区' }],
          senderAddress: [{ required: true, message: '请输入寄件人详细地址' }],
          receiverName: [{ required: true, message: '请输入收件人姓名' }],
          receiverTelephone: [{ required: true, message: '请输入收件人联系电话' }],
          receiverCity: [{ required: true, message: '请选择收件人地区' }],
          receiverAddress: [{ required: true, message: '请输入收件人详细地址' }],
          logisticsCompanyId: [{ required: true, message: '请选择物流公司' }],
        },
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
          { type: 'checkbox', width: 45 },
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
          { field: 'scName', title: '仓库名称', width: 100, slots: { default: 'scName_default' } },
          {
            field: 'receiverName',
            title: '收件人',
            width: 120,
            slots: { default: 'receiverName_default' },
          },
          { field: 'createTime', title: '操作时间', width: 170 },
          { field: 'createBy', title: '操作人', width: 100 },
        ],
        tableData: [],
      };
    },
    computed: {},
    created() {
      this.openDialog();
    },
    methods: {
      // 打开对话框 由父页面触发
      openDialog() {
        // 初始化表单数据
        this.initFormData();
      },
      // 关闭对话框
      closeDialog() {
        this.$utils.closeCurrentPage();
      },
      // 初始化表单数据
      initFormData() {
        this.formData = {
          senderName: '',
          senderTelephone: '',
          senderCity: [],
          senderAddress: '',
          receiverName: '',
          receiverTelephone: '',
          receiverCity: [],
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
        this.entityType = '';
        this.addressType = '';
      },
      emptyRow() {
        return {
          id: this.$utils.uuid(),
        };
      },
      addBizOrder() {
        this.$refs.queryBizOrderDialog.openDialog();
      },
      confirmAddBizOrder(datas) {
        if (!this.$utils.isEmpty(datas)) {
          datas
            .map((item) => {
              return Object.assign({}, this.emptyRow(), item);
            })
            .forEach((item) => {
              const bizIds = this.tableData.map((d) => d.bizId);
              if (!bizIds.includes(item.bizId)) {
                this.tableData.push(item);
              }
            });
        }
      },
      delRow() {
        const records = this.$refs.grid.getCheckboxRecords();
        if (this.$utils.isEmpty(records)) {
          this.$msg.createError('请选择要删除的业务单据！');
          return;
        }
        this.$msg.createConfirm('是否确定删除选中的业务单据？').then(() => {
          const tableData = this.tableData.filter((t) => {
            const tmp = records.filter((item) => item.id === t.id);
            return this.$utils.isEmpty(tmp);
          });

          this.tableData = tableData;
        });
      },
      async calcWeight() {
        if (this.$utils.isEmpty(this.tableData)) {
          this.$msg.createError('请先选择业务单据');
          return;
        }

        let flag = this.$utils.isEmpty(this.formData.totalWeight);
        if (!this.$utils.isEmpty(this.formData.totalWeight)) {
          await this.$msg
            .createConfirm('您当前已录入总重量，重新计算会覆盖录入值，是否确认继续？')
            .then(() => {
              flag = true;
            });
        }

        if (flag) {
          this.loading = true;
          api
            .calcWeight({
              bizOrders: this.tableData,
            })
            .then((res) => {
              this.formData.totalWeight = res;
            })
            .finally(() => {
              this.loading = false;
            });
        }
      },
      async calcVolume() {
        if (this.$utils.isEmpty(this.tableData)) {
          this.$msg.createError('请先选择业务单据');
          return;
        }

        let flag = this.$utils.isEmpty(this.formData.totalVolume);
        if (!this.$utils.isEmpty(this.formData.totalVolume)) {
          await this.$msg
            .createConfirm('您当前已录入总体积，重新计算会覆盖录入值，是否确认继续？')
            .then(() => {
              flag = true;
            });
        }

        if (flag) {
          this.loading = true;
          api
            .calcVolume({
              bizOrders: this.tableData,
            })
            .then((res) => {
              this.formData.totalVolume = res;
            })
            .finally(() => {
              this.loading = false;
            });
        }
      },
      setSender(row) {
        this.$msg.createConfirm('选择地址后，会覆盖寄件人信息，是否确认继续？').then(() => {
          this.entityId = row.scId;
          this.entityType = this.$enums.ADDRESS_ENTITY_TYPE.SC.code;
          this.addressType = this.$enums.ADDRESS_TYPE.DELIVERY.code;

          this.$refs.addressDialog.openDialog();
        });
      },
      setReceiver(row) {
        this.$msg.createConfirm('选择地址后，会覆盖收件人信息，是否确认继续？').then(() => {
          this.entityId = row.receiverId;
          if (this.$enums.LOGISTICS_SHEET_DETAIL_BIZ_TYPE.SALE_OUT_SHEET.equalsCode(row.bizType)) {
            this.entityType = this.$enums.ADDRESS_ENTITY_TYPE.CUSTOMER.code;
          } else if (
            this.$enums.LOGISTICS_SHEET_DETAIL_BIZ_TYPE.RETAIL_OUT_SHEET.equalsCode(row.bizType)
          ) {
            this.entityType = this.$enums.ADDRESS_ENTITY_TYPE.MEMBER.code;
          }
          this.addressType = this.$enums.ADDRESS_TYPE.RECEIVE.code;

          this.$refs.addressDialog.openDialog();
        });
      },
      confirmAddress(addr, addrType) {
        if (this.$enums.ADDRESS_TYPE.RECEIVE.equalsCode(addrType)) {
          // 收货地址
          this.formData.receiverName = addr.name;
          this.formData.receiverTelephone = addr.telephone;
          this.formData.receiverCity = [addr.provinceId, addr.cityId, addr.districtId];
          this.formData.receiverAddress = addr.address;
        } else {
          // 发货地址
          this.formData.senderName = addr.name;
          this.formData.senderTelephone = addr.telephone;
          this.formData.senderCity = [addr.provinceId, addr.cityId, addr.districtId];
          this.formData.senderAddress = addr.address;
        }
      },
      // 校验数据
      async validData() {
        if (this.$utils.isEmpty(this.tableData)) {
          this.$msg.createError('请先选择业务单据');
          return false;
        }
        let flag = true;
        await this.$refs.senderForm.validate().then((valid) => {
          flag = valid;
        });
        if (flag) {
          await this.$refs.receiverForm.validate().then((valid) => {
            flag = valid;
          });
          if (flag) {
            await this.$refs.form
              .validate()
              .then()
              .then((valid) => {
                flag = valid;
              });
          }
        }

        if (!flag) {
          return false;
        }

        if (!this.$utils.isEmpty(this.formData.totalWeight)) {
          if (!this.$utils.isFloat(this.formData.totalWeight)) {
            this.$msg.createError('总重量必须为数字');
            return false;
          }
          if (!this.$utils.isFloatGeZero(this.formData.totalWeight)) {
            this.$msg.createError('总重量必须大于0');
            return false;
          }
          if (!this.$utils.isNumberPrecision(this.formData.totalWeight, 2)) {
            this.$msg.createError('总重量最多允许2位小数');
            return false;
          }
        }

        if (!this.$utils.isEmpty(this.formData.totalVolume)) {
          if (!this.$utils.isFloat(this.formData.totalVolume)) {
            this.$msg.createError('总体积必须为数字');
            return false;
          }
          if (!this.$utils.isFloatGeZero(this.formData.totalVolume)) {
            this.$msg.createError('总体积必须大于0');
            return false;
          }
          if (!this.$utils.isNumberPrecision(this.formData.totalVolume, 2)) {
            this.$msg.createError('总体积最多允许2位小数');
            return false;
          }
        }

        if (!this.$utils.isEmpty(this.formData.totalAmount)) {
          if (!this.$utils.isFloat(this.formData.totalAmount)) {
            this.$msg.createError('物流费必须为数字');
            return false;
          }
          if (!this.$utils.isFloatGeZero(this.formData.totalAmount)) {
            this.$msg.createError('物流费必须大于0');
            return false;
          }
          if (!this.$utils.isNumberPrecision(this.formData.totalAmount, 2)) {
            this.$msg.createError('物流费最多允许2位小数');
            return false;
          }
        }

        return true;
      },
      // 创建订单
      createOrder() {
        this.validData().then((valid) => {
          if (valid) {
            const scIds = this.tableData.map((item) => item.scId);
            const receiverIds = this.tableData
              .filter((item) => !this.$utils.isEmpty(item.receiverId))
              .map((item) => item.receiverId);
            if (scIds.length > 1 && receiverIds.length > 1) {
              this.$msg
                .createConfirm('选择的业务单据包含不同的仓库和收件人，是否确认创建物流单？')
                .then(() => {
                  this.doCreateOrder();
                });
            } else if (scIds.length > 1) {
              this.$msg
                .createConfirm('选择的业务单据包含不同的仓库，是否确认创建物流单？')
                .then(() => {
                  this.doCreateOrder();
                });
            } else if (receiverIds.length > 1) {
              this.$msg
                .createConfirm('选择的业务单据包含不同的收件人，是否确认创建物流单？')
                .then(() => {
                  this.doCreateOrder();
                });
            } else {
              this.doCreateOrder();
            }
          }
        });
      },
      doCreateOrder() {
        const params = {
          logisticsNo: this.formData.logisticsNo,
          logisticsCompanyId: this.formData.logisticsCompanyId,
          senderName: this.formData.senderName,
          senderTelephone: this.formData.senderTelephone,
          senderAddress: this.formData.senderAddress,
          senderProvinceId: this.formData.senderCity[0],
          senderCityId: this.formData.senderCity[1],
          senderDistrictId: this.formData.senderCity[2],
          receiverName: this.formData.receiverName,
          receiverTelephone: this.formData.receiverTelephone,
          receiverAddress: this.formData.receiverAddress,
          receiverProvinceId: this.formData.receiverCity[0],
          receiverCityId: this.formData.receiverCity[1],
          receiverDistrictId: this.formData.receiverCity[2],
          totalWeight: this.formData.totalWeight,
          totalVolume: this.formData.totalVolume,
          totalAmount: this.formData.totalAmount,
          description: this.formData.description,
          bizOrders: this.tableData.map((item) => {
            return {
              bizId: item.bizId,
              bizType: item.bizType,
            };
          }),
        };

        this.loading = true;
        api
          .create(params)
          .then((res) => {
            this.$msg.createSuccess('保存成功！');

            this.$emit('confirm');
            this.closeDialog();
          })
          .finally(() => {
            this.loading = false;
          });
      },
    },
  });
</script>
<style></style>
