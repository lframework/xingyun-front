<template>
  <div>
    <div class="j-form-item-container">
      <slot></slot>
      <FadeTransition :group="true">
        <slot v-if="collapseStatus" name="more"></slot>
      </FadeTransition>
    </div>
    <div v-if="showCollapse" class="j-form-item-footer-container">
      <a :class="'j-form-item-footer'" type="info" @click="toggleCollapse"
        >{{ collapseStatus ? '收起' : '显示更多'
        }}<basic-arrow class="ml-1" :expand="!collapseStatus" up
      /></a>
    </div>
  </div>
</template>
<script>
  import { BasicArrow } from '@/components/Basic';
  import Schema from 'async-validator';
  import { defineComponent, ref, toValue } from 'vue';
  import { keys } from '@/utils/utils';
  import { createError } from '@/hooks/web/msg';
  import { FadeTransition } from '@/components/Transition';

  export default defineComponent({
    name: 'JForm',

    componentName: 'JForm',
    components: {
      BasicArrow,
      FadeTransition,
    },

    props: {
      model: {
        type: Object,
        default: () => {},
      },
      rules: {
        type: Object,
        default: undefined,
      },
      /**
       * 文字标签宽度
       */
      labelWidth: {
        type: String,
        default: '100px',
      },
      enableCollapse: {
        type: Boolean,
        default: true,
      },
    },
    setup() {
      const collapseStatus = ref(false);

      return {
        collapseStatus,
      };
    },
    computed: {
      showCollapse() {
        const { $slots } = this;
        return $slots.more;
      },
    },
    methods: {
      toggleCollapse() {
        this.collapseStatus = !this.collapseStatus;
        this.$emit('collapse')
      },
      validate() {
        const model = toValue(this.model);
        const rules = toValue(this.rules);
        const getItems = this.getItems;
        return new Promise((resolve) => {
          if (!model || !rules) {
            resolve(true);
          } else {
            const itemProps = getItems().map((item) => item.props.prop);
            const ruleKeys = keys(rules).filter((ruleKey) => itemProps.includes(ruleKey));
            const newRules = {};
            ruleKeys.forEach((ruleKey) => {
              newRules[ruleKey] = rules[ruleKey];
            });
            const validator = new Schema(newRules);
            validator
              .validate(model, {
                suppressWarning: true,
                first: true,
                firstFields: true,
              })
              .then(() => {
                resolve(true);
              })
              .catch(({ errors, fields }) => {
                createError(errors[0].message);
                resolve(false, errors, fields);
              });
          }
        });
      },
      getItems() {
        const { $slots } = this;
        return $slots.default().filter((vnode) => {
          return vnode.type?.componentName === 'JFormItem';
        });
      },
    },
  });
</script>
