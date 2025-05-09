<template>
  <div>
    <a-form label-width="80px" :model="pageInfo" size="mini" class="kr-form">
      <a-row>
        <a-col :span="24">
          <a-form-item label="模板名称">
            <a-input v-model:value="pageInfo.title" class="w-full" />
          </a-form-item>
        </a-col>
      </a-row>
      <a-row>
        <a-col :span="12">
          <a-form-item label="模板宽度">
            <a-input-number v-model:value="pageInfo.width" :min="1" class="min-input" disabled />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="模板高度">
            <a-input-number v-model:value="pageInfo.height" :min="1" class="min-input" disabled />
          </a-form-item>
        </a-col>
      </a-row>
      <a-row>
        <a-col :span="24">
          <a-form-item label="纸张方向">
            <a-radio-group
              v-model:value="pageInfo.pageDirection"
              :options="[
                {
                  label: '纵向',
                  value: 1,
                },
                {
                  label: '横向',
                  value: 2,
                },
              ]"
              @change="changePageDirection"
            />
          </a-form-item>
        </a-col>
      </a-row>
      <a-row>
        <div style="margin: 5px">
          <a-space>
            <a-dropdown>
              <a @click.prevent>
                选择纸张
                <DownOutlined />
              </a>
              <template #overlay>
                <a-menu @click="onSetPageSize">
                  <a-menu-item v-for="(item, index) in pageSizeModels" :key="index">{{
                    item.name
                  }}</a-menu-item>
                </a-menu>
              </template>
            </a-dropdown>
          </a-space>
        </div>
      </a-row>
      <a-row>
        <a-form-item label="纸张宽度">
          <a-input-number v-model:value="pageInfo.pageWidth" :min="1" class="min-input" />
          <span class="unit-text">(mm)</span>
        </a-form-item>
      </a-row>
      <a-row>
        <a-form-item label="纸张高度">
          <a-input-number v-model:value="pageInfo.pageHeight" :min="1" class="min-input" />
          <span class="unit-text">(mm)</span>
        </a-form-item>
      </a-row>
    </a-form>
  </div>
</template>

<script>
  import { defineComponent } from 'vue';
  import { DownOutlined } from '@ant-design/icons-vue';
  import { mm2px } from '../utils/calc';
  import { usePrintDesignerStore } from '../store/printDesigner';

  export default defineComponent({
    components: {
      DownOutlined,
    },
    setup() {
      const printDesignerStore = usePrintDesignerStore();
      return {
        printDesignerStore,
      };
    },
    computed: {
      pageInfo() {
        return this.printDesignerStore.page;
      },
      pageSizeModels() {
        const models = [];
        models.push(
          {
            name: 'A3',
            width: 297,
            height: 420,
          },
          {
            name: 'A4',
            width: 210,
            height: 297,
          },
          {
            name: 'A5',
            width: 148,
            height: 210,
          },
          {
            name: 'A6',
            width: 105,
            height: 148,
          },
          {
            name: 'B3',
            width: 353,
            height: 500,
          },
          {
            name: 'B4',
            width: 250,
            height: 353,
          },
          {
            name: 'B5',
            width: 176,
            height: 250,
          },
          {
            name: 'B6',
            width: 125,
            height: 176,
          },
        );

        return models;
      },
    },
    methods: {
      onSetPageSize({ key }) {
        const model = this.pageSizeModels[key];
        this.pageInfo.pageWidth = model.width;
        this.pageInfo.pageHeight = model.height;
        this.pageInfo.width = parseInt(mm2px(model.width));
        this.pageInfo.height = parseInt(mm2px(model.height));

        this.pageInfo.pageDirection = 1;
      },
      changePageDirection() {
        if (this.pageInfo.pageDirection === 1) {
          this.pageInfo.width = parseInt(mm2px(this.pageInfo.pageWidth));
          this.pageInfo.height = parseInt(mm2px(this.pageInfo.pageHeight));
        } else {
          this.pageInfo.width = parseInt(mm2px(this.pageInfo.pageHeight));
          this.pageInfo.height = parseInt(mm2px(this.pageInfo.pageWidth));
        }
      },
    },
  });
</script>
