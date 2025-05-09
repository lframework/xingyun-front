<template>
  <div>
    <a-form label-width="80px" :model="activeElement" size="mini" class="kr-form">
      <a-row>
        <a-col :span="24">
          <a-form-item label="显示列">
            <a-checkbox-group v-model:value="activeElement.selectCol" @change="changeCol">
              <a-row>
                <a-col v-for="col in activeElement.columnsAttr" :key="col.name" :span="12">
                  <a-checkbox :value="col.name">{{ col.title }}</a-checkbox>
                </a-col>
              </a-row>
            </a-checkbox-group>
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
      </a-row>
      <a-row>
        <a-col :span="12">
          <a-form-item label="字体颜色">
            <a-input v-model:value="activeElement.style.FontColor" />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="边框颜色">
            <a-input v-model:value="activeElement.style.borderColor" />
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
  import { usePrintDesignerStore } from '../../store/printDesigner';

  export default defineComponent({
    setup() {
      const printDesignerStore = usePrintDesignerStore();
      return {
        printDesignerStore,
      };
    },
    data() {
      return {};
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
      changeCol() {
        let selectCol = [];
        this.activeElement.selectCol.forEach((itemName) => {
          let colInfo = this.activeElement.columnsAttr.find((col) => col.name === itemName);
          if (colInfo) {
            selectCol.push(colInfo);
          }
        });
        this.activeElement.columns = selectCol; //表格显示的字段
      },
    },
  });
</script>
<style lang="scss" scoped></style>
