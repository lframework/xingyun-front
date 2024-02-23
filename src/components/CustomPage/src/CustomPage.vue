<template>
  <component :is="componentName" v-on="$listeners" />
</template>
<script>
  import { getCurrentInstance, defineComponent } from 'vue';

  import * as api from '@/api/development/gen/api';

  export default defineComponent({
    name: 'CustomPage',
    components: {},
    props: {
      pageId: {
        type: String || Number,
        required: true,
      },
    },
    setup() {
      const currentInstance = getCurrentInstance();
      return {
        currentInstance,
      };
    },
    data() {
      return {
        componentName: 'div',
      };
    },
    computed: {},
    watch: {
      pageId(val) {
        this.initConfig();
      },
    },
    mounted() {
      this.initConfig();
    },
    async created() {
      this.openForm();
    },
    methods: {
      // 打开表单 由父页面触发
      openForm() {
        this.dialogVisible = true;

        this.$nextTick(() => this.open());
      },
      open() {
        this.initConfig();

        // 初始化表单数据
        this.initFormData();
      },
      async initConfig() {
        if (this.$utils.isEmpty(this.pageId)) {
          return;
        }
        await api.getCustomPageConfig(this.pageId).then((res) => {
          const componentName = 'CustomPage_' + res.id;
          const componentFn = new Function('defineComponent', res.componentConfig);
          this.currentInstance.appContext.app.component(
            componentName,
            componentFn(defineComponent),
          );
          this.componentName = componentName;
        });
      },
      initFormData() {},
    },
  });
</script>
<style lang="less"></style>
