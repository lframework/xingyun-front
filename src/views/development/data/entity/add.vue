<template>
  <a-modal v-model="visible" :mask-closable="false" width="85%" title="新增" :dialog-style="{ top: '20px' }" :footer="null">
    <div v-if="visible" v-loading="loading">
      <j-border>
        <j-form :enable-collapse="false" label-width="80px">
          <j-form-item :span="12" label="名称" :required="true">
            <a-input v-model="formData.name" allow-clear />
          </j-form-item>
          <j-form-item :span="12" label="分类">
            <gen-data-entity-category-selector v-model="formData.category" />
          </j-form-item>
          <j-form-item :span="24" label="备注" :content-nest="false">
            <a-textarea v-model="formData.description" />
          </j-form-item>
        </j-form>
      </j-border>

      <div style="height: 10px;" />

      <j-border>
        <j-form :enable-collapse="false" label-width="80px">
          <j-form-item :span="12" label="数据表" :required="true">
            <simple-db-table-selector v-model="formData.table" @input="changeTable" />
          </j-form-item>
        </j-form>
      </j-border>

      <div style="height: 10px;" />

      <j-border>
        <generate-column ref="generateColumn" :columns="columns" @refresh-columns="e => columns = e" />
      </j-border>

      <div class="form-modal-footer">
        <a-space>
          <a-button type="primary" :loading="loading" html-type="submit" @click="submit">保存</a-button>
          <a-button :loading="loading" @click="closeDialog">取消</a-button>
        </a-space>
      </div>
    </div>
  </a-modal>
</template>
<script>
import GenDataEntityCategorySelector from '@/components/Selector/GenDataEntityCategorySelector'
import GenerateColumn from './generate-column'
import SimpleDbTableSelector from '@/components/Selector/SimpleDbTableSelector'

export default {
  components: {
    GenerateColumn,
    GenDataEntityCategorySelector,
    SimpleDbTableSelector
  },
  data() {
    return {
      // 是否可见
      visible: false,
      // 是否显示加载框
      loading: false,
      // 表单数据
      formData: {},
      columns: []
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

      this.open()
    },
    // 关闭对话框
    closeDialog() {
      this.visible = false
      this.$emit('close')
    },
    // 初始化表单数据
    initFormData() {
      this.formData = {
        name: '',
        category: {},
        description: '',
        table: {}
      }

      this.columns = []
    },
    // 页面显示时由父页面触发
    open() {
      // 初始化表单数据
      this.initFormData()
    },
    changeTable(e) {
      this.columns = []
      if (this.$utils.isEmpty(e)) {
        return
      }
      this.$api.development.dataEntity.queryColumns({
        tableName: e.id
      }).then(res => {
        res = res.map(item => {
          return Object.assign({ dataDic: {
            id: item.dataDicId,
            name: item.dataDicName
          }, regularExpression: '' }, item)
        })
        this.columns = res
      }).catch(() => {
        this.formData.table = {}
      })
    },
    submit() {
      if (this.$utils.isEmpty(this.formData.name)) {
        this.$msg.error('请输入名称')
        return
      }
      if (!this.$refs.generateColumn.validDate()) {
        return
      }
      const params = Object.assign({
        tableName: this.formData.table.id,
        categoryId: this.formData.category.id,
        columns: this.$refs.generateColumn.getColumns().map(item => {
          item.dataDicId = item.dataDic.id
          return item
        })
      }, this.formData)

      this.loading = true
      this.$api.development.dataEntity.add(params).then(() => {
        this.$msg.success('新增成功！')
        this.$emit('confirm')
        this.closeDialog()
      }).finally(() => {
        this.loading = false
      })
    }
  }
}
</script>
