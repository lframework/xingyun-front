<template>
  <div class="j-border">
    <div v-if="!isEmpty(title)" :class="'j-border-title'">{{ title }}</div>
    <slot></slot>
  </div>
</template>
<script setup>
  import { isEmpty } from '@/utils/utils';
  import { defineOptions } from 'vue';

  defineOptions({
    name: 'JBorder',
  });
  defineProps({
    title: {
      type: String,
      default: '',
    },
  });
</script>
<style lang="less">
  .j-border {
    border: 1px solid #eeeeee;
    border-radius: 4px;
    padding: 5px;
    background-color: #ffffff;

    .j-border-title {
      margin-left: 20px;
      color: rgba(0, 0, 0, 0.85);
      font-weight: 700;
      font-size: 16px;
      line-height: 1.5;
    }

    /*.j-border-title--default {
    font-size: 12px;
    padding: 0 20px;

    transform: translateY(-80%);
  }*/
  }
</style>
