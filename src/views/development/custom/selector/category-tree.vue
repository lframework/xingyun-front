<template>
  <a-card :body-style="{ height: height + 'px', padding: '10px' }">
    <a-tree
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
              <a-menu-item v-if="$utils.isEqualWithStr(0, treeKey)" key="1">新增子项</a-menu-item>
              <a-menu-item v-if="!$utils.isEqualWithStr(0, treeKey)" key="2">编辑</a-menu-item>
              <a-menu-item v-if="!$utils.isEqualWithStr(0, treeKey)" key="3">删除</a-menu-item>
            </a-menu>
          </template>
        </a-dropdown>
      </template>
    </a-tree>
    <add-category ref="addCategoryDialog" @confirm="doSearch" />
    <modify-category :id="id" ref="updateCategoryDialog" @confirm="doSearch" />
  </a-card>
</template>
<script>
  import { defineComponent } from 'vue';
  import AddCategory from './category/add.vue';
  import ModifyCategory from './category/modify.vue';
  import * as api from '@/api/development/custom/selector-category';

  export default defineComponent({
    components: {
      AddCategory,
      ModifyCategory,
    },
    props: {
      height: {
        type: Number,
        default: 100,
      },
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
          this.$refs.addCategoryDialog.openDialog();
        } else if (menuKey === '2') {
          this.id = treeKey;
          this.$refs.updateCategoryDialog.openDialog();
        } else if (menuKey === '3') {
          this.$msg.createConfirm('是否确认删除此分类？').then(() => {
            api.deleteById(treeKey).then(() => {
              this.$msg.createSuccess('删除成功！');
              this.doSearch();
            });
          });
        }
      },
      doSearch() {
        api.query().then((res) => {
          this.treeData[0].children = [...res.map((item) => Object.assign({ parentId: 0 }, item))];
        });
      },
      onSelect(keys) {
        this.$emit('change', keys[0]);
      },
    },
  });
</script>
