<template>
  <div class="tag-box">
    <a-tag
      class="cursor-pointer"
      v-for="(layer, index) in layers"
      :key="layer.uuid"
      :closable="layer === activeElement ? true : false"
      :color="layer === activeElement ? primaryColor : ''"
      @click="
        (e) => {
          activeLayer(e, layer);
        }
      "
      @close="
        (e) => {
          dele(e, layer);
        }
      "
      >{{ layer.title }}</a-tag
    >
  </div>
</template>

<script>
  import { defineComponent } from 'vue';
  import { cumulativeOffset, checkInView } from '../utils/offset';
  import setting from '@/settings/projectSetting';
  import { usePrintDesignerStore } from '../store/printDesigner';

  export default defineComponent({
    setup() {
      const printDesignerStore = usePrintDesignerStore();
      return {
        printDesignerStore,
      };
    },
    computed: {
      // 已添加的组件
      layers() {
        return this.printDesignerStore.page.tempItems;
      },
      activeElement() {
        return this.printDesignerStore.activeElement;
      },
      primaryColor() {
        return setting.themeColor;
      },
    },
    methods: {
      activeLayer(e, item) {
        this.printDesignerStore.select({
          uuid: item.uuid,
        });
        let viewport = document.querySelector('#viewport');
        if (viewport) {
          let target = viewport.querySelector(`[data-uuid='${item.uuid}']`);
          if (target && !checkInView(target)) {
            viewport.scrollTop = cumulativeOffset(target).top - 50;
          }
        } else {
          console.error('未找到 "#viewport" 的节点');
        }
      },

      // 删除元件
      dele(e, item) {
        this.printDesignerStore.delete(item.uuid);
      },
    },
  });
</script>
<style lang="scss" scoped>
  .tag-box {
    .ant-tag {
      margin-bottom: 10px;
      margin-right: 10px;
    }
  }
</style>
