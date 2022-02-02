<template>
  <el-dialog :visible.sync="visible" :close-on-click-modal="false" width="40%" title="新增" top="5vh" @open="open">
    <div v-if="visible" v-permission="['base-data:customer:add']">
      <el-form ref="form" v-loading="loading" label-width="140px" title-align="right" :model="formData" :rules="rules">
        <el-form-item label="编号" prop="code">
          <el-input v-model.trim="formData.code" maxlength="20" show-word-limit clearable />
        </el-form-item>
        <el-form-item label="名称" prop="name">
          <el-input v-model.trim="formData.name" maxlength="20" show-word-limit clearable @input="changeName" />
        </el-form-item>
        <el-form-item label="助记码" prop="mnemonicCode">
          <el-input v-model.trim="formData.mnemonicCode" maxlength="20" show-word-limit clearable />
        </el-form-item>
        <el-form-item label="联系人" prop="contact">
          <el-input v-model.trim="formData.contact" maxlength="100" show-word-limit clearable />
        </el-form-item>
        <el-form-item label="联系电话" prop="telephone">
          <el-input v-model.trim="formData.telephone" maxlength="20" show-word-limit clearable />
        </el-form-item>
        <el-form-item label="电子邮箱" prop="email">
          <el-input v-model.trim="formData.email" maxlength="100" show-word-limit clearable />
        </el-form-item>
        <el-form-item label="邮编" prop="zipCode">
          <el-input v-model.trim="formData.zipCode" maxlength="20" show-word-limit clearable />
        </el-form-item>
        <el-form-item label="传真" prop="fax">
          <el-input v-model.trim="formData.fax" maxlength="100" show-word-limit clearable />
        </el-form-item>
        <el-form-item label="地区" prop="cityId">
          <city-selector v-model="formData.cityId" :only-final="true" />
        </el-form-item>
        <el-form-item label="地址" prop="address">
          <el-input v-model.trim="formData.address" maxlength="200" show-word-limit clearable />
        </el-form-item>
        <el-form-item label="收货人" prop="receiver">
          <el-input v-model.trim="formData.receiver" maxlength="100" show-word-limit clearable />
        </el-form-item>
        <el-form-item label="收货人手机号" prop="receiveTelephone">
          <el-input v-model.trim="formData.receiveTelephone" maxlength="20" show-word-limit clearable />
        </el-form-item>
        <el-form-item label="收货地址" prop="receiveAddress">
          <el-input v-model.trim="formData.receiveAddress" maxlength="200" show-word-limit clearable />
        </el-form-item>
        <el-form-item label="结账方式" prop="settleType">
          <el-select v-model="formData.settleType" clearable>
            <el-option v-for="item in $enums.SETTLE_TYPE.values()" :key="item.code" :label="item.desc" :value="item.code" />
          </el-select>
        </el-form-item>
        <el-form-item label="统一社会信用代码" prop="creditCode">
          <el-input v-model.trim="formData.creditCode" maxlength="100" show-word-limit clearable />
        </el-form-item>
        <el-form-item label="纳税人识别号" prop="taxIdentifyNo">
          <el-input v-model.trim="formData.taxIdentifyNo" maxlength="100" show-word-limit clearable />
        </el-form-item>
        <el-form-item label="开户银行" prop="bankName">
          <el-input v-model.trim="formData.bankName" maxlength="100" show-word-limit clearable />
        </el-form-item>
        <el-form-item label="户名" prop="accountName">
          <el-input v-model.trim="formData.accountName" maxlength="100" show-word-limit clearable />
        </el-form-item>
        <el-form-item label="银行账号" prop="accountNo">
          <el-input v-model.trim="formData.accountNo" maxlength="100" show-word-limit clearable />
        </el-form-item>
        <el-form-item label="备注" prop="description">
          <el-input v-model.trim="formData.description" maxlength="200" show-word-limit type="textarea" resize="none" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submit">保存</el-button>
          <el-button @click="closeDialog">取消</el-button>
        </el-form-item>
      </el-form>
    </div>

  </el-dialog>
</template>
<script>
import CitySelector from '@/components/Selector/CitySelector'
export default {
  components: {
    CitySelector
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
        code: [
          { required: true, message: '请输入编号' }
        ],
        name: [
          { required: true, message: '请输入名称' }
        ],
        settleType: [
          { required: true, message: '请选择结账方式' }
        ]
      }
    }
  },
  computed: {
  },
  created() {
    // 初始化表单数据
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
        receiver: '',
        receiveTelephone: '',
        receiveAddress: '',
        settleType: '',
        creditCode: '',
        taxIdentifyNo: '',
        bankName: '',
        accountName: '',
        accountNo: '',
        description: ''
      }
    },
    // 提交表单事件
    submit() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.loading = true
          this.$api.baseData.customer.create(Object.assign({}, this.formData)).then(() => {
            this.$msg.success('新增成功！')
            // 初始化表单数据
            this.initFormData()
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
      // 初始化表单数据
      this.initFormData()
    },
    // 名称改变
    changeName(e) {
      this.formData.mnemonicCode = this.$utils.getCamelCharsUpperCase(e)
    }
  }
}
</script>
