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
      fontWeight: val.style.Bold === '1' ? 'bold' : 'normal',
      lineHeight: val.style.FontSize + 'px',
      border: val.style.bordered
        ? (!val.style.intLineWidth ? '1' : val.style.intLineWidth) +
          'px ' +
          parseIntLineStyle(val.style.intLineStyle) +
          ' #000'
        : 'none',
    }"
  >
    <span
      :style="{
        position: 'relative',
        top: (val.style.topOffset || 0) + 'px',
        left: (val.style.leftOffset || 0) + 'px',
      }"
      >{{ val.value }}</span
    >
  </div>
</template>

<script>
  import { defineComponent } from 'vue';
  import { widgetName } from './settings';
  import { parseIntLineStyle } from '@/components/PrintDesigner/src/libs/props';

  export default defineComponent({
    name: widgetName,
    props: {
      val: {
        type: Object,
        required: true,
      },
    },
    setup() {
      return {
        parseIntLineStyle,
      };
    },
    methods: {},
  });
</script>
