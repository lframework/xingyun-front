<template>
  <div>
    <a-form label-width="80px" :model="activeElement" size="mini" class="kr-form">
      <a-row>
        <a-form-item label="对齐方式">
          <a-radio-group
            v-model:value="activeElement.style.Alignment"
            :options="[
              { label: '左对齐', value: 'left' },
              { label: '居中', value: 'center' },
              { label: '右对齐', value: 'right' },
            ]"
          />
        </a-form-item>
      </a-row>
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
          <a-form-item label="字体颜色">
            <a-input v-model:value="activeElement.style.FontColor" />
          </a-form-item>
        </a-col>
      </a-row>
      <a-row>
        <a-col :span="12">
          <a-form-item label="当前页码样式">
            <a-input v-model:value="activeElement.curPageStyle" class="min-input" />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="总页码样式">
            <a-input v-model:value="activeElement.totalPageStyle" class="min-input" />
          </a-form-item>
        </a-col>
      </a-row>
      <a-row>
        <a-col :span="12">
          <a-form-item label="页码分隔样式">
            <a-input v-model:value="activeElement.splitPageStyle" class="min-input" />
          </a-form-item>
        </a-col>
      </a-row>
      <a-row>
        <a-col :span="12">
          <a-form-item label="打印类型">
            <a-select v-model:value="activeElement.style.ItemType" class="min-input">
              <a-select-option v-for="val in itemTypeArray" :value="val.value" :key="val.value">{{
                val.label
              }}</a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="高度自动">
            <a-switch
              v-model:checked="activeElement.style.autoHeight"
              :active-value="true"
              :inactive-value="false"
            />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="下边距">
            <a-input-number
              :disabled="!activeElement.style.autoHeight"
              v-model:value="activeElement.style.BottomMargin"
              :min="0"
              class="min-input"
            />
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
