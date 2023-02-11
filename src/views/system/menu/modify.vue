<template>
  <a-modal v-model="visible" :mask-closable="false" width="50%" title="修改" :dialog-style="{ top: '20px' }" :footer="null">
    <div v-if="visible" v-permission="['system:menu:modify']" v-loading="loading">
      <a-form-model ref="form" :label-col="{span: 4}" :wrapper-col="{span: 16}" :model="formData" :rules="rules">
        <a-form-model-item label="编号" prop="code">
          <a-input v-model.trim="formData.code" allow-clear />
        </a-form-model-item>
        <a-form-model-item label="标题" prop="title">
          <a-input v-model.trim="formData.title" allow-clear />
        </a-form-model-item>
        <a-form-model-item v-if="$enums.MENU_DISPLAY.CATALOG.equalsCode(formData.display) || $enums.MENU_DISPLAY.FUNCTION.equalsCode(formData.display)" label="图标" prop="icon">
          <icon-picker v-model="formData.icon" />
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
          <a-form-model-item v-if="$enums.MENU_DISPLAY.FUNCTION.equalsCode(formData.display)" label="组件类型" prop="componentType">
            <a-select v-model="formData.componentType" allow-clear>
              <a-select-option v-for="item in $enums.MENU_COMPONENT_TYPE.values()" :key="item.code" :value="item.code">{{ item.desc }}</a-select-option>
            </a-select>
          </a-form-model-item>
          <a-form-model-item v-if="$enums.MENU_DISPLAY.FUNCTION.equalsCode(formData.display) && $enums.MENU_COMPONENT_TYPE.NORMAL.equalsCode(formData.componentType)" label="组件" prop="component">
            <a-input v-model.trim="formData.component" placeholder="对应路由当中的component属性" allow-clear />
          </a-form-model-item>
          <a-form-model-item v-if="$enums.MENU_DISPLAY.FUNCTION.equalsCode(formData.display) && $enums.MENU_COMPONENT_TYPE.CUSTOM_LIST.equalsCode(formData.componentType)" label="自定义列表" prop="customList.id">
            <gen-custom-list-selector v-model="formData.customList" :request-params="{ available: true }" />
          </a-form-model-item>
          <a-form-model-item v-if="$enums.MENU_DISPLAY.FUNCTION.equalsCode(formData.display) && $enums.MENU_COMPONENT_TYPE.CUSTOM_FORM.equalsCode(formData.componentType)" label="自定义表单" prop="customForm.id">
            <gen-custom-form-selector v-model="formData.customForm" :request-params="{ available: true, isDialog: false }" />
          </a-form-model-item>
          <a-form-model-item v-if="$enums.MENU_DISPLAY.FUNCTION.equalsCode(formData.display) && $enums.MENU_COMPONENT_TYPE.CUSTOM_FORM.equalsCode(formData.componentType)" label="自定义请求参数" prop="requestParam">
            <a @click="$refs.requestParamEditor.openDialog()">编辑参数</a>
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
    <json-editor ref="requestParamEditor" v-model="formData.requestParam" :description="`参数应为对象的json字符串，如：{&quot;name&quot;: &quot;名称&quot;}。`" />
  </a-modal>
</template>
<script>
import SysMenuSelector from '@/components/Selector/SysMenuSelector'
import { validCode } from '@/utils/validate'
import IconPicker from '@/components/IconPicker'
import GenCustomListSelector from '@/components/Selector/GenCustomListSelector'
import GenCustomFormSelector from '@/components/Selector/GenCustomFormSelector'
import JsonEditor from './json-editor'
export default {
  components: {
    SysMenuSelector,
    IconPicker,
    GenCustomListSelector,
    GenCustomFormSelector,
    JsonEditor
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
        componentType: [
          { required: true, message: '请选择组件类型' }
        ],
        component: [
          { required: true, message: '请输入组件' }
        ],
        'customList.id': [
          { required: true, message: '请选择自定义列表' }
        ],
        'customForm.id': [
          { required: true, message: '请选择自定义表单' }
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

      this.$nextTick(() => this.open())
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
        icon: '',
        parentId: '',
        permission: '',
        description: '',
        name: '',
        componentType: '',
        component: '',
        customList: {},
        customForm: {},
        requestParam: '',
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
              this.doSubmit()
            }
          })
        })
      } else {
        this.doSubmit()
      }
    },
    doSubmit() {
      this.loading = true
      const params = Object.assign({}, this.formData)
      if (this.$enums.MENU_COMPONENT_TYPE.CUSTOM_LIST.equalsCode(this.formData.componentType)) {
        params.component = params.customList.id
      } else if (this.$enums.MENU_COMPONENT_TYPE.CUSTOM_FORM.equalsCode(this.formData.componentType)) {
        params.component = params.customForm.id
      }
      this.$api.system.menu.modify(params).then(() => {
        this.$msg.success('修改成功！')
        // 初始化表单数据
        this.initFormData()
        this.$emit('confirm')
        this.visible = false
      }).finally(() => {
        this.loading = false
      })
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
        data.customList = {
          id: data.customListId,
          name: data.customListName
        }
        data.customForm = {
          id: data.customFormId,
          name: data.customFormName
        }
        this.formData = data
      }).finally(() => {
        this.loading = false
      })
    }
  }
}
</script>
