<template>
  <a-modal v-model="visible" :mask-closable="false" width="40%" :dialog-style="{ top: '20px' }" title="发货" :footer="null">
    <div v-if="visible" v-permission="['logistics:sheet:delivery']" v-loading="loading">
      <a-form-model ref="form" :label-col="{span: 4}" :wrapper-col="{span: 16}" :model="formData" :rules="rules">
        <a-form-model-item label="物流单号" prop="logisticsNo">
          <a-input v-model="formData.logisticsNo" allow-clear />
        </a-form-model-item>
        <a-form-model-item label="物流费（元）" prop="totalAmount">
          <a-input v-model="formData.totalAmount" allow-clear />
        </a-form-model-item>
        <div class="form-modal-footer">
          <a-space>
            <a-button type="primary" :loading="loading" html-type="submit" @click="submit">确定</a-button>
            <a-button :loading="loading" @click="closeDialog">取消</a-button>
          </a-space>
        </div>
      </a-form-model>
    </div>
  </a-modal>
</template>
<script>

export default {
  components: {
  },
  props: {
    sheetId: {
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
        totalAmount: [
          {
            validator: (rule, value, callback) => {
              if (!this.$utils.isEmpty(value)) {
                if (!this.$utils.isFloat(value)) {
                  return callback(new Error('物流费必须为数字类型'))
                }
                if (!this.$utils.isFloatGeZero(value)) {
                  return callback(new Error('物流费必须大于0'))
                }
                if (!this.$utils.isNumberPrecision(value, 2)) {
                  return callback(new Error('物流费最多允许2位小数'))
                }
              }
              return callback()
            }
          }
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
        logisticsNo: '',
        totalAmount: ''
      }
    },
    // 提交表单事件
    submit() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.loading = true
          const params = Object.assign({}, this.formData, { id: this.sheetId })
          this.$api.sc.logistics.logisticsSheet.delivery(params).then(() => {
            this.$msg.success('发货成功！')
            this.$emit('confirm')
            this.closeDialog()
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

      this.loadData()
    },
    async loadData() {
      this.loading = true
      await this.$api.sc.logistics.logisticsSheet.queryDelivery(this.sheetId).then(data => {
        this.formData = data
      }).finally(() => {
        this.loading = false
      })
    }
  }
}
</script>
