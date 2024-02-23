<template>
  <a-dropdown :trigger="['contextmenu']">
    <li :class="getClass" @click.stop="handleClickItem" :style="getCollapse ? {} : getItemStyle">
      <Tooltip placement="right" v-if="showTooptip">
        <template #title>
          <slot name="title"></slot>
        </template>
        <div :class="`${prefixCls}-tooltip`">
          <slot></slot>
        </div>
      </Tooltip>

      <template v-else>
        <slot></slot>
        <slot name="title"></slot>
      </template>
    </li>
    <template #overlay>
      <a-menu @click="handleDropDown" v-if="item?.meta?.id">
        <a-menu-item key="collectMenu" v-if="!isCollect">
          <template #icon>
            <StarOutlined :style="starStyle" />
          </template>
          收藏菜单
        </a-menu-item>
        <a-menu-item key="cancelCollectMenu" v-else>
          <template #icon>
            <StarFilled :style="starStyle" />
          </template>
          取消收藏
        </a-menu-item>
      </a-menu>
    </template>
  </a-dropdown>
</template>

<script lang="ts">
  import { PropType, defineComponent, ref, computed, unref, getCurrentInstance, watch } from 'vue';
  import { useDesign } from '/@/hooks/web/useDesign';
  import { propTypes } from '/@/utils/propTypes';
  import { useMenuItem } from './useMenu';
  import { Tooltip } from 'ant-design-vue';
  import { useSimpleRootMenuContext } from './useSimpleMenuContext';
  import { StarOutlined, StarFilled } from '@ant-design/icons-vue';
  import projectSetting from '@/settings/projectSetting';
  import { Menu } from '@/router/types';
  import { collectMenu, cancelCollectMenu } from '@/api/sys/menu';
  import { createSuccessTip } from '@/hooks/web/msg';

  export default defineComponent({
    name: 'MenuItem',
    components: { Tooltip, StarOutlined, StarFilled },
    props: {
      name: {
        type: [String, Number] as PropType<string | number>,
        required: true,
      },
      item: {
        type: Object as PropType<Menu>,
        default: () => ({}),
      },
      disabled: propTypes.bool,
    },
    setup(props, { slots }) {
      const instance = getCurrentInstance();

      const active = ref(false);

      const { getItemStyle, getParentList, getParentMenu, getParentRootMenu } =
        useMenuItem(instance);

      const { prefixCls } = useDesign('menu');

      const { rootMenuEmitter, activeName } = useSimpleRootMenuContext();

      const getClass = computed(() => {
        return [
          `${prefixCls}-item`,
          {
            [`${prefixCls}-item-active`]: unref(active),
            [`${prefixCls}-item-selected`]: unref(active),
            [`${prefixCls}-item-disabled`]: !!props.disabled,
          },
        ];
      });

      const getCollapse = computed(() => unref(getParentRootMenu)?.props.collapse);

      const showTooptip = computed(() => {
        return unref(getParentMenu)?.type.name === 'Menu' && unref(getCollapse) && slots.title;
      });

      const starStyle = {
        fontSize: '16px',
        color: projectSetting.themeColor,
      };
      const isCollect = computed(() => {
        return props.item?.meta?.isCollect;
      });

      function handleDropDown({ key }: { key: string }): void {
        if (props?.item?.meta?.id) {
          if (key === 'collectMenu') {
            collectMenu(props.item.meta.id).then(() => {
              props.item.meta.isCollect = true;
              createSuccessTip('收藏成功');
            });
          } else if (key === 'cancelCollectMenu') {
            cancelCollectMenu(props.item.meta.id).then(() => {
              props.item.meta.isCollect = false;
              createSuccessTip('取消成功');
            });
          }
        }
      }

      function handleClickItem() {
        const { disabled } = props;
        if (disabled) {
          return;
        }

        rootMenuEmitter.emit('on-menu-item-select', props.name);
        if (unref(getCollapse)) {
          return;
        }
        const { uidList } = getParentList();

        rootMenuEmitter.emit('on-update-opened', {
          opend: false,
          parent: instance?.parent,
          uidList: uidList,
        });
      }
      watch(
        () => activeName.value,
        (name: string | number) => {
          if (name === props.name) {
            const { list, uidList } = getParentList();
            active.value = true;
            list.forEach((item) => {
              if (item.proxy) {
                (item.proxy as any).active = true;
              }
            });

            // rootMenuEmitter.emit('on-update-active-name:submenu', uidList);
          } else {
            active.value = false;
          }
        },
        { immediate: true },
      );

      return {
        getClass,
        prefixCls,
        getItemStyle,
        getCollapse,
        handleClickItem,
        showTooptip,
        handleDropDown,
        starStyle,
        isCollect,
      };
    },
  });
</script>
