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
      fontSize: val.style.FontSize + 'px',
      color: val.style.FontColor,
      textAlign: val.style.Alignment,
    }"
  >
    <span>{{ val.curPageStyle }}{{ val.splitPageStyle }}{{ val.totalPageStyle }}</span>
  </div>
</template>

<script>
  import { defineComponent } from 'vue';
  import { widgetName } from './settings';
  import { usePrintDesignerStore } from '../../store/printDesigner';

  export default defineComponent({
    name: widgetName,
    props: {
      val: {
        type: Object,
        required: true,
      },
    },
    setup() {
      const printDesignerStore = usePrintDesignerStore();
      return {
        printDesignerStore,
      };
    },
    methods: {},
  });
</script>
