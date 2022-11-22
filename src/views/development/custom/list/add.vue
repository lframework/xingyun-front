<template>
  <a-modal v-model="visible" :mask-closable="false" width="85%" title="新增" :dialog-style="{ top: '20px' }" :footer="null">
    <div v-if="visible" v-loading="loading">
      <j-border>
        <j-form :enable-collapse="false" label-width="80px">
          <j-form-item :span="12" label="名称" :required="true">
            <a-input v-model="formData.name" allow-clear />
          </j-form-item>
          <j-form-item :span="12" label="分类">
            <gen-custom-list-category-selector v-model="formData.category" />
          </j-form-item>
          <j-form-item :span="24" label="备注" :content-nest="false">
            <a-textarea v-model="formData.description" />
          </j-form-item>
        </j-form>
      </j-border>

      <div style="height: 10px;" />

      <j-border>
        <j-form :enable-collapse="false" label-width="80px">
          <j-form-item :span="12" label="数据对象" :required="true">
            <gen-data-obj-selector v-model="formData.dataObj" :request-params="{ available: true }" @input="changeTable" />
          </j-form-item>
        </j-form>
      </j-border>

      <div style="height: 10px;" />

      <j-border title="基础配置">
        <j-form :enable-collapse="false" label-width="160px">
          <j-form-item :span="8" label="列表类型" :required="true">
            <a-select v-model="formData.listType" allow-clear>
              <a-select-option v-for="item in $enums.GEN_CUSTOM_LIST_TYPE.values()" :key="item.code" :value="item.code">{{ item.desc }}</a-select-option>
            </a-select>
          </j-form-item>
          <j-form-item :span="8" label="表单Label宽度（px）" :required="true">
            <a-input-number v-model="formData.labelWidth" class="number-input" :min="1" />
          </j-form-item>
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
          <j-form-item v-if="!formData.treeData" :span="8" label="是否分页" :required="true">
            <a-select v-model="formData.hasPage" allow-clear>
              <a-select-option :value="true">是</a-select-option>
              <a-select-option :value="false">否</a-select-option>
            </a-select>
          </j-form-item>
          <j-form-item :span="8" label="是否树形列表" :required="true">
            <a-select v-model="formData.treeData" allow-clear>
              <a-select-option :value="true">是</a-select-option>
              <a-select-option :value="false">否</a-select-option>
            </a-select>
          </j-form-item>
          <j-form-item v-if="formData.treeData" :span="8" label="父级ID字段" :required="true">
            <a-tree-select
              v-model="formData.treePidColumn"
              :replace-fields="{ title: 'name', key: 'id', value: 'id', children: 'columns' }"
              style="width: 100%"
              :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
              :tree-data="treeColumns"
              tree-default-expand-all
            />
          </j-form-item>
          <j-form-item v-if="formData.treeData" :span="8" label="树形节点字段" :required="true">
            <a-tree-select
              v-model="formData.treeNodeColumn"
              :replace-fields="{ title: 'name', key: 'id', value: 'id', children: 'columns' }"
              style="width: 100%"
              :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
              :tree-data="treeColumns"
              tree-default-expand-all
            />
          </j-form-item>
          <j-form-item v-if="formData.treeData" :span="8" label="子节点Key值" :required="true">
            <a-input v-model="formData.treeChildrenKey" allow-clear />
          </j-form-item>
        </j-form>
      </j-border>

      <div style="height: 10px;" />

      <j-border title="查询条件">
        <query-params ref="queryParams" :columns="queryColumns" />
      </j-border>

      <div style="height: 10px;" />

      <j-border title="列表配置">
        <query-detail ref="queryDetail" :columns="columns" />
      </j-border>

      <div style="height: 10px;" />

      <j-border title="查询前置SQL语句">
        <a-textarea v-model="formData.queryPrefixSql" :auto-size="{ minRows: 4, maxRows: 4 }" />
      </j-border>

      <div style="height: 10px;" />

      <j-border title="查询后置SQL语句">
        <a-textarea v-model="formData.querySuffixSql" :auto-size="{ minRows: 4, maxRows: 4 }" />
      </j-border>

      <div style="height: 10px;" />

      <j-border title="后置SQL语句">
        <a-textarea v-model="formData.suffixSql" :auto-size="{ minRows: 4, maxRows: 4 }" />
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
import GenCustomListCategorySelector from '@/components/Selector/GenCustomListCategorySelector'
import GenDataObjSelector from '@/components/Selector/GenDataObjSelector'
import QueryDetail from './query-detail'
import QueryParams from './query-params'

