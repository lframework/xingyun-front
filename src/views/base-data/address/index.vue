<template>
  <div v-permission="['base-data:address:query']" class="app-container">

    <!-- 数据列表 -->
    <vxe-grid
      id="Address"
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
            <j-form-item label="实体类型">
              <a-select v-model="searchFormData.entityType" allow-clear>
                <a-select-option v-for="item in $enums.ADDRESS_ENTITY_TYPE.values()" :key="item.code" :value="item.code">{{ item.desc }}</a-select-option>
              </a-select>
            </j-form-item>
            <j-form-item label="地址类型">
              <a-select v-model="searchFormData.addressType" allow-clear>
                <a-select-option v-for="item in $enums.ADDRESS_TYPE.values()" :key="item.code" :value="item.code">{{ item.desc }}</a-select-option>
              </a-select>
            </j-form-item>
            <j-form-item label="姓名">
              <a-input v-model="searchFormData.name" allow-clear />
            </j-form-item>
            <j-form-item label="手机号">
              <a-input v-model="searchFormData.telephone" allow-clear />
            </j-form-item>
            <j-form-item label="详细地址">
              <a-input v-model="searchFormData.address" allow-clear />
            </j-form-item>
            <j-form-item label="默认地址">
              <a-select v-model="searchFormData.isDefault" placeholder="全部" allow-clear>
                <a-select-option :value="true">是</a-select-option>
                <a-select-option :value="false">否</a-select-option>
              </a-select>
            </j-form-item>
          </j-form>
        </j-border>
      </template>
      <!-- 工具栏 -->
      <template v-slot:toolbar_buttons>
        <a-space>
          <a-button type="primary" icon="search" @click="search">查询</a-button>
          <a-button v-permission="['base-data:address:add']" type="primary" icon="plus" @click="$refs.addDialog.openDialog()">新增</a-button>
          <a-button v-permission="['base-data:address:import']" icon="cloud-upload" @click="$refs.importer.openDialog()">导入Excel</a-button>
          <a-button v-permission="['base-data:address:export']" icon="download" @click="exportList">导出</a-button>
        </a-space>
      </template>

      <!-- 状态 列自定义内容 -->
      <template v-slot:available_default="{ row }">
        <available-tag :available="row.available" />
      </template>

      <!-- 操作 列自定义内容 -->
      <template v-slot:action_default="{ row }">
        <a-button v-permission="['base-data:address:query']" type="link" @click="e => { id = row.id;$nextTick(() => $refs.viewDialog.openDialog()) }">查看</a-button>
        <a-button v-permission="['base-data:address:modify']" type="link" @click="e => { id = row.id;$nextTick(() => $refs.updateDialog.openDialog()) }">修改</a-button>
      </template>
    </vxe-grid>

    <!-- 新增窗口 -->
    <add ref="addDialog" @confirm="search" />

    <!-- 修改窗口 -->
    <modify :id="id" ref="updateDialog" @confirm="search" />

    <!-- 查看窗口 -->
    <detail :id="id" ref="viewDialog" />

    <address-importer ref="importer" @confirm="search" />
  </div>
</template>

<script>
import AvailableTag from '@/components/Tag/Available'
import Add from './add'
import Modify from './modify'
import Detail from './detail'
import AddressImporter from '@/components/Importer/AddressImporter'

export default {
  name: 'Address',
  components: {
    Add, Modify, Detail, AvailableTag, AddressImporter
  },
  data() {
    return {
      loading: false,
      // 当前行数据
      id: '',
      ids: [],
      // 查询列表的查询条件
      searchFormData: {
        available: this.$enums.AVAILABLE.ENABLE.code
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
        { type: 'seq', width: 40 },
        { field: 'entityType', title: '实体类型', width: 100, formatter: ({ cellValue }) => { return this.$enums.ADDRESS_ENTITY_TYPE.getDesc(cellValue) } },
        { field: 'entityName', title: '实体名称', width: 120 },
        { field: 'addressType', title: '地址类型', width: 100, formatter: ({ cellValue }) => { return this.$enums.ADDRESS_TYPE.getDesc(cellValue) } },
        { field: 'name', title: '姓名', width: 100 },
        { field: 'telephone', title: '手机号', width: 160 },
        { field: 'areaName', title: '地区', width: 200, formatter: ({ cellValue, row }) => { return row.provinceName + ' / ' + row.cityName + ' / ' + row.districtName } },
        { field: 'address', title: '详细地址', minWidth: 240 },
        { field: 'isDefault', title: '默认地址', width: 120, formatter: ({ cellValue }) => { return cellValue ? '是' : '否' } },
        { field: 'createBy', title: '创建人', width: 100 },
        { field: 'createTime', title: '创建时间', width: 170 },
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
            return this.$api.baseData.address.query(this.buildQueryParams(page))
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
    exportList() {
      this.loading = true
      this.$api.baseData.address.exportList(this.buildQueryParams({})).then(() => {
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
