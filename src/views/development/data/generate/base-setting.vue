<template>
  <div>
    <a-form-model ref="form" v-loading="loading" :label-col="{span: 8}" :wrapper-col="{span: 8}" :model="formData" :rules="rules">
      <a-form-model-item label="生成模板类型" prop="templateType">
        <a-select v-model="formData.templateType" placeholder="" allow-clear>
          <a-select-option v-for="item in $enums.GEN_TEMPLATE_TYPE.values()" :key="item.code" :value="item.code">{{ item.desc }}</a-select-option>
        </a-select>
      </a-form-model-item>
      <a-form-model-item label="后端完整包名">
        <a-input :value="fullPackageNameBack" disabled />
      </a-form-model-item>
      <a-form-model-item label="前端完整路径">
        <a-input :value="fullPackageNameFront" disabled />
      </a-form-model-item>
      <a-form-model-item label="作者" prop="author">
        <a-input v-model.trim="formData.author" />
      </a-form-model-item>
      <a-form-model-item label="主键类型" prop="keyType">
        <a-select v-model="formData.keyType" placeholder="" allow-clear>
          <a-select-option v-for="item in $enums.GEN_KEY_TYPE.values()" :key="item.code" :value="item.code">{{ item.desc }}</a-select-option>
        </a-select>
      </a-form-model-item>
      <a-form-model-item label="类名" prop="className">
        <a-input v-model.trim="formData.className" />
      </a-form-model-item>
      <a-form-model-item label="类描述" prop="classDescription">
        <a-input v-model.trim="formData.classDescription" />
      </a-form-model-item>
      <a-form-model-item label="包名" prop="packageName">
        <a-input v-model.trim="formData.packageName" />
      </a-form-model-item>
      <a-form-model-item label="模块名" prop="moduleName">
        <a-input v-model.trim="formData.moduleName" />
      </a-form-model-item>
      <a-form-model-item label="业务名" prop="bizName">
        <a-input v-model.trim="formData.bizName" />
      </a-form-model-item>
      <a-form-model-item label="父级菜单" prop="parentMenuId">
        <sys-menu-selector
          v-model="formData.parentMenuId"
          :request-params="{
            display: $enums.MENU_DISPLAY.CATALOG.code
          }"
        />
      </a-form-model-item>
      <a-form-model-item label="本级菜单编号" prop="menuCode">
        <a-input v-model.trim="formData.menuCode" />
      </a-form-model-item>
      <a-form-model-item label="本级菜单名称" prop="menuName">
        <a-input v-model.trim="formData.menuName" />
      </a-form-model-item>
      <a-form-model-item label="详情页Span总数量" prop="detailSpan">
        <a-input v-model.trim="formData.detailSpan" />
      </a-form-model-item>
      <a-form-model-item label="是否应用缓存" prop="isCache">
        <a-row>
          <a-col :span="20">
            <a-select v-model="formData.isCache" placeholder="">
              <a-select-option :value="true">是</a-select-option>
              <a-select-option :value="false">否</a-select-option>
            </a-select>
          </a-col>
          <a-col :span="3" :offset="1">
            <a-tooltip title="表示后端查询、修改等功能是否使用缓存"><a-icon type="question-circle" /></a-tooltip>
          </a-col>
        </a-row>
      </a-form-model-item>
      <a-form-model-item label="是否内置删除功能" prop="hasDelete">
        <a-row>
          <a-col :span="20">
            <a-select v-model="formData.hasDelete" placeholder="">
              <a-select-option :value="true">是</a-select-option>
              <a-select-option :value="false">否</a-select-option>
            </a-select>
          </a-col>
          <a-col :span="3" :offset="1">
            <a-tooltip title="表示是否内置deleteById功能"><a-icon type="question-circle" /></a-tooltip>
          </a-col>
        </a-row>
      </a-form-model-item>
    </a-form-model>
  </div>
