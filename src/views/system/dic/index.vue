<template>
  <div v-permission="['system:dic:query']" class="app-container">
    <a-row>
      <a-col :span="4" :style="{height: $defaultTableHeight + 'px'}">
        <category-tree :height="$defaultTableHeight" @change="e => doSearch(e)" />
      </a-col>
      <a-col :span="20">
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
                <j-form-item label="编号">
                  <a-input v-model="searchFormData.code" allow-clear />
                </j-form-item>
                <j-form-item label="名称">
                  <a-input v-model="searchFormData.name" allow-clear />
                </j-form-item>
              </j-form>
            </j-border>
          </template>
          <!-- 工具栏 -->
          <template v-slot:toolbar_buttons>
            <a-space>
              <a-button type="primary" icon="search" @click="search">查询</a-button>
              <a-button v-permission="['system.dic:add']" type="primary" icon="plus" @click="$refs.addDialog.openDialog()">新增</a-button>
            </a-space>
          </template>

          <!-- 状态 列自定义内容 -->
          <template v-slot:available_default="{ row }">
            <available-tag :available="row.available" />
          </template>

          <!-- 操作 列自定义内容 -->
          <template v-slot:action_default="{ row }">
            <a-button v-if="!$enums.COLUMN_TYPE.CUSTOM.equalsCode(row.columnType)" type="link" @click="e => { id = row.id;$nextTick(() => $refs.itemDialog.openDialog()) }">字典值管理</a-button>
            <a-button v-permission="['system.dic:modify']" type="link" @click="e => { id = row.id;$nextTick(() => $refs.updateDialog.openDialog()) }">修改</a-button>
            <a-button v-permission="['system.dic:delete']" type="link" class="ant-btn-link-danger" @click="deleteRow(row)">删除</a-button>
          </template>
        </vxe-grid>
      </a-col>
    </a-row>

    <!-- 新增窗口 -->
    <add ref="addDialog" @confirm="search" />

    <!-- 修改窗口 -->
    <modify :id="id" ref="updateDialog" @confirm="search" />

    <!-- 规格值窗口 -->
    <item ref="itemDialog" :dic-id="id" />
  </div>
</template>

<script>
import AvailableTag from '@/components/Tag/Available'
import Add from './add'
import Modify from './modify'
import Item from './item/index'
import CategoryTree from './category-tree'

export default {
  name: 'SysDataDic',
  components: {
    Add, Modify, Item, AvailableTag, CategoryTree
  },
  data() {
    return {
      loading: false,
      // 当前行数据
      id: '',
      ids: [],
      // 查询列表的查询条件
      searchFormData: {
        code: '',
        name: ''
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
        { field: 'code', title: '编号', width: 120 },
        { field: 'name', title: '名称', minWidth: 160 },
        { field: 'categoryName', title: '分类', width: 140 },
        { title: '操作', width: 210, fixed: 'right', slots: { default: 'action_default' }}
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
            return this.$api.system.dic.query(this.buildQueryParams(page))
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
    doSearch(categoryId) {
      if (!this.$utils.isEmpty(categoryId)) {
        if (this.$utils.isEqualWithStr(0, categoryId)) {
          this.searchFormData.categoryId = ''
        } else {
          this.searchFormData.categoryId = categoryId
        }
      } else {
        this.searchFormData.categoryId = ''
      }

      this.search()
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
    deleteRow(row) {
      this.$msg.confirm('是否确认删除此数据字典？').then(() => {
        this.$api.system.dic.remove(row.id).then(() => {
          this.$msg.success('删除成功！')
          this.search()
        })
      })
    }
  }
}
</script>
<style scoped>
</style>
