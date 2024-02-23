<template>
  <div>
    <a-form
      ref="form"
      v-loading="loading"
      :label-col="{ span: 8 }"
      :wrapper-col="{ span: 8 }"
      :model="formData"
      :rules="rules"
    >
      <a-form-item label="生成模板类型" name="templateType">
        <a-select v-model:value="formData.templateType" placeholder="" allow-clear>
          <a-select-option
            v-for="item in $enums.GEN_TEMPLATE_TYPE.values()"
            :key="item.code"
            :value="item.code"
            >{{ item.desc }}</a-select-option
          >
        </a-select>
      </a-form-item>
      <a-form-item label="后端完整包名">
        <a-input :value="fullPackageNameBack" disabled />
      </a-form-item>
      <a-form-item label="前端完整路径">
        <a-input :value="fullPackageNameFront" disabled />
      </a-form-item>
      <a-form-item label="作者" name="author">
        <a-input v-model:value.trim="formData.author" />
      </a-form-item>
      <a-form-item label="主键类型" name="keyType">
        <a-select v-model:value="formData.keyType" placeholder="" allow-clear>
          <a-select-option
            v-for="item in $enums.GEN_KEY_TYPE.values()"
            :key="item.code"
            :value="item.code"
            >{{ item.desc }}</a-select-option
          >
        </a-select>
      </a-form-item>
      <a-form-item label="类名" name="className">
        <a-input v-model:value.trim="formData.className" />
      </a-form-item>
      <a-form-item label="类描述" name="classDescription">
        <a-input v-model:value.trim="formData.classDescription" />
      </a-form-item>
      <a-form-item label="包名" name="packageName">
        <a-input v-model:value.trim="formData.packageName" />
      </a-form-item>
      <a-form-item label="模块名" name="moduleName">
        <a-input v-model:value.trim="formData.moduleName" />
      </a-form-item>
      <a-form-item label="业务名" name="bizName">
        <a-input v-model:value.trim="formData.bizName" />
      </a-form-item>
      <a-form-item label="父级菜单" name="parentMenuId">
        <sys-menu-selector
          v-model:value="formData.parentMenuId"
          :only-final="false"
          :request-params="{
            display: $enums.MENU_DISPLAY.CATALOG.code,
          }"
        />
      </a-form-item>
      <a-form-item label="本级菜单编号" name="menuCode">
        <a-input v-model:value.trim="formData.menuCode" />
      </a-form-item>
      <a-form-item label="本级菜单名称" name="menuName">
        <a-input v-model:value.trim="formData.menuName" />
      </a-form-item>
      <a-form-item label="详情页Span总数量" name="detailSpan">
        <a-input v-model:value.trim="formData.detailSpan" />
      </a-form-item>
      <a-form-item name="isCache">
        <template #label>
          <a-space>
            <span> 是否应用缓存 </span>
            <a-tooltip title="表示后端查询、修改等功能是否使用缓存"
              ><QuestionCircleOutlined
            /></a-tooltip>
          </a-space>
        </template>
        <a-select v-model:value="formData.isCache" placeholder="">
          <a-select-option :value="true">是</a-select-option>
          <a-select-option :value="false">否</a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item name="hasDelete">
        <template #label>
          <a-space>
            <span> 是否内置删除功能 </span>
            <a-tooltip title="表示是否内置deleteById功能"><QuestionCircleOutlined /></a-tooltip>
          </a-space>
        </template>
        <a-select v-model:value="formData.hasDelete" placeholder="">
          <a-select-option :value="true">是</a-select-option>
          <a-select-option :value="false">否</a-select-option>
        </a-select>
      </a-form-item>
    </a-form>
  </div>
