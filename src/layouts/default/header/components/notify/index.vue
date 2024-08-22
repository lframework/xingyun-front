<template>
  <div :class="prefixCls">
    <Badge :count="count" dot :numberStyle="numberStyle">
      <BellOutlined @click="openNotifyDrawer" />
    </Badge>
    <a-drawer
      title="消息中心"
      :width="560"
      :open="open"
      :destroyOnClose="true"
      @close="closeNotifyDrawer"
    >
      <a-card>
        <a-tabs centered tab-position="left">
          <template v-for="item in listData" :key="item.key">
            <a-tab-pane>
              <template #tab>
                {{ item.name }}
                <span v-if="item.list.length !== 0">({{ item.list.length }})</span>
              </template>
              <!-- 绑定title-click事件的通知列表中标题是“可点击”的-->
              <NoticeList
                :list="item.list"
                v-if="item.key === '1'"
                :page-size="8"
                @title-click="onNoticeClick"
              />
              <NoticeList :list="item.list" v-else :page-size="6" />
            </a-tab-pane>
          </template>
        </a-tabs>
      </a-card>
    </a-drawer>
    <notice-detail ref="noticeDetailDialog" :id="noticeId" />
  </div>
</template>
<script lang="ts">
  import { h, computed, defineComponent, ref, Ref } from 'vue';
  import { Popover, Tabs, Badge, notification } from 'ant-design-vue';
  import { BellOutlined, LoginOutlined, LogoutOutlined } from '@ant-design/icons-vue';
  import { ListItem } from './data';
  import NoticeList from './NoticeList.vue';
  import { useDesign } from '/@/hooks/web/useDesign';
  import { useUserStore } from '@/store/modules/user';
  import { isEmpty } from '@/utils/utils';
  import eventBus from '@/events/eventBus';
  import UserConnectTip from '@/components/UserConnectTip';
  import projectSetting from '@/settings/projectSetting';
  import * as noticeApi from '@/api/system/notice';
  import NoticeDetail from '@/views/system/notice/detail.vue';

  export default defineComponent({
    components: {
      Popover,
      BellOutlined,
      Tabs,
      TabPane: Tabs.TabPane,
      Badge,
      NoticeList,
      NoticeDetail,
    },
    setup() {
      const { prefixCls } = useDesign('header-notify');
      const noticeId = ref('');
      const noticeList: Ref<ListItem[]> = ref([]);
      const listData = computed(() => {
        return [
          {
            key: '1',
            name: '通知',
            list: [...noticeList.value],
          },
          {
            key: '2',
            name: '消息',
            list: [],
          },
          {
            key: '3',
            name: '代办',
            list: [],
          },
        ];
      });

      const count = computed(() => {
        let count = 0;
        const tabListData = listData.value;
        for (let i = 0; i < tabListData.length; i++) {
          count += tabListData[i].list.length;
        }
        return count;
      });

      const open = ref(false);

      const wsTimer: Ref<NodeJS.Timer | null> = ref(null);
      const retryWs = ref(false);
      const socket: Ref<WebSocket | undefined> = ref(undefined);
      const wsUrl = import.meta.env.VITE_GLOB_APP_MESSAGE_BUS_WS_URL;

      function openNotifyDrawer() {
        open.value = true;
      }

      function closeNotifyDrawer() {
        open.value = false;
      }

      function connectWs() {
        const userStore = useUserStore();
        const token = userStore.getToken;
        if (isEmpty(token)) {
          retryWs.value = false;
          return;
        }
        try {
          // 创建WebSocket连接
          socket.value = new WebSocket(wsUrl + '?X-Auth-Token=' + token);

          // 监听WebSocket连接打开事件
          socket.value.onopen = () => {
            retryWs.value = false;
          };

          // 监听WebSocket接收到消息事件
          socket.value.onmessage = (event) => {
            const msg = event.data;
            const msgObj = JSON.parse(msg);
            let pushObj = msgObj.data;
            try {
              // 这里尝试解析数据为json，如果解析不了那么直接推送字符串
              pushObj = JSON.parse(pushObj);
              // eslint-disable-next-line no-empty
            } catch {}
            eventBus.$emit(msgObj.bizType, pushObj);
          };

          // 监听WebSocket连接关闭事件
          socket.value.onclose = () => {
            // 这里重连ws
            socket.value = undefined;
          };
        } catch {
          socket.value = undefined;
          retryWs.value = false;
        }
      }

      function wsConnectDaemon() {
        if (retryWs.value) {
          return;
        }
        if (socket.value === undefined) {
          retryWs.value = true;
          connectWs();
        }
      }

      function onUserConnect(e) {
        notification.open({
          message: `用户上线`,
          description: () =>
            h(UserConnectTip, { name: e.name, ip: e.ip, createTime: e.createTime }),
          duration: 2,
          placement: 'bottomRight',
          icon: () => h(LoginOutlined, { style: { color: projectSetting.themeColor } }),
        });
      }

      function onUserDisconnect(e) {
        notification.open({
          message: `用户下线`,
          description: () =>
            h(UserConnectTip, { name: e.name, ip: e.ip, createTime: e.createTime }),
          duration: 2,
          placement: 'bottomRight',
          icon: () => h(LogoutOutlined, { style: { color: projectSetting.themeColor } }),
        });
      }

      function onRefreshNotice() {
        noticeApi
          .queryMyNotice({
            pageIndex: 1,
            pageSize: 10000,
            readed: false,
          })
          .then((res) => {
            noticeList.value = (res.datas || []).map((item) => {
              return {
                id: item.id,
                title: '系统通知',
                description: item.title,
                datetime: item.publishTime,
                type: '1',
              } as ListItem;
            });
          });
      }

      eventBus.$on(eventBus.$pullEvent.CONNECT, onUserConnect);
      eventBus.$on(eventBus.$pullEvent.DIS_CONNECT, onUserDisconnect);
      eventBus.$on(eventBus.$pullEvent.SYS_NOTICE, onRefreshNotice);

      return {
        prefixCls,
        listData,
        count,
        numberStyle: {},
        open,
        openNotifyDrawer,
        closeNotifyDrawer,
        wsTimer,
        wsConnectDaemon,
        noticeId,
      };
    },
    mounted() {
      this.wsTimer = setInterval(this.wsConnectDaemon, 3000);
    },
    methods: {
      onNoticeClick(record: ListItem) {
        const id = record.id;
        this.noticeId = id;

        this.$refs.noticeDetailDialog.openDialog();
      },
    },
  });
</script>
<style lang="less">
  @prefix-cls: ~'@{namespace}-header-notify';

  .@{prefix-cls} {
    padding-bottom: 1px;

    &__overlay {
      width: 360px;
      height: 300px;
    }

    .ant-tabs-content {
      height: 300px;
    }

    .ant-badge {
      display: flex;
      align-items: center;
      font-size: 18px;

      .ant-badge-multiple-words {
        padding: 0 4px;
      }

      svg {
        width: 0.9em;
      }
    }
  }
</style>
