<template>
  <div>
    <div v-if="loadedConfig" v-show="visible">
      <page-wrapper content-full-height fixed-height>
        <!-- 数据列表 -->
        <vxe-grid
          :id="listConfig.id"
          ref="grid"
          resizable
          show-overflow
          highlight-hover-row
          keep-source
          :custom-config="{}"
          :tree-config="listConfig.treeData ? { expandAll: true } : undefined"
          :proxy-config="proxyConfig"
          :columns="tableColumn"
          :toolbar-config="toolbarConfig"
          :pager-config="listConfig.hasPage ? {} : undefined"
          :loading="loading"
          :row-config="_rowConfig"
          :radio-config="_radioConfig"
          :checkbox-config="_checkboxConfig"
          height="auto"
          :export-config="{}"
          @cell-dblclick="onCellDblClick"
        >
          <template v-if="!$utils.isEmpty(queryParams)" #form>
            <j-border>
              <j-form :label-width="listConfig.labelWidth + 'px'">
                <j-form-item
                  v-for="queryParam in queryParams"
                  :key="queryParam.tableAlias + '_' + queryParam.columnName"
                  :item-show="queryParam.frontShow"
                  :label="queryParam.name"
                  :span="queryParam.formWidth"
                  :content-nest="
                    $enums.GEN_VIEW_TYPE.INPUT.equalsCode(queryParam.viewType) ||
                    $enums.GEN_VIEW_TYPE.TEXTAREA.equalsCode(queryParam.viewType) ||
                    $enums.GEN_VIEW_TYPE.SELECT.equalsCode(queryParam.viewType) ||
                    $enums.GEN_VIEW_TYPE.DATA_DIC.equalsCode(queryParam.viewType)
                  "
                >
                  <input-component :query-param="queryParam" :search-condition="searchFormData" />
                </j-form-item>
              </j-form>
            </j-border>
          </template>
          <!-- 工具栏 -->
          <template #toolbar_buttons>
            <a-space>
              <a-button type="primary" :icon="h(SearchOutlined)" @click="search">查询</a-button>
              <a-button
                v-if="listConfig.allowExport"
                type="primary"
                :icon="h(DownloadOutlined)"
                @click="onExport"
                >导出</a-button
              >
              <template v-if="!$utils.isEmpty(toolbars)">
                <div v-for="toolbar in toolbars" :key="toolbar.id">
                  <router-link
                    v-if="$enums.GEN_CUSTOM_LIST_BTN_TYPE.ROUTE.equalsCode(toolbar.btnType)"
                    :to="toolbar.btnConfig"
                  >
                    <a-button
                      :type="
                        $enums.GEN_CUSTOM_LIST_BTN_VIEW_TYPE.LINK_DANGER.equalsCode(
                          toolbar.viewType,
                        )
                          ? $enums.GEN_CUSTOM_LIST_BTN_VIEW_TYPE.LINK.code
                          : toolbar.viewType
                      "
                      :class="
                        $enums.GEN_CUSTOM_LIST_BTN_VIEW_TYPE.LINK_DANGER.equalsCode(
                          toolbar.viewType,
                        )
                          ? 'ant-btn-link-danger'
                          : ''
                      "
                      ><icon v-if="!$utils.isEmpty(toolbar.icon)" :icon="toolbar.icon" />{{
                        toolbar.name
                      }}</a-button
                    >
                  </router-link>
                  <a-button
                    v-else-if="$enums.GEN_CUSTOM_LIST_BTN_TYPE.EXTERNAL.equalsCode(toolbar.btnType)"
                    :type="
                      $enums.GEN_CUSTOM_LIST_BTN_VIEW_TYPE.LINK_DANGER.equalsCode(toolbar.viewType)
                        ? $enums.GEN_CUSTOM_LIST_BTN_VIEW_TYPE.LINK.code
                        : toolbar.viewType
                    "
                    :class="
                      $enums.GEN_CUSTOM_LIST_BTN_VIEW_TYPE.LINK_DANGER.equalsCode(toolbar.viewType)
                        ? 'ant-btn-link-danger'
                        : ''
                    "
                    @click="onLoadExternal(toolbar)"
                    ><icon v-if="!$utils.isEmpty(toolbar.icon)" :icon="toolbar.icon" />{{
                      toolbar.name
                    }}</a-button
                  >
                  <a-button
                    v-else-if="
                      $enums.GEN_CUSTOM_LIST_BTN_TYPE.EXCUTE_SCRIPT.equalsCode(toolbar.btnType)
                    "
                    :type="
                      $enums.GEN_CUSTOM_LIST_BTN_VIEW_TYPE.LINK_DANGER.equalsCode(toolbar.viewType)
                        ? $enums.GEN_CUSTOM_LIST_BTN_VIEW_TYPE.LINK.code
                        : toolbar.viewType
                    "
                    :class="
                      $enums.GEN_CUSTOM_LIST_BTN_VIEW_TYPE.LINK_DANGER.equalsCode(toolbar.viewType)
                        ? 'ant-btn-link-danger'
                        : ''
                    "
                    @click="onExcuteScript(toolbar)"
                    ><icon v-if="!$utils.isEmpty(toolbar.icon)" :icon="toolbar.icon" />{{
                      toolbar.name
                    }}</a-button
                  >
                </div>
              </template>
            </a-space>
          </template>

          <!-- 操作 列自定义内容 -->
          <template #action_default="{ row }">
            <a-space>
              <div v-for="handleColumn in handleColumns" :key="handleColumn.id">
                <router-link
                  v-if="$enums.GEN_CUSTOM_LIST_BTN_TYPE.ROUTE.equalsCode(handleColumn.btnType)"
                  :to="handleColumn.btnConfig"
                >
                  <a-button
                    :type="
                      $enums.GEN_CUSTOM_LIST_BTN_VIEW_TYPE.LINK_DANGER.equalsCode(
                        handleColumn.viewType,
                      )
                        ? $enums.GEN_CUSTOM_LIST_BTN_VIEW_TYPE.LINK.code
                        : handleColumn.viewType
                    "
                    :class="
                      $enums.GEN_CUSTOM_LIST_BTN_VIEW_TYPE.LINK_DANGER.equalsCode(
                        handleColumn.viewType,
                      )
                        ? 'ant-btn-link-danger'
                        : ''
                    "
                    ><icon v-if="!$utils.isEmpty(handleColumn.icon)" :icon="handleColumn.icon" />{{
                      handleColumn.name
                    }}</a-button
                  >
                </router-link>
                <a-button
                  v-else-if="
                    $enums.GEN_CUSTOM_LIST_BTN_TYPE.EXTERNAL.equalsCode(handleColumn.btnType)
                  "
                  :type="
                    $enums.GEN_CUSTOM_LIST_BTN_VIEW_TYPE.LINK_DANGER.equalsCode(
                      handleColumn.viewType,
                    )
                      ? $enums.GEN_CUSTOM_LIST_BTN_VIEW_TYPE.LINK.code
                      : handleColumn.viewType
                  "
                  :class="
                    $enums.GEN_CUSTOM_LIST_BTN_VIEW_TYPE.LINK_DANGER.equalsCode(
                      handleColumn.viewType,
                    )
                      ? 'ant-btn-link-danger'
                      : ''
                  "
                  @click="onLoadExternal(handleColumn)"
                  ><icon v-if="!$utils.isEmpty(handleColumn.icon)" :icon="handleColumn.icon" />{{
                    handleColumn.name
                  }}</a-button
                >
                <a-button
                  v-else-if="
                    $enums.GEN_CUSTOM_LIST_BTN_TYPE.EXCUTE_SCRIPT.equalsCode(handleColumn.btnType)
                  "
                  :type="
                    $enums.GEN_CUSTOM_LIST_BTN_VIEW_TYPE.LINK_DANGER.equalsCode(
                      handleColumn.viewType,
                    )
                      ? $enums.GEN_CUSTOM_LIST_BTN_VIEW_TYPE.LINK.code
                      : handleColumn.viewType
                  "
                  :class="
                    $enums.GEN_CUSTOM_LIST_BTN_VIEW_TYPE.LINK_DANGER.equalsCode(
                      handleColumn.viewType,
                    )
                      ? 'ant-btn-link-danger'
                      : ''
                  "
                  @click="onExcuteScriptInHandleColumn(handleColumn)"
                  ><icon v-if="!$utils.isEmpty(handleColumn.icon)" :icon="handleColumn.icon" />{{
                    handleColumn.name
                  }}</a-button
                >
              </div>
            </a-space>
          </template>
        </vxe-grid>
      </page-wrapper>
    </div>
  </div>
