<template>
  <div v-permission="['system:oplog:query']" class="app-container">

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
      :pager-config="pagerConfig"
      :loading="loading"
      :height="$defaultTableHeight"
    >
      <template v-slot:form>
        <j-border>
          <j-form label-width="80px">
            <j-form-item label="日志名称">
              <el-input
                v-model="searchFormData.name"
                clearable
              />
            </j-form-item>
            <j-form-item label="创建人">
              <user-selector
                v-model="searchFormData.createBy"
              />
            </j-form-item>
            <j-form-item label="日志类型">
              <el-select v-model="searchFormData.logType" placeholder="全部" clearable>
                <el-option v-for="item in $enums.OP_LOG_TYPE.values()" :key="item.code" :label="item.desc" :value="item.code" />
              </el-select>
            </j-form-item>
            <j-form-item label="创建日期" :content-nest="false">
              <el-date-picker
                v-model="searchFormData.startTime"
                type="date"
                value-format="yyyy-MM-dd 00:00:00"
              />
              <span class="date-split">至</span>
              <el-date-picker
                v-model="searchFormData.endTime"
                type="date"
                value-format="yyyy-MM-dd 23:59:59"
              />
            </j-form-item>
          </j-form>
        </j-border>
      </template>

      <!-- 工具栏 -->
      <template v-slot:toolbar_buttons>
        <el-form :inline="true">
          <el-form-item>
            <el-button type="primary" icon="el-icon-search" @click="search">搜索</el-button>
          </el-form-item>
        </el-form>
      </template>

      <!-- 操作 列自定义内容 -->
      <template v-slot:action_default="{ row }">
        <el-button v-permission="['system:oplog:query']" type="text" icon="el-icon-view" @click="e => { id = row.id;$refs.detailDialog.openDialog() }">查看</el-button>
      </template>
    </vxe-grid>
    <detail
      :id="id"
      ref="detailDialog"
    />
  </div>
</template>

<script>
import UserSelector from '@/components/Selector/UserSelector'
import Detail from './detail'
import Moment from 'moment'

export default {
  name: 'Oplog',
  components: {
    UserSelector, Detail
  },
  data() {
    return {
      loading: false,
      // 当前行数据
      id: '',
      // 查询列表的查询条件
      searchFormData: {
        name: '',
        createBy: {},
        logType: '',
        startTime: this.$utils.formatDateTime(this.$utils.getDateTimeWithMinTime(Moment().subtract(1, 'w').add(1, 'd'))),
        endTime: this.$utils.formatDateTime(this.$utils.getDateTimeWithMaxTime(this.$utils.getCurrentDate()))
      },
      // 分页配置
      pagerConfig: {
        // 默认每页条数
        pageSize: 20,
        // 可选每页条数
        pageSizes: [5, 15, 20, 50, 100, 200, 500, 1000]
      },
      // 列表数据配置
      tableColumn: [
        { field: 'name', title: '日志名称', minWidth: 220 },
        { field: 'logType', title: '日志类型', width: 100, formatter: ({ cellValue }) => { return this.$enums.OP_LOG_TYPE.getDesc(cellValue) } },
        { field: 'createBy', title: '创建人', width: 100 },
        { field: 'ip', title: 'IP地址', width: 130 },
        { field: 'createTime', title: '创建时间', width: 170 },
        { title: '操作', width: 70, fixed: 'right', slots: { default: 'action_default' }}
      ],
      // 工具栏配置
      toolbarConfig: {
        zoom: true,
        custom: true,
        // 右侧是否显示刷新按钮
        refresh: true,
        // 自定义左侧工具栏
        slots: {
          buttons: 'toolbar_buttons'
        }
      },
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
            return this.$api.system.opLog.query(this.buildQueryParams(page))
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
      const params = Object.assign({}, this.searchFormData, {
        createBy: this.searchFormData.createBy.id
      })

      return params
    }
  }
}
</script>
<style scoped>
</style>
