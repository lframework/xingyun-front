<template>
  <div>
    <a-row>
      <a-col :span="24">
        <a-input-search
          v-model:value="address"
          placeholder="输入地址进行搜索"
          enter-button
          :loading="loading"
          @search="onSearch"
        />
      </a-col>
    </a-row>
    <a-row>
      <a-col :span="24">
        <div id="container"></div>
      </a-col>
    </a-row>
  </div>
</template>

<script>
  let map, marker;
  import { defineComponent } from 'vue';
  import * as api from '@/api/components';

  export default defineComponent({
    name: 'LocationMap',
    props: {
      value: { type: Object, required: true },
    },
    setup() {
      const TMap = window.TMap;

      return {
        TMap,
      };
    },
    data() {
      return {
        map: null,
        marker: null,
        address: undefined,
        loading: false,
      };
    },
    computed: {
      model: {
        get() {
          return this.value;
        },
        set() {},
      },
    },
    async mounted() {
      const key = await api.getMapKey();
      await this.loadMapScript(key);
      await this.initMap();
      this.initLocation();
    },
    methods: {
      async loadMapScript(key) {
        const script = document.createElement('script');
        script.src = `https://map.qq.com/api/gljs?v=1.exp&key=${key}`;
        document.head.appendChild(script);
        return new Promise((resolve) => {
          script.onload = resolve;
        });
      },
      async initMap() {
        const _this = this;
        const lat = 39.908802;
        const lng = 116.397502;
        const zoom = 16;
        map = new TMap.Map(document.getElementById('container'), {
          // 地图的中心地理坐标。
          center: new TMap.LatLng(lat, lng),
          zoom: zoom,
        });
        // 绑定点击事件
        map.on('click', function (evt) {
          const lat = evt.latLng.getLat().toFixed(6);
          const lng = evt.latLng.getLng().toFixed(6);
          _this.createMarker(lng, lat);
        });

        return Promise.resolve();
      },
      initLocation() {
        this.$nextTick(() => {
          if (!this.$utils.isEmpty(this.model.lng) && !this.$utils.isEmpty(this.model.lat)) {
            this.createMarker(this.model.lng, this.model.lat, true);
          } else {
            this.removeMarker();
            const lat = 39.908802;
            const lng = 116.397502;
            const zoom = 16;
            map.setCenter(new TMap.LatLng(lat, lng));
            map.setZoom(zoom);
          }
        });
      },
      createMarker(lng, lat, setCenter) {
        this.removeMarker();
        marker = new TMap.MultiMarker({
          id: 'marker',
          map: map,
          geometries: [
            {
              position: new TMap.LatLng(lat, lng),
            },
          ],
        });
        if (setCenter) {
          map.setCenter(new TMap.LatLng(lat, lng));
        }
        this.$emit('update:value', {
          lng: lng,
          lat: lat,
        });
      },
      removeMarker() {
        if (!this.$utils.isEmpty(marker)) {
          marker.setMap(null);
          marker = null;
        }
      },
      onSearch(e) {
        if (!this.$utils.isEmpty(e)) {
          this.loading = true;
          api
            .getMapLocation(e)
            .then((res) => {
              this.createMarker(res.lng, res.lat, true);
            })
            .finally(() => {
              this.loading = false;
            });
        }
      },
    },
  });
</script>
