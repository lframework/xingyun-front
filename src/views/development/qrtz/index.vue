<template>
  <div v-permission="['development:qrtz:manage']" class="app-container">

    <!-- 数据列表 -->
    <vxe-grid
      id="Qrtz"
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
            <j-form-item label="名称">
              <a-input v-model="searchFormData.name" allow-clear />
            </j-form-item>
            <j-form-item label="组">
              <a-input v-model="searchFormData.group" allow-clear />
            </j-form-item>
            <j-form-item label="状态">
              <a-select v-model="searchFormData.state" placeholder="全部" allow-clear>
                <a-select-option v-for="item in $enums.TRIGGER_STATE.values()" :key="item.code" :value="item.code">{{ item.desc }}</a-select-option>
              </a-select>
            </j-form-item>
          </j-form>
        </j-border>
      </template>
      <!-- 工具栏 -->
      <template v-slot:toolbar_buttons>
        <a-space>
          <a-button type="primary" icon="search" @click="search">查询</a-button>
          <a-button type="primary" icon="plus" @click="$refs.addDialog.openDialog()">新增</a-button>
        </a-space>
      </template>

      <!-- 操作 列自定义内容 -->
      <template v-slot:action_default="{ row }">
        <a-button type="link" @click="e => { name = row.name;group = row.group;$nextTick(() => $refs.viewDialog.openDialog()) }">查看</a-button>
        <a-button type="link" @click="e => { name = row.name;group = row.group;$nextTick(() => $refs.updateDialog.openDialog()) }">修改</a-button>
        <a-button v-if="$enums.TRIGGER_STATE.WAITING.equalsCode(row.state) || $enums.TRIGGER_STATE.ACQUIRED.equalsCode(row.state) || $enums.TRIGGER_STATE.ERROR.equalsCode(row.state) || $enums.TRIGGER_STATE.COMPLETE.equalsCode(row.state)" type="link" class="ant-btn-link-danger" @click="pauseRow(row)">暂停</a-button>
        <a-button v-if="$enums.TRIGGER_STATE.PAUSED.equalsCode(row.state)" type="link" @click="resumeRow(row)">恢复</a-button>
        <a-button v-if="$enums.TRIGGER_STATE.WAITING.equalsCode(row.state) || $enums.TRIGGER_STATE.PAUSED.equalsCode(row.state) || $enums.TRIGGER_STATE.COMPLETE.equalsCode(row.state)" type="link" @click="triggerRow(row)">触发</a-button>
        <a-button type="link" class="ant-btn-link-danger" @click="deleteRow(row)">删除</a-button>
      </template>
    </vxe-grid>

    <!-- 新增窗口 -->
    <add ref="addDialog" @confirm="search" />

    <!-- 修改窗口 -->
    <modify ref="updateDialog" :ori-name="name" :ori-group="group" @confirm="search" />

    <!-- 查看窗口 -->
    <detail ref="viewDialog" :name="name" :group="group" />
  </div>
</template>

<script>
import Add from './add'
import Modify from './modify'
import Detail from './detail'

export default {
  name: 'Qrtz',
  components: {
    Add, Modify, Detail
  },
  data() {
    return {
      loading: false,
      // 当前行数据
      name: '',
      group: '',
      ids: [],
      // 查询列表的查询条件
      searchFormData: {
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
        { field: 'name', title: '名称', width: 100 },
        { field: 'group', title: '组', width: 100 },
        { field: 'cron', title: 'Cron表达式', width: 180 },
        { field: 'description', title: '备注', minWidth: 200 },
        { field: 'state', title: '状态', width: 80, formatter: ({ cellValue }) => { return this.$enums.TRIGGER_STATE.getDesc(cellValue) } },
        { title: '操作', width: 280, fixed: 'right', slots: { default: 'action_default' }}
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
            return this.$api.development.qrtz.query(this.buildQueryParams(page))
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
    deleteRow(row) {
      this.$msg.confirm('是否确认删除此定时任务？').then(() => {
        this.loading = true
        this.$api.development.qrtz.remove({
          name: row.name,
          group: row.group
        }).then(() => {
          this.$msg.success('删除成功！')
          this.search()
        }).finally(() => {
          this.loading = false
        })
      })
    },
    resumeRow(row) {
      this.$msg.confirm('是否确认恢复此定时任务？').then(() => {
        this.loading = true
        this.$api.development.qrtz.resume({
          name: row.name,
          group: row.group
        }).then(() => {
          this.$msg.success('恢复成功！')
          this.search()
        }).finally(() => {
          this.loading = false
        })
      })
    },
    pauseRow(row) {
      this.$msg.confirm('是否确认暂停此定时任务？').then(() => {
        this.loading = true
        this.$api.development.qrtz.pause({
          name: row.name,
          group: row.group
        }).then(() => {
          this.$msg.success('暂停成功！')
          this.search()
        }).finally(() => {
          this.loading = false
        })
      })
    },
    triggerRow(row) {
      this.$msg.confirm('是否确认触发此定时任务？').then(() => {
        this.loading = true
        this.$api.development.qrtz.trigger({
          name: row.name,
          group: row.group
        }).then(() => {
          this.$msg.success('触发成功！')
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
