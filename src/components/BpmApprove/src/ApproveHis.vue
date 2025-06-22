<template>
  <div>
    <a-collapse v-model:active-key="activeKey" v-for="item in formData" :key="item.id" accordion>
      <a-collapse-panel :key="item.id" :header="item.title">
        <flow-chart :instance-id="item.id" />
      </a-collapse-panel>
    </a-collapse>
  </div>
</template>
<script>
  import { defineComponent } from 'vue';
  import FlowChart from '@/components/FlowChart';
  import * as api from '@/api/bpm/flow/instance';

  export default defineComponent({
    components: { FlowChart },
    props: {
      businessId: {
        type: String,
        required: true,
      },
    },
    data() {
      return {
        // 是否显示加载框
        loading: false,
        // 表单数据
        formData: [],
        activeKey: [],
      };
    },
    computed: {},
    created() {
      // 初始化表单数据
      this.initFormData();
    },
    methods: {
      // 初始化表单数据
      initFormData() {
        api.listBusiness(this.businessId).then((res) => {
          this.formData = res;

          this.activeKey = this.$utils.isEmpty(this.formData) ? '' : this.formData[0].id;
        });
      },
    },
  });
</script>
<style></style>
