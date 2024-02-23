<template>
  <div>
    <div> 姓名: {{ name }} </div>
    <div> IP: {{ ip }} </div>
    <div> 发生时间: {{ createTime }} </div>
  </div>
</template>

<script>
  import { defineComponent } from 'vue';

  export default defineComponent({
    name: 'UserConnectTip',
    props: {
      name: {
        type: String,
        required: true,
      },
      ip: {
        type: String,
        required: true,
      },
      createTime: {
        type: String,
        required: true,
      },
    },
    methods: {},
  });
</script>