</template>
<script>
import SysMenuSelector from '@/components/Selector/SysMenuSelector'
import { validCode } from '@/utils/validate'
export default {
  // 使用组件
  components: {
    SysMenuSelector
  },

  props: {
    formData: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      // 是否显示加载框
      loading: false,
      // 表单校验规则
      rules: {
        templateType: [
          { required: true, message: '请选择生成模板类型' }
        ],
        packageName: [
          { required: true, message: '请输入包名' }
        ],
        moduleName: [
          { required: true, message: '请输入模块名' }
        ],
        bizName: [
          { required: true, message: '请输入业务名' }
        ],
        className: [
          { required: true, message: '请输入类名' }
        ],
        classDescription: [
          { required: true, message: '请输入类描述' }
        ],
        keyType: [
          { required: true, message: '请选择主键类型' }
        ],
        parentMenuId: [
          { required: true, message: '请选择父级菜单' }
        ],
        menuCode: [
          { required: true, message: '请输入本级菜单编号' },
          { validator: validCode, message: '本级菜单编号必须由字母、数字、“-_.”组成，长度不能超过20位' }
        ],
        menuName: [
          { required: true, message: '请输入本级菜单名称' }
        ],
        detailSpan: [
          { required: true, message: '请输入详情页Span总数量' }
        ],
        isCache: [
          { required: true, message: '请选择是否应用缓存' }
        ],
        hasDelete: [
          { required: true, message: '清选择是否内置删除功能' }
        ]
      }
    }
  },
  computed: {
    fullPackageNameBack() {
      let fullPackageNameBack = ''
      if (!this.$utils.isEmpty(this.formData.packageName)) {
        fullPackageNameBack += this.formData.packageName + '.'
      }
      if (!this.$utils.isEmpty(this.formData.moduleName)) {
        fullPackageNameBack += this.formData.moduleName + '.'
      }
      if (!this.$utils.isEmpty(this.formData.bizName)) {
        fullPackageNameBack += this.formData.bizName
      }

      return fullPackageNameBack
    },
    fullPackageNameFront() {
      let fullPackageNameFront = 'views/'

      if (!this.$utils.isEmpty(this.formData.moduleName)) {
        fullPackageNameFront += this.formData.moduleName + '/'
      }

      if (!this.$utils.isEmpty(this.formData.bizName)) {
        fullPackageNameFront += this.formData.bizName
      }

      return fullPackageNameFront
    }
  },
  created() {
  },
  methods: {
    async validDate() {
      let flag = true
      await this.$refs.form.validate((valid) => {
        flag = valid
      })
      if (!flag) {
        return false
      }
      if (this.$utils.isEmpty(this.formData.templateType)) {
        this.$msg.error('请选择生成模板类型！')
        return false
      }

      if (this.$utils.isEmpty(this.formData.keyType)) {
        this.$msg.error('请选择主键类型！')
        return false
      }

      if (this.$utils.isEmpty(this.formData.className)) {
        this.$msg.error('请输入类名！')
        return false
      }

      if (this.$utils.isEmpty(this.formData.classDescription)) {
        this.$msg.error('请输入类描述！')
        return false
      }

      if (this.$utils.isEmpty(this.formData.packageName)) {
        this.$msg.error('请输入包名！')
        return false
      }

      if (this.$utils.isEmpty(this.formData.moduleName)) {
        this.$msg.error('请输入模块名！')
        return false
      }

      if (this.$utils.isEmpty(this.formData.bizName)) {
        this.$msg.error('请输入业务名！')
        return false
      }

      if (this.$utils.isEmpty(this.formData.parentMenuId)) {
        this.$msg.error('请选择父级菜单！')
        return false
      }

      if (this.$utils.isEmpty(this.formData.menuCode)) {
        this.$msg.error('请输入本级菜单编号！')
        return false
      }

      if (this.$utils.isEmpty(this.formData.menuName)) {
        this.$msg.error('请输入本级菜单名称！')
        return false
      }

      if (this.$utils.isEmpty(this.formData.detailSpan)) {
        this.$msg.error('请输入详情页Span总数量！')
        return false
      }

      if (!this.$utils.isIntegerGtZero(this.formData.detailSpan)) {
        this.$msg.error('详情页Span总数量必须是整数并且大于0！')
        return false
      }

      if (this.$utils.isEmpty(this.formData.isCache)) {
        this.$msg.error('请选择是否应用缓存！')
        return false
      }

      if (this.$utils.isEmpty(this.formData.hasDelete)) {
        this.$msg.error('请选择是否内置删除功能！')
        return false
      }

      return true
    }
  }
}
</script>
