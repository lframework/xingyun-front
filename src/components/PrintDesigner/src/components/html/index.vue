<template>
  <div
    class="widgets"
    v-html="val.value"
    :contenteditable="!!val.isEdit"
    @blur="(e) => updateText(e, val.uuid)"
    :style="{
      position: 'absolute',
      left: val.left + 'px',
      top: val.top + 'px',
      width: val.width + 'px',
      minHeight: val.height + 'px',
      zIndex: val.style.zIndex,
      fontSize: val.style.FontSize + 'px',
      color: val.style.FontColor,
    }"
  ></div>
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
    methods: {
      updateText(e, uuid) {
        let text = e.target.innerHTML;
        this.printDesignerStore.updateData({
          uuid: uuid,
          key: 'value',
          value: text,
        });
      },
    },
  });
</script>
