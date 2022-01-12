<template>
  <el-form ref="form" v-loading="loading" label-width="100px" title-align="right" :model="formData" :rules="rules">
    <el-form-item label="数据库" prop="dbType">
      <el-radio-group v-model="formData.dbType" @change="dbTypeChange">
        <el-radio v-for="item in constants.DB_TYPE" :key="item.code" :label="item.code">{{ item.desc }}</el-radio>
      </el-radio-group>
    </el-form-item>
    <el-form-item label="转换规则" prop="convertType">
      <el-select v-model="formData.convertType" filterable clearable>
        <el-option
          v-for="item in $enums.GEN_CONVERT_TYPE.values()"
          :key="item.code"
          :label="item.desc"
          :value="item.code"
        />
      </el-select>
      <el-popover
        class="tip-question"
        placement="top-start"
        width="200"
        trigger="click"
        content="将数据库字段名转换成属性名时的规则。"
      >
        <el-button slot="reference" type="text" icon="el-icon-question" />
      </el-popover>
    </el-form-item>
    <el-form-item label="数据库表" prop="table">
      <el-select v-model="formData.table" filterable clearable>
        <el-option
          v-for="(item, index) in tableOptions"
          :key="index"
          :label="item.tableSchema + '.' + item.tableName"
          :value="item.tableSchema + '.' + item.tableName"
        />
      </el-select>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="submitEvent">保存</el-button>
      <el-button @click="$emit('close')">取消</el-button>
    </el-form-item>
  </el-form>
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
    // 初始化表单数据
    initFormData() {
      this.formData = {
        id: '',
        code: '',
        name: '',
        available: '',
        description: '',
        dbType: constants.DB_TYPE.CURRENT.code,
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
