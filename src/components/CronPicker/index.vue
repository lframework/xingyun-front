<template>
  <div class="components-input-demo-presuffix">
    <a-input ref="cronInput" v-model="cron" read-only @click="openModal" @change="handleCronChange" @keyup.enter="openModal">
      <a-icon slot="prefix" type="schedule" />
      <a-icon v-if="cron" slot="suffix" type="close-circle" title="清空" @click="handleEmpty" />
    </a-input>
    <CronModal ref="innerVueCron" :data="cron" @ok="handleOK" />
  </div>
</template>
<script>
import CronModal from './CronModal'
export default {
  name: 'CronPicker',
  components: {
    CronModal
  },
  props: {
    value: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      cron: ''
    }
  },
  watch: {
    value(value) {
      this.cron = value
    }
  },
  created() {
    const _this = this
    _this.cron = _this.value
  },
  methods: {
    openModal() {
      this.$refs.innerVueCron.show()
    },
    // cron change
    handleCronChange(val) {
      // val inputEvent对象
      this.$emit('change', this.cron)
    },
    handleOK(val) {
      this.cron = val
      this.$emit('input', this.cron)
      // this.$emit("change", Object.assign({},  this.cron));
    },
    handleEmpty() {
      this.cron = ''
    }
  }
}
</script>
<style lang="less" scoped>
.components-input-demo-presuffix .anticon-close-circle {
  cursor: pointer;
  color: #ccc;
  transition: color 0.3s;
  font-size: 12px;
}
.components-input-demo-presuffix .anticon-close-circle:hover {
  color: #666;
}
.components-input-demo-presuffix .anticon-close-circle:active {
  color: #666;
}
</style>
