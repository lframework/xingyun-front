<template>
  <a-modal v-model="visible" :mask-closable="false" width="40%" title="数据权限" :dialog-style="{ top: '20px' }" :footer="null">
    <j-form :enable-collapse="false">
      <j-form-item v-for="item in $enums.SYS_DATA_PERMISSION_DATA_PERMISSION_TYPE.values()" :key="item.code" :label="item.desc + '数据权限'" :span="24">
        <a @click="openDraggerDialog(item)">点此设置</a>
      </j-form-item>
    </j-form>
    <div class="form-modal-footer">
      <a-space>
        <a-button type="primary" :loading="loading" html-type="submit" @click="submit">保存</a-button>
        <a-button :loading="loading" @click="closeDialog">取消</a-button>
      </a-space>
    </div>
    <data-permission-dragger v-for="item in $enums.SYS_DATA_PERMISSION_DATA_PERMISSION_TYPE.values()" :key="item.code" :ref="item.name + 'DataPermission'" :model-id="item.code" />
  </a-modal>
</template>
<script>
import DataPermissionDragger from '@/components/DataPermissionDragger/index.vue'
export default {
  name: 'BatchDataPermission',
  components: {
    DataPermissionDragger
  },
  props: {
    bizIds: {
      type: Array,
      required: true
    },
    bizType: {
      type: Number,
      required: true
    }
  },
  data() {
    return {
      visible: false,
      loading: false
    }
  },
  created() {
    // 初始化表单数据
    this.initFormData()
  },
  methods: {
    // 打开对话框 由父页面触发
    openDialog() {
      this.visible = true

      this.$nextTick(() => this.open())
    },
    // 关闭对话框
    closeDialog() {
      this.visible = false
      this.$emit('close')
    },
    initFormData() {

    },
    loadData() {
      const permissionTypes = this.$enums.SYS_DATA_PERMISSION_DATA_PERMISSION_TYPE.values()
      for (let i = 0; i < permissionTypes.length; i++) {
        const permissionType = permissionTypes[i]
        this.$refs[permissionType.name + 'DataPermission'][0].setModel([])
      }
    },
    // 页面显示时触发
    open() {
      // 初始化表单数据
      this.initFormData()
      this.loadData()
    },
    openDraggerDialog(permissionType) {
      this.$refs[permissionType.name + 'DataPermission'][0].openDialog()
    },
    submit() {
      const permissionTypes = this.$enums.SYS_DATA_PERMISSION_DATA_PERMISSION_TYPE.values()
      const datas = []
      for (let i = 0; i < permissionTypes.length; i++) {
        const permissionType = permissionTypes[i]
        if (!this.$refs[permissionType.name + 'DataPermission'][0].validModel()) {
          this.$refs[permissionType.name + 'DataPermission'][0].openDialog()
          break
        }
        datas.push({
          bizIds: this.bizIds,
          bizType: this.bizType,
          permissionType: permissionType.code,
          permission: JSON.stringify(this.$refs[permissionType.name + 'DataPermission'][0].getModel())
        })
      }

      this.loading = true
      this.$api.system.dataPermission.saveData(datas).then(() => {
        this.$msg.success('保存成功！')
        this.closeDialog()
      }).finally(() => {
        this.loading = false
      })
    }
  }
}
</script>
<style lang="less" scoped>
</style>
