<template>
  <el-dialog :visible.sync="visible" :close-on-click-modal="false" :modal="false" width="40%" title="查看" top="5vh" @open="open">
    <div v-if="visible" v-permission="['system:menu:query']">
      <el-descriptions :column="4" border label-class-name="descriptions-label" content-class-name="descriptions-content">
        <el-descriptions-item label="编号" :span="2">
          {{ formData.code }}
        </el-descriptions-item>
        <el-descriptions-item label="标题" :span="2">
          {{ formData.title }}
        </el-descriptions-item>
        <el-descriptions-item label="类型" :span="2">
          {{ $enums.MENU_DISPLAY.getDesc(formData.display) }}
        </el-descriptions-item>
        <el-descriptions-item label="父级菜单" :span="2">
          {{ formData.parentName }}
        </el-descriptions-item>
        <el-descriptions-item v-if="$enums.MENU_DISPLAY.FUNCTION.equalsCode(formData.display) || $enums.MENU_DISPLAY.PERMISSION.equalsCode(formData.display)" label="权限" :span="4">
          {{ formData.permission }}
        </el-descriptions-item>
        <el-descriptions-item label="备注" :span="4">
          {{ formData.description }}
        </el-descriptions-item>
      </el-descriptions>
      <el-descriptions v-if="!$utils.isEmpty(formData.display) && !$enums.MENU_DISPLAY.PERMISSION.equalsCode(formData.display)" :column="4" border label-class-name="descriptions-label" content-class-name="descriptions-content">
        <el-descriptions-item v-if="!$enums.MENU_DISPLAY.PERMISSION.equalsCode(formData.display)" label="路由名称" :span="4">
          {{ formData.name }}
        </el-descriptions-item>
        <el-descriptions-item v-if="$enums.MENU_DISPLAY.FUNCTION.equalsCode(formData.display)" label="组件" :span="4">
          {{ formData.component }}
        </el-descriptions-item>
        <el-descriptions-item v-if="!$enums.MENU_DISPLAY.PERMISSION.equalsCode(formData.display)" label="路由路径" :span="4">
          {{ formData.path }}
        </el-descriptions-item>
        <el-descriptions-item v-if="$enums.MENU_DISPLAY.FUNCTION.equalsCode(formData.display)" label="是否不缓存" :span="4">
          {{ formData.noCache ? '不缓存' : '缓存' }}
        </el-descriptions-item>
        <el-descriptions-item v-if="!$enums.MENU_DISPLAY.PERMISSION.equalsCode(formData.display)" label="是否隐藏" :span="4">
          {{ formData.hidden ? '是' : '否' }}
        </el-descriptions-item>
      </el-descriptions>
    </div>
  </el-dialog>
</template>
<script>
export default {
  components: {
  },
  props: {
    id: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      // 是否可见
      visible: false,
      // 是否显示加载框
      loading: false,
      // 表单数据
      formData: {}
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
    },
    // 关闭对话框
    closeDialog() {
      this.visible = false
      this.$emit('close')
    },
    // 初始化表单数据
    initFormData() {
      this.formData = {
        code: '',
        title: '',
        display: '',
        parentId: '',
        parentName: '',
        permission: '',
        description: '',
        name: '',
        component: '',
        path: '',
        noCache: true,
        hidden: false
      }
    },
    // 页面显示时由父页面触发
    open() {
      // 初始化表单数据
      this.initFormData()
      // 查询数据
      this.loadData()
    },
    loadData() {
      this.loading = true
      this.$api.system.menu.get(this.id).then(data => {
        this.formData = data
      }).finally(() => {
        this.loading = false
      })
    }
  }
}
</script>
