<template>
  <div id="viewport" data-type="viewport" class="holder">
    <div
      class="canvas-frame"
      :style="{
        width: page.width + rulerSize + 'px',
      }"
    >
      <div class="ruler-corner"></div>
      <div class="ruler ruler-horizontal" :style="{ width: page.width + 'px' }">
        <span
          v-for="tick in horizontalRulerTicks"
          :key="'h-' + tick.value"
          class="ruler-tick ruler-tick-horizontal"
          :class="'ruler-tick-' + tick.type"
          :style="{ left: tick.value + 'px' }"
        >
          <span v-if="tick.label" class="ruler-label ruler-label-horizontal">{{ tick.value }}</span>
        </span>
      </div>
      <div class="ruler ruler-vertical" :style="{ height: page.height + 'px' }">
        <span
          v-for="tick in verticalRulerTicks"
          :key="'v-' + tick.value"
          class="ruler-tick ruler-tick-vertical"
          :class="'ruler-tick-' + tick.type"
          :style="{ top: tick.value + 'px' }"
        >
        </span>
        <span
          v-for="mark in verticalRulerMarks"
          :key="'vl-' + mark"
          class="ruler-label ruler-label-vertical"
          :style="{ top: mark + 'px' }"
        >
          {{ mark }}
        </span>
      </div>
      <div :style="screenStyle" class="screen">
        <!-- 组件 -->
        <component
          v-for="val in widgetStore"
          :is="val.type"
          :data-title="val.type"
          :class="{ active: widgetId === val.uuid }"
          :key="val.uuid"
          :val="val"
          :data-type="val.type"
          :data-uuid="val.uuid"
          class="layer"
        />

        <!-- 参考线 -->
        <div
          v-for="(guide, index) in guides"
          :key="index"
          class="guide-line"
          :class="['guide-line-' + guide.type, 'guide-line-' + guide.source]"
          :style="getGuideStyle(guide)"
        ></div>

        <!-- 尺寸控制器 -->
        <control />
      </div>
    </div>
  </div>
</template>

