<template>
  <a-tag v-if="$enums.MENU_DISPLAY.CATALOG.equalsCode(menuDisplay)" color="blue">{{ $enums.MENU_DISPLAY.CATALOG.desc }}</a-tag>
  <a-tag v-else-if="$enums.MENU_DISPLAY.FUNCTION.equalsCode(menuDisplay)" color="green">{{ $enums.MENU_DISPLAY.FUNCTION.desc }}</a-tag>
  <a-tag v-else-if="$enums.MENU_DISPLAY.PERMISSION.equalsCode(menuDisplay)" color="orange">{{ $enums.MENU_DISPLAY.PERMISSION.desc }}</a-tag>
</template>
<script>
export default {
  name: 'MenuDisplayTag',
  props: {
    menuDisplay: {
      type: Number || String,
      required: true
    }
  }
}
</script>
