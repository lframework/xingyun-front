<template>
  <div v-permission="['settle:in-item:query']" class="app-container">

    <!-- 数据列表 -->
    <vxe-grid
      ref="grid"
      resizable
      show-overflow
      highlight-hover-row
      keep-source
      row-id="id"
      :proxy-config="proxyConfig"
      :columns="tableColumn"
      :toolbar-config="toolbarConfig"
      :pager-config="{}"
      :loading="loading"
      :height="$defaultTableHeight"
    >
      <template v-slot:form>
        <j-border>
          <j-form label-width="80px" @collapse="$refs.grid.refreshColumn()">
            <j-form-item label="编号" :span="6">
              <a-input v-model="searchFormData.code" allow-clear />
            </j-form-item>
            <j-form-item label="名称" :span="6">
              <a-input v-model="searchFormData.name" allow-clear />
            </j-form-item>
            <j-form-item label="状态" :span="6">
              <a-select v-model="searchFormData.available" placeholder="全部" allow-clear>
                <a-select-option v-for="item in $enums.AVAILABLE.values()" :key="item.code" :value="item.code">{{ item.desc }}</a-select-option>
              </a-select>
            </j-form-item>
          </j-form>
        </j-border>
      </template>
      <!-- 工具栏 -->
      <template v-slot:toolbar_buttons>
        <a-space>
          <a-button type="primary" icon="search" @click="search">查询</a-button>
          <a-button v-permission="['settle:in-item:add']" type="primary" icon="plus" @click="$refs.addDialog.openDialog()">新增</a-button>
          <a-button v-permission="['settle:in-item:export']" icon="download" @click="exportList">导出</a-button>
          <a-dropdown v-permission="['settle:in-item:modify']">
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

      <!-- 状态 列自定义内容 -->
      <template v-slot:available_default="{ row }">
        <available-tag :available="row.available" />
      </template>

      <!-- 操作 列自定义内容 -->
      <template v-slot:action_default="{ row }">
        <a-button v-permission="['settle:in-item:query']" type="link" @click="e => { id = row.id;$nextTick(() => $refs.viewDialog.openDialog()) }">查看</a-button>
        <a-button v-permission="['settle:in-item:modify']" type="link" @click="e => { id = row.id;$nextTick(() => $refs.updateDialog.openDialog()) }">修改</a-button>
      </template>
    </vxe-grid>

    <!-- 新增窗口 -->
    <add ref="addDialog" @confirm="search" />

    <!-- 修改窗口 -->
    <modify :id="id" ref="updateDialog" @confirm="search" />

    <!-- 查看窗口 -->
    <detail :id="id" ref="viewDialog" />
  </div>
</template>

<script>
import AvailableTag from '@/components/Tag/Available'
import Add from './add'
import Modify from './modify'
import Detail from './detail'

export default {
  name: 'SettleInItem',
  components: {
    Add, Modify, Detail, AvailableTag
  },
  data() {
    return {
      loading: false,
      // 当前行数据
      id: '',
      ids: [],
      // 查询列表的查询条件
      searchFormData: {},
      // 分页配置
      pagerConfig: {
        // 默认每页条数
        pageSize: 20,
        // 可选每页条数
        pageSizes: [5, 15, 20, 50, 100, 200, 500, 1000]
      },
      // 工具栏配置
      toolbarConfig: {
        // 自定义左侧工具栏
        slots: {
          buttons: 'toolbar_buttons'
        }
      },
      // 列表数据配置
      tableColumn: [
        { type: 'checkbox', width: 40 },
        { field: 'code', title: '编号', width: 100 },
        { field: 'name', title: '名称', minWidth: 180 },
        { field: 'description', title: '备注', minWidth: 200 },
        { field: 'available', title: '状态', width: 80, slots: { default: 'available_default' }},
        { field: 'createBy', title: '创建人', width: 100 },
        { field: 'createTime', title: '创建时间', width: 170 },
        { field: 'updateBy', title: '修改人', width: 100 },
        { field: 'updateTime', title: '修改时间', width: 170 },
        { title: '操作', width: 120, fixed: 'right', slots: { default: 'action_default' }}
      ],
      // 请求接口配置
      proxyConfig: {
        props: {
          // 响应结果列表字段
          result: 'datas',
          // 响应结果总条数字段
          total: 'totalCount'
        },
        ajax: {
          // 查询接口
          query: ({ page, sorts, filters }) => {
            return this.$api.settle.inItem.query(this.buildQueryParams(page))
          }
        }
      }
    }
  },
  created() {
  },
  methods: {
    // 列表发生查询时的事件
    search() {
      this.$refs.grid.commitProxy('reload')
    },
    // 查询前构建查询参数结构
    buildQueryParams(page) {
      return Object.assign({
        pageIndex: page.currentPage,
        pageSize: page.pageSize
      }, this.buildSearchFormData())
    },
    // 查询前构建具体的查询参数
    buildSearchFormData() {
      return Object.assign({ }, this.searchFormData)
    },
    handleCommand({ key }) {
      if (key === 'batchEnable') {
        this.batchEnable()
      } else if (key === 'batchUnable') {
        this.batchUnable()
      }
    },
    // 批量停用
    batchUnable() {
      const records = this.$refs.grid.getCheckboxRecords()

      if (this.$utils.isEmpty(records)) {
        this.$msg.error('请选择要停用的收入项目！')
        return
      }

      this.$msg.confirm('是否确定停用选择的收入项目？').then(() => {
        this.loading = true
        const ids = records.map(t => t.id)
        this.$api.settle.inItem.batchUnable(ids).then(data => {
          this.$msg.success('停用成功！')
          this.search()
        }).finally(() => {
          this.loading = false
        })
      })
    },
    // 批量启用
    batchEnable() {
      const records = this.$refs.grid.getCheckboxRecords()

      if (this.$utils.isEmpty(records)) {
        this.$msg.error('请选择要启用的收入项目！')
        return
      }

      this.$msg.confirm('是否确定启用选择的收入项目？').then(() => {
        this.loading = true
        const ids = records.map(t => t.id)
        this.$api.settle.inItem.batchEnable(ids).then(data => {
          this.$msg.success('启用成功！')
          this.search()
        }).finally(() => {
          this.loading = false
        })
      })
    },
    exportList() {
      this.loading = true
      this.$api.settle.inItem.exportList(this.buildQueryParams({})).then(() => {
        this.$msg.successTip('导出成功！')
      }).finally(() => {
        this.loading = false
      })
    }
  }
}
</script>
<style scoped>
</style>
