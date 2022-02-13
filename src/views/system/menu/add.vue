<template>
  <el-dialog :visible.sync="visible" :close-on-click-modal="false" append-to-body width="30%" title="新增" top="5vh" @open="open">
    <div v-if="visible" v-permission="['system:menu:add']">
      <el-form ref="form" v-loading="loading" label-width="100px" title-align="right" :model="formData" :rules="rules">
        <el-form-item label="编号" prop="code">
          <el-input v-model.trim="formData.code" clearable />
        </el-form-item>
        <el-form-item label="标题" prop="title">
          <el-input v-model.trim="formData.title" clearable />
        </el-form-item>
        <el-form-item label="类型" prop="display">
          <el-radio-group v-model="formData.display" @change="displayChange">
            <el-radio v-for="item in $enums.MENU_DISPLAY.values()" :key="item.code" :label="item.code">{{ item.desc }}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="父级菜单" prop="parentId">
          <sys-menu-selector v-model="formData.parentId" :only-final="false" />
        </el-form-item>
        <el-form-item v-if="$enums.MENU_DISPLAY.FUNCTION.equalsCode(formData.display) || $enums.MENU_DISPLAY.PERMISSION.equalsCode(formData.display)" label="权限" prop="permission">
          <el-input v-model.trim="formData.permission" clearable />
        </el-form-item>
        <el-form-item label="备注" prop="description">
          <el-input v-model.trim="formData.description" type="textarea" resize="none" />
        </el-form-item>
        <div v-if="!$utils.isEmpty(formData.display) && !$enums.MENU_DISPLAY.PERMISSION.equalsCode(formData.display)">
          <el-divider>以下均为前端配置项</el-divider>
          <el-form-item v-if="!$enums.MENU_DISPLAY.PERMISSION.equalsCode(formData.display)" label="路由名称" prop="name">
            <el-input v-model.trim="formData.name" placeholder="对应路由当中的name属性" clearable />
          </el-form-item>
          <el-form-item v-if="$enums.MENU_DISPLAY.FUNCTION.equalsCode(formData.display)" label="组件" prop="component">
            <el-input v-model.trim="formData.component" placeholder="对应路由当中的component属性" clearable />
          </el-form-item>
          <el-form-item v-if="!$enums.MENU_DISPLAY.PERMISSION.equalsCode(formData.display)" label="路由路径" prop="path">
            <el-input v-model.trim="formData.path" placeholder="对应路由当中的path属性" clearable />
          </el-form-item>
          <el-form-item v-if="$enums.MENU_DISPLAY.FUNCTION.equalsCode(formData.display)" label="是否不缓存" prop="noCache">
            <el-switch
              v-model="formData.noCache"
              active-color="#13ce66"
              inactive-color="#ff4949"
            />
          </el-form-item>
          <el-form-item v-if="!$enums.MENU_DISPLAY.PERMISSION.equalsCode(formData.display)" label="是否隐藏" prop="hidden">
            <el-switch
              v-model="formData.hidden"
              active-color="#13ce66"
              inactive-color="#ff4949"
            />
          </el-form-item>
          <el-divider />
        </div>
        <el-form-item>
          <el-button type="primary" @click="submit">保存</el-button>
          <el-button @click="closeDialog">取消</el-button>
        </el-form-item>
      </el-form>
    </div>
  </el-dialog>
</template>
<script>
import SysMenuSelector from '@/components/Selector/SysMenuSelector'
export default {
  components: {
    SysMenuSelector
  },
  data() {
    return {
      // 是否可见
      visible: false,
      // 是否显示加载框
      loading: false,
      // 表单数据
      formData: {},
      // 表单校验规则
      rules: {
        code: [
          { required: true, message: '请输入编号' }
        ],
        title: [
          { required: true, message: '请输入标题' }
        ],
        display: [
          { required: true, message: '请选择类型' }
        ],
        name: [
          { required: true, message: '请输入路由名称' }
        ],
        component: [
          { required: true, message: '请输入组件' }
        ],
        path: [
          { required: true, message: '请输入路由路径' }
        ],
        noCache: [
          { required: true, message: '请选择是否缓存' }
        ],
        hidden: [
          { required: true, message: '请选择是否隐藏' }
        ]
      }
    }
  },
  computed: {
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
        permission: '',
        description: '',
        name: '',
        component: '',
        path: '',
        noCache: true,
        hidden: false
      }
    },
    // 提交表单事件
    submit() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.loading = true
          this.$api.system.menu.create(this.formData).then(() => {
            this.$msg.success('新增成功！')
            // 初始化表单数据
            this.initFormData()
            this.$emit('confirm')
            this.visible = false
          }).finally(() => {
            this.loading = false
          })
        }
      })
    },
    // 页面显示时由父页面触发
    open() {
      // 初始化表单数据
      this.initFormData()
    },
    // 类型选择器发生改变时
    displayChange(val) {
      if (this.$enums.MENU_DISPLAY.CATALOG.equalsCode(val)) {
        this.formData = Object.assign(this.formData, {
          component: '',
          noCache: true
        })
      } else if (this.$enums.MENU_DISPLAY.PERMISSION.equalsCode(val)) {
        this.formData = Object.assign(this.formData, {
          name: '',
          path: '',
          hidden: false,
          component: '',
          noCache: true
        })
      }
    }
  }
}
</script>
