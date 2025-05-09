<template>
  <div
    class="widgets"
    :style="{
      left: val.left + 'px',
      top: val.top + 'px',
      width: val.width + 'px',
      height: val.height + 'px',
      textAlign: val.style.Alignment,
      color: val.style.FontColor,
    }"
    style="position: absolute; overflow: hidden"
  >
    <table
      border="1"
      width="100%"
      cellspacing="0"
      cellpadding="2"
      style="border-collapse: collapse; font-size: 12px"
      :style="{
        borderColor: val.style.borderColor,
        borderWidth: '1px',
        borderStyle: 'solid',
      }"
    >
      <tr
        :style="{
          borderColor: val.style.borderColor,
          borderWidth: '1px',
          borderStyle: 'solid',
        }"
      >
        <th
          :style="{
            borderColor: val.style.borderColor,
            borderWidth: '1px',
            borderStyle: 'solid',
            fontSize: val.style.FontSize + 'px',
          }"
          v-for="item in columns"
          :key="item.name"
          :width="item.name === '_seq' ? 40 : ''"
          >{{ item.title }}</th
        >
      </tr>
      <tr
        :style="{
          borderColor: val.style.borderColor,
          borderWidth: '1px',
          borderStyle: 'solid',
        }"
      >
        <td
          :style="{
            borderColor: val.style.borderColor,
            borderWidth: '1px',
            borderStyle: 'solid',
            fontSize: val.style.FontSize + 'px',
          }"
          v-for="item in columns"
          :key="item.name"
          v-html="item.value"
        ></td>
      </tr>
    </table>
  </div>
</template>

<script>
  import { defineComponent } from 'vue';
  import { widgetName } from './settings';

  export default defineComponent({
    name: widgetName,
    props: {
      val: {
        type: Object,
        required: true,
      },
    },
    computed: {
      // 去掉type='row'的数据
      columns() {
        let col = this.val.columns || [];
        return col;
      },
    },
    methods: {},
  });
</script>
