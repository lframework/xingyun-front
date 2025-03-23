import eventBus from '@/events/eventBus';
import { useRefreshStore } from '@/store/modules/multipleTab';

export const multiplePageMix = {
  activated() {
    const refreshStore = useRefreshStore();
    const currentPath = this.$route.path;
    if (refreshStore.checkAndClear(currentPath)) {
      try {
        this.onRefreshPage();
      } catch (e) {
        /* empty */
      }
    }
  },
  methods: {
    openChildPage(path: string) {
      const refreshStore = useRefreshStore();
      refreshStore.setCacheFlag(path, this.$route.path);
      this.$router.push(path);
    },
    closeCurrentPage(refreshParent: boolean = true): void {
      const refreshStore = useRefreshStore();
      const parentPath = refreshParent ? refreshStore.getCacheFlag(this.$route.path) : '';
      refreshStore.setRefreshFlag(parentPath);
      eventBus.$emit(eventBus.$otherEvent.CLOSE_CURRENT_TAB);

      if (!this.$utils.isEmpty(parentPath)) {
        this.$router.push(parentPath);
      }
    },
  },
};
