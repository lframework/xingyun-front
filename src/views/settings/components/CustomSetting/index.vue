<template>
  <div class="side-setting">
    <setting-item title="整体风格设置">
      <img-checkbox-group
        :default-values="[theme.mode]"
        @change="values => setTheme({...theme, mode: values[0]})"
      >
        <img-checkbox title="暗色菜单风格" img="/static/images/dark.svg" value="dark" />
        <img-checkbox title="亮色菜单风格" img="/static/images/light.svg" value="light" />
      </img-checkbox-group>
    </setting-item>
    <a-divider />
    <setting-item>
      <a-list :split="false">
        <a-list-item>
          内容区域宽度
          <a-select
            slot="actions"
            :get-popup-container="getPopupContainer"
            :value="pageWidth"
            class="select-item"
            size="small"
            @change="setPageWidth"
          >
            <a-select-option value="fluid">流式</a-select-option>
            <a-select-option value="fixed">定宽</a-select-option>
          </a-select>
        </a-list-item>
        <a-list-item>
          固定Header
          <a-switch slot="actions" :checked="fixedHeader" size="small" @change="setFixedHeader" />
        </a-list-item>
        <a-list-item>
          固定侧边栏
          <a-switch slot="actions" :checked="fixedSideBar" size="small" @change="setFixedSideBar" />
        </a-list-item>
      </a-list>
    </setting-item>
    <a-divider />
    <setting-item title="其他设置">
      <a-list :split="false">
        <a-list-item>
          色弱模式
          <a-switch slot="actions" :checked="weekMode" size="small" @change="setWeekMode" />
        </a-list-item>
        <a-list-item>
          多页签模式
          <a-switch slot="actions" :checked="multiPage" size="small" @change="setMultiPage" />
        </a-list-item>
      </a-list>
    </setting-item>
    <a-divider />
    <setting-item title="页面切换动画">
      <a-list :split="false">
        <a-list-item>
          禁用动画
          <a-switch slot="actions" :checked="animate.disabled" size="small" @change="val => setAnimate({...animate, disabled: val})" />
        </a-list-item>
        <a-list-item>
          动画效果
          <a-select
            slot="actions"
            :value="animate.name"
            :get-popup-container="getPopupContainer"
            class="select-item"
            size="small"
            @change="val => setAnimate({...animate, name: val})"
          >
            <a-select-option v-for="(item, index) in animates" :key="index" :value="item.name">{{ item.alias }}</a-select-option>
          </a-select>
        </a-list-item>
        <a-list-item>
          动画方向
          <a-select
            slot="actions"
            :value="animate.direction"
            :get-popup-container="getPopupContainer"
            class="select-item"
            size="small"
            @change="val => setAnimate({...animate, direction: val})"
          >
            <a-select-option v-for="(item, index) in directions" :key="index" :value="item">{{ item }}</a-select-option>
          </a-select>
        </a-list-item>
      </a-list>
    </setting-item>
    <setting-item>
      <a-button type="primary" icon="save" @click="saveSetting">保存配置</a-button>
      <a-button type="dashed" icon="redo" style="float: right" @click="resetSetting">重置配置</a-button>
    </setting-item>
  </div>
</template>

<script>
import SettingItem from './SettingItem'
import { ImgCheckbox } from '@/components/checkbox'
import { mapState, mapMutations } from 'vuex'
import { setting } from '@/config/default'
import sysConfig from '@/config/config'
import fastEqual from 'fast-deep-equal'
import deepMerge from 'deepmerge'

const ImgCheckboxGroup = ImgCheckbox.Group
export default {
  name: 'CustomSetting',
  components: { ImgCheckboxGroup, ImgCheckbox, SettingItem },
  data() {
    return {
    }
  },
  computed: {
    directions() {
      return this.animates.find(item => item.name === this.animate.name).directions
    },
    ...mapState('setting', ['theme', 'layout', 'animate', 'animates', 'palettes', 'multiPage', 'weekMode', 'fixedHeader', 'fixedSideBar', 'hideSetting', 'pageWidth'])
  },
  watch: {
    'animate.name': function(val) {
      this.setAnimate({ name: val, direction: this.directions[0] })
    }
  },
  methods: {
    getPopupContainer() {
      return this.$el.parentNode
    },
    saveSetting() {
      const closeMessage = this.$message.loading('正在保存到本地，请稍后...', 0)
      const config = this.extractConfig(true)
      localStorage.setItem(process.env.VUE_APP_SETTING_KEY, JSON.stringify(config))
      setTimeout(closeMessage, 800)
    },
    resetSetting() {
      this.$confirm({
        title: '重置主题会刷新页面，当前页面内容不会保留，确认重置？',
        onOk() {
          localStorage.removeItem(process.env.VUE_APP_SETTING_KEY)
          window.location.reload()
        }
      })
    },
    // 提取配置
    extractConfig(local = false) {
      const config = {}
      const mySetting = this.$store.state.setting
      const dftSetting = local ? deepMerge(setting, sysConfig) : setting
      Object.keys(mySetting).forEach(key => {
        const dftValue = dftSetting[key]; const myValue = mySetting[key]
        if (dftValue !== undefined && !fastEqual(dftValue, myValue)) {
          config[key] = myValue
        }
      })
      return config
    },
    ...mapMutations('setting', ['setTheme', 'setLayout', 'setMultiPage', 'setWeekMode',
      'setFixedSideBar', 'setFixedHeader', 'setAnimate', 'setHideSetting', 'setPageWidth'])
  }
}
</script>

<style lang="less" scoped>
.side-setting {
  min-height: 100%;
  background-color: @base-bg-color;
  padding: 24px;
  font-size: 14px;
  line-height: 1.5;
  word-wrap: break-word;
  position: relative;
  .flex{
    display: flex;
  }
  .select-item{
    width: 80px;
  }
}
</style>
