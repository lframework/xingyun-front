<template>
  <div>
    <a-list item-layout="horizontal">
      <a-list-item class="custom-setting-item">
        <a-list-item-meta>
          <template #title>
            <a>自动锁屏</a>
          </template>
          <template #description>
            <span class="custom-setting-description">设置系统无操作后自动锁屏时间</span>
          </template>
        </a-list-item-meta>
        <div class="custom-setting-actions">
          <a-select v-model:value="formData.autoLock" class="custom-setting-select">
            <a-select-option :value="0">不自动锁屏</a-select-option>
            <a-select-option :value="5">无操作5分钟后自动锁屏</a-select-option>
            <a-select-option :value="10">无操作10分钟后自动锁屏</a-select-option>
            <a-select-option :value="15">无操作15分钟后自动锁屏</a-select-option>
            <a-select-option :value="30">无操作30分钟后自动锁屏</a-select-option>
            <a-select-option :value="60">无操作60分钟后自动锁屏</a-select-option>
          </a-select>
          <a-button type="link" @click="submit">保存</a-button>
          <a-button type="link" @click="reset">重置</a-button>
        </div>
      </a-list-item>
      <a-list-item class="custom-setting-item">
        <a-list-item-meta>
          <template #title>
            <a>菜单排序</a>
          </template>
          <template #description>
            <span class="custom-setting-description">自定义左侧菜单显示顺序，支持同级菜单拖拽排序。</span>
          </template>
        </a-list-item-meta>
        <template #actions>
          <a @click="openMenuSortDialog">设置</a>
        </template>
      </a-list-item>
    </a-list>

    <menu-sort-modal ref="menuSortModal" />
  </div>
</template>
<script>
  import { defineComponent } from 'vue';
  import { useAppStore } from '@/store/modules/app';
  import { createSuccessTip } from '@/hooks/web/msg';
  import MenuSortModal from './MenuSortModal.vue';

  export default defineComponent({
    components: {
      MenuSortModal,
    },
    setup() {
      const appStore = useAppStore();
      return {
        appStore,
      };
    },
    data() {
      return {
        formData: {
          autoLock: this.appStore.getProjectConfig.lockTime,
        },
      };
    },
    methods: {
      submit() {
        const config = { lockTime: this.formData.autoLock };
        this.appStore.setProjectConfig(config);
        createSuccessTip('保存成功');
      },
      reset() {
        this.formData = {
          autoLock: 0,
        };
      },
      openMenuSortDialog() {
        this.$refs.menuSortModal.openDialog();
      },
    },
  });
</script>

<style lang="less" scoped>
  .custom-setting-item {
    align-items: center;
  }

  .custom-setting-description {
    color: @text-color-secondary;
  }

  .custom-setting-actions {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .custom-setting-select {
    width: 220px;
  }
</style>
