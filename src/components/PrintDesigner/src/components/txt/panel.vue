<template>
  <div>
    <a-form label-width="80px" :model="activeElement" size="mini" class="kr-form">
      <a-row>
        <a-col :span="24">
          <a-form-item label="内容">
            <a-textarea
              :readonly="!activeElement.isEdit"
              v-model:value="activeElement.value"
              @change="(e) => updateText(e, activeElement.uuid)"
            />
          </a-form-item>
        </a-col>
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
          <a-form-item label="加粗">
            <a-switch
              v-model:checked="activeElement.style.Bold"
              :checked-value="'1'"
              :unchecked-value="'0'"
            />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="边框">
            <a-switch
              v-model:checked="activeElement.style.bordered"
              :checked-value="true"
              :unchecked-value="false"
            />
          </a-form-item>
        </a-col>
      </a-row>
      <a-row v-if="activeElement.style.bordered">
        <a-col :span="12">
          <a-form-item label="边框样式">
            <a-select v-model:value="activeElement.style.intLineStyle" class="min-input">
              <a-select-option
                v-for="val in intLineStyleArray"
                :value="val.value"
                :key="val.value"
                >{{ val.label }}</a-select-option
              >
            </a-select>
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="边框宽度">
            <a-input-number
              v-model:value="activeElement.style.intLineWidth"
              :min="1"
              class="min-input"
            />
          </a-form-item>
        </a-col>
      </a-row>
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
          <a-form-item label="打印类型">
            <a-select v-model:value="activeElement.style.ItemType" class="min-input">
              <a-select-option v-for="val in itemTypeArray" :value="val.value" :key="val.value">{{
                val.label
              }}</a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
      </a-row>
      <a-row>
        <a-form-item label="文字距离上边框距离">
          <a-input-number v-model:value="activeElement.style.topOffset" class="min-input" />
        </a-form-item>
      </a-row>
      <a-row>
        <a-form-item label="文字距离左边框距离">
          <a-input-number v-model:value="activeElement.style.leftOffset" class="min-input" />
        </a-form-item>
      </a-row>
    </a-form>
  </div>
</template>
<script>
  import { defineComponent } from 'vue';
  import { getItemTypeArray, getIntLineStyleArray } from '../../libs/props.js';
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
        intLineStyleArray: getIntLineStyleArray(),
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
      updateText(e, uuid) {
        this.printDesignerStore.updateData({
          uuid: uuid,
          key: 'value',
          value: this.activeElement.value,
        });
      },
    },
  });
</script>
<style lang="scss" scoped></style>
