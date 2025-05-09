<template>
  <div>
    <!-- 公共属性 -->
    <a-form label-width="80px" :model="activeElement" size="mini" class="kr-form">
      <a-row>
        <a-form-item>
          <a-col :span="24">
            <a-space
              ><a-button size="small" type="primary" @click="copyTempItem">复制</a-button></a-space
            >
          </a-col>
        </a-form-item>
      </a-row>
      <a-row>
        <a-col :span="12">
          <a-form-item label="宽度">
            <a-input-number v-model:value="activeElement.width" :min="1" class="min-input" />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="高度">
            <a-input-number v-model:value="activeElement.height" :min="1" class="min-input" />
          </a-form-item>
        </a-col>
      </a-row>
      <a-row>
        <a-col :span="12">
          <a-form-item label="横坐标">
            <a-input-number v-model:value="activeElement.left" :min="0" class="min-input" />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="纵坐标">
            <a-input-number v-model:value="activeElement.top" :min="0" class="min-input" />
          </a-form-item>
        </a-col>
      </a-row>
      <a-row>
        <a-col :span="12">
          <a-form-item label="组件名称">
            <a-input v-model:value="activeElement.title" class="min-input" />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="字段名">
            <a-input v-model:value="activeElement.name" class="min-input" />
          </a-form-item>
        </a-col>
      </a-row>
      <component :is="activeElement.type + 'Panel'" :active-element="activeElement" />
    </a-form>
  </div>
</template>
<script>
  import { defineComponent } from 'vue';
  import { getCodeTypeArray, getItemTypeArray } from '../libs/props.js';
  import cloneDeep from 'lodash/cloneDeep';
  import { usePrintDesignerStore } from '../store/printDesigner';

  export default defineComponent({
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
      activeElement() {
        return this.printDesignerStore.activeElement;
      },
      // 页面高度
      height() {
        return this.printDesignerStore.page.height;
      },
    },
    methods: {
      copyTempItem() {
        const item = cloneDeep(this.activeElement);
        this.printDesignerStore.addTempItem(item);
      },
    },
  });
</script>
<style lang="scss" scoped>
  .mini-form {
    ::v-deep.a-form-item--mini.a-form-item {
      margin-bottom: 10px;
    }
  }
</style>
