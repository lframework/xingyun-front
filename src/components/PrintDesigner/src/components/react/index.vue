<template>
  <div
    class="widgets"
    :style="{
      position: 'absolute',
      left: val.left + 'px',
      top: val.top + 'px',
      width: val.width + 'px',
      minHeight: val.height + 'px',
      zIndex: val.style.zIndex,
      border: '1px solid #000000',
    }"
  ></div>
</template>

<script>
  import { defineComponent } from 'vue';
  import { widgetName } from './settings';

  export default defineComponent({
    name: widgetName,
    props: {
      val: {
        type: Object,
        required: true,
      },
    },
    methods: {},
  });
</script>
