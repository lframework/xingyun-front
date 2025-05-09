<template>
  <div>
    <a-form label-width="80px" :model="activeElement" size="mini" class="kr-form">
      <a-row>
        <a-col :span="12">
          <a-form-item label="打印类型">
            <a-select
              :disabled="activeElement.style.ItemType === undefined"
              v-model:value="activeElement.style.ItemType"
              class="min-input"
            >
              <a-select-option v-for="val in itemTypeArray" :value="val.value" :key="val.value">{{
                val.label
              }}</a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
      </a-row>
    </a-form>
  </div>
</template>
<script>
  import { defineComponent } from 'vue';
  import { getItemTypeArray } from '../../libs/props.js';
  import { usePrintDesignerStore } from '../../store/printDesigner';

  export default defineComponent({
    setup() {
      const printDesignerStore = usePrintDesignerStore();
      return {
        printDesignerStore,
      };
    },
    data() {
      return {
        itemTypeArray: getItemTypeArray(),
      };
    },
    computed: {
      activeElement() {
        return this.printDesignerStore.activeElement;
      },
      // 页面高度
      height() {
        return this.printDesignerStore.page.height;
      },
    },
  });
</script>
<style lang="scss" scoped></style>
