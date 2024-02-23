<template>
  <a-badge
    :status="AVAILABLE.get('ENABLE').equalsCode(available) ? 'success' : 'error'"
    :text="AVAILABLE.getDesc(available)"
  />
</template>
<script>
  import { defineComponent } from 'vue';
  import { AVAILABLE } from '@/enums/biz/available';

  export default defineComponent({
    name: 'AvailableTag',
    props: {
      available: {
        type: Boolean || String,
        required: true,
      },
    },
    setup() {
      return {
        AVAILABLE,
      };
    },
  });
</script>
