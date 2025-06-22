<template>
  <div
    :style="{
      height: $utils.isEmpty(height) ? 80 * $vh + 'px' : height,
      width: $utils.isEmpty(width) ? '100%' : width,
    }"
  >
    <iframe
      class="w-full h-full"
      scrolling="no"
      :src="
        apiUrl +
        '/warm-flow-ui/index.html?id=' +
        instanceId +
        '&type=FlowChart' +
        '&token=' +
        token +
        '&uuid=' +
        $utils.uuid()
      "
    ></iframe>
  </div>
</template>
<script>
  import { defineComponent } from 'vue';
  import { useGlobSetting } from '@/hooks/setting';
  import { getToken } from '@/utils/auth';

  export default defineComponent({
    name: 'FlowChart',
    components: {},
    props: {
      instanceId: {
        type: String,
        required: true,
      },
      height: {
        type: String,
        default: '',
      },
      width: {
        type: String,
        default: '',
      },
    },
    data() {
      return {};
    },
    computed: {
      apiUrl() {
        const { apiUrl, cloudEnable } = useGlobSetting();

        return `${apiUrl}${cloudEnable === 'true' ? '/cloud-api' : ''}`;
      },
      token() {
        return getToken();
      },
    },
  });
</script>
