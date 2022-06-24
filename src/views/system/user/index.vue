<template>
  <div v-permission="['system:user:query']" class="app-container">

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
            <j-form-item label="用户名">
              <a-input v-model="searchFormData.username" allow-clear />
            </j-form-item>
            <j-form-item label="姓名">
              <a-input v-model="searchFormData.name" allow-clear />
            </j-form-item>
            <j-form-item label="岗位" prop="position">
              <sys-position-selector v-model="searchFormData.position" />
            </j-form-item>
            <j-form-item label="状态">
              <a-select v-model="searchFormData.available" placeholder="全部" allow-clear>
                <a-select-option v-for="item in $enums.AVAILABLE.values()" :key="item.code" :value="item.code">{{ item.desc }}</a-select-option>
              </a-select>
            </j-form-item>
            <j-form-item label="是否锁定">
              <a-select v-model="searchFormData.lockStatus" placeholder="全部" allow-clear>
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
          <a-button v-permission="['system:user:add']" type="primary" icon="plus" @click="$refs.addDialog.openDialog()">新增</a-button>
          <a-button v-permission="['system:user:permission']" icon="thunderbolt" @click="batchSetting">批量授权</a-button>
          <a-dropdown v-permission="['system:user:modify']">
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
        <a-button v-permission="['system:user:query']" type="link" @click="e => { id = row.id;$nextTick(() => $refs.viewDialog.openDialog()) }">查看</a-button>
        <a-button v-permission="['system:user:modify']" type="link" @click="e => { id = row.id;$nextTick(() => $refs.updateDialog.openDialog()) }">修改</a-button>
        <a-button v-if="row.lockStatus" v-permission="['system:user:modify']" type="link" @click="e => unlock(row)">解锁</a-button>
        <a-button v-permission="['system:user:permission']" type="link" @click="setting(row)">授权</a-button>
      </template>
    </vxe-grid>

    <!-- 新增窗口 -->
    <add ref="addDialog" @confirm="search" />

    <!-- 修改窗口 -->
    <modify :id="id" ref="updateDialog" @confirm="search" />

    <!-- 查看窗口 -->
    <detail :id="id" ref="viewDialog" />

    <!-- 授权窗口 -->
    <permission ref="permissionDialog" :ids="ids" />
  </div>
</template>

<script>
import AvailableTag from '@/components/Tag/Available'
import Add from './add'
import Modify from './modify'
import Detail from './detail'
import Permission from './permission'
import SysPositionSelector from '@/components/Selector/SysPositionSelector'

export default {
  name: 'User',
  components: {
    Add, Modify, Detail, AvailableTag, Permission, SysPositionSelector
  },
  data() {
    return {
      loading: false,
      // 当前行数据
      id: '',
      ids: [],
      // 查询列表的查询条件
      searchFormData: {
        position: {},
        available: true
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
        { field: 'username', title: '用户名', minWidth: 120 },
        { field: 'name', title: '姓名', minWidth: 150 },
        { field: 'deptName', title: '部门', width: 160 },
        { field: 'roleName', title: '角色', width: 160 },
        { field: 'positionName', title: '岗位', width: 160 },
        { field: 'email', title: '邮箱', width: 120 },
        { field: 'telephone', title: '联系电话', width: 120 },
        { field: 'gender', title: '性别', width: 80, formatter: ({ cellValue }) => { return this.$enums.GENDER.getDesc(cellValue) } },
        { field: 'description', title: '备注', minWidth: 200 },
        { field: 'available', title: '状态', width: 80, slots: { default: 'available_default' }},
        { field: 'lockStatus', title: '是否锁定', width: 80, formatter: ({ cellValue }) => { return cellValue ? '是' : '否' } },
        { field: 'createBy', title: '创建人', width: 100 },
        { field: 'createTime', title: '创建时间', width: 170 },
        { field: 'updateBy', title: '修改人', width: 100 },
        { field: 'updateTime', title: '修改时间', width: 170 },
        { title: '操作', width: 200, fixed: 'right', slots: { default: 'action_default' }}
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
            return this.$api.system.user.query(this.buildQueryParams(page))
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
      const params = Object.assign({}, this.searchFormData, { positionId: this.searchFormData.position.id })

      delete params.position

      return params
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
        this.$msg.error('请选择要停用的用户！')
        return
      }

      this.$msg.confirm('是否确定停用选择的用户？').then(() => {
        this.loading = true
        const ids = records.map(t => t.id)
        this.$api.system.user.batchUnable(ids).then(data => {
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
        this.$msg.error('请选择要启用的用户！')
        return
      }

      this.$msg.confirm('是否确定启用选择的用户？').then(() => {
        this.loading = true
        const ids = records.map(t => t.id)
        this.$api.system.user.batchEnable(ids).then(data => {
          this.$msg.success('启用成功！')
          this.search()
        }).finally(() => {
          this.loading = false
        })
      })
    },
    // 授权
    setting(row) {
      this.ids = [row.id]
      this.$refs.permissionDialog.openDialog()
    },
    // 批量授权
    batchSetting() {
      const records = this.$refs.grid.getCheckboxRecords()

      if (this.$utils.isEmpty(records)) {
        this.$msg.error('请选择要授权的用户！')
        return
      }

      this.ids = records.map(item => item.id)
      this.$refs.permissionDialog.openDialog()
    },
    unlock(row) {
      this.$msg.confirm('是否确定解锁该用户？').then(() => {
        this.loading = true
        this.$api.system.user.unlock(row.id).then(() => {
          this.$msg.success('解锁成功！')
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
