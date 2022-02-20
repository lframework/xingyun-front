<template>
  <div class="gen-container">
    <el-form ref="form" v-loading="loading" label-width="150px" title-align="right" :model="formData" :rules="rules" style="padding: 0 25%;">
      <el-form-item label="生成模板类型" prop="templateType">
        <el-select v-model="formData.templateType" placeholder="" clearable>
          <el-option v-for="item in $enums.GEN_TEMPLATE_TYPE.values()" :key="item.code" :label="item.desc" :value="item.code" />
        </el-select>
      </el-form-item>
      <el-form-item label="后端完整包名">
        <el-input :value="fullPackageNameBack" disabled />
      </el-form-item>
      <el-form-item label="前端完整路径">
        <el-input :value="fullPackageNameFront" disabled />
      </el-form-item>
      <el-form-item label="作者" prop="author">
        <el-input v-model.trim="formData.author" />
      </el-form-item>
      <el-form-item label="主键类型" prop="keyType">
        <el-select v-model="formData.keyType" placeholder="" clearable>
          <el-option v-for="item in $enums.GEN_KEY_TYPE.values()" :key="item.code" :label="item.desc" :value="item.code" />
        </el-select>
      </el-form-item>
      <el-form-item label="类名" prop="className">
        <el-input v-model.trim="formData.className" />
      </el-form-item>
      <el-form-item label="类描述" prop="classDescription">
        <el-input v-model.trim="formData.classDescription" />
      </el-form-item>
      <el-form-item label="包名" prop="packageName">
        <el-input v-model.trim="formData.packageName" />
      </el-form-item>
      <el-form-item label="模块名" prop="moduleName">
        <el-input v-model.trim="formData.moduleName" />
      </el-form-item>
      <el-form-item label="业务名" prop="bizName">
        <el-input v-model.trim="formData.bizName" />
      </el-form-item>
      <el-form-item label="父级菜单" prop="parentMenuId">
        <sys-menu-selector
          v-model="formData.parentMenuId"
          :request-params="{
            display: $enums.MENU_DISPLAY.CATALOG.code
          }"
        />
      </el-form-item>
      <el-form-item label="本级菜单编号" prop="menuCode">
        <el-input v-model.trim="formData.menuCode" />
      </el-form-item>
      <el-form-item label="本级菜单名称" prop="menuName">
        <el-input v-model.trim="formData.menuName" />
      </el-form-item>
      <el-form-item label="详情页Span总数量" prop="detailSpan">
        <el-input v-model.trim="formData.detailSpan" />
      </el-form-item>
      <el-form-item label="是否应用缓存" prop="isCache">
        <el-select v-model="formData.isCache" placeholder="">
          <el-option label="是" :value="true" />
          <el-option label="否" :value="false" />
        </el-select>
        <el-popover
          class="tip-question"
          placement="top-start"
          width="200"
          trigger="click"
          content="表示后端查询、修改等功能是否使用缓存"
        >
          <el-button slot="reference" type="text" icon="el-icon-question" />
        </el-popover>
      </el-form-item>
      <el-form-item label="是否内置删除功能" prop="hasDelete">
        <el-select v-model="formData.hasDelete" placeholder="">
          <el-option label="是" :value="true" />
          <el-option label="否" :value="false" />
        </el-select>
        <el-popover
          class="tip-question"
          placement="top-start"
          width="200"
          trigger="click"
          content="表示是否内置deleteById功能"
        >
          <el-button slot="reference" type="text" icon="el-icon-question" />
        </el-popover>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import SysMenuSelector from '@/components/Selector/SysMenuSelector'
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
          { required: true, message: '请输入本级菜单编号' }
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