export default {
  components: {
    GenCustomListCategorySelector,
    GenDataObjSelector,
    QueryDetail,
    QueryParams
  },
  data() {
    return {
      // 是否可见
      visible: false,
      // 是否显示加载框
      loading: false,
      // 表单数据
      formData: {},
      // 所有字段
      columns: [],
      // 查询条件的字段，排除掉自定义查询条件
      queryColumns: [],
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
        name: '',
        category: {},
        description: '',
        dataObj: {}
      }

      this.columns = []
      this.queryColumns = []
      this.treeColumns = []
    },
    // 页面显示时由父页面触发
    open() {
      // 初始化表单数据
      this.initFormData()
    },
    changeTable() {
      this.columns = []
      this.queryColumns = []
      this.$api.development.dataObj.queryColumns({
        id: this.formData.dataObj.id
      }).then(res => {
        this.columns = res
        this.columns.forEach(item => {
          item.checkable = false
          return item
        })

        this.queryColumns = res.filter(item => item.id !== 'customQuery')
        this.queryColumns.forEach(item => {
          item.checkable = false
          return item
        })

        this.treeColumns = res.filter(item => item.id !== 'customQuery')
        this.treeColumns.forEach(item => {
          item.selectable = false
          return item
        })
      })
    },
    submit() {
      if (this.$utils.isEmpty(this.formData.name)) {
        this.$msg.error('请输入名称')
        return
      }
      if (this.$utils.isEmpty(this.formData.dataObj.id)) {
        this.$msg.error('请选择数据对象')
        return
      }
      if (this.$utils.isEmpty(this.formData.listType)) {
        this.$msg.error('请选择列表类型')
        return
      }
      if (this.$utils.isEmpty(this.formData.labelWidth)) {
        this.$msg.error('请输入表单Label宽度')
        return
      }
      if (this.$utils.isEmpty(this.formData.idColumn)) {
        this.$msg.error('请选择ID字段')
        return
      }

      const treeColumns = []
      const tmpArr = this.treeColumns.map(item => {
        return item.columns || []
      })
      tmpArr.forEach(item => treeColumns.push(...item))

      this.formData.idColumnRelaId = treeColumns.filter(item => item.id === this.formData.idColumn)[0].relaId

      if (this.$utils.isEmpty(this.formData.treeData)) {
        this.$msg.error('请选择是否树形列表')
        return
      }
      if (this.formData.treeData) {
        this.formData.hasPage = false
        if (this.$utils.isEmpty(this.formData.treePidColumn)) {
          this.$msg.error('请选择父级ID字段')
          return
        }
        if (this.$utils.isEmpty(this.formData.treeNodeColumn)) {
          this.$msg.error('请选择树形节点字段')
          return
        }
        if (this.$utils.isEmpty(this.formData.treeChildrenKey)) {
          this.$msg.error('请输入子节点Key值')
          return
        }

        this.formData.treePidColumnRelaId = treeColumns.filter(item => item.id === this.formData.treePidColumn)[0].relaId
        this.formData.treeNodeColumnRelaId = treeColumns.filter(item => item.id === this.formData.treeNodeColumn)[0].relaId
      } else {
        if (this.$utils.isEmpty(this.formData.hasPage)) {
          this.$msg.error('请选择是否分页')
          return
        }
      }
      if (!this.$refs.queryParams.validDate()) {
        return
      }
      if (!this.$refs.queryDetail.validDate()) {
        return
      }
      const params = Object.assign({
        dataObjId: this.formData.dataObj.id,
        categoryId: this.formData.category.id,
        queryParams: this.$refs.queryParams.getTableData(),
        details: this.$refs.queryDetail.getTableData()
      }, this.formData)

      this.loading = true
      this.$api.development.customList.add(params).then(() => {
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
