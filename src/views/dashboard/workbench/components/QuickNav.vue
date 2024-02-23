<template>
  <a-card title="快捷导航" :loading="loading">
    <template v-if="!canViewAll" #extra><a @click="viewAll">查看全部</a></template>
    <template v-if="!$utils.isEmpty(_menus)">
      <a-card-grid v-for="item in _menus" :key="item.id">
        <router-link :to="item.path" :class="'router-link-color-' + item.color">
          <span class="flex flex-col items-center">
            <icon :icon="item.icon" size="20" />
            <span class="text-md mt-2 truncate">{{ item.title }}</span>
          </span>
        </router-link>
      </a-card-grid>
    </template>
    <a-empty v-else />
  </a-card>
</template>
<script>
  import Icon from '@/components/Icon/Icon.vue';
  import { defineComponent } from 'vue';
  import { getCollectMenu } from '@/api/sys/menu';

  export default defineComponent({
    name: 'QuickNav',
    components: {
      Icon,
    },
    data() {
      return {
        canViewAll: false,
        menus: [],
        loading: false,
      };
    },
    computed: {
      _menus() {
        if (this.canViewAll) {
          return this.menus;
        } else {
          const tmp = [];
          for (let i = 0; i < 6; i++) {
            if (i < this.menus.length) {
              tmp.push(this.menus[i]);
            }
          }
          return tmp;
        }
      },
    },
    created() {
      this.loading = true;
      getCollectMenu()
        .then((res) => {
          this.menus = res.map((item, index) => {
            return {
              ...item,
              color: index % 2,
            };
          });
        })
        .finally(() => {
          this.loading = false;
        });
    },
    methods: {
      viewAll() {
        this.canViewAll = !this.canViewAll;
      },
    },
  });
</script>
<style lang="less" scoped>
  .router-link-color-0 {
    color: #000000;
  }
  .router-link-color-1 {
    color: @primary-color;
  }
</style>
