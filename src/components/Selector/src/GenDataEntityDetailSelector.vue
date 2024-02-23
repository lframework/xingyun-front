<template>
  <div>
    <a-select
      v-model:value="model"
      mode="multiple"
      style="width: 100%"
      @change="(e) => $emit('update:value', e)"
    >
      <a-select-option v-for="item in selectOptions" :key="item.id" :value="item.id">
        {{ item.name }}
      </a-select-option>
    </a-select>
  </div>
</template>

<script>
  import { defineComponent } from 'vue';
  import * as api from '@/api/development/data/entity-detail';

  export default defineComponent({
    name: 'GenDataEntityDetailSelector',
    components: {},
    props: {
      value: { type: Array, required: true },
      entityId: {
        type: String,
        required: true,
      },
    },
    data() {
      return {
        selectOptions: [],
      };
    },
    computed: {
      model: {
        get() {
          return this.value;
        },
        set() {},
      },
    },
    created() {
      this.loadSelectOptions();
    },
    methods: {
      getList() {
        return api.selector({
          entityId: this.entityId,
        });
      },
      loadSelectOptions() {
        this.selectOptions = [];
        if (!this.$utils.isEmpty(this.entityId)) {
          this.getList().then((res) => {
            this.selectOptions = res;
          });
        }
      },
    },
  });
</script>

<style lang="less"></style>
