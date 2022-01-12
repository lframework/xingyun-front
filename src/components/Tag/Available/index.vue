<template>
  <div>
    <el-badge :type="$enums.AVAILABLE.ENABLE.equalsCode(available) ? 'primary' : 'danger'" class="dot-tag" is-dot />
    <span>{{ $enums.AVAILABLE.getDesc(available) }}</span>
  </div>
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
