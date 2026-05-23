<template>
  <a-modal
    v-model:open="visible"
    :mask-closable="false"
    width="720px"
    title="菜单排序"
    :style="{ top: '20px' }"
  >
    <div v-if="visible" v-loading="loading" class="menu-sort-modal">
      <a-alert v-if="loadFailed" type="error" show-icon message="用户菜单加载失败，请关闭后重试" />
      <a-empty v-else-if="!loading && isEmpty(menuTree)" description="暂无可排序菜单" />
      <div v-else class="menu-sort-modal__content">
        <div class="menu-sort-modal__tip">拖拽菜单项可调整显示顺序，仅支持同级菜单之间排序。</div>
        <menu-sort-tree :list="menuTree" />
      </div>
    </div>
    <template #footer>
      <div class="form-modal-footer">
        <a-space>
          <a-button type="primary" :loading="saving" :disabled="cannotSave" @click="submitEvent">
            保存
          </a-button>
          <a-button :loading="saving" @click="closeDialog">取消</a-button>
        </a-space>
      </div>
    </template>
  </a-modal>
</template>

<script>
  import { defineComponent } from 'vue';
  import { getMenuList, saveUserMenuSort } from '@/api/sys/menu';
  import { createConfirm, createError, createSuccessTip } from '@/hooks/web/msg';
  import { isEmpty } from '@/utils/utils';
  import * as menuSortHelper from './menuSortHelper.mjs';
  import MenuSortTree from './MenuSortTree.vue';

  export default defineComponent({
    name: 'MenuSortModal',
    components: {
      MenuSortTree,
    },
    setup() {
      return {
        isEmpty,
      };
    },
    data() {
      return {
        visible: false,
        loading: false,
        saving: false,
        loadFailed: false,
        menuTree: [],
      };
    },
    computed: {
      cannotSave() {
        return this.loading || this.loadFailed || this.isEmpty(this.menuTree);
      },
    },
    methods: {
      openDialog() {
        this.visible = true;
        this.$nextTick(() => this.open());
      },
      closeDialog() {
        this.visible = false;
      },
      open() {
        this.loadMenus();
      },
      loadMenus() {
        this.loading = true;
        this.loadFailed = false;
        this.menuTree = [];

        getMenuList()
          .then((data) => {
            this.menuTree = menuSortHelper.toMenuSortTree(data);
          })
          .catch(() => {
            this.loadFailed = true;
            createError('用户菜单加载失败，请稍后重试');
          })
          .finally(() => {
            this.loading = false;
          });
      },
      submitEvent() {
        if (this.cannotSave) {
          return;
        }

        this.saving = true;
        saveUserMenuSort(menuSortHelper.toSaveUserMenuSortVo(this.menuTree))
          .then(() => {
            this.closeDialog();
            createSuccessTip('菜单排序保存成功');
            return createConfirm('菜单排序已保存，是否立即刷新页面加载新的菜单顺序？', '提示信息')
              .then(() => {
                window.location.reload();
              })
              .catch(() => undefined);
          })
          .catch(() => {
            createError('菜单排序保存失败，请稍后重试');
          })
          .finally(() => {
            this.saving = false;
          });
      },
    },
  });
</script>

<style lang="less" scoped>
  .menu-sort-modal {
    min-height: 240px;
  }

  .menu-sort-modal__content {
    border: 1px solid @border-color-light;
    border-radius: 4px;
    padding: 16px;
    max-height: 520px;
    overflow-y: auto;
    background: #fafafa;
  }

  .menu-sort-modal__tip {
    color: @text-color-secondary;
    margin-bottom: 12px;
  }
</style>
