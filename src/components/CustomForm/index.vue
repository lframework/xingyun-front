<template>
  <div v-if="loadedConfig && dialogVisible" class="app-container">
    <div>
      <a-modal v-if="config.isDialog" v-model="dialogVisible" :mask-closable="false" :width="config.dialogWidth" :title="config.dialogTittle" :dialog-style="{ top: '20px' }" :footer="null">
        <form-create
          v-model="fapi"
          v-loading="loading"
          :value.sync="formData"
          :rule="config.formConfig.rule || []"
          :option="config.formConfig.option"
          @submit="onSubmit"
        />
      </a-modal>
      <div v-else v-loading="loading" style="padding-top: 20px;">
        <form-create
          v-model="fapi"
          v-loading="loading"
          :value.sync="formData"
          :rule="config.formConfig.rule || []"
          :option="config.formConfig.option"
          @submit="onSubmit"
        />
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'CustomForm',
  components: {
  },
  props: {
    requestParam: {
      type: [Object, Function],
      default: e => {
        return {}
      }
    },
    customFormId: {
      type: String,
      required: true
    },
    disabled: {
      type: Boolean,
      default: false
    },
    beforeOpen: {
      type: Function,
      default: e => {
        return () => {
          return true
        }
      }
    }
  },
  data() {
    return {
      loading: false,
      dialogVisible: false,
      loadedConfig: false,
      fapi: null,
      config: {
        formConfig: {
          rule: [],
          option: {}
        }
      },
      formData: {}
    }
  },
  computed: {
  },
  watch: {
    customFormId(val) {
      this.initConfig()
    }
  },
  mounted() {
    this.initConfig()
  },
  methods: {
    // 打开表单 由父页面触发
    openForm() {
      this.dialogVisible = true

      this.$nextTick(() => this.open())
    },
    open() {
      this.initConfig()

      // 初始化表单数据
      this.initFormData()
    },
    initFormData() {
      this.formData = {}

      if (this.config.requireQuery) {
        this.loading = true
        let requestParam = this.requestParam
        if (this.$utils.isFunction(this.requestParam)) {
          requestParam = this.requestParam()
        }
        this.$api.development.gen.customFormGetData(this.customFormId, this.$utils.isEmpty(requestParam) ? undefined : requestParam).then(d => {
          this.formData = d || {}
        }).finally(() => {
          this.loading = false
        })
      }
    },
    async initConfig() {
      if (this.$utils.isEmpty(this.customFormId)) {
        return
      }
      const that = this
      await this.$api.development.gen.getCustomFormConfig(this.customFormId).then(res => {
        that.config = res
        that.config.formConfig = JSON.parse(that.config.formConfig)

        that.loadedConfig = true
      })
    },
    onSubmit(formData) {
      if (!this.$utils.isEmpty(this.config.prefixSubmit)) {
        // 执行前置脚本
        const prefixSubmit = new Function('formData', '_this', this.config.prefixSubmit)
        if (prefixSubmit(formData, this)) {
          return
        }
      }

      this.loading = true
      this.$api.development.gen.customFormHandleData(this.customFormId, formData).then(() => {
        if (!this.$utils.isEmpty(this.config.suffixSubmit)) {
          // 执行后置脚本
          const suffixSubmit = new Function('formData', '_this', this.config.suffixSubmit)
          if (!suffixSubmit(formData, this)) {
            this.dialogVisible = false
          }
        }
      }).finally(() => {
        this.loading = false
      })
    }
  }
}
</script>
<style lang="less">
</style>
