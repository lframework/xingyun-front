<template>
  <a-modal v-model="visible" :mask-closable="false" width="85%" title="修改" :dialog-style="{ top: '20px' }" :footer="null">
    <div v-if="visible" v-loading="loading">
      <j-border>
        <j-form :enable-collapse="false" label-width="80px">
          <j-form-item :span="12" label="名称" :required="true">
            <a-input v-model="formData.name" allow-clear />
          </j-form-item>
          <j-form-item :span="12" label="分类">
            <gen-custom-selector-category-selector v-model="formData.category" />
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
        <j-form :enable-collapse="false" label-width="100px">
          <j-form-item :span="12" label="自定义列表" :required="true">
            <span>{{ formData.customListName }}</span>
          </j-form-item>
        </j-form>
      </j-border>

      <div style="height: 10px;" />

      <j-border title="基础配置">
        <j-form :enable-collapse="false" label-width="160px">
          <j-form-item :span="8" label="对话框标题">
            <a-input v-model="formData.dialogTittle" />
          </j-form-item>
          <j-form-item :span="8" label="对话框宽度" :required="true">
            <a-input v-model="formData.dialogWidth" />
          </j-form-item>
          <j-form-item :span="8" label="占位符">
            <a-input v-model="formData.placeholder" />
          </j-form-item>
        </j-form>
      </j-border>

      <div style="height: 10px;" />

      <j-border title="数据配置">
        <j-form :enable-collapse="false" label-width="160px">
          <j-form-item :span="8" label="ID字段" :required="true">
            <a-tree-select
              v-model="formData.idColumn"
              :replace-fields="{ title: 'name', key: 'id', value: 'id', children: 'columns' }"
              style="width: 100%"
              :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
              :tree-data="treeColumns"
              tree-default-expand-all
            />
          </j-form-item>
          <j-form-item :span="8" label="名称字段" :required="true">
            <a-tree-select
              v-model="formData.nameColumn"
              :replace-fields="{ title: 'name', key: 'id', value: 'id', children: 'columns' }"
              style="width: 100%"
              :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
              :tree-data="treeColumns"
              tree-default-expand-all
            />
          </j-form-item>
        </j-form>
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
import GenCustomSelectorCategorySelector from '@/components/Selector/GenCustomSelectorCategorySelector'

export default {
  components: {
    GenCustomSelectorCategorySelector
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
      // 树形菜单需要的字段
      treeColumns: []
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
        this.open()
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
        id: '',
        name: '',
        category: {},
        description: '',
        available: ''
      }

      this.treeColumns = []
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
      await this.$api.development.customSelector.get(this.id).then(data => {
        data.category = {
          id: data.categoryId,
          name: data.categoryName
        }

        this.formData = data

        this.changeTable().then(res => {
          this.treeColumns = res.filter(item => item.id !== 'customQuery')
          this.treeColumns.forEach(item => {
            item.selectable = false
            return item
          })
        })
      }).finally(() => {
        this.loading = false
      })
    },
    changeTable() {
      this.columns = []
      return this.$api.development.dataObj.queryColumns({
        id: this.formData.dataObjId
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
      if (this.$utils.isEmpty(this.formData.dialogWidth)) {
        this.$msg.error('请输入对话框宽度')
        return
      }
      if (this.$utils.isEmpty(this.formData.idColumn)) {
        this.$msg.error('请选择ID字段')
        return
      }
      if (this.$utils.isEmpty(this.formData.nameColumn)) {
        this.$msg.error('请选择名称字段')
        return
      }
      const treeColumns = []
      const tmpArr = this.treeColumns.map(item => {
        return item.columns || []
      })
      tmpArr.forEach(item => treeColumns.push(...item))

      this.formData.idColumnRelaId = treeColumns.filter(item => item.id === this.formData.idColumn)[0].relaId
      this.formData.nameColumnRelaId = treeColumns.filter(item => item.id === this.formData.nameColumn)[0].relaId

      const params = Object.assign({
        id: this.id,
        categoryId: this.formData.category.id
      }, this.formData)

      this.loading = true
      this.$api.development.customSelector.modify(params).then(() => {
        this.$msg.success('修改成功！')
        this.$emit('confirm')
        this.closeDialog()
      }).finally(() => {
        this.loading = false
      })
    }
  }
}
</script>
