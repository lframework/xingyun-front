<template>
  <div>
    <a-form label-width="80px" :model="activeElement" size="mini" class="kr-form">
      <a-row>
        <a-col :span="12">
          <a-form-item label="字号">
            <a-input-number
              v-model:value="activeElement.style.FontSize"
              :min="1"
              class="min-input"
            />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="条码值">
            <a-switch
              v-model:checked="activeElement.style.ShowBarText"
              :checked-value="'1'"
              :unchecked-value="'0'"
            />
          </a-form-item>
        </a-col>
      </a-row>
      <a-row>
        <a-col :span="12">
          <a-form-item label="条码类型">
            <a-select v-model:value="activeElement.style.CodeType" class="min-input">
              <a-select-option v-for="val in codeTypeArray" :key="val" :value="val">{{
                val
              }}</a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="打印类型">
            <a-select v-model:value="activeElement.style.ItemType" class="min-input">
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
  import { getCodeTypeArray, getItemTypeArray } from '../../libs/props.js';
  import { usePrintDesignerStore } from '../../store/printDesigner';

  export default defineComponent({
    props: {
      activeElement: {
        type: Object,
        required: true,
      },
    },
    setup() {
      const printDesignerStore = usePrintDesignerStore();
      return {
        printDesignerStore,
      };
    },
    data() {
      return {
        codeTypeArray: getCodeTypeArray(),
        itemTypeArray: getItemTypeArray(),
      };
    },
    computed: {
      // 页面高度
      height() {
        return this.printDesignerStore.page.height;
      },
    },
  });
</script>
<style lang="scss" scoped></style>
