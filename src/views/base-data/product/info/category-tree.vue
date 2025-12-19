<template>
  <a-card :body-style="{ height: height + 'px', padding: '10px' }">
    <a-tree
      v-if="showTree"
      :tree-data="treeData"
      default-expand-all
      show-line
      :default-expanded-keys="expandedKeys"
      :v-model:selected-keys="selectedKeys"
      :field-names="{
        children: 'children',
        title: 'name',
        key: 'id',
      }"
      @select="onSelect"
    >
      <template #title="{ id: treeKey, name }">
        <a-dropdown :trigger="['contextmenu']">
          <span>{{ name }}</span>
          <template #overlay>
            <a-menu @click="({ key: menuKey }) => onContextMenuClick(treeKey, menuKey)">
              <a-menu-item key="1">新增子项</a-menu-item>
              <a-menu-item v-if="!isEqualWithStr(0, treeKey)" key="2">编辑</a-menu-item>
              <a-menu-item v-if="!isEqualWithStr(0, treeKey)" key="3">删除</a-menu-item>
            </a-menu>
          </template>
        </a-dropdown>
      </template>
    </a-tree>
    <add-category ref="addCategoryDialog" @confirm="doSearch" />
    <add-child-category :id="id" ref="addChildCategoryDialog" @confirm="doSearch" />
    <modify-category :id="id" ref="updateCategoryDialog" @confirm="doSearch" />
  </a-card>
</template>
<script>
  import { defineComponent } from 'vue';
  import AddCategory from '@/views/base-data/product/category/add.vue';
  import AddChildCategory from '@/views/base-data/product/category/add-children.vue';
  import ModifyCategory from '@/views/base-data/product/category/modify.vue';
  import * as api from '@/api/base-data/product/category';
  import { isEqualWithStr, toArrayTree } from '@/utils/utils';
  import { createConfirm, createSuccess } from '@/hooks/web/msg';

  export default defineComponent({
    components: {
      AddCategory,
      AddChildCategory,
      ModifyCategory,
    },
    props: {
      height: {
        type: Number,
        default: 100,
      },
    },
    setup() {
      return {
        isEqualWithStr,
      };
    },
    data() {
      return {
        treeData: [
          {
            id: 0,
            name: '全部分类',
            children: [],
          },
        ],
        showTree: false,
        expandedKeys: [0],
        selectedKeys: [],
        id: '',
      };
    },
    created() {
      this.doSearch();
    },
    methods: {
      onContextMenuClick(treeKey, menuKey) {
        if (menuKey === '1') {
          if (treeKey === 0) {
            this.$refs.addCategoryDialog.openDialog();
          } else {
            this.id = treeKey;
            this.$refs.addChildCategoryDialog.openDialog();
          }
        } else if (menuKey === '2') {
          this.id = treeKey;
          this.$refs.updateCategoryDialog.openDialog();
        } else if (menuKey === '3') {
          createConfirm('是否确认删除此分类？').then(() => {
            api.deleteById(treeKey, true).then(() => {
              createSuccess('删除成功！');
              this.doSearch();
            });
          });
        }
      },
      doSearch() {
        this.showTree = false;
        api
          .query()
          .then((res) => {
            this.treeData[0].children = toArrayTree(res);
          })
          .finally(() => {
            this.showTree = true;
          });
      },
      onSelect(keys) {
        this.$emit('change', keys[0]);
      },
    },
  });
</script>
