<template>
  <a-modal v-model:open="visible" :mask-closable="false" width="40%" title="查看" :footer="null">
    <div v-if="visible" v-permission="['system:menu:query']" v-loading="loading">
      <a-descriptions bordered :column="4">
        <a-descriptions-item label="编号" :span="2">
          {{ formData.code }}
        </a-descriptions-item>
        <a-descriptions-item label="标题" :span="2">
          {{ formData.title }}
        </a-descriptions-item>
        <a-descriptions-item label="类型" :span="2">
          <menu-display-tag :menuDisplay="formData.display" />
        </a-descriptions-item>
        <a-descriptions-item label="父级菜单" :span="2">
          {{ formData.parentName }}
        </a-descriptions-item>
        <a-descriptions-item
          v-if="
            $enums.MENU_DISPLAY.FUNCTION.equalsCode(formData.display) ||
            $enums.MENU_DISPLAY.PERMISSION.equalsCode(formData.display)
          "
          label="权限"
          :span="4"
        >
          {{ formData.permission }}
        </a-descriptions-item>
        <a-descriptions-item label="备注" :span="4">
          {{ formData.description }}
        </a-descriptions-item>
        <a-descriptions-item
          v-if="!$enums.MENU_DISPLAY.PERMISSION.equalsCode(formData.display)"
          label="路由名称"
          :span="4"
        >
          {{ formData.name }}
        </a-descriptions-item>
        <a-descriptions-item
          v-if="$enums.MENU_DISPLAY.FUNCTION.equalsCode(formData.display)"
          label="组件"
          :span="4"
        >
          {{ formData.component }}
        </a-descriptions-item>
        <a-descriptions-item
          v-if="!$enums.MENU_DISPLAY.PERMISSION.equalsCode(formData.display)"
          label="路由路径"
          :span="4"
        >
          {{ formData.path }}
        </a-descriptions-item>
        <a-descriptions-item
          v-if="$enums.MENU_DISPLAY.FUNCTION.equalsCode(formData.display)"
          label="是否不缓存"
          :span="4"
        >
          {{ formData.noCache ? '不缓存' : '缓存' }}
        </a-descriptions-item>
        <a-descriptions-item
          v-if="!$enums.MENU_DISPLAY.PERMISSION.equalsCode(formData.display)"
          label="是否隐藏"
          :span="4"
        >
          {{ formData.hidden ? '是' : '否' }}
        </a-descriptions-item>
      </a-descriptions>
    </div>
  </a-modal>
</template>
<script>
  import { defineComponent } from 'vue';
  import * as api from '@/api/system/menu';

  export default defineComponent({
    components: {},
    props: {
      id: {
        type: String,
        required: true,
      },
    },
    data() {
      return {
        // 是否可见
        visible: false,
        // 是否显示加载框
        loading: false,
        // 表单数据
        formData: {},
      };
    },
    created() {
      // 初始化表单数据
      this.initFormData();
    },
    methods: {
      // 打开对话框 由父页面触发
      openDialog() {
        this.visible = true;

        this.$nextTick(() => this.open());
      },
      // 关闭对话框
      closeDialog() {
        this.visible = false;
        this.$emit('close');
      },
      // 初始化表单数据
      initFormData() {
        this.formData = {};
      },
      // 页面显示时由父页面触发
      open() {
        // 初始化表单数据
        this.initFormData();
        // 查询数据
        this.loadData();
      },
      loadData() {
        this.loading = true;
        api
          .get(this.id)
          .then((data) => {
            this.formData = data;
          })
          .finally(() => {
            this.loading = false;
          });
      },
    },
  });
</script>
