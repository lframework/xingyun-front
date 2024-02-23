<template>
  <a-tag v-if="MENU_DISPLAY.get('CATALOG').equalsCode(menuDisplay)" color="blue">{{
    MENU_DISPLAY.get('CATALOG').desc
  }}</a-tag>
  <a-tag v-else-if="MENU_DISPLAY.get('FUNCTION').equalsCode(menuDisplay)" color="green">{{
    MENU_DISPLAY.get('FUNCTION').desc
  }}</a-tag>
  <a-tag v-else-if="MENU_DISPLAY.get('PERMISSION').equalsCode(menuDisplay)" color="orange">{{
    MENU_DISPLAY.get('PERMISSION').desc
  }}</a-tag>
</template>
<script>
  import { defineComponent } from 'vue';
  import { MENU_DISPLAY } from '@/enums/biz/menuDisplay';

  export default defineComponent({
    name: 'MenuDisplayTag',
    props: {
      menuDisplay: {
        type: Number || String,
        required: true,
      },
    },
    setup() {
      return {
        MENU_DISPLAY,
      };
    },
  });
</script>
