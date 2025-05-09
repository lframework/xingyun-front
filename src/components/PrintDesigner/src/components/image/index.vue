<template>
  <div
    class="widgets"
    :style="{
      position: 'absolute',
      width: val.width + 'px',
      height: val.height + 'px',
      left: val.left + 'px',
      top: val.top + 'px',
      zIndex: val.zIndex,
    }"
  >
    <img class="braid-image" :title="val.title" :src="val.value || val.defaultValue" />
  </div>
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
    data() {
      return {};
    },
    computed: {
      imageUrl() {
        return this.val.value;
      },
    },
    watch: {
      val(newVal) {
        this.imageUrl = newVal.value;
      },
    },
  });
</script>

<style scoped>
  .braid-image {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    user-select: none;
    -webkit-user-drag: none;
    pointer-events: none;
  }
</style>
