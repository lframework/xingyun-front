<template>
  <a-modal
    v-model:open="visible"
    :mask-closable="false"
    width="40%"
    :style="{ top: '20px' }"
    title="新增"
    :footer="null"
  >
    <div v-if="visible" v-permission="['base-data:address:add']" v-loading="loading">
      <vxe-form
        border
        title-background
        title-width="80"
        ref="form"
        :data="formData"
        :rules="rules"
      >
        <vxe-form-group span="24" title="基础信息" title-bold vertical>
          <vxe-form-item title="实体类型" field="entityType" span="24">
            <a-select v-model:value="formData.entityType" allow-clear @change="changeEntityType">
              <a-select-option
                v-for="item in ADDRESS_ENTITY_TYPE.values()"
                :key="item.code"
                :value="item.code"
                >{{ item.desc }}</a-select-option
              >
            </a-select>
          </vxe-form-item>
          <vxe-form-item
            :visible="!isEmpty(formData.entityType)"
            title="实体"
            field="entityId"
            span="24"
          >
            <store-center-selector
              v-if="ADDRESS_ENTITY_TYPE.SC.equalsCode(formData.entityType)"
              v-model:value="formData.entityId"
            />
            <supplier-selector
              v-else-if="ADDRESS_ENTITY_TYPE.SUPPLIER.equalsCode(formData.entityType)"
              v-model:value="formData.entityId"
            />
            <customer-selector
              v-else-if="ADDRESS_ENTITY_TYPE.CUSTOMER.equalsCode(formData.entityType)"
              v-model:value="formData.entityId"
            />
            <member-selector
              v-else-if="ADDRESS_ENTITY_TYPE.MEMBER.equalsCode(formData.entityType)"
              v-model:value="formData.entityId"
            />
            <shop-selector
              v-else-if="ADDRESS_ENTITY_TYPE.SHOP.equalsCode(formData.entityType)"
              v-model:value="formData.entityId"
            />
          </vxe-form-item>
          <vxe-form-item title="地址类型" field="addressType" span="24">
            <a-select v-model:value="formData.addressType" allow-clear>
              <a-select-option
                v-for="item in ADDRESS_TYPE.values()"
                :key="item.code"
                :value="item.code"
                >{{ item.desc }}</a-select-option
              >
            </a-select>
          </vxe-form-item>
          <vxe-form-item title="姓名" field="name" span="12">
            <a-input v-model:value="formData.name" allow-clear />
          </vxe-form-item>
          <vxe-form-item :title="'手机号'" field="telephone" span="12">
            <a-input v-model:value="formData.telephone" allow-clear />
          </vxe-form-item>
        </vxe-form-group>
        <vxe-form-group span="24" title="扩展信息" title-bold vertical>
          <vxe-form-item title="地区" field="city" span="24">
            <city-selector v-model:value="formData.city" :only-final="true" />
          </vxe-form-item>
          <vxe-form-item title="详细地址" field="address" span="24">
            <a-input v-model:value="formData.address" allow-clear />
          </vxe-form-item>
          <vxe-form-item title="默认地址" field="isDefault" span="24">
            <a-switch
              v-model:checked="formData.isDefault"
              checked-children="是"
              un-checked-children="否"
            />
          </vxe-form-item>
        </vxe-form-group>
        <vxe-form-item span="24">
          <div class="form-modal-footer">
            <a-space>
              <a-button type="primary" :loading="loading" html-type="submit" @click="submit"
                >保存</a-button
              >
              <a-button :loading="loading" @click="closeDialog">取消</a-button>
            </a-space>
          </div>
        </vxe-form-item>
      </vxe-form>
    </div>
  </a-modal>
</template>
<script>
  import { defineComponent } from 'vue';
  import * as api from '@/api/base-data/address';
  import { isEmpty } from '@/utils/utils';
  import { createSuccess } from '@/hooks/web/msg';
  import CitySelector from '@/components/Selector/CitySelector.vue';
  import SupplierSelector from '@/components/Selector/SupplierSelector.vue';
  import CustomerSelector from '@/components/Selector/CustomerSelector.vue';
  import MemberSelector from '@/components/Selector/MemberSelector.vue';
  import ShopSelector from '@/components/Selector/ShopSelector.vue';
  import StoreCenterSelector from '@/components/Selector/StoreCenterSelector.vue';
  import { ADDRESS_ENTITY_TYPE } from '@/enums/biz/addressEntityType';
  import { ADDRESS_TYPE } from '@/enums/biz/addressType';

  export default defineComponent({
    components: {
      CitySelector,
      CustomerSelector,
      MemberSelector,
      ShopSelector,
      StoreCenterSelector,
      SupplierSelector,
    },
    setup() {
      return {
        isEmpty,
        ADDRESS_ENTITY_TYPE,
        ADDRESS_TYPE,
      };
    },
    data() {
      return {
        // 是否可见
        visible: false,
        // 是否显示加载框
        loading: false,
        // 表单数据
        formData: {},
        // 表单校验规则
        rules: {
          entityType: [{ required: true, message: '请选择实体类型' }],
          entityId: [{ required: true, message: '请选择实体' }],
          addressType: [{ required: true, message: '请选择地址类型' }],
          name: [{ required: true, message: '请输入姓名' }],
          telephone: [{ required: true, message: '请输入手机号' }],
          city: [{ required: true, message: '请选择地区' }],
          address: [{ required: true, message: '请输入详细地址' }],
          isDefault: [{ required: true, message: '请选择默认地址' }],
        },
      };
    },
    computed: {},
    created() {
      // 初始化表单数据
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
          entityId: '',
          entityType: '',
          isDefault: false,
          city: [],
        };
      },
      // 提交表单事件
      submit() {
        this.$refs.form.validate().then((errMaps) => {
          if (!errMaps) {
            this.loading = true;
            const params = Object.assign({}, this.formData);
            params.cityId = isEmpty(params.city) ? '' : params.city[params.city.length - 1];
            delete params.city;
            api
              .create(params)
              .then(() => {
                createSuccess('新增成功！');
                // 初始化表单数据
                this.initFormData();
                this.$emit('confirm');
                this.visible = false;
              })
              .finally(() => {
                this.loading = false;
              });
          }
        });
      },
      // 页面显示时触发
      open() {
        // 初始化表单数据
        this.initFormData();
      },
      changeEntityType() {
        this.formData.entityId = '';
      },
    },
  });
</script>
