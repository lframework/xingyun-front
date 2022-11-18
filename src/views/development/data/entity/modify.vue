<template>
  <a-modal v-model="visible" :mask-closable="false" width="85%" title="修改" :dialog-style="{ top: '20px' }" :footer="null">
    <div v-if="visible" v-loading="loading">
      <j-border>
        <j-form :enable-collapse="false" label-width="80px">
          <j-form-item :span="12" label="名称" :required="true">
            <a-input v-model="formData.name" allow-clear />
          </j-form-item>
          <j-form-item :span="12" label="分类">
            <gen-data-entity-category-selector v-model="formData.category" />
          </j-form-item>
          <j-form-item :span="12" label="状态" :required="true">
            <a-select v-model="formData.available" allow-clear>
              <a-select-option v-for="item in $enums.AVAILABLE.values()" :key="item.code" :value="item.code">{{ item.desc }}</a-select-option>
            </a-select>
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
            <a-space>
              <span>{{ formData.tableName }}</span>
              <a-button type="link" icon="reload" :loading="loading" @click="syncTable" />
            </a-space>
          </j-form-item>
        </j-form>
      </j-border>

      <div style="height: 10px;" />

      <j-border>
        <generate-column ref="generateColumn" :columns="columns" @refreshColumns="e => columns = e" />
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

export default {
  components: {
    GenerateColumn,
    GenDataEntityCategorySelector
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

      this.$nextTick(() => {
        this.$nextTick(() => this.open())
      })
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
        tableName: '',
        available: ''
      }

      this.columns = []
    },
    // 页面显示时由父页面触发
    open() {
      // 初始化表单数据
      this.initFormData()

      this.loadFormData()
    },
    // 查询数据
    async loadFormData() {
      this.loading = true
      await this.$api.development.dataEntity.get(this.id).then(data => {
        let columns = data.columns
        columns = columns.map(item => {
          return Object.assign({ dataDic: {
            id: item.dataDicId,
            name: item.dataDicName
          }, regularExpression: '' }, item)
        })
        this.columns = columns
        delete data.columns
        data.category = {
          id: data.categoryId,
          name: data.categoryName
        }
        this.formData = data
      }).finally(() => {
        this.loading = false
      })
    },
    submit() {
      if (this.$utils.isEmpty(this.formData.name)) {
        this.$msg.error('请输入名称')
        return
      }
      if (this.$utils.isEmpty(this.formData.available)) {
        this.$msg.error('请选择状态')
        return
      }
      if (!this.$refs.generateColumn.validDate()) {
        return
      }
      const params = Object.assign({
        categoryId: this.formData.category.id,
        columns: this.$refs.generateColumn.getColumns().map(item => {
          item.dataDicId = item.dataDic.id
          return item
        })
      }, this.formData)

      this.loading = true
      this.$api.development.dataEntity.modify(params).then(() => {
        this.$msg.success('修改成功！')
        this.$emit('confirm')
        this.closeDialog()
      }).finally(() => {
        this.loading = false
      })
    },
    syncTable() {
      this.$msg.confirm('是否确认同步表结构？注：同步表结构可能会丢失差异字段配置').then(() => {
        this.loading = true
        this.$api.development.dataEntity.syncTable(this.id).then(() => {
          this.$msg.successTip('同步成功，正在重载数据...')
          this.$nextTick(() => this.open())
        })
      })
    }
  }
}
</script>
