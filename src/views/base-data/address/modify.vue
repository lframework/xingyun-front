<template>
  <a-modal v-model="visible" :mask-closable="false" width="40%" title="修改" :dialog-style="{ top: '20px' }" :footer="null">
    <div v-if="visible" v-permission="['base-data:address:modify']" v-loading="loading">
      <a-form-model ref="form" :label-col="{span: 4}" :wrapper-col="{span: 16}" :model="formData" :rules="rules">
        <a-form-model-item label="实体类型" prop="entityType">
          <a-select v-model="formData.entityType" allow-clear @change="changeEntityType">
            <a-select-option v-for="item in $enums.ADDRESS_ENTITY_TYPE.values()" :key="item.code" :value="item.code">{{ item.desc }}</a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item v-if="!$utils.isEmpty(formData.entityType)" label="实体" prop="entityId">
          <store-center-selector v-if="$enums.ADDRESS_ENTITY_TYPE.SC.equalsCode(formData.entityType)" v-model="formData.entityId" />
          <supplier-selector v-else-if="$enums.ADDRESS_ENTITY_TYPE.SUPPLIER.equalsCode(formData.entityType)" v-model="formData.entityId" />
          <customer-selector v-else-if="$enums.ADDRESS_ENTITY_TYPE.CUSTOMER.equalsCode(formData.entityType)" v-model="formData.entityId" />
          <member-selector v-else-if="$enums.ADDRESS_ENTITY_TYPE.MEMBER.equalsCode(formData.entityType)" v-model="formData.entityId" />
          <shop-selector v-else-if="$enums.ADDRESS_ENTITY_TYPE.SHOP.equalsCode(formData.entityType)" v-model="formData.entityId" />
        </a-form-model-item>
        <a-form-model-item label="地址类型" prop="addressType">
          <a-select v-model="formData.addressType" allow-clear>
            <a-select-option v-for="item in $enums.ADDRESS_TYPE.values()" :key="item.code" :value="item.code">{{ item.desc }}</a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item label="姓名" prop="name">
          <a-input v-model="formData.name" allow-clear />
        </a-form-model-item>
        <a-form-model-item label="手机号" prop="telephone">
          <a-input v-model="formData.telephone" allow-clear />
        </a-form-model-item>
        <a-form-model-item label="地区" prop="city">
          <city-selector v-model="formData.city" :only-final="true" />
        </a-form-model-item>
        <a-form-model-item label="详细地址" prop="address">
          <a-input v-model="formData.address" allow-clear />
        </a-form-model-item>
        <a-form-model-item label="默认地址" prop="isDefault">
          <a-switch v-model="formData.isDefault" checked-children="是" un-checked-children="否" />
        </a-form-model-item>
        <div class="form-modal-footer">
          <a-space>
            <a-button type="primary" :loading="loading" html-type="submit" @click="submit">保存</a-button>
            <a-button :loading="loading" @click="closeDialog">取消</a-button>
          </a-space>
        </div>
      </a-form-model>
    </div>
  </a-modal>
</template>
<script>
import StoreCenterSelector from '@/components/Selector/StoreCenterSelector'
import SupplierSelector from '@/components/Selector/SupplierSelector'
import CustomerSelector from '@/components/Selector/CustomerSelector'
import MemberSelector from '@/components/Selector/MemberSelector'
import ShopSelector from '@/components/Selector/ShopSelector'
import CitySelector from '@/components/Selector/CitySelector'
export default {
  // 使用组件
  components: {
    StoreCenterSelector, SupplierSelector, CustomerSelector, MemberSelector, ShopSelector, CitySelector
  },

  props: {
    id: {
      type: String,
      required: true
    }
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
        entityType: [
          { required: true, message: '请选择实体类型' }
        ],
        entityId: [
          { required: true, message: '请选择实体' }
        ],
        addressType: [
          { required: true, message: '请选择地址类型' }
        ],
        name: [
          { required: true, message: '请输入姓名' }
        ],
        telephone: [
          { required: true, message: '请输入手机号' }
        ],
        city: [
          { required: true, message: '请选择地区' }
        ],
        address: [
          { required: true, message: '请输入详细地址' }
        ],
        isDefault: [
          { required: true, message: '请选择默认地址' }
        ]
      }
    }
  },
  created() {
    this.initFormData()
  },
  methods: {
    // 打开对话框 由父页面触发
    openDialog() {
      this.visible = true

      this.$nextTick(() => this.open())
    },
    // 关闭对话框
    closeDialog() {
      this.visible = false
      this.$emit('close')
    },
    // 初始化表单数据
    initFormData() {
      this.formData = {
        entityId: '',
        entityType: '',
        isDefault: false,
        city: []
      }
    },
    // 提交表单事件
    submit() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.loading = true
          const params = Object.assign({}, this.formData)
          params.cityId = this.$utils.isEmpty(params.city) ? '' : params.city[params.city.length - 1]
          delete params.city
          this.$api.baseData.address.modify(params).then(() => {
            this.$msg.success('修改成功！')
            this.$emit('confirm')
            this.visible = false
          }).finally(() => {
            this.loading = false
          })
        }
      })
    },
    // 页面显示时触发
    open() {
      // 初始化数据
      this.initFormData()

      // 查询数据
      this.loadFormData()
    },
    // 查询数据
    async loadFormData() {
      this.loading = true
      await this.$api.baseData.address.get(this.id).then(data => {
        this.formData = Object.assign({}, this.formData, data)
        this.formData.city.push(this.formData.provinceId)
        this.formData.city.push(this.formData.cityId)
        this.formData.city.push(this.formData.districtId)
      }).finally(() => {
        this.loading = false
      })
    }
  }
}
</script>
