<template>
  <a-badge :status="$enums.AVAILABLE.ENABLE.equalsCode(available) ? 'success' : 'error'" :text="$enums.AVAILABLE.getDesc(available)" />
</template>
<script>
export default {
  name: 'AvailableTag',
  props: {
    available: {
      type: Boolean || String,
      required: true
    }
  }
}
</script>