<script>
  import { defineComponent } from 'vue';
  import control from './size-control.vue';
  import move from '../mixins/move';
  import { usePrintDesignerStore } from '../store/printDesigner';
  import { limitElementPosition } from '../utils/bounds.mjs';

  export default defineComponent({
    components: {
      control, // 尺寸控制
    },

    mixins: [move],
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
      // 已添加的组件
      widgetStore() {
        return this.printDesignerStore.page.tempItems;
      },
      // 背景图地址
      backImg() {
        return this.printDesignerStore.page.imageUrl ? this.printDesignerStore.page.imageUrl : '';
      },
      rulerSize() {
        return 44;
      },
      horizontalRulerTicks() {
        return this.createRulerTicks(this.page.width);
      },
      verticalRulerTicks() {
        return this.createRulerTicks(this.page.height);
      },
      verticalRulerMarks() {
        return this.createRulerMarks(this.page.height);
      },
      screenStyle() {
        const gridImage = [
          'linear-gradient(to right, rgba(64, 72, 86, 0.08) 1px, transparent 1px)',
          'linear-gradient(to bottom, rgba(64, 72, 86, 0.08) 1px, transparent 1px)',
          'linear-gradient(to right, rgba(64, 72, 86, 0.16) 1px, transparent 1px)',
          'linear-gradient(to bottom, rgba(64, 72, 86, 0.16) 1px, transparent 1px)',
        ];

        if (this.backImg) {
          gridImage.unshift('url(' + this.backImg + ')');
        }

        return {
          height: this.page.height + 'px',
          width: this.page.width + 'px',
          backgroundImage: gridImage.join(','),
          backgroundSize: this.backImg
            ? 'auto, 10px 10px, 10px 10px, 50px 50px, 50px 50px'
            : '10px 10px, 10px 10px, 50px 50px, 50px 50px',
          backgroundRepeat: this.backImg
            ? 'no-repeat, repeat, repeat, repeat, repeat'
            : 'repeat, repeat, repeat, repeat',
        };
      },

      // 画布高度
      page() {
        return this.printDesignerStore.page;
      },
      // 选中项id
      widgetId() {
        return this.printDesignerStore.uuid;
      },
      guides() {
        return this.printDesignerStore.guides;
      },
    },

    mounted() {
      // 采用事件代理的方式监听元件的选中操作
      let viewportDom = document.getElementById('viewport');
      if (viewportDom) {
        viewportDom.addEventListener('mousedown', this.handleSelection, false);
      } else {
        console.error('未找的‘viewport’节点');
      }

      // 绑定键盘上下左右键用于元件的移动
      document.addEventListener(
        'keydown',
        (e) => {
          e.stopPropagation();
          var target = this.printDesignerStore.activeElement;
          var position;
          // 左
          if (e.keyCode === 37 && target.left) {
            position = limitElementPosition({ ...target, left: target.left - 1 }, this.page);
            target.left = position.left;
            return;
          }
          // 上
          if (e.keyCode === 38 && target.top) {
            e.preventDefault();
            position = limitElementPosition({ ...target, top: target.top - 1 }, this.page);
            target.top = position.top;
            return;
          }
          // 右
          if (e.keyCode === 39 && target.left !== undefined) {
            position = limitElementPosition({ ...target, left: target.left + 1 }, this.page);
            target.left = position.left;
            return;
          }
          // 下
          if (e.keyCode === 40 && target.top !== undefined) {
            e.preventDefault();
            position = limitElementPosition({ ...target, top: target.top + 1 }, this.page);
            target.top = position.top;
          }
        },
        true,
      );
    },

    methods: {
      createRulerTicks(length) {
        const ticks = [];

        for (let value = 0; value <= length; value += 5) {
          const isMajor = value % 50 === 0;
          const isMedium = value % 10 === 0;

          ticks.push({
            value,
            type: isMajor ? 'major' : isMedium ? 'medium' : 'minor',
            label: isMajor,
          });
        }

        return ticks;
      },
      createRulerMarks(length) {
        const marks = [];

        for (let value = 0; value <= length; value += 50) {
          marks.push(value);
        }

        return marks;
      },
      getGuideStyle(guide) {
        if (guide.type === 'vertical') {
          return {
            left: guide.position + 'px',
            height: this.page.height + 'px',
          };
        }

        return {
          top: guide.position + 'px',
          width: this.page.width + 'px',
        };
      },
      /**
       * 目标元素获得焦点
       */
      handleSelection(e) {
        var target = this.selectTarget(e.target);
        if (target) {
          var uuid = target.getAttribute('data-uuid');
          // 设置选中元素
          this.printDesignerStore.select({
            uuid: uuid || -1,
          });
          // 绑定移动事件：除背景图以外的元件才能移动
          target = this.printDesignerStore.activeElement;
          if (target.draggable) {
            this.initmovement(e); // 参见 mixins
          }
        } else {
          // 取消选中元素
          this.printDesignerStore.select({
            uuid: -1,
          });
        }

        return true;
      },
      /**
       * 获得选中的目标，如果没有返回false
       */
      selectTarget(target) {
        let type = target.getAttribute('data-type');
        if (type) {
          if (type === 'viewport') {
            return false;
          } else {
            return target;
          }
        } else {
          return this.selectTarget(target.parentNode);
        }
      },
    },
  });
</script>

