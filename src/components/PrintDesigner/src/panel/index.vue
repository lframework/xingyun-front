<template>
  <div class="kr-collapse">
    <a-collapse v-model:active-key="activeNames">
      <a-collapse-panel key="1">
        <template #header>
          <span>页面参数</span>
        </template>
        <page />
      </a-collapse-panel>
      <a-collapse-panel key="3">
        <template #header>
          <span>组件</span>
        </template>
        <options />
      </a-collapse-panel>
      <a-collapse-panel key="4">
        <template #header>
          <span>已加组件</span>
        </template>
        <layers />
      </a-collapse-panel>
      <a-collapse-panel key="2" v-if="printDesignerStore.type !== 'page'">
        <template #header>
          <span>样式</span>
        </template>
        <appearance class="pd-l-10" />
      </a-collapse-panel>
    </a-collapse>
  </div>
</template>

<script>
  import { defineComponent } from 'vue';
  import page from './page.vue';
  import style from './style.vue';
  import options from './options/index.vue';
  import layers from './layers.vue';
  import { usePrintDesignerStore } from '../store/printDesigner';

  export default defineComponent({
    components: {
      page,
      appearance: style,
      options,
      layers,
    },
    setup() {
      const printDesignerStore = usePrintDesignerStore();
      return {
        printDesignerStore,
      };
    },

    data() {
      return {
        activeNames: ['1', '2', '3', '4'],
      };
    },
  });
</script>