</template>
<script>
  import { defineComponent } from 'vue';
  import { validCode } from '@/utils/validate';
  import { QuestionCircleOutlined } from '@ant-design/icons-vue';

  export default defineComponent({
    // 使用组件
    components: { QuestionCircleOutlined },

    props: {
      formData: {
        type: Object,
        required: true,
      },
    },
    data() {
      return {
        // 是否显示加载框
        loading: false,
        // 表单校验规则
        rules: {
          templateType: [{ required: true, message: '请选择生成模板类型' }],
          packageName: [{ required: true, message: '请输入包名' }],
          moduleName: [{ required: true, message: '请输入模块名' }],
          bizName: [{ required: true, message: '请输入业务名' }],
          className: [{ required: true, message: '请输入类名' }],
          classDescription: [{ required: true, message: '请输入类描述' }],
          keyType: [{ required: true, message: '请选择主键类型' }],
          parentMenuId: [{ required: true, message: '请选择父级菜单' }],
          menuCode: [
            { required: true, message: '请输入本级菜单编号' },
            {
              validator: validCode,
              message: '本级菜单编号必须由字母、数字、“-_.”组成，长度不能超过20位',
            },
          ],
          menuName: [{ required: true, message: '请输入本级菜单名称' }],
          detailSpan: [{ required: true, message: '请输入详情页Span总数量' }],
          isCache: [{ required: true, message: '请选择是否应用缓存' }],
          hasDelete: [{ required: true, message: '清选择是否内置删除功能' }],
        },
      };
    },
    computed: {
      fullPackageNameBack() {
        let fullPackageNameBack = '';
        if (!this.$utils.isEmpty(this.formData.packageName)) {
          fullPackageNameBack += this.formData.packageName + '.';
        }
        if (!this.$utils.isEmpty(this.formData.moduleName)) {
          fullPackageNameBack += this.formData.moduleName + '.';
        }
        if (!this.$utils.isEmpty(this.formData.bizName)) {
          fullPackageNameBack += this.formData.bizName;
        }

        return fullPackageNameBack;
      },
      fullPackageNameFront() {
        let fullPackageNameFront = 'views/';

        if (!this.$utils.isEmpty(this.formData.moduleName)) {
          fullPackageNameFront += this.formData.moduleName + '/';
        }

        if (!this.$utils.isEmpty(this.formData.bizName)) {
          fullPackageNameFront += this.formData.bizName;
        }

        return fullPackageNameFront;
      },
    },
    created() {},
    methods: {
      async validDate() {
        let flag = true;
        await this.$refs.form
          .validate()
          .then((valid) => {
            flag = true;
          })
          .catch(() => {
            flag = false;
          });
        if (!flag) {
          return false;
        }
        if (this.$utils.isEmpty(this.formData.templateType)) {
          this.$msg.createError('请选择生成模板类型！');
          return false;
        }

        if (this.$utils.isEmpty(this.formData.keyType)) {
          this.$msg.createError('请选择主键类型！');
          return false;
        }

        if (this.$utils.isEmpty(this.formData.className)) {
          this.$msg.createError('请输入类名！');
          return false;
        }

        if (this.$utils.isEmpty(this.formData.classDescription)) {
          this.$msg.createError('请输入类描述！');
          return false;
        }

        if (this.$utils.isEmpty(this.formData.packageName)) {
          this.$msg.createError('请输入包名！');
          return false;
        }

        if (this.$utils.isEmpty(this.formData.moduleName)) {
          this.$msg.createError('请输入模块名！');
          return false;
        }

        if (this.$utils.isEmpty(this.formData.bizName)) {
          this.$msg.createError('请输入业务名！');
          return false;
        }

        if (this.$utils.isEmpty(this.formData.parentMenuId)) {
          this.$msg.createError('请选择父级菜单！');
          return false;
        }

        if (this.$utils.isEmpty(this.formData.menuCode)) {
          this.$msg.createError('请输入本级菜单编号！');
          return false;
        }

        if (this.$utils.isEmpty(this.formData.menuName)) {
          this.$msg.createError('请输入本级菜单名称！');
          return false;
        }

        if (this.$utils.isEmpty(this.formData.detailSpan)) {
          this.$msg.createError('请输入详情页Span总数量！');
          return false;
        }

        if (!this.$utils.isIntegerGtZero(this.formData.detailSpan)) {
          this.$msg.createError('详情页Span总数量必须是整数并且大于0！');
          return false;
        }

        if (this.$utils.isEmpty(this.formData.isCache)) {
          this.$msg.createError('请选择是否应用缓存！');
          return false;
        }

        if (this.$utils.isEmpty(this.formData.hasDelete)) {
          this.$msg.createError('请选择是否内置删除功能！');
          return false;
        }

        return true;
      },
    },
  });
</script>
