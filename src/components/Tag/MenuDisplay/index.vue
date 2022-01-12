<template>
  <el-tag v-if="$enums.MENU_DISPLAY.CATALOG.equalsCode(menuDisplay)">{{ $enums.MENU_DISPLAY.CATALOG.desc }}</el-tag>
  <el-tag v-else-if="$enums.MENU_DISPLAY.FUNCTION.equalsCode(menuDisplay)" type="success">{{ $enums.MENU_DISPLAY.FUNCTION.desc }}</el-tag>
  <el-tag v-else-if="$enums.MENU_DISPLAY.PERMISSION.equalsCode(menuDisplay)" type="warning">{{ $enums.MENU_DISPLAY.PERMISSION.desc }}</el-tag>
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
