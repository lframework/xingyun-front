<template>
  <div class="cron-picker">
    <a-input
      ref="cronInput"
      v-model:value="cron"
      readonly
      @click="openModal"
      @change="handleCronChange"
      @keyup.enter="openModal"
    >
      <template #prefix>
        <ScheduleOutlined />
      </template>
      <template #suffix>
        <CloseCircleOutlined v-if="cron && !disabled" @click="handleEmpty" />
      </template>
    </a-input>
    <a-form-item class="form-item-alone">
      <CronModal ref="innerVueCron" :data="cron" @set-cron="handleOK" />
    </a-form-item>
  </div>
</template>
<script>
  import { defineComponent } from 'vue';
  import CronModal from './CronModal.vue';
  import { ScheduleOutlined, CloseCircleOutlined } from '@ant-design/icons-vue';

  export default defineComponent({
    name: 'CronPicker',
    components: {
      CronModal,
      ScheduleOutlined,
      CloseCircleOutlined,
    },
    props: {
      value: {
        type: String,
        default: '',
      },
      disabled: {
        type: Boolean,
        default: false,
      },
    },
    data() {
      return {
        cron: '',
      };
    },
    watch: {
      value(value) {
        this.cron = value;
      },
    },
    created() {
      this.cron = this.value;
    },
    methods: {
      openModal() {
        if (this.disabled) {
          return;
        }
        this.$refs.innerVueCron.show();
      },
      // cron change
      handleCronChange(val) {
        // val inputEvent对象
        this.$emit('change', this.cron);
      },
      handleOK(val, a) {
        console.log(val);
        this.cron = val;
        this.$emit('update:value', this.cron);
        // this.$emit("change", Object.assign({},  this.cron));
      },
      handleEmpty() {
        if (this.disabled) {
          return;
        }
        this.cron = '';

        this.$emit('update:value', this.cron);
      },
    },
  });
</script>
<style lang="less" scoped>
  .cron-picker .anticon-close-circle {
    cursor: pointer;
    color: #ccc;
    transition: color 0.3s;
    font-size: 12px;
  }
  .cron-picker .anticon-close-circle:hover {
    color: #666;
  }
  .cron-picker .anticon-close-circle:active {
    color: #666;
  }
</style>