<style scoped>
  .holder {
    display: flex;
    box-sizing: border-box;
    align-items: flex-start;
    justify-content: flex-start;
    width: 100%;
    height: 100%;
    min-height: 0;
    overflow: auto;
    border: 1px solid #f5f5f5;
    border-width: 0 1px;
    background-image: linear-gradient(45deg, #f5f5f5 25%, transparent 0, transparent 75%, #f5f5f5 0),
      linear-gradient(45deg, #f5f5f5 25%, transparent 0, transparent 75%, #f5f5f5 0);
    background-position: 0 0, 13px 13px;
    background-size: 26px 26px;
    font-size: 0;
  }

  .canvas-frame {
    display: grid;
    grid-template-columns: 44px 1fr;
    grid-template-rows: 34px 1fr;
    flex: 0 0 auto;
    margin: 25px auto;
  }

  .ruler-corner {
    grid-column: 1;
    grid-row: 1;
    border-right: 1px solid #c8c8c8;
    border-bottom: 1px solid #c8c8c8;
    background: linear-gradient(135deg, #f5f5f5 0, #eee 100%);
  }

  .ruler {
    position: relative;
    overflow: hidden;
    background-color: #f3f3f3;
    color: #555;
    font-size: 10px;
    line-height: 1;
    user-select: none;
  }

  .ruler-horizontal {
    grid-column: 2;
    grid-row: 1;
    height: 34px;
    border-bottom: 1px solid #c8c8c8;
    background-image: linear-gradient(to bottom, #fff 0, #eee 100%);
  }

  .ruler-vertical {
    grid-column: 1;
    grid-row: 2;
    width: 44px;
    border-right: 1px solid #c8c8c8;
    background-image: linear-gradient(to right, #fff 0, #eee 100%);
  }

  .ruler-tick {
    position: absolute;
    background-color: #8a8a8a;
  }

  .ruler-tick-horizontal {
    bottom: 0;
    width: 1px;
  }

  .ruler-tick-vertical {
    right: 0;
    height: 1px;
  }

  .ruler-tick-minor.ruler-tick-horizontal {
    height: 7px;
    background-color: #b8b8b8;
  }

  .ruler-tick-medium.ruler-tick-horizontal {
    height: 12px;
    background-color: #9a9a9a;
  }

  .ruler-tick-major.ruler-tick-horizontal {
    height: 20px;
    background-color: #6f6f6f;
  }

  .ruler-tick-minor.ruler-tick-vertical {
    width: 7px;
    background-color: #b8b8b8;
  }

  .ruler-tick-medium.ruler-tick-vertical {
    width: 12px;
    background-color: #9a9a9a;
  }

  .ruler-tick-major.ruler-tick-vertical {
    width: 20px;
    background-color: #6f6f6f;
  }

  .ruler-label {
    position: absolute;
    color: #555;
    font-size: 10px;
    white-space: nowrap;
  }

  .ruler-label-horizontal {
    bottom: 20px;
    left: 3px;
  }

  .ruler-label-vertical {
    left: 4px;
    width: 24px;
    transform: translateY(3px);
    text-align: right;
  }

  .screen {
    position: relative;
    grid-column: 2;
    grid-row: 2;
    transform-origin: center top;
    background-color: #fff;
    box-shadow: 0 0 5px 1px #ccc;
  }

  .guide-line {
    position: absolute;
    z-index: 998;
    pointer-events: none;
  }

  .guide-line-vertical {
    top: 0;
    width: 0;
    border-left: 1px solid #1677ff;
    box-shadow: 0 0 0 1px rgb(22 119 255 / 18%);
  }

  .guide-line-horizontal {
    left: 0;
    height: 0;
    border-top: 1px solid #1677ff;
    box-shadow: 0 0 0 1px rgb(22 119 255 / 18%);
  }

  .guide-line-page {
    border-color: #0958d9;
    box-shadow: 0 0 0 1px rgb(9 88 217 / 28%), 0 0 6px rgb(9 88 217 / 30%);
  }

  .layer {
    &:hover {
      outline: 1px solid #ddd !important;
    }

    &.active {
      outline: 1px solid #2196f3 !important;

      &:hover {
        outline: 1px solid #2196f3 !important;
      }
    }
  }
</style>
