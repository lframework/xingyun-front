<template>
  <div class="options-box">
    <template v-for="(item, index) in optionItems" :key="index">
      <a-popover
        v-if="item.type === 'braid-table'"
        placement="top"
        width="200"
        v-model:open="tablePopover"
      >
        <template #content>
          <div>
            <a-checkbox-group v-model:value="item.selectCol">
              <a-row>
                <a-col v-for="col in item.columnsAttr" :key="col.name" :span="12">
                  <a-checkbox :value="col.name">{{ col.title }}</a-checkbox>
                </a-col>
              </a-row>
            </a-checkbox-group>
          </div>
          <!--          <a-button size="small" slot="reference">{{ item.title }}</a-button>-->
          <a-button
            size="small"
            type="primary"
            @click="
              (e) => {
                addTempItem(e, item);
              }
            "
            >确定</a-button
          >
        </template>
        <a-button size="small">{{ item.title }}</a-button>
      </a-popover>
      <a-button
        v-else
        size="small"
        @click="
          (e) => {
            addTempItem(e, item);
          }
        "
        >{{ item.title }}</a-button
      >
    </template>
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
      return {
        tablePopover: false,
      };
    },
    computed: {
      optionItems() {
        return this.printDesignerStore.optionItems;
      },
    },
    methods: {
      // 添加组件
      addTempItem(e, item) {
        switch (item.type) {
          case 'braid-table': {
            let selectCol = [];
            item.selectCol.forEach((itemName) => {
              let colInfo = item.columnsAttr.find((col) => col.name === itemName);
              if (colInfo) {
                selectCol.push(colInfo);
              }
            });
            item.columns = selectCol; //表格显示的字段
            this.printDesignerStore.addTempItem(item);
            this.tablePopover = false;
            break;
          }
          default:
            this.printDesignerStore.addTempItem(item);
        }
      },
    },
  });
</script>

<style lang="scss" scoped>
  .options-box {
    .ant-btn {
      margin-bottom: 10px;
      margin-right: 10px;
      margin-left: 0;
    }
  }
</style>
