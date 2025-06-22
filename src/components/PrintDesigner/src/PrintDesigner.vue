<template>
  <div class="kr-designer" data-theme="kr-designer">
    <viewport class="kr-designer-view" />
    <div class="kr-designer-tool">
      <div class="kr-designer-tool_con">
        <panel class="control-panel" />
      </div>
      <div class="kr-designer-tool_bar">
        <a-space>
          <a-button size="small" type="primary" @click="saveTemp">保存</a-button>
          <a-button size="small" @click="previewTemp">预览</a-button>
        </a-space>
      </div>
    </div>
  </div>
</template>

<script>
  import { defineComponent } from 'vue';
  import Viewport from './viewport/index.vue';
  import Panel from './panel/index.vue';
  import cloneDeep from 'lodash/cloneDeep';
  import { usePrintDesignerStore } from './store/printDesigner';

  export default defineComponent({
    name: 'PrintDesigner',
    components: { Viewport, Panel },
    props: {
      widgetOptions: {
        type: Array,
        default: () => [],
      },
      tempValue: {
        type: Object,
        default: () => ({
          title: 'demo',
          width: 750,
          height: 550,
          pageWidth: 750,
          pageHeight: 550,
          tempItems: [],
        }),
      },
      demoData: {
        type: Object,
        default: () => ({}),
      },
    },
    setup() {
      const printDesignerStore = usePrintDesignerStore();
      return {
        printDesignerStore,
      };
    },
    created() {
      this.initTemp(this.tempValue, this.widgetOptions);
    },
    methods: {
      // 保存模板
      saveTemp() {
        let page = this.printDesignerStore.page;
        this.$emit('save', cloneDeep(page));
      },
      // 预览模板
      previewTemp() {
        let page = { ...this.printDesignerStore.page };
        this.$lodop.preview(cloneDeep(page), [this.demoData]);
      },

      // 初始化设计器
      initTemp(tempValue, widgetOptions) {
        this.printDesignerStore.designerInit({
          tempValue: cloneDeep(tempValue),
          options: cloneDeep(widgetOptions),
        });
      },
    },
  });
</script>

<style lang="scss">
  body,
  html {
    padding: 0;
    margin: 0;
    height: 100%;
    box-sizing: border-box;
  }
  .kr-designer {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    color: #2c3e50;
    width: 100%;
    height: 100%;
    text-align: left;
    display: flex;
    flex-direction: row;
    .kr-designer-view {
      flex: 1;
      display: flex;
      flex-direction: column;
    }
    .kr-designer-tool {
      width: 400px;
      height: 100%;
      display: flex;
      flex-direction: column;
      .a-scrollbar__wrap {
        overflow: auto;
      }
      &_con {
        flex: 1;
        height: 100%;
        width: 100%;
        overflow: hidden;
      }
      &_bar {
        padding: 10px;
        text-align: center;
      }
    }
  }

  .kr-form {
    .a-form-item--mini.a-form-item {
      margin-bottom: 10px;
    }
    .min-input {
      width: 100px;
    }
    .unit-text {
      font-size: 12px;
      color: #999999;
      margin-left: 5px;
    }
  }

  .kr-collapse {
    color: #555555;
    width: 400px;

    .a-collapse-item__header {
      box-sizing: border-box;
      padding-left: 10px;
    }

    .a-collapse-item__content {
      box-sizing: border-box;
      padding: 10px;
    }
  }
</style>
