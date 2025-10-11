<template>
  <div>
    <a-tree-select
      v-model:value="model"
      tree-default-expand-all
      :show-search="true"
      :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
      :field-names="{ label: 'name', key: 'id', value: 'id', children: 'children' }"
      :tree-data="options"
      :placeholder="placeholder"
      allow-clear
      :filter-tree-node="filter"
      :disabled="disabled"
      :multiple="multiple"
      style="width: 100%"
      @change="onChange"
    />
  </div>
</template>

<script>
  import { defineComponent } from 'vue';
  import * as api from '@/api/bpm/flow/flow-category';
  import { toArrayTree, eachTree, isEmpty } from '@/utils/utils';

  export default defineComponent({
    name: 'FlowCategorySelector',
    components: {},
    props: {
      value: { type: [Object, String, Array], required: true },
      requestParams: {
        type: Object,
        default: (e) => {
          return {};
        },
      },
      onlyFinal: {
        type: Boolean,
        default: true,
      },
      disabled: {
        type: Boolean,
        default: false,
      },
      beforeOpen: {
        type: Function,
        default: (e) => {
          return () => {
            return true;
          };
        },
      },
      placeholder: {
        type: String,
        default: '',
      },
      multiple: {
        type: Boolean,
        default: false,
      },
    },
    data() {
      return {
        options: [],
      };
    },
    computed: {
      model: {
        get() {
          return this.value;
        },
        set() {},
      },
      _requestParams() {
        return Object.assign({}, this.requestParams);
      },
    },
    created() {
      this.loadOptions();
    },
    methods: {
      getList() {
        return api.query();
      },
      loadOptions() {
        this.getList().then((data) => {
          const options = toArrayTree(data);
          if (this.onlyFinal) {
            eachTree(options, (item) => {
              if (!isEmpty(item.children) || isEmpty(item.parentId)) {
                item.disabled = true;
              }
            });
          }

          this.options = options;
        });
      },
      onChange(e) {
        if (isEmpty(e)) {
          this.$emit('update:value', e);
          this.$emit('clear', e);
        } else {
          this.$emit('update:value', e);
        }
      },
      filter(inputValue, node) {
        return node.name.indexOf(inputValue) > -1;
      },
    },
  });
</script>

<style lang="less"></style>
