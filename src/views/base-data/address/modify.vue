<template>
  <a-modal
    v-model:open="visible"
    :mask-closable="false"
    width="40%"
    title="修改"
    :style="{ top: '20px' }"
    :footer="null"
  >
    <div v-if="visible" v-permission="['base-data:address:modify']" v-loading="loading">
      <a-form
        ref="form"
        :label-col="{ span: 4 }"
        :wrapper-col="{ span: 16 }"
        :model="formData"
        :rules="rules"
      >
        <a-form-item label="实体类型" name="entityType">
          <a-select v-model:value="formData.entityType" allow-clear @change="changeEntityType">
            <a-select-option
              v-for="item in $enums.ADDRESS_ENTITY_TYPE.values()"
              :key="item.code"
              :value="item.code"
              >{{ item.desc }}</a-select-option
            >
          </a-select>
        </a-form-item>
        <a-form-item v-if="!$utils.isEmpty(formData.entityType)" label="实体" name="entityId">
          <store-center-selector
            v-if="$enums.ADDRESS_ENTITY_TYPE.SC.equalsCode(formData.entityType)"
            v-model:value="formData.entityId"
          />
          <supplier-selector
            v-else-if="$enums.ADDRESS_ENTITY_TYPE.SUPPLIER.equalsCode(formData.entityType)"
            v-model:value="formData.entityId"
          />
          <customer-selector
            v-else-if="$enums.ADDRESS_ENTITY_TYPE.CUSTOMER.equalsCode(formData.entityType)"
            v-model:value="formData.entityId"
          />
          <member-selector
            v-else-if="$enums.ADDRESS_ENTITY_TYPE.MEMBER.equalsCode(formData.entityType)"
            v-model:value="formData.entityId"
          />
          <shop-selector
            v-else-if="$enums.ADDRESS_ENTITY_TYPE.SHOP.equalsCode(formData.entityType)"
            v-model:value="formData.entityId"
          />
        </a-form-item>
        <a-form-item label="地址类型" name="addressType">
          <a-select v-model:value="formData.addressType" allow-clear>
            <a-select-option
              v-for="item in $enums.ADDRESS_TYPE.values()"
              :key="item.code"
              :value="item.code"
              >{{ item.desc }}</a-select-option
            >
          </a-select>
        </a-form-item>
        <a-form-item label="姓名" name="name">
          <a-input v-model:value="formData.name" allow-clear />
        </a-form-item>
        <a-form-item label="手机号" name="telephone">
          <a-input v-model:value="formData.telephone" allow-clear />
        </a-form-item>
        <a-form-item label="地区" name="city">
          <city-selector v-model:value="formData.city" :only-final="true" />
        </a-form-item>
        <a-form-item label="详细地址" name="address">
          <a-input v-model:value="formData.address" allow-clear />
        </a-form-item>
        <a-form-item label="默认地址" name="isDefault">
          <a-switch
            v-model:checked="formData.isDefault"
            checked-children="是"
            un-checked-children="否"
          />
        </a-form-item>
        <div class="form-modal-footer">
          <a-space>
            <a-button type="primary" :loading="loading" html-type="submit" @click="submit"
              >保存</a-button
            >
            <a-button :loading="loading" @click="closeDialog">取消</a-button>
          </a-space>
        </div>
      </a-form>
    </div>
  </a-modal>
</template>
<script>
  import { defineComponent } from 'vue';
  import * as api from '@/api/base-data/address';

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
          entityId: '',
          entityType: '',
          isDefault: false,
          city: [],
        };
      },
      // 提交表单事件
      submit() {
        this.$refs.form.validate().then((valid) => {
          if (valid) {
            this.loading = true;
            const params = Object.assign({}, this.formData);
            params.cityId = this.$utils.isEmpty(params.city)
              ? ''
              : params.city[params.city.length - 1];
            delete params.city;
            api
              .update(params)
              .then(() => {
                this.$msg.createSuccess('修改成功！');
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
          .then((data) => {
            this.formData = Object.assign({}, this.formData, data);
            this.formData.city.push(this.formData.provinceId);
            this.formData.city.push(this.formData.cityId);
            this.formData.city.push(this.formData.districtId);
          })
          .finally(() => {
            this.loading = false;
          });
      },
    },
  });
</script>
