<template>
  <div
    :style="{
      height: isEmpty(height) ? 80 * $vh + 'px' : height,
      width: isEmpty(width) ? '100%' : width,
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
        uuid()
      "
    ></iframe>
  </div>
</template>
<script>
  import { defineComponent } from 'vue';
  import { useGlobSetting } from '@/hooks/setting';
  import { getToken } from '@/utils/auth';
  import { isEmpty, uuid } from '@/utils/utils';

  export default defineComponent({
    name: 'FlowChart',
    components: {},
    setup() {
      return {
        isEmpty,
        uuid,
      };
    },
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
