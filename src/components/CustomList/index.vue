<template>
  <div>
    <div v-if="loadedConfig" v-show="visible" class="app-container">
      <!-- 数据列表 -->
      <vxe-grid
        ref="grid"
        resizable
        show-overflow
        highlight-hover-row
        keep-source
        :tree-config="listConfig.treeData ? { expandAll: true } : undefined"
        :proxy-config="proxyConfig"
        :columns="tableColumn"
        :toolbar-config="toolbarConfig"
        :pager-config="listConfig.hasPage ? {} : undefined"
        :loading="loading"
        :height="$defaultTableHeight"
      >
        <template v-if="!$utils.isEmpty(queryParams)" v-slot:form>
          <j-border>
            <j-form :label-width="listConfig.labelWidth + 'px'" @collapse="$refs.grid.refreshColumn()">
              <j-form-item v-for="queryParam in queryParams" :key="queryParam.tableAlias + '_' + queryParam.columnName" :label="queryParam.name" :span="queryParam.formWidth" :content-nest="$enums.GEN_VIEW_TYPE.INPUT.equalsCode(queryParam.viewType) || $enums.GEN_VIEW_TYPE.TEXTAREA.equalsCode(queryParam.viewType) || $enums.GEN_VIEW_TYPE.SELECT.equalsCode(queryParam.viewType) || $enums.GEN_VIEW_TYPE.DATA_DIC.equalsCode(queryParam.viewType)">
                <input-component :query-param="queryParam" :search-condition="searchFormData" />
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
      </vxe-grid>
    </div>
  </div>
</template>

<script>
import AvailableTag from '@/components/Tag/Available'
import InputComponent from '@/components/InputComponent'

export default {
  name: 'CustomList',
  // 使用组件
  components: {
    InputComponent
  },
  props: {
    customListId: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      // 是否显示加载框
      loading: false,
      // 是否已加载完配置
      loadedConfig: false,
      visible: true,
      // 查询列表的查询条件
      searchFormData: {
      },
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
      // 查询条件
      queryParams: [],
      // 列表数据配置
      tableColumn: [],
      // 自定义列表配置
      listConfig: {}
    }
  },
  computed: {
    proxyConfig() {
      if (this.listConfig.hasPage) {
        return {
          props: {
            // 响应结果列表字段
            result: 'datas',
            // 响应结果总条数字段
            total: 'totalCount'
          },
          ajax: {
            // 查询接口
            query: ({ page, sorts, filters }) => {
              return this.$api.development.gen.queryCustomListPage(this.customListId, this.buildQueryParams(page))
            }
          }
        }
      } else {
        if (this.listConfig.treeData) {
          // 树形列表
          return {
            ajax: {
              query: () => this.$api.development.gen.queryCustomListTree(this.customListId, this.buildQueryParams()).then(res => {
                // 将带层级的列表转成树结构
                res = this.$utils.toArrayTree(res, { key: this.listConfig.treeIdColumn, parentKey: this.listConfig.treePidColumn, children: this.listConfig.treeChildrenKey, strict: true })

                return this.$utils.searchTree(res, item => {
                  return item['id@show']
                })
              })
            }
          }
        } else {
          return {
            ajax: {
              // 查询接口
              query: ({ page, sorts, filters }) => {
                return this.$api.development.gen.queryCustomListDatas(this.customListId, this.buildQueryParams(page))
              }
            }
          }
        }
      }
    }
  },
  watch: {
    customListId(val) {
      this.initConfig()
    }
  },
  created() {

  },
  mounted() {
    this.initConfig()
  },
  methods: {
    async initConfig() {
      if (this.$utils.isEmpty(this.customListId)) {
        return
      }
      const that = this
      await this.$api.development.gen.getCustomListConfig(this.customListId).then(res => {
        this.listConfig = res.listConfig
        // 初始化tableColumn
        const fields = res.listConfig.fields || []
        const tableColumn = fields.map(item => {
          const column = {
            field: item.columnName,
            title: item.name,
            sortable: item.sortable
          }

          if (this.$enums.GEN_QUERY_WIDTH_TYPE.FIX.equalsCode(item.widthType)) {
            column.width = item.width
          } else {
            column.minWidth = item.width
          }

          if (!item.fixEnum && item.isNumberType) {
            column.align = 'right'
          }

          if (item.hasAvailableTag) {
            column.slots = {
              default: function({ row }, h) {
                return [
                  h(AvailableTag, {
                    props: {
                      available: row[item.columnName]
                    }
                  })
                ]
              }
            }
          }

          if (item.fixEnum) {
            column.formatter = function({ cellValue }) { return that.$enums[item.frontType].getDesc(cellValue) }
          }

          if (that.listConfig.treeData && item.columnName === that.listConfig.treeNodeColumn) {
            column.treeNode = true
          }

          return column
        })

        this.tableColumn = [{ type: 'seq', width: 40 }, ...tableColumn]

        // 初始化查询条件
        this.queryParams = res.queryParams || []

        this.loadedConfig = true
      })
    },
    // 列表发生查询时的事件
    search() {
      this.$refs.grid.commitProxy('reload')
    },
    // 查询前构建查询参数结构
    buildQueryParams(page) {
      return Object.assign({
        pageIndex: page ? page.currentPage : undefined,
        pageSize: page ? page.pageSize : undefined
      }, this.buildSearchFormData())
    },
    // 查询前构建具体的查询参数
    buildSearchFormData() {
      const keys = this.$utils.keys(this.searchFormData)
      const searchFormData = keys.map(key => { return this.searchFormData[key] }).filter(item => !this.$utils.isEmpty(item) && (!this.$utils.isEmpty(item.value) || !this.$utils.isEmpty(item.values)))
      return {
        conditions: searchFormData
      }
    }
  }
}
</script>
