<template>
  <div v-permission="['base-data:product:category:query']" class="app-container">
    <vxe-grid
      ref="grid"
      resizable
      show-overflow
      highlight-hover-row
      keep-source
      row-id="id"
      :export-config="{}"
      :proxy-config="tableProxy"
      :columns="tableColumn"
      :toolbar-config="tableToolbar"
      :tree-config="{ expandAll: true }"
      :loading="loading"
      :height="$defaultTableHeight"
    >
      <template v-slot:icon_default="{ row }">
        <span v-if="!$utils.isEmpty(row.icon)">
          <svg-icon :icon-class="row.icon" />
        </span>
      </template>

      <template v-slot:menuDisplay_default="{ row }">
        <menu-display-tag :menu-display="row.display" />
      </template>

      <template v-slot:available_default="{ row }">
        <available-tag :available="row.available" />
      </template>

      <template v-slot:action_default="{ row }">
        <el-button v-permission="['base-data:product:category:add']" type="text" icon="el-icon-plus" @click="e => { id = row.id;$refs.addChildrenDialog.openDialog()}">新增子类目</el-button>
        <el-button v-permission="['base-data:product:category:modify']" type="text" icon="el-icon-edit" @click="e => { id = row.id;$refs.updateDialog.openDialog() }">修改</el-button>
      </template>

      <template v-slot:form>
        <j-border>
          <j-form>
            <j-form-item label="编号" :span="6">
              <el-input v-model="searchFormData.code" clearable />
            </j-form-item>
            <j-form-item label="名称" :span="6">
              <el-input v-model="searchFormData.name" clearable />
            </j-form-item>
            <j-form-item label="状态" :span="6">
              <el-select v-model="searchFormData.available" placeholder="全部" clearable>
                <el-option v-for="item in $enums.AVAILABLE.values()" :key="item.code" :label="item.desc" :value="item.code" />
              </el-select>
            </j-form-item>
          </j-form>
        </j-border>
      </template>

      <template v-slot:toolbar_buttons>
        <el-form :inline="true">
          <el-form-item>
            <el-button type="primary" icon="el-icon-search" @click="search">搜索</el-button>
          </el-form-item>
          <el-form-item v-permission="['base-data:product:category:add']">
            <el-button type="primary" icon="el-icon-plus" @click="$refs.addDialog.openDialog()">新增</el-button>
          </el-form-item>
          <el-form-item v-permission="['base-data:product:category:modify']">
            <el-dropdown trigger="click" @command="handleCommand">
              <el-button>
                更多<i class="el-icon-more el-icon--right" />
              </el-button>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="batchEnable"><i class="el-icon-check" />批量启用</el-dropdown-item>
                <el-dropdown-item command="batchUnable"><i class="el-icon-s-release" />批量停用</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </el-form-item>
        </el-form>
      </template>
    </vxe-grid>

    <!-- 新增窗口 -->
    <add ref="addDialog" @confirm="search" />

    <!-- 修改窗口 -->
    <modify :id="id" ref="updateDialog" @confirm="search" />

    <!-- 新建子类目窗口 -->
    <add-children :id="id" ref="addChildrenDialog" @confirm="search" />
  </div>
</template>

<script>
import Add from './add'
import Modify from './modify'
import AddChildren from './add-children'
import MenuDisplayTag from '@/components/Tag/MenuDisplay'
import AvailableTag from '@/components/Tag/Available'

export default {
  name: 'ProductCategory',
  components: {
    Add, Modify, AddChildren, MenuDisplayTag, AvailableTag
  },
  data() {
    return {
      loading: false,
      id: '',
      searchFormData: {
        code: '',
        name: '',
        available: this.$enums.AVAILABLE.ENABLE.code
      },
      originData: [],
      tableProxy: {
        ajax: {
          query: () => this.$api.baseData.product.category.query().then(res => {
            // 将带层级的列表转成树结构
            res = this.$utils.toArrayTree(res, { key: 'id', parentKey: 'parentId', children: 'children', strict: true })

            this.originData = res

            return this.handleSearch()
          })
        }
      },
      tableToolbar: {
        refresh: true,
        slots: {
          buttons: 'toolbar_buttons'
        }
      },
      tableColumn: [
        { type: 'checkbox', width: 40 },
        { field: 'code', title: '编号', width: 120 },
        { field: 'name', title: '名称', minWidth: 160, treeNode: true },
        { field: 'available', title: '状态', width: 80, slots: { default: 'available_default' }},
        { field: 'description', title: '备注', minWidth: 160 },
        { field: 'action', title: '操作', width: 200, slots: { default: 'action_default' }, fixed: 'right' }
      ]
    }
  },
  created() {
  },
  methods: {
    handleSearch() {
      const filterCode = this.$utils.toString(this.searchFormData.code).trim()
      const filterName = this.$utils.toString(this.searchFormData.name).trim()
      const filterAvailable = this.searchFormData.available
      const isFilterCode = !this.$utils.isEmpty(filterCode)
      const isFilterName = !this.$utils.isEmpty(filterName)
      const isFilterAvailable = !this.$utils.isEmpty(filterAvailable)
      if (isFilterName || isFilterAvailable || isFilterCode) {
        const options = { key: 'id', parentKey: 'parentId', children: 'children' }
        const tableData = this.$utils.searchTree(this.originData, item => {
          let filterResult = true
          if (isFilterCode) {
            filterResult &= this.$utils.isEqualWithStr(this.$utils.toString(item['code']), filterCode)
          }

          if (isFilterName) {
            filterResult &= this.$utils.toString(item['name']).indexOf(filterName) > -1
          }

          if (isFilterAvailable) {
            filterResult &= this.$utils.isEqualWithStr(item['available'], filterAvailable) && this.$utils.isEmpty(item['children'])
          }

          return filterResult
        }, options)

        // 搜索之后默认展开所有子节点
        this.$nextTick(() => {
          this.$refs.grid.setAllTreeExpand(true)
        })
        return tableData
      } else {
        return this.originData
      }
    },
    search() {
      this.$refs.grid.commitProxy('reload')
    },
    handleCommand(command) {
      if (command === 'batchEnable') {
        this.batchEnable()
      } else if (command === 'batchUnable') {
        this.batchUnable()
      }
    },
    batchUnable() {
      const records = this.$refs.grid.getCheckboxRecords()

      if (this.$utils.isEmpty(records)) {
        this.$msg.error('请选择要停用的类目！')
        return
      }

      this.$msg.confirm('是否确定停用选择的类目？').then(() => {
        this.loading = true
        const ids = records.map(t => t.id)
        this.$api.baseData.product.category.batchUnable(ids).then(data => {
          this.$msg.success('停用成功！')
          this.search()
        }).finally(() => {
          this.loading = false
        })
      })
    },
    batchEnable() {
      const records = this.$utils.union(this.$refs.grid.getCheckboxRecords(), this.$refs.grid.getCheckboxIndeterminateRecords())

      if (this.$utils.isEmpty(records)) {
        this.$msg.error('请选择要启用的类目！')
        return
      }

      this.$msg.confirm('是否确定启用选择的类目？').then(() => {
        this.loading = true
        const ids = records.map(t => t.id)
        this.$api.baseData.product.category.batchEnable(ids).then(data => {
          this.$msg.success('启用成功！')
          this.search()
        }).finally(() => {
          this.loading = false
        })
      })
    }
  }
}
</script>

<style scoped>

</style>
