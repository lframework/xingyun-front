<template>
  <el-dialog :visible.sync="visible" :close-on-click-modal="false" width="40%" title="查看" top="5vh" @open="open">
    <div v-if="visible" v-permission="['base-data:supplier:query']">
      <el-descriptions :column="4" border label-class-name="descriptions-label" content-class-name="descriptions-content">
        <el-descriptions-item label="编号" :span="2">
          {{ formData.code }}
        </el-descriptions-item>
        <el-descriptions-item label="名称" :span="2">
          {{ formData.name }}
        </el-descriptions-item>
        <el-descriptions-item label="助记码" :span="2">
          {{ formData.mnemonicCode }}
        </el-descriptions-item>
        <el-descriptions-item label="联系人" :span="2">
          {{ formData.contact }}
        </el-descriptions-item>
        <el-descriptions-item label="联系电话" :span="2">
          {{ formData.telephone }}
        </el-descriptions-item>
        <el-descriptions-item label="电子邮箱" :span="2">
          {{ formData.email }}
        </el-descriptions-item>
        <el-descriptions-item label="邮编" :span="2">
          {{ formData.zipCode }}
        </el-descriptions-item>
        <el-descriptions-item label="传真" :span="2">
          {{ formData.fax }}
        </el-descriptions-item>
        <el-descriptions-item label="地区" :span="2">
          {{ formData.cityName }}
        </el-descriptions-item>
        <el-descriptions-item label="地址" :span="2">
          {{ formData.address }}
        </el-descriptions-item>
        <el-descriptions-item label="发货地址" :span="2">
          {{ formData.deliveryAddress }}
        </el-descriptions-item>
        <el-descriptions-item label="送货周期（天）" :span="2">
          {{ formData.deliveryCycle }}
        </el-descriptions-item>
        <el-descriptions-item label="经营方式" :span="2">
          {{ $enums.MANAGE_TYPE.getDesc(formData.manageType) }}
        </el-descriptions-item>
        <el-descriptions-item label="结账方式" :span="2">
          {{ $enums.SETTLE_TYPE.getDesc(formData.settleType) }}
        </el-descriptions-item>
        <el-descriptions-item label="统一社会信用代码" :span="2">
          {{ formData.creditCode }}
        </el-descriptions-item>
        <el-descriptions-item label="纳税人识别号" :span="2">
          {{ formData.taxIdentifyNo }}
        </el-descriptions-item>
        <el-descriptions-item label="开户银行" :span="2">
          {{ formData.bankName }}
        </el-descriptions-item>
        <el-descriptions-item label="户名" :span="2">
          {{ formData.accountName }}
        </el-descriptions-item>
        <el-descriptions-item label="银行账号" :span="2">
          {{ formData.accountNo }}
        </el-descriptions-item>
        <el-descriptions-item label="状态" :span="2">
          <available-tag :available="formData.available" />
        </el-descriptions-item>
        <el-descriptions-item label="备注" :span="4">
          {{ formData.description }}
        </el-descriptions-item>
      </el-descriptions>
    </div>
  </el-dialog>
</template>
<script>
import AvailableTag from '@/components/Tag/Available'
export default {
  // 使用组件
  components: {
    AvailableTag
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
      formData: {}
    }
  },
  created() {
    this.initFormData()
  },
  methods: {
    // 打开对话框 由父页面触发
    openDialog() {
      this.visible = true
    },
    // 关闭对话框
    closeDialog() {
      this.visible = false
      this.$emit('close')
    },
    // 初始化表单数据
    initFormData() {
      this.formData = {
        id: '',
        code: '',
        name: '',
        mnemonicCode: '',
        contact: '',
        telephone: '',
        email: '',
        zipCode: '',
        fax: '',
        cityId: '',
        address: '',
        deliveryAddress: '',
        deliveryCycle: '',
        manageType: '',
        settleType: '',
        creditCode: '',
        taxIdentifyNo: '',
        bankName: '',
        accountName: '',
        accountNo: '',
        description: ''
      }
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
      await this.$api.baseData.supplier.get(this.id).then(data => {
        this.formData = data
      }).finally(() => {
        this.loading = false
      })
    }
  }
}
</script>
