<template>
  <div>
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
              <j-form-item label="状态">
                <a-select v-model="searchFormData.available" allow-clear>
                  <a-select-option v-for="item in $enums.AVAILABLE.values()" :key="item.code" :value="item.code">{{ item.desc }}</a-select-option>
                </a-select>
              </j-form-item>
              <j-form-item label="创建时间" :content-nest="false">
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
            </j-form>
          </j-border>
        </template>
        <!-- 工具栏 -->
        <template v-slot:toolbar_buttons>
          <a-space>
            <a-button type="primary" icon="search" @click="search">查询</a-button>
            <a-button type="primary" icon="plus" @click="$refs.addDialog.openDialog()">新增</a-button>
            <a-button icon="share-alt" @click="onBatchSendFile">批量发送给他人</a-button>
          </a-space>
        </template>

        <!-- 状态 列自定义内容 -->
        <template v-slot:available_default="{ row }">
          <available-tag :available="row.available" />
        </template>

        <!-- 操作 列自定义内容 -->
        <template v-slot:action_default="{ row }">
          <a-button type="link" @click="e => { id = row.id;$nextTick(() => $refs.viewDialog.openDialog()) }">查看</a-button>
          <a-button type="link" @click="e => { id = row.id;$nextTick(() => $refs.updateDialog.openDialog()) }">修改</a-button>
          <a-button type="link" @click="e => { id = row.id;download(row) }">下载</a-button>
          <a-button type="link" @click="e => { id = row.id;$nextTick(() => $refs.sendDialog.openDialog()) }">发送给他人</a-button>
        </template>
      </vxe-grid>
    </div>
    <!-- 新增窗口 -->
    <add ref="addDialog" @confirm="search" />

    <!-- 修改窗口 -->
    <modify :id="id" ref="updateDialog" @confirm="search" />

    <!-- 查看窗口 -->
    <detail :id="id" ref="viewDialog" />

    <send ref="sendDialog" @confirm="sendFile" />

    <send ref="batchSendDialog" @confirm="batchSendFile" />
  </div>
</template>

<script>
import Add from './add'
import Modify from './modify'
import Detail from './detail'
import AvailableTag from '@/components/Tag/Available'
import Send from './send'
import { request } from '@/utils/request'

export default {
  name: 'FileBox',
  components: {
    AvailableTag, Add, Modify, Detail, Send
  },
  data() {
    return {
      loading: false,
      // 当前行数据
      id: '',
      // 查询列表的查询条件
      searchFormData: {
        name: '',
        available: this.$enums.AVAILABLE.ENABLE.code,
        createTimeStart: '',
        createTimeEnd: ''
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
        { field: 'name', title: '名称', width: 180 },
        { field: 'available', title: '状态', width: 80, slots: { default: 'available_default' }},
        { field: 'description', title: '备注', minWidth: 200 },
        { field: 'createTime', title: '创建时间', width: 170 },
        { field: 'updateTime', title: '修改时间', width: 170 },
        { title: '操作', width: 240, fixed: 'right', slots: { default: 'action_default' }}
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
            return this.$api.sw.filebox.query(this.buildQueryParams(page))
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
    sendFile(e) {
      this.loading = true
      this.$api.sw.filebox.send(Object.assign({
        id: this.id
      }, e)).then(() => {
        this.$msg.success('发送成功！')
      }).finally(() => {
        this.loading = false
      })
    },
    onBatchSendFile() {
      const records = this.$refs.grid.getCheckboxRecords()
      if (this.$utils.isEmpty(records)) {
        this.$msg.error('请先选择需要发送的文件！')
        return
      }

      this.$refs.batchSendDialog.openDialog()
    },
    batchSendFile(e) {
      const records = this.$refs.grid.getCheckboxRecords()
      this.loading = true
      this.$api.sw.filebox.batchSend(Object.assign({
        ids: records.map(item => item.id)
      }, e)).then(() => {
        this.$msg.success('发送成功！')
      }).finally(() => {
        this.loading = false
      })
    },
    download(row) {
      request({
        url: row.url,
        method: 'get',
        responseType: 'blob'
      }).then(() => {
        this.$msg.successTip('下载成功！')
      })
    }
  }
}
</script>
<style scoped>
</style>
