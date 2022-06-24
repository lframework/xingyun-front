<template>
  <a-modal v-model="visible" :mask-closable="false" width="40%" title="修改" :dialog-style="{ top: '20px' }" :footer="null">
    <div v-if="visible" v-permission="['system:menu:modify']" v-loading="loading">
      <a-form-model ref="form" :label-col="{span: 4}" :wrapper-col="{span: 16}" :model="formData" :rules="rules">
        <a-form-model-item label="编号" prop="code">
          <a-input v-model.trim="formData.code" allow-clear />
        </a-form-model-item>
        <a-form-model-item label="标题" prop="title">
          <a-input v-model.trim="formData.title" allow-clear />
        </a-form-model-item>
        <a-form-model-item label="父级菜单" prop="parentId">
          <sys-menu-selector v-model="formData.parentId" :only-final="false" />
        </a-form-model-item>
        <a-form-model-item v-if="$enums.MENU_DISPLAY.FUNCTION.equalsCode(formData.display) || $enums.MENU_DISPLAY.PERMISSION.equalsCode(formData.display)" label="权限" prop="permission">
          <a-input v-model.trim="formData.permission" allow-clear />
        </a-form-model-item>
        <a-form-model-item label="状态" prop="available">
          <a-select v-model="formData.available" allow-clear>
            <a-select-option v-for="item in $enums.AVAILABLE.values()" :key="item.code" :value="item.code">{{ item.desc }}</a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item label="备注" prop="description">
          <a-textarea v-model.trim="formData.description" />
        </a-form-model-item>
        <div v-if="!$utils.isEmpty(formData.display) && !$enums.MENU_DISPLAY.PERMISSION.equalsCode(formData.display)">
          <a-divider>以下均为前端配置项</a-divider>
          <a-form-model-item v-if="!$enums.MENU_DISPLAY.PERMISSION.equalsCode(formData.display)" label="路由名称" prop="name">
            <a-input v-model.trim="formData.name" placeholder="对应路由当中的name属性" allow-clear />
          </a-form-model-item>
          <a-form-model-item v-if="$enums.MENU_DISPLAY.FUNCTION.equalsCode(formData.display)" label="组件" prop="component">
            <a-input v-model.trim="formData.component" placeholder="对应路由当中的component属性" allow-clear />
          </a-form-model-item>
          <a-form-model-item v-if="!$enums.MENU_DISPLAY.PERMISSION.equalsCode(formData.display)" label="路由路径" prop="path">
            <a-input v-model.trim="formData.path" placeholder="对应路由当中的path属性" allow-clear />
          </a-form-model-item>
          <a-form-model-item v-if="$enums.MENU_DISPLAY.FUNCTION.equalsCode(formData.display)" label="是否不缓存" prop="noCache">
            <a-switch
              v-model="formData.noCache"
            />
          </a-form-model-item>
          <a-form-model-item v-if="!$enums.MENU_DISPLAY.PERMISSION.equalsCode(formData.display)" label="是否隐藏" prop="hidden">
            <a-switch
              v-model="formData.hidden"
            />
          </a-form-model-item>
          <a-divider />
        </div>
        <div class="form-modal-footer">
          <a-space>
            <a-button type="primary" :loading="loading" html-type="submit" @click="submit">保存</a-button>
            <a-button :loading="loading" @click="closeDialog">取消</a-button>
          </a-space>
        </div>
      </a-form-model>
    </div>
  </a-modal>
</template>
<script>
import SysMenuSelector from '@/components/Selector/SysMenuSelector'
import { validCode } from '@/utils/validate'
export default {
  components: {
    SysMenuSelector
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
      formData: {},
      // 表单校验规则
      rules: {
        code: [
          { required: true, message: '请输入编号' },
          { validator: validCode }
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
        path: [
          { required: true, message: '请输入路由路径' }
        ],
        noCache: [
          { required: true, message: '请选择是否缓存' }
        ],
        hidden: [
          { required: true, message: '请选择是否隐藏' }
        ],
        available: [
          { required: true, message: '请选择状态' }
        ]
      }
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

      this.open()
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
        hidden: false,
        isSpecial: false,
        available: true
      }
    },
    // 提交表单事件
    submit() {
      if (this.formData.isSpecial) {
        this.$msg.confirm('当前菜单为内置菜单，是否确定修改？注：修改内置菜单可能会导致系统功能异常，请谨慎操作').then(() => {
          this.$refs.form.validate((valid) => {
            if (valid) {
              this.loading = true
              this.$api.system.menu.modify(this.formData).then(() => {
                this.$msg.success('修改成功！')
                // 初始化表单数据
                this.initFormData()
                this.$emit('confirm')
                this.visible = false
              }).finally(() => {
                this.loading = false
              })
            }
          })
        })
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
