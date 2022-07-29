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
        <a-button v-permission="['system:menu:query']" type="link" @click="e => { id = row.id;$nextTick(() => $refs.viewDialog.openDialog())}">查看</a-button>
        <a-button v-permission="['system:menu:modify']" type="link" @click="e => { id = row.id;$nextTick(() => $refs.updateDialog.openDialog()) }">修改</a-button>
        <a-button v-permission="['system:menu:delete']" type="link" class="ant-btn-link-danger" @click="e => { deleteRow(row) }">删除</a-button>
      </template>

      <template v-slot:form>
        <j-border>
          <j-form label-width="60px" @collapse="$refs.grid.refreshColumn()">
            <j-form-item label="标题" :span="6">
              <a-input v-model="searchFormData.searchMenuName" allow-clear />
            </j-form-item>
            <j-form-item label="状态" :span="6">
              <a-select v-model="searchFormData.available" placeholder="全部" allow-clear>
                <a-select-option :value="$enums.AVAILABLE.ENABLE.code">{{ '仅显示' + $enums.AVAILABLE.ENABLE.desc }}</a-select-option>
              </a-select>
            </j-form-item>
          </j-form>
        </j-border>
      </template>

      <template v-slot:toolbar_buttons>
        <a-space>
          <a-button type="primary" icon="search" @click="search">查询</a-button>
          <a-button v-permission="['system:menu:add']" type="primary" icon="plus" @click="$refs.addDialog.openDialog()">新增</a-button>
          <a-dropdown v-permission="['system:menu:modify']">
            <a-menu slot="overlay" @click="handleCommand">
              <a-menu-item key="batchEnable">
                <a-icon type="check" />批量启用
              </a-menu-item>
              <a-menu-item key="batchUnable">
                <a-icon type="stop" />批量停用
              </a-menu-item>
            </a-menu>
            <a-button>更多<a-icon type="down" /></a-button>
          </a-dropdown>
        </a-space>
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
        available: true
      },
      originData: [],
      tableProxy: {
        ajax: {
          query: () => this.$api.system.menu.query().then(res => {
            // 将带层级的列表转成树结构
            res = this.$utils.toArrayTree(res, { key: 'id', parentKey: 'parentId', children: 'children', strict: true })

            this.originData = res

            res = this.handleSearch()

            return res
          })
        }
      },
      toolBarConfig: {
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
        { field: 'isSpecial', title: '是否内置', width: 80, formatter: ({ cellValue }) => { return cellValue ? '是' : '否' } },
        { field: 'available', title: '状态', width: 80, slots: { default: 'available_default' }},
        { field: 'description', minWidth: 100, title: '备注' },
        { field: 'action', title: '操作', width: 150, slots: { default: 'action_default' }, fixed: 'right' }
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
        const options = { key: 'id', parentKey: 'parentId', children: 'children', strict: true }
        let tableData = this.$utils.searchTree(this.originData, item => {
          let filterResult = true
          if (isFilterName) {
            filterResult &= this.$utils.toString(item['title']).indexOf(filterName) > -1
          }

          return filterResult
        }, options)

        if (isFilterAvailable) {
          tableData = this.$utils.toTreeArray(tableData, options)
          tableData = tableData.filter(item => this.$utils.isEqualWithStr(item['available'], filterAvailable))
          tableData = this.$utils.toArrayTree(tableData, options)
        }

        return tableData
      } else {
        return this.originData
      }
    },
    search(e) {
      this.$refs.grid.commitProxy('reload')
    },
    handleCommand({ key }) {
      if (key === 'batchEnable') {
        this.batchEnable()
      } else if (key === 'batchUnable') {
        this.batchUnable()
      }
    },
    batchUnable() {
      const records = this.$refs.grid.getCheckboxRecords()

      if (this.$utils.isEmpty(records)) {
        this.$msg.error('请选择要停用的菜单！')
        return
      }

      this.$msg.confirm(records.filter(item => item.isSpecial).length > 0 ? '选择的菜单包含内置菜单，是否确定停用？注：停用内置菜单可能会导致系统功能异常，请谨慎操作' : '是否确定停用选择的菜单？').then(() => {
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
      const records = this.$utils.union(this.$refs.grid.getCheckboxRecords(), this.$refs.grid.getCheckboxIndeterminateRecords(true))

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
      this.$msg.confirm(row.isSpecial ? '当前菜单为内置菜单，是否确定删除？注：删除内置菜单可能会导致系统功能异常，请谨慎操作' : '是否确定删除该菜单？').then(() => {
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