</template>

<script>
  import { h, defineComponent } from 'vue';
  import InputComponent from '@/components/InputComponent/index.vue';
  import { Icon } from '@/components/Icon';
  import { SearchOutlined, DownloadOutlined } from '@ant-design/icons-vue';
  import * as api from '@/api/development/gen/api';

  export default defineComponent({
    name: 'CustomList',
    // 使用组件
    components: {
      Icon,
      InputComponent,
    },
    props: {
      customListId: {
        type: String,
        required: true,
      },
    },
    setup() {
      return {
        h,
        SearchOutlined,
        DownloadOutlined,
      };
    },
    data() {
      return {
        // 是否显示加载框
        loading: false,
        // 是否已加载完配置
        loadedConfig: false,
        visible: true,
        // 查询列表的查询条件
        searchFormData: {},
        // 工具栏配置
        toolbarConfig: {
          // 自定义左侧工具栏
          slots: {
            buttons: 'toolbar_buttons',
          },
        },
        // 查询条件
        queryParams: [],
        // 列表数据配置
        tableColumn: [],
        // 自定义列表配置
        listConfig: {},
        // 工具栏
        toolbars: [],
        // 操作列
        handleColumns: [],
      };
    },
    computed: {
      proxyConfig() {
        if (this.listConfig.hasPage) {
          return {
            props: {
              // 响应结果列表字段
              result: 'datas',
              // 响应结果总条数字段
              total: 'totalCount',
            },
            ajax: {
              // 查询接口
              query: ({ page, sorts, filters }) => {
                return api.customListQueryPage(this.customListId, this.buildQueryParams(page));
              },
            },
          };
        } else {
          if (this.listConfig.treeData) {
            // 树形列表
            return {
              ajax: {
                query: () =>
                  api
                    .customListQueryTree(this.customListId, this.buildQueryParams())
                    .then((res) => {
                      // 将带层级的列表转成树结构
                      res = this.$utils.toArrayTree(res, {
                        key: this.listConfig.idColumn,
                        parentKey: this.listConfig.treePidColumn,
                        children: this.listConfig.treeChildrenKey,
                        strict: true,
                      });

                      return this.$utils.searchTree(res, (item) => {
                        return item['id@show'];
                      });
                    }),
              },
            };
          } else {
            return {
              ajax: {
                // 查询接口
                query: ({ page, sorts, filters }) => {
                  return api.customListQueryList(this.customListId, this.buildQueryParams(page));
                },
              },
            };
          }
        }
      },
      _rowConfig() {
        if (this.$enums.GEN_CUSTOM_LIST_TYPE.SEQ.equalsCode(this.listConfig.listType)) {
          return { isCurrent: true, isHover: true };
        }

        return {};
      },
      _radioConfig() {
        if (this.$enums.GEN_CUSTOM_LIST_TYPE.SINGLE.equalsCode(this.listConfig.listType)) {
          return {
            trigger: 'row',
            highlight: true,
          };
        }
        return {};
      },
      _checkboxConfig() {
        if (this.$enums.GEN_CUSTOM_LIST_TYPE.MULTIPLE.equalsCode(this.listConfig.listType)) {
          return {
            trigger: 'row',
            highlight: true,
          };
        }
        return {};
      },
    },
    watch: {
      customListId(val) {
        this.initConfig();
      },
    },
    created() {},
    mounted() {
      this.initConfig();
    },
    methods: {
      async initConfig() {
        if (this.$utils.isEmpty(this.customListId)) {
          return;
        }
        const that = this;
        await api.getCustomListConfig(this.customListId).then((res) => {
          this.listConfig = res.listConfig;
          // 初始化tableColumn
          const fields = res.listConfig.fields || [];
          const tableColumn = fields.map((item) => {
            const column = {
              field: item.columnName,
              title: item.name,
              sortable: item.sortable,
            };

            if (this.$enums.GEN_QUERY_WIDTH_TYPE.FIX.equalsCode(item.widthType)) {
              column.width = item.width;
            } else {
              column.minWidth = item.width;
            }

            if (!item.fixEnum && item.isNumberType) {
              column.align = 'right';
            }

            if (item.hasAvailableTag) {
              column.slots = {
                default: function ({ row }, h) {
                  return [
                    h(AvailableTag, {
                      props: {
                        available: row[item.columnName],
                      },
                    }),
                  ];
                },
              };
            }

            if (item.fixEnum) {
              column.formatter = function ({ cellValue }) {
                return that.$enums[item.frontType].getDesc(cellValue);
              };
            } else {
              if (!this.$utils.isEmpty(item.formatter)) {
                column.formatter = function ({ cellValue, row }) {
                  const fn = new Function('cellValue', 'row', item.formatter);
                  return fn(cellValue, row);
                };
              }
            }

            if (that.listConfig.treeData && item.columnName === that.listConfig.treeNodeColumn) {
              column.treeNode = true;
            }

            return column;
          });

          const firstColumn = {
            type: 'seq',
            width: 50,
          };
          if (this.$enums.GEN_CUSTOM_LIST_TYPE.SINGLE.equalsCode(this.listConfig.listType)) {
            firstColumn.type = 'radio';
          } else if (
            this.$enums.GEN_CUSTOM_LIST_TYPE.MULTIPLE.equalsCode(this.listConfig.listType)
          ) {
            firstColumn.type = 'checkbox';
          }
          this.tableColumn = [firstColumn, ...tableColumn];

          // 初始化查询条件
          this.queryParams = res.queryParams || [];

          this.toolbars = res.toolbars;

          this.handleColumns = res.handleColumns || [];

          if (!this.$utils.isEmpty(this.handleColumns)) {
            const totalWidth = this.handleColumns
              .map((item) => item.width)
              .reduce((prev, cur) => {
                return prev + cur;
              });
            this.tableColumn.push({
              title: '操作',
              width: totalWidth,
              fixed: 'right',
              slots: {
                default: 'action_default',
              },
            });
          }

          this.loadedConfig = true;
          this.$emit('loadedConfig', true);
        });
      },
      // 列表发生查询时的事件
      search() {
        this.$refs.grid.commitProxy('reload');
      },
      // 导出
      onExport() {
        this.$refs.grid.exportData({
          columnFilterMethod: ({ column, $columnIndex }) => {
            return (
              !['radio', 'checkbox', 'seq'].includes(column.type) &&
              !this.$utils.isEmpty(column.field)
            );
          },
        });
      },
      // 查询前构建查询参数结构
      buildQueryParams(page) {
        return Object.assign(
          {
            pageIndex: page ? page.currentPage : undefined,
            pageSize: page ? page.pageSize : undefined,
          },
          this.buildSearchFormData(),
        );
      },
      // 查询前构建具体的查询参数
      buildSearchFormData() {
        const keys = this.$utils.keys(this.searchFormData);
        const searchFormData = keys
          .map((key) => {
            return this.searchFormData[key];
          })
          .filter(
            (item) =>
              !this.$utils.isEmpty(item) &&
              (!this.$utils.isEmpty(item.value) || !this.$utils.isEmpty(item.values)),
          );
        return {
          conditions: searchFormData,
        };
      },
      onCellDblClick({ row }) {
        this.$emit('cellDblClick', row);
      },
      getSelectedRecords() {
        if (this.$enums.GEN_CUSTOM_LIST_TYPE.SEQ.equalsCode(this.listConfig.listType)) {
          return this.$refs.grid.getCurrentRecord();
        } else if (this.$enums.GEN_CUSTOM_LIST_TYPE.SINGLE.equalsCode(this.listConfig.listType)) {
          return this.$refs.grid.getRadioRecord();
        } else if (this.$enums.GEN_CUSTOM_LIST_TYPE.MULTIPLE.equalsCode(this.listConfig.listType)) {
          return this.$refs.grid.getCheckboxRecords();
        }
      },
      getEmptyRecords() {
        if (this.$enums.GEN_CUSTOM_LIST_TYPE.SEQ.equalsCode(this.listConfig.listType)) {
          return;
        } else if (this.$enums.GEN_CUSTOM_LIST_TYPE.SINGLE.equalsCode(this.listConfig.listType)) {
          return;
        } else if (this.$enums.GEN_CUSTOM_LIST_TYPE.MULTIPLE.equalsCode(this.listConfig.listType)) {
          return [];
        }
      },
      async getRecordsByIds(ids) {
        let result = this.getEmptyRecords();
        if (this.$utils.isEmpty(ids)) {
          return result;
        }

        const tableAlias = this.listConfig.idColumn.substring(
          0,
          this.listConfig.idColumn.indexOf('_'),
        );
        const columnName = this.listConfig.idColumn.substring(
          this.listConfig.idColumn.indexOf('_') + 1,
        );
        await api
          .customListQueryList(this.customListId, {
            conditions: [
              {
                tableAlias: tableAlias,
                columnName: columnName,
                queryType: this.$enums.GEN_QUERY_TYPE.IN.code,
                values: this.$utils.isArray(ids) ? ids : [ids],
              },
            ],
          })
          .then((res) => {
            if (!this.$utils.isEmpty(res)) {
              if (this.$enums.GEN_CUSTOM_LIST_TYPE.SEQ.equalsCode(this.listConfig.listType)) {
                result = res[0];
              } else if (
                this.$enums.GEN_CUSTOM_LIST_TYPE.SINGLE.equalsCode(this.listConfig.listType)
              ) {
                result = res[0];
              } else if (
                this.$enums.GEN_CUSTOM_LIST_TYPE.MULTIPLE.equalsCode(this.listConfig.listType)
              ) {
                result = res;
              }
            }
          });

        return result;
      },
      onLoadExternal(toolbar) {
        window.open(toolbar.btnConfig, '_blank');
      },
      onLoadCustomForm(toolbar) {
        let form = this.$refs['toolbarCustomForm' + toolbar.id];
        if (this.$utils.isArray(form)) {
          form = form[0];
        }

        form.openForm();
      },
      onLoadCustomFormInHandleColumn(handleColumn) {
        let form = this.$refs['handleColumnCustomForm' + handleColumn.id];
        if (this.$utils.isArray(form)) {
          form = form[0];
        }

        form.openForm();
      },
      buildRequestParam(toolbar) {
        if (this.$utils.isEmpty(toolbar.requestParam)) {
          return {};
        }

        const fn = new Function('_this', toolbar.requestParam);

        return fn(this) || {};
      },
      buildRequestParamInHandleColumn(row, handleColumn) {
        if (this.$utils.isEmpty(handleColumn.requestParam)) {
          return {};
        }

        const fn = new Function('row', handleColumn.requestParam);

        return fn(row) || {};
      },
      onExcuteScript(toolbar) {
        const fn = new Function('_this', toolbar.btnConfig);
        fn(this);
      },
      onExcuteScriptInHandleColumn(handleColumn) {
        const fn = new Function('_this', handleColumn.btnConfig);
        fn(this);
      },
    },
  });
</script>
