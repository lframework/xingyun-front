<template>
  <div class="flex flex-row flex-nowrap flex-justify-center">
    <slot></slot>
  </div>
</template>
<script setup>
  import { defineOptions } from 'vue';

  defineOptions({
    name: 'NoWrap',
  });
</script>
