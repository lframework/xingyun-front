<template>
  <a-modal
    v-model:open="visible"
    :mask-closable="false"
    width="100%"
    title="设置"
    :keyboard="false"
    :style="{ top: '5px' }"
    :footer="null"
  >
    <div
      v-if="visible && inited"
      v-permission="['base-data:print-template:modify']"
      v-loading="loading"
    >
      <print-designer
        ref="designer"
        :temp-value="value"
        :widget-options="widgets"
        :demo-data="demoData"
        @save="submit"
      />
    </div>
  </a-modal>
</template>
<script>
  import { defineComponent } from 'vue';
  import * as api from '@/api/base-data/print-template';

  export default defineComponent({
    // 使用组件
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
        inited: false,
        // 表单数据
        formData: {},
        // 表单校验规则
        rules: {
          name: [{ required: true, message: '请输入名称' }],
        },
        value: {
          title: 'demo',
          width: 750,
          height: 550,
          pageWidth: 750,
          pageHeight: 550,
          tempItems: [],
        },
        widgets: [],
        demoData: {},
      };
    },
    created() {
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
        this.formData = {
          id: '',
          templateJson: '',
        };

        this.inited = false;
      },
      // 提交表单事件
      submit(templateJson) {
        this.loading = true;
        this.formData.templateJson = JSON.stringify(templateJson || {});
        api
          .updateSetting({
            id: this.formData.id,
            templateJson: this.formData.templateJson,
          })
          .then(() => {
            this.$msg.createSuccess('保存成功！');
            this.$emit('confirm');
            this.visible = false;
          })
          .finally(() => {
            this.loading = false;
          });
      },
      // 页面显示时触发
      open() {
        // 初始化数据
        this.initFormData();

        // 查询数据
        this.loadFormData();
      },
      // 查询数据
      loadFormData() {
        this.loading = true;
        Promise.all([api.getTemplateComp(this.id), api.getSetting(this.id)])
          .then(([templateComp, setting]) => {
            this.formData = setting;

            this.value = this.formData.templateJson || {
              title: '',
              width: 750,
              height: 550,
              pageWidth: 750,
              pageHeight: 550,
              tempItems: [],
            };

            this.widgets = (templateComp || []).map((item) => item.compJson);

            this.demoData = this.formData.demoData;
          })
          .finally(() => {
            this.loading = false;

            this.inited = true;
          });
      },
    },
  });
</script>
