<template>
  <div v-if="visible" class="loading--wrapper">
    <div class="loading--spinner">
      <a-spin :spinning="visible" />
    </div>
  </div>

</template>

<script>
export default {
  data() {
    return {
      visible: false
    }
  }
}
</script>
<style lang="less">
.loading--wrapper {
  position: absolute;
  height: 100%;
  width: 100%;
  z-index: 99999;
  top: 0;
  left: 0;

  .loading--spinner {
    position: absolute;
    margin: 0 auto;
    top: 50%;
    left: 50%;
    z-index: 99999;
  }
}
</style>
