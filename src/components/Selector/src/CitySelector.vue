<template>
  <div>
    <a-cascader
      v-model:value="model"
      :options="options"
      :show-search="{ filter }"
      :field-names="{ label: 'name', key: 'id', value: 'id', children: 'children' }"
      :placeholder="placeholder"
      :allow-clear="true"
      :disabled="disabled"
      expand-trigger="hover"
      :change-on-select="!onlyFinal"
      @change="onChange"
    />
  </div>
</template>

<script>
  import { defineComponent } from 'vue';
  import * as api from '@/api/common/city';

  export default defineComponent({
    name: 'CitySelector',
    components: {},
    props: {
      value: { type: Array, required: true },
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
      getList(params) {
        return api.selector(params);
      },
      loadOptions() {
        this.getList(this._requestParams).then((data) => {
          this.options = this.$utils.toArrayTree(data, {
            strict: true,
          });
        });
      },
      onChange(e) {
        if (this.$utils.isEmpty(e)) {
          this.$emit('update:value', e);
          this.$emit('clear', e);
        } else {
          this.$emit('update:value', e);
        }
      },
      filter(inputValue, path) {
        return path.some(
          (option) => option.name.toLowerCase().indexOf(inputValue.toLowerCase()) > -1,
        );
      },
    },
  });
</script>

<style lang="less"></style>
