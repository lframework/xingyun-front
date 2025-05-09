<template>
  <div
    class="braid-barcode"
    :style="{
      position: 'absolute',
      width: val.width + 'px',
      height: val.height + 'px',
      left: val.left + 'px',
      top: val.top + 'px',
      zIndex: val.zIndex,
    }"
  >
    <img :src="codeUrl" />
    <div
      class="text"
      :style="{
        display: val.style.ShowBarText === '1' ? '' : 'none',
        fontSize: val.style.FontSize + 'px',
      }"
      >1234567890</div
    >
  </div>
</template>

<script>
  import { defineComponent } from 'vue';
  import qrCodeImg from './QRCode.png';
  import pdf417Img from './PDF417.png';
  import barCodeImg from './barCode.png';
  import { widgetName } from './settings';

  export default defineComponent({
    name: widgetName,
    props: {
      val: {
        type: Object,
        required: true,
      },
    },
    setup() {
      return {
        qrCodeImg,
        pdf417Img,
        barCodeImg,
      };
    },
    data() {
      return {};
    },
    computed: {
      codeUrl() {
        if (this.val.style.CodeType === 'QRCode') {
          return qrCodeImg;
        } else if (this.val.style.CodeType === 'PDF417') {
          return pdf417Img;
        } else {
          return barCodeImg;
        }
      },
    },
  });
</script>
<style lang="scss" scoped>
  .braid-barcode {
    &:hover {
      outline: 1px solid #ddd !important;
    }
    &.active {
      outline: 1px solid #2196f3 !important;
      &:hover {
        outline: 1px solid #2196f3 !important;
      }
    }
    img {
      width: 100%;
      height: 100%;
      user-select: none;
      -webkit-user-drag: none;
      pointer-events: none;
    }
    .text {
      position: absolute;
      left: 0;
      bottom: 0;
      width: 100%;
      text-align: center;
      background-color: #ffffff;
    }
  }
</style>
