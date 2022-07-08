<template>
  <div class="app-container">
    <div v-permission="['member:level:config']">
      <a-row>
        <a-col :md="16" :sm="24">
          <a-card v-loading="loading">
            <a-form-model ref="form" :label-col="{span: 10}" :wrapper-col="{span: 8}" :model="formData" :rules="rules">
              <a-form-model-item label="每消费1元获得的经验值" prop="exp">
                <a-input v-model="formData.exp" allow-clear />
              </a-form-model-item>
              <a-form-model-item label="是否自动降级" prop="isDownGrade">
                <a-select v-model="formData.isDownGrade" placeholder="">
                  <a-select-option :value="true">是</a-select-option>
                  <a-select-option :value="false">否</a-select-option>
                </a-select>
              </a-form-model-item>
              <a-form-model-item v-if="formData.isDownGrade" label="降级周期" prop="downGradeCycle">
                <a-select v-model="formData.downGradeCycle" placeholder="">
                  <a-select-option v-for="item in $enums.DOWN_GRADE_CYCLE.values()" :key="item.code" :value="item.code">{{ item.desc }}</a-select-option>
                </a-select>
              </a-form-model-item>
              <a-form-model-item v-if="formData.isDownGrade" label="每次降级的经验值" prop="downGradeExp">
                <a-input v-model="formData.downGradeExp" allow-clear />
              </a-form-model-item>
              <div class="form-modal-footer">
                <a-space>
                  <a-button type="primary" html-type="submit" :loading="loading" @click="submit">保存</a-button>
                  <a-button :loading="loading" @click="close">取消</a-button>
                </a-space>
              </div>
            </a-form-model>
          </a-card>
        </a-col>
      </a-row>
    </div>
  </div>
</template>
<script>

export default {
  name: 'MemberLevelConfig',
  // 使用组件
  components: {
  },

  props: {
  },
  data() {
    return {
      // 是否显示加载框
      loading: false,
      // 表单数据
      formData: {},
      // 表单校验规则
      rules: {
        exp: [
          { required: true, message: '请输入每消费1元获得的经验值' }
        ],
        isDownGrade: [
          { required: true, message: '请选择是否自动降级' }
        ],
        downGradeCycle: [
          { required: true, message: '请选择降级周期' }
        ],
        downGradeExp: [
          { required: true, message: '请输入每次降级的经验值' }
        ]
      }
    }
  },
  created() {
    this.initFormData()

    // 查询数据
    this.loadFormData()
  },
  methods: {
    // 初始化表单数据
    initFormData() {
      this.formData = {
        exp: '',
        isDownGrade: '',
        downGradeCycle: '',
        downGradeExp: ''
      }
    },
    // 查询数据
    async loadFormData() {
      this.loading = true
      await this.$api.crm.member.memberLevelConfig.get().then(data => {
        this.formData = data
      }).finally(() => {
        this.loading = false
      })
    },
    // 提交表单事件
    submit() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.loading = true
          this.$api.crm.member.memberLevelConfig.modify(this.formData).then(() => {
            this.$msg.success('修改成功！')
          }).finally(() => {
            this.loading = false
          })
        }
      })
    },
    close() {
      this.$utils.closeCurrentPage(this.$parent)
    }
  }
}
</script>
