<template>
  <div ref="viewerRef" id="markdownViewer" :class="$props.class"></div>
</template>

<script lang="ts" setup>
  import { onBeforeUnmount, onDeactivated, Ref, ref, unref, watch } from 'vue';
  import VditorPreview from 'vditor/dist/method.min';
  import { onMountedOrActivated } from '@vben/hooks';
  import { useRootSetting } from '/@/hooks/setting/useRootSetting';
  import { getTheme } from './getTheme';

  const props = defineProps({
    value: { type: String },
    class: { type: String },
  });
  const viewerRef = ref(null);
  const vditorPreviewRef = ref(null) as Ref<VditorPreview | null>;
  const { getDarkMode } = useRootSetting();

  function init() {
    const viewerEl = unref(viewerRef);
    vditorPreviewRef.value = VditorPreview.preview(viewerEl, props.value, {
      mode: getTheme(getDarkMode.value, 'content'),
      theme: {
        // 设置内容主题
        current: getTheme(getDarkMode.value, 'content'),
      },
      hljs: {
        // 设置代码块主题
        style: getTheme(getDarkMode.value, 'code'),
      },
    });
  }

  // 流式场景下 value 会逐 token 高频变化，Vditor 每次 preview 都是整篇重渲染，
  // 直接 init 会造成重渲染风暴与闪烁。这里做“首次即时 + 尾随节流”：立即渲染一次，
  // 节流窗口内的后续变化合并，并在窗口结束时补渲染一次，保证最终内容一定渲染到位。
  const RENDER_THROTTLE_MS = 80;
  let renderTimer: ReturnType<typeof setTimeout> | null = null;
  let pendingRender = false;

  function scheduleInit() {
    if (renderTimer) {
      pendingRender = true;
      return;
    }
    init();
    renderTimer = setTimeout(() => {
      renderTimer = null;
      if (pendingRender) {
        pendingRender = false;
        scheduleInit();
      }
    }, RENDER_THROTTLE_MS);
  }

  watch(
    () => getDarkMode.value,
    (val) => {
      VditorPreview.setContentTheme(getTheme(val, 'content'));
      VditorPreview.setCodeTheme(getTheme(val, 'code'));
      init();
    },
  );

  watch(
    () => props.value,
    (v, oldValue) => {
      v !== oldValue && scheduleInit();
    },
  );

  function destroy() {
    if (renderTimer) {
      clearTimeout(renderTimer);
      renderTimer = null;
    }
    pendingRender = false;
    const vditorInstance = unref(vditorPreviewRef);
    if (!vditorInstance) return;
    try {
      vditorInstance?.destroy?.();
    } catch (error) {
      //
    }
    vditorPreviewRef.value = null;
  }

  onMountedOrActivated(init);

  onBeforeUnmount(destroy);
  onDeactivated(destroy);
</script>
