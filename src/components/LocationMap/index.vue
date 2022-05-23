<template>
  <div>
    <a-row>
      <a-col :span="24">
        <a-input-search
          v-model="address"
          placeholder="输入地址进行搜索"
          enter-button
          :loading="loading"
          @search="onSearch"
        />
      </a-col>
    </a-row>
    <a-row>
      <a-col :span="24">
        <div id="container" />
      </a-col>
    </a-row>
  </div>
</template>

<script>
import TMap from 'TMap'
export default {
  name: 'LocationMap',
  props: {
    value: { type: Object, required: true }
  },
  data() {
    return {
      map: null,
      marker: null,
      address: undefined,
      loading: false
    }
  },
  computed: {
    model: {
      get() {
        return this.value
      },
      set() {}
    }
  },
  created() {
    const _this = this
    const lat = 39.908802
    const lng = 116.397502
    const zoom = 16
    this.$nextTick(() => {
      _this.map = new TMap.Map(document.getElementById('container'), {
        // 地图的中心地理坐标。
        center: new TMap.LatLng(lat, lng),
        zoom: zoom
      })
      // 绑定点击事件
      _this.map.on('click', function(evt) {
        const lat = evt.latLng.getLat().toFixed(6)
        const lng = evt.latLng.getLng().toFixed(6)
        _this.createMarker(lng, lat)
      })
    })
  },
  methods: {
    initLocation() {
      this.$nextTick(() => {
        if (!this.$utils.isEmpty(this.model.lng) && !this.$utils.isEmpty(this.model.lat)) {
          this.createMarker(this.model.lng, this.model.lat, true)
        } else {
          this.removeMarker()
          const lat = 39.908802
          const lng = 116.397502
          const zoom = 16
          this.map.setCenter(new TMap.LatLng(lat, lng))
          this.map.setZoom(zoom)
        }
      })
    },
    createMarker(lng, lat, setCenter) {
      this.removeMarker()
      this.marker = new TMap.MultiMarker({
        id: 'marker',
        map: this.map,
        geometries: [{
          'position': new TMap.LatLng(lat, lng)
        }]
      })
      if (setCenter) {
        this.map.setCenter(new TMap.LatLng(lat, lng))
      }
      this.$emit('input', {
        lng: lng,
        lat: lat
      })
    },
    removeMarker() {
      if (!this.$utils.isEmpty(this.marker)) {
        this.marker.setMap(null)
        this.marker = null
      }
    },
    onSearch(e) {
      if (!this.$utils.isEmpty(e)) {
        this.loading = true
        this.$api.components.getMapLocation(e).then(res => {
          this.createMarker(res.lng, res.lat, true)
        }).finally(() => {
          this.loading = false
        })
      }
    }
  }
}
</script>
