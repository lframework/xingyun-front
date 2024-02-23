<template>
  <transition enter-active-class="animated fadeIn">
    <div v-show="visible && itemShow" :class="'j-form-item'" :style="{ width: itemWidth }">
      <span
        v-if="!hiddenLabel"
        class="j-form-item-label"
        :style="{ width: form.labelWidth, minWidth: form.labelWidth }"
      >
        <span v-if="_required" class="j-form-item-required"></span>
        <slot v-if="!(autoHiddenLabel && !$slots.default)" name="label"></slot>
        <span v-if="!$slots.label">{{ autoHiddenLabel && !$slots.default ? '' : label }}</span>
        <span>{{ autoHiddenLabel && !$slots.default ? '' : '：' }}</span>
      </span>
      <div v-if="contentNest" class="j-form-item-content" :style="{ width: contentWidth }">
        <slot></slot>
      </div>
      <slot v-else></slot>
    </div>
  </transition>
</template>
<script>
  import { defineComponent, ref, toValue } from 'vue';

  export default defineComponent({
    name: 'JFormItem',

    componentName: 'JFormItem',

    props: {
      prop: {
        type: String,
        default: undefined,
      },
      /**
       * 文字标签内容
       */
      label: {
        type: String,
        default: '',
      },
      /**
       * 内容是否用div包裹
       */
      contentNest: {
        type: Boolean,
        default: true,
      },
      /**
       * 内容宽度
       */
      contentWidth: {
        type: String,
        default: '60%',
      },
      /**
       * 占位列数
       */
      span: {
        type: Number,
        default: 8,
      },
      /**
       * 当内容为空时， 是否自动隐藏文字标签
       */
      autoHiddenLabel: {
        type: Boolean,
        default: true,
      },
      /**
       * 是否必填
       */
      required: {
        type: Boolean,
        default: false,
      },
      /**
       * 是否显示冒号
       */
      colon: {
        type: Boolean,
        default: true,
      },
      /**
       * 是否显示
       */
      itemShow: {
        type: Boolean,
        default: true,
      },
      /**
       * 是否隐藏Label
       */
      hiddenLabel: {
        type: Boolean,
        default: false,
      },
    },
    setup() {
      const visible = ref(true);

      return {
        visible,
      };
    },
    computed: {
      form() {
        let parent = this.$parent;
        let parentName = parent.$options.componentName;
        while (parentName !== 'JForm') {
          parent = parent.$parent;
          parentName = parent.$options.componentName;
        }
        return parent;
      },
      itemWidth() {
        const span = Math.max(1, Math.min(this.span, 24));

        return (span / 24) * 100 + '%';
      },
      _required() {
        if (this.required) {
          return true;
        }

        const rules = toValue(this.form?.rules);
        const prop = toValue(this.prop);

        if (!rules || !prop) {
          return false;
        }

        const validRules = this.form.rules[this.prop];
        if (!validRules) {
          return false;
        }

        return validRules.some((item) => item.required);
      },
    },
  });
</script>
