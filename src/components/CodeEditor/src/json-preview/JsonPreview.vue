<template>
  <div class="json-preview">
    <CodeEditor :value="previewValue" readonly bordered />
  </div>
</template>

<script lang="ts" setup>
  import { computed } from 'vue';
  import CodeEditor from '../CodeEditor.vue';

  const props = defineProps({
    data: {
      type: [Object, Array, String, Number, Boolean],
      default: () => ({}),
    },
  });

  const previewValue = computed(() => {
    const { data } = props;

    if (typeof data === 'string') {
      try {
        return JSON.stringify(JSON.parse(data), null, 2);
      } catch (e) {
        return data;
      }
    }

    return JSON.stringify(data ?? {}, null, 2);
  });
</script>

<style lang="less" scoped>
  .json-preview {
    height: 100%;
    min-height: 300px;
  }
</style>
