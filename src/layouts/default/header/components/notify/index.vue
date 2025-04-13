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
                <span v-if="item.list.length !== 0 && item.list.length < 100"
                  >({{ item.list.length }})</span
                >
                <span v-if="item.list.length !== 0 && item.list.length >= 100">(99+)</span>
              </template>
              <!-- 绑定title-click事件的通知列表中标题是“可点击”的-->
              <NoticeList
                :list="item.list"
                v-if="item.key === '1'"
                :page-size="8"
                @title-click="onNoticeClick"
              />
              <SiteMessageList
                v-else-if="item.key === '2'"
                :list="item.list"
                :page-size="8"
                @title-click="onSiteMessageClick"
              />
            </a-tab-pane>
          </template>
        </a-tabs>
      </a-card>
    </a-drawer>
    <notice-detail ref="noticeDetailDialog" :id="noticeId" />
    <site-message-detail ref="siteMessageDetailDialog" :id="siteMessageId" />
  </div>
</template>
<script lang="ts">
  import { h, computed, defineComponent, ref, Ref } from 'vue';
  import { Badge, notification } from 'ant-design-vue';
  import { BellOutlined, LoginOutlined, LogoutOutlined } from '@ant-design/icons-vue';
  import { ListItem } from './data';
  import NoticeList from './NoticeList.vue';
  import SiteMessageList from './SiteMessageList.vue';
  import { useDesign } from '/@/hooks/web/useDesign';
  import { useUserStore } from '@/store/modules/user';
  import { isEmpty } from '@/utils/utils';
  import eventBus from '@/events/eventBus';
  import UserConnectTip from '@/components/UserConnectTip';
  import projectSetting from '@/settings/projectSetting';
  import * as noticeApi from '@/api/system/notice';
  import * as siteMessageApi from '@/api/system/site-message';
  import NoticeDetail from '@/views/system/notice/detail.vue';
  import SiteMessageDetail from '@/views/system/site-message/detail.vue';

  export default defineComponent({
    components: {
      BellOutlined,
      Badge,
      NoticeList,
      SiteMessageList,
      NoticeDetail,
      SiteMessageDetail,
    },
    setup() {
      const { prefixCls } = useDesign('header-notify');
      const noticeId = ref('');
      const siteMessageId = ref('');
      const noticeList: Ref<ListItem[]> = ref([]);
      const siteMessageList: Ref<ListItem[]> = ref([]);
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
            list: [...siteMessageList.value],
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
      const wsDaemonFlag = ref(false);
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
          wsDaemonFlag.value = false;
          return;
        }
        try {
          // 创建WebSocket连接
          socket.value = new WebSocket(wsUrl + '?X-Auth-Token=' + token);

          // 监听WebSocket连接打开事件
          socket.value.onopen = () => {
            wsDaemonFlag.value = false;
          };

          // 监听WebSocket接收到消息事件
          socket.value.onmessage = (event) => {
            const msg = event.data;
            const msgObj = JSON.parse(msg);
            let pullObj = msgObj.data;
            try {
              // 这里尝试解析数据为json，如果解析不了那么直接推送字符串
              pullObj = JSON.parse(pullObj);
              // eslint-disable-next-line no-empty
            } catch {}
            eventBus.$emit(msgObj.bizType, pullObj);
          };

          // 监听WebSocket连接关闭事件
          socket.value.onclose = () => {
            // 这里重连ws
            socket.value = undefined;
          };
        } catch {
          socket.value = undefined;
          wsDaemonFlag.value = false;
        }
      }

      function disConnectWs() {
        if (socket.value && socket.value.readyState === WebSocket.OPEN) {
          socket.value.close();
        }
        socket.value = undefined;
        wsDaemonFlag.value = false;
      }

      function wsConnectDaemon() {
        if (socket.value === undefined || socket.value.readyState !== WebSocket.OPEN) {
          disConnectWs();
        }
        if (wsDaemonFlag.value) {
          return;
        }
        if (socket.value === undefined) {
          wsDaemonFlag.value = true;
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

      function onRefreshSiteMessage() {
        siteMessageApi
          .queryMy({
            pageIndex: 1,
            pageSize: 10000,
            readed: false,
          })
          .then((res) => {
            siteMessageList.value = (res.datas || []).map((item) => {
              return {
                id: item.id,
                title: '站内信',
                description: item.title,
                datetime: item.createTime,
                type: '2',
              } as ListItem;
            });
          });
      }

      const eventBusOff = ref([]);

      eventBusOff.value.push(eventBus.$on(eventBus.$pullEvent.CONNECT, onUserConnect));
      eventBusOff.value.push(eventBus.$on(eventBus.$pullEvent.DIS_CONNECT, onUserDisconnect));
      eventBusOff.value.push(eventBus.$on(eventBus.$pullEvent.SYS_NOTICE, onRefreshNotice));
      eventBusOff.value.push(
        eventBus.$on(eventBus.$pullEvent.SYS_SITE_MESSAGE, onRefreshSiteMessage),
      );

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
        siteMessageId,
        disConnectWs,
        eventBusOff,
      };
    },
    mounted() {
      this.wsTimer = setInterval(this.wsConnectDaemon, 3000);
    },
    unmounted() {
      clearInterval(this.wsTimer);
      this.disConnectWs();
      this.eventBusOff.forEach((item) => item());
      this.eventBusOff = [];
    },
    methods: {
      onNoticeClick(record: ListItem) {
        const id = record.id;
        this.noticeId = id;

        this.$refs.noticeDetailDialog.openDialog();
      },

      onSiteMessageClick(record: ListItem) {
        const id = record.id;
        this.siteMessageId = id;

        this.$refs.siteMessageDetailDialog.openDialog();
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
      font-size: 16px;

      .ant-badge-multiple-words {
        padding: 0 4px;
      }

      svg {
        width: 0.9em;
      }
    }
  }
</style>
