<template>
  <a-dropdown v-model="show" :trigger="['click']">
    <div slot="overlay">
      <a-spin :spinning="loading">
        <a-tabs class="dropdown-tabs" :tab-bar-style="{textAlign: 'center'}" :style="{width: '297px'}">
          <a-tab-pane key="1" tab="通知">
            <a-list class="tab-pane">
              <!--              <a-list-item>
                <a-list-item-meta title="你收到了 14 份新周报" description="一年前">
                  <a-avatar slot="avatar" style="background-color: white" src="https://gw.alipayobjects.com/zos/rmsportal/ThXAXghbEsBCCSDihZxY.png" />
                </a-list-item-meta>
              </a-list-item>
              <a-list-item>
                <a-list-item-meta title="你推荐的 曲妮妮 已通过第三轮面试" description="一年前">
                  <a-avatar slot="avatar" style="background-color: white" src="https://gw.alipayobjects.com/zos/rmsportal/OKJXDXrmkNshAMvwtvhu.png" />
                </a-list-item-meta>
              </a-list-item>
              <a-list-item>
                <a-list-item-meta title="这种模板可以区分多种通知类型" description="一年前">
                  <a-avatar slot="avatar" style="background-color: white" src="https://gw.alipayobjects.com/zos/rmsportal/kISTdvpyTAhtGxpovNWd.png" />
                </a-list-item-meta>
              </a-list-item>-->
            </a-list>
          </a-tab-pane>
          <a-tab-pane key="2" tab="消息">
            <a-list class="tab-pane" />
          </a-tab-pane>
          <a-tab-pane key="3" tab="待办">
            <a-list class="tab-pane" />
          </a-tab-pane>
        </a-tabs>
      </a-spin>
    </div>
    <span class="header-notice" @click="fetchNotice">
      <a-badge class="notice-badge" count="0">
        <a-icon :class="['header-notice-icon']" type="bell" />
      </a-badge>
    </span>
  </a-dropdown>
</template>

<script>
export default {
  name: 'HeaderNotice',
  data() {
    return {
      loading: false,
      show: false
    }
  },
  computed: {
  },
  methods: {
    fetchNotice() {
      if (this.loading) {
        this.loading = false
        return
      }
      this.loadding = true
      setTimeout(() => {
        this.loadding = false
      }, 1000)
    }
  }
}
</script>

<style lang="less">
  .header-notice{
    display: inline-block;
    transition: all 0.3s;
    span {
      vertical-align: initial;
    }
    .notice-badge{
      color: inherit;
      .header-notice-icon{
        font-size: 16px;
        padding: 4px;
      }
    }
  }
  .dropdown-tabs{
    background-color: @base-bg-color;
    box-shadow: 0 2px 8px @shadow-color;
    border-radius: 4px;
    .tab-pane{
      padding: 0 24px 12px;
      min-height: 250px;
    }
  }
</style>
