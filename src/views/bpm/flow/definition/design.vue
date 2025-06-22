<template>
  <a-modal
    v-model:open="visible"
    :mask-closable="false"
    width="100%"
    title="流程设计"
    :style="{ top: '0px' }"
    :body-style="{ height: 100 * $vh + 'px', overflow: 'auto' }"
    :footer="null"
  >
    <iframe
      v-if="visible && !loading"
      class="w-full h-full"
      scrolling="no"
      :src="
        apiUrl +
        '/warm-flow-ui/index.html?id=' +
        id +
        '&disabled=' +
        !$enums.FLOW_DEFINITION_IS_PUBLISH.N.equalsCode(formData.isPublish) +
        '&token=' +
        token +
        '&uuid=' +
        $utils.uuid()
      "
    ></iframe>
  </a-modal>
</template>
<script>
  import { defineComponent } from 'vue';
  import { useGlobSetting } from '/@/hooks/setting';
  import { getToken } from '@/utils/auth';
  import * as api from '@/api/bpm/flow/definition';

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
        // 表单数据
        formData: {},
      };
    },
    computed: {
      apiUrl() {
        const { apiUrl, cloudEnable } = useGlobSetting();

        return `${apiUrl}${cloudEnable === 'true' ? '/cloud-api' : ''}`;
      },
      token() {
        return getToken();
      },
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
          code: '',
          name: '',
          categoryId: '',
          categoryName: '',
          isPublish: '',
        };
      },
      // 页面显示时由父页面触发
      open() {
        // 初始化数据
        this.initFormData();

        // 查询数据
        this.loadFormData();
      },
      // 查询数据
      loadFormData() {
        this.loading = true;
        api
          .detail(this.id)
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
