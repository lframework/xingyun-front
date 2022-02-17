<template>
  <div v-permission="['system:menu:query']" class="app-container">
    <vxe-grid
      ref="grid"
      resizable
      show-overflow
      highlight-hover-row
      keep-source
      row-id="id"
      :tree-config="{}"
      :export-config="{}"
      :proxy-config="tableProxy"
      :columns="tableColumn"
      :toolbar-config="toolBarConfig"
      :loading="loading"
      :height="$defaultTableHeight"
    >
      <template v-slot:menuDisplay_default="{ row }">
        <menu-display-tag :menu-display="row.display" />
      </template>

      <template v-slot:available_default="{ row }">
        <available-tag :available="row.available" />
      </template>

      <template v-slot:action_default="{ row }">
        <el-button v-permission="['system:menu:query']" type="text" icon="el-icon-view" @click="e => { id = row.id;$refs.viewDialog.openDialog()}">查看</el-button>
        <el-button v-if="!row.isSpecial" v-permission="['system:menu:modify']" type="text" icon="el-icon-edit" @click="e => { id = row.id;$refs.updateDialog.openDialog() }">修改</el-button>
        <el-button v-if="!row.isSpecial" v-permission="['system:menu:delete']" type="text" icon="el-icon-delete" @click="e => { deleteRow(row) }">删除</el-button>
      </template>

      <template v-slot:form>
        <j-border>
          <j-form label-width="60px" @collapse="$refs.grid.refreshColumn()">
            <j-form-item label="标题" :span="6">
              <el-input v-model="searchFormData.searchMenuName" clearable />
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
            <el-button type="primary" icon="el-icon-search" @click="handleSearch">搜索</el-button>
          </el-form-item>
          <el-form-item v-permission="['system:menu:add']">
            <el-button type="primary" icon="el-icon-plus" @click="$refs.addDialog.openDialog()">新增</el-button>
          </el-form-item>
          <el-form-item v-permission="['system:menu:modify']">
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

    <!-- 详情窗口 -->
    <detail :id="id" ref="viewDialog" />
  </div>
</template>

<script>
import Add from './add'
import Modify from './modify'
import Detail from './detail'
import MenuDisplayTag from '@/components/Tag/MenuDisplay'
import AvailableTag from '@/components/Tag/Available'

export default {
  name: 'Menu',
  components: {
    Add, Modify, Detail, MenuDisplayTag, AvailableTag
  },
  data() {
    return {
      loading: false,
      id: '',
      searchFormData: {
        searchMenuName: '',
        available: ''
      },
      originData: [],
      tableProxy: {
        ajax: {
          query: () => this.$api.system.menu.query().then(res => {
            // 将带层级的列表转成树结构
            res = this.$utils.toArrayTree(res, { key: 'id', parentKey: 'parentId', children: 'children', strict: true })

            this.originData = res

            return res
          })
        }
      },
      toolBarConfig: {
        zoom: true,
        custom: true,
        refresh: true,
        slots: {
          buttons: 'toolbar_buttons'
        }
      },
      tableColumn: [
        { type: 'checkbox', width: 40 },
        { field: 'code', title: '编号', width: 80 },
        { field: 'title', title: '标题', minWidth: 160, treeNode: true },
        { field: 'display', title: '类型', width: 80, slots: { default: 'menuDisplay_default' }},
        { field: 'permission', title: '权限', width: 220 },
        { field: 'available', title: '状态', width: 80, slots: { default: 'available_default' }},
        { field: 'description', minWidth: 100, title: '备注' },
        { field: 'action', title: '操作', width: 210, slots: { default: 'action_default' }, fixed: 'right' }
      ]
    }
  },
  created() {
  },
  methods: {
    handleSearch() {
      const filterName = this.$utils.toString(this.searchFormData.searchMenuName).trim()
      const filterAvailable = this.searchFormData.available
      const isFilterName = !this.$utils.isEmpty(filterName)
      const isFilterAvailable = !this.$utils.isEmpty(filterAvailable)
      if (isFilterName || isFilterAvailable) {
        const options = { key: 'id', parentKey: 'parentId', children: 'children' }
        const tableData = this.$utils.searchTree(this.originData, item => {
          let filterResult = true
          if (isFilterName) {
            filterResult &= this.$utils.toString(item['title']).indexOf(filterName) > -1
          }

          if (isFilterAvailable) {
            filterResult &= this.$utils.isEqualWithStr(item['available'], filterAvailable) && this.$utils.isEmpty(item['children'])
          }

          return filterResult
        }, options)
        this.$refs.grid.loadData(tableData)
        // 搜索之后默认展开所有子节点
        this.$nextTick(() => {
          this.$refs.grid.setAllTreeExpand(true)
        })
      } else {
        this.$refs.grid.loadData(this.originData)
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
        this.$msg.error('请选择要停用的菜单！')
        return
      }

      this.$msg.confirm('是否确定停用选择的菜单？').then(() => {
        this.loading = true
        const ids = records.map(t => t.id)
        this.$api.system.menu.batchUnable(ids).then(data => {
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
        this.$msg.error('请选择要启用的菜单！')
        return
      }

      this.$msg.confirm('是否确定启用选择的菜单？').then(() => {
        this.loading = true
        const ids = records.map(t => t.id)
        this.$api.system.menu.batchEnable(ids).then(data => {
          this.$msg.success('启用成功！')
          this.search()
        }).finally(() => {
          this.loading = false
        })
      })
    },
    // 删除
    deleteRow(row) {
      this.$msg.confirm('是否确定删除该菜单？').then(() => {
        this.loading = true
        this.$api.system.menu.deleteById(row.id).then(() => {
          this.$msg.success('删除成功！')
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
