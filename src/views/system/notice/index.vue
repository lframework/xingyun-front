<template>
  <div>
    <div v-permission="['system:notice:query']" class="app-container">
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
              <j-form-item label="标题">
                <a-input v-model="searchFormData.title" allow-clear />
              </j-form-item>
              <j-form-item label="发布时间" :content-nest="false">
                <div class="date-range-container">
                  <a-date-picker
                    v-model="searchFormData.createTimeStart"
                    placeholder=""
                    value-format="YYYY-MM-DD 00:00:00"
                  />
                  <span class="date-split">至</span>
                  <a-date-picker
                    v-model="searchFormData.createTimeEnd"
                    placeholder=""
                    value-format="YYYY-MM-DD 23:59:59"
                  />
                </div>
              </j-form-item>
              <j-form-item label="是否已读">
                <a-select v-model="searchFormData.readed" placeholder="全部" allow-clear>
                  <a-select-option :value="false">否</a-select-option>
                  <a-select-option :value="true">是</a-select-option>
                </a-select>
              </j-form-item>
            </j-form>
          </j-border>
        </template>
        <!-- 工具栏 -->
        <template v-slot:toolbar_buttons>
          <a-space>
            <a-button type="primary" icon="search" @click="search">查询</a-button>
          </a-space>
        </template>

        <!-- 操作 列自定义内容 -->
        <template v-slot:action_default="{ row }">
          <a-button v-permission="['system:notice:query']" type="link" @click="e => { id = row.id;$nextTick(() => $refs.viewDialog.openDialog()) }">查看</a-button>
        </template>
      </vxe-grid>
    </div>
    <!-- 查看窗口 -->
    <detail :id="id" ref="viewDialog" />

  </div>
</template>

<script>
import Detail from './detail'
export default {
  name: 'SysNotice',
  components: {
    Detail
  },
  data() {
    return {
      loading: false,
      // 当前行数据
      id: '',
      // 查询列表的查询条件
      searchFormData: {
        title: '',
        createTimeStart: '',
        createTimeEnd: '',
        readed: undefined
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
        { field: 'title', title: '标题', minWidth: 160 },
        { field: 'readed', title: '是否已读', width: 100, formatter: ({ cellValue }) => { return cellValue ? '是' : '否' } },
        { field: 'publishTime', title: '发布时间', width: 170 },
        { title: '操作', width: 70, fixed: 'right', slots: { default: 'action_default' }}
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
            return this.$api.system.notice.queryMy(this.buildQueryParams(page))
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
