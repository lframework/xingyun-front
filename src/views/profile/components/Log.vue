<template>
  <div class="app-container">
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
      :pager-config="pagerConfig"
      :loading="loading"
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
            <j-form-item label="日志类型">
              <el-select v-model="searchFormData.logType" placeholder="全部" clearable>
                <el-option v-for="item in $enums.OP_LOG_TYPE.values()" :key="item.code" :label="item.desc" :value="item.code" />
              </el-select>
            </j-form-item>
            <j-form-item>
              <el-button type="primary" icon="el-icon-search" @click="search">搜索</el-button>
            </j-form-item>
          </j-form>
        </j-border>
      </template>
    </vxe-grid>
  </div>
</template>

<script>
export default {
  components: {
  },
  data() {
    return {
      loading: false,
      // 当前行数据
      id: '',
      // 查询列表的查询条件
      searchFormData: {},
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
        { field: 'ip', title: 'IP地址', width: 130 },
        { field: 'createTime', title: '创建时间', width: 170 }
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
            return this.$api.userCenter.queryOpLogs(this.buildQueryParams(page))
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
    }
  }
}
</script>
<style scoped>
</style>
