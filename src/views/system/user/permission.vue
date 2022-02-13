<template>
  <el-dialog :visible.sync="visible" :close-on-click-modal="false" append-to-body width="60%" title="授权" top="5vh" @open="open">
    <div v-if="visible" v-permission="['system:user:permission']">
      <vxe-grid
        ref="grid"
        v-loading="loading"
        resizable
        show-overflow
        highlight-hover-row
        keep-source
        row-id="id"
        :tree-config="{}"
        :export-config="{}"
        :data="tableData"
        :checkbox-config="{ checkField: 'selected' }"
        :columns="tableColumn"
      />
    </div>

    <span slot="footer" class="dialog-footer">
      <el-button type="primary" :loading="loading" @click="submit">保存</el-button>
      <el-button :loading="loading" @click="closeDialog">取消</el-button>
    </span>
  </el-dialog>
</template>
<script>

export default {
  // 使用组件
  components: {
  },
  props: {
    ids: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      // 是否可见
      visible: false,
      // 是否显示加载框
      loading: false,
      // 表格数据
      tableData: [],
      // 表格列配置
      tableColumn: [
        { type: 'checkbox', width: 40 },
        { field: 'code', title: '编号', width: 100 },
        { field: 'name', title: '名称', minWidth: 160 },
        { field: 'permission', title: '权限', width: 220 }
      ]
    }
  },
  created() {
  },
  methods: {
    // 打开对话框 由父页面触发
    openDialog() {
      this.visible = true
    },
    // 关闭对话框
    closeDialog() {
      this.visible = false
      this.$emit('close')
    },
    // 页面显示时触发
    open() {
      // 查询数据
      this.query()
    },
    // 列表查询数据
    query() {
      this.loading = true
      const params = {}
      if (!this.$utils.isEmpty(this.ids) && this.ids.length === 1) {
        params.userId = this.ids[0]
      }
      this.$api.system.user.roles(params).then(res => {
        this.tableData = res
      }).finally(() => {
        this.loading = false
      })
    },
    // 提交数据
    submit() {
      this.loading = true
      const records = this.$refs.grid.getCheckboxRecords()
      const roleIds = this.$utils.isEmpty(records) ? [] : records.map(item => item.id)
      this.$api.system.user.setting({
        userIds: this.ids,
        roleIds: roleIds
      }).then(() => {
        this.$msg.success('授权成功！')
        this.$emit('confirm')
        this.visible = false
      }).finally(() => {
        this.loading = false
      })
    }
  }
}
</script>
