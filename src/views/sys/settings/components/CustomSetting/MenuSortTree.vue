<template>
  <div class="menu-sort-tree">
    <draggable
      :list="list"
      item-key="id"
      :group="groupOptions"
      :animation="200"
      :disabled="disabled"
      handle=".menu-sort-tree__handle"
    >
      <template #item="{ element }">
        <div class="menu-sort-tree__item">
          <div class="menu-sort-tree__node">
            <span class="menu-sort-tree__handle">::</span>
            <span class="menu-sort-tree__title">{{ element.title }}</span>
          </div>
          <div v-if="!isEmpty(element.children)" class="menu-sort-tree__children">
            <menu-sort-tree
              :list="element.children"
              :parent-id="element.id"
              :disabled="disabled"
            />
          </div>
        </div>
      </template>
    </draggable>
  </div>
</template>

<script>
  import { defineComponent } from 'vue';
  import Draggable from 'vuedraggable';
  import { isEmpty } from '@/utils/utils';
  import * as menuSortHelper from './menuSortHelper.mjs';

  export default defineComponent({
    name: 'MenuSortTree',
    components: {
      Draggable,
    },
    props: {
      list: {
        type: Array,
        required: true,
      },
      parentId: {
        type: String,
        default: 'root',
      },
      disabled: {
        type: Boolean,
        default: false,
      },
    },
    setup() {
      return {
        isEmpty,
      };
    },
    computed: {
      groupOptions() {
        return {
          name: menuSortHelper.getMenuSortGroupName(this.parentId),
        };
      },
    },
  });
</script>

<style lang="less" scoped>
  .menu-sort-tree {
    width: 100%;
  }

  .menu-sort-tree__item + .menu-sort-tree__item {
    margin-top: 8px;
  }

  .menu-sort-tree__node {
    min-height: 40px;
    border: 1px solid @border-color-light;
    border-radius: 4px;
    background: #fff;
    display: flex;
    align-items: center;
    padding: 0 12px;
  }

  .menu-sort-tree__handle {
    cursor: move;
    color: @text-color-secondary;
    margin-right: 10px;
    user-select: none;
  }

  .menu-sort-tree__title {
    flex: 1;
    color: @text-color-base;
  }

  .menu-sort-tree__children {
    margin-left: 24px;
    margin-top: 8px;
    padding-left: 12px;
    border-left: 1px dashed @border-color-light;
  }
</style>
