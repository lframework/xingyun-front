<template>
  <div style="width: 100%">
    <a-select
      v-if="!readOnly"
      v-model:value="value"
      show-search
      option-filter-prop="children"
      :filter-option="filterOption"
      :allow-clear="true"
      :disabled="disabled"
      @change="handleChange"
    >
      <a-select-option v-for="item in dicOptions" :key="item.id" :value="item.id">
        {{ item.name }}
      </a-select-option>
    </a-select>
    <a-input v-if="readOnly" read-only :value="_value" />
  </div>
</template>
<script>
  import { defineComponent } from 'vue';
  import * as api from '@/api/system/dic-item';

  export default defineComponent({
    name: 'DataDicPicker',
    props: {
      code: {
        type: String,
        required: true,
      },
      value: {
        type: String,
        required: true,
      },
      disabled: {
        type: Boolean,
        default: false,
      },
      readOnly: {
        type: Boolean,
        default: false,
      },
    },
    data() {
      return {
        dicOptions: [],
      };
    },
    computed: {
      _value() {
        const filters = this.dicOptions.filter((item) => item.id === this.value);
        if (this.$utils.isEmpty(filters)) {
          return undefined;
        }

        return filters[0].name;
      },
    },
    created() {
      this.loadDatas();
    },
    methods: {
      async loadDatas() {
        this.dicOptions = await api.getByDicCode(this.code);
      },
      handleChange(value) {
        this.$emit('change', value);
        this.$emit('update:value', value);
      },
      filterOption(input, option) {
        return (
          option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
        );
      },
    },
  });
</script>
