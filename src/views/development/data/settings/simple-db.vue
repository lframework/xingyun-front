<template>
  <div v-loading="loading">
    <a-form-model ref="form" :label-col="{span: 6}" :wrapper-col="{span: 14}" :model="formData" :rules="rules">
      <a-form-model-item label="数据库" prop="dbType">
        <a-radio-group v-model="formData.dbType" @change="dbTypeChange">
          <a-radio v-for="item in constants.DB_TYPE" :key="item.code" :value="item.code">{{ item.desc }}</a-radio>
        </a-radio-group>
      </a-form-model-item>
      <a-form-model-item label="转换规则" prop="convertType">
        <a-row>
          <a-col :span="20">
            <a-select v-model="formData.convertType" show-search allow-clear>
              <a-select-option
                v-for="item in $enums.GEN_CONVERT_TYPE.values()"
                :key="item.code"
                :value="item.code"
              >{{ item.desc }}</a-select-option>
            </a-select>
          </a-col>
          <a-col :span="3" :offset="1">
            <a-tooltip title="将数据库字段名转换成属性名时的规则"><a-icon type="question-circle" /></a-tooltip>
          </a-col>
        </a-row>
      </a-form-model-item>
      <a-form-model-item label="数据库表" prop="table">
        <a-select v-model="formData.table" show-search allow-clear>
          <a-select-option
            v-for="(item, index) in tableOptions"
            :key="index"
            :value="item.tableSchema + '.' + item.tableName"
          >{{ item.tableSchema + '.' + item.tableName }}</a-select-option>
        </a-select>
      </a-form-model-item>
    </a-form-model>
    <div class="form-modal-footer">
      <a-space>
        <a-button type="primary" @click="submitEvent">保存</a-button>
        <a-button @click="closeDialog">取消</a-button>
      </a-space>
    </div>
  </div>
</template>
<script>
import * as constants from './constants'
export default {
  // 使用组件
  components: {
  },

  props: {
    id: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      // 是否显示加载框
      loading: false,
      // 表单数据
      formData: {},
      // 表单校验规则
      rules: {
        dbType: [
          { required: true, message: '请选择数据库' }
        ],
        convertType: [
          { required: true, message: '请选择转换规则' }
        ],
        table: [
          { required: true, message: '请选择数据库表' }
        ]
      },
      // 数据库表选择器数据
      tableOptions: []
    }
  },
  computed: {
    constants() {
      return constants
    }
  },
  created() {
    this.initFormData()
  },
  methods: {
    // 关闭对话框
    closeDialog() {
      this.$emit('close')
    },
    // 初始化表单数据
    initFormData() {
      this.formData = {
        dbType: constants.DB_TYPE.CURRENT.code,
        convertType: this.$enums.GEN_CONVERT_TYPE.UNDERLINE_TO_CAMEL.code,
        table: ''
      }

      this.tableOptions = []
    },
    // 提交表单事件
    submitEvent() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          const table = this.formData.table
          const tableArr = table.split('.')
          const tableSchema = tableArr[0]
          const tableName = tableArr[1]

          const params = {
            dataObjId: this.id,
            convertType: this.formData.convertType,
            tableSchema: tableSchema,
            tableName: tableName
          }
          this.loading = true
          this.$api.development.simpledb.create(params).then(() => {
            this.$msg.success('设置成功！')
            this.$emit('confirm')
            this.closeDialog()
          }).finally(() => {
            this.loading = false
          })
        }
      })
    },
    // 页面显示时由父页面触发
    open() {
      // 初始化数据
      this.initFormData()

      // 查询数据
      this.loadFormData()

      // 查询数据库表选择器数据
      this.loadTables()
    },
    // 查询数据
    loadFormData() {
    },
    dbTypeChange() {
      this.formData.table = ''
      this.loadTables()
    },
    loadTables() {
      // 请求接口参数
      const params = {
        isCurrentDb: true
      }

      if (this.$utils.isEqualWithStr(constants.DB_TYPE.ALL.code, this.formData.dbType)) {
        params.isCurrentDb = false
      }

      this.loading = true
      this.$api.development.simpledb.getTables(params).then(data => {
        this.tableOptions = data
      }).finally(() => {
        this.loading = false
      })
    }
  }
}
</script>
