<template>
  <div v-loading="loading">
    <div style="position: absolute;top:0;">
      <a-space>
        <a-button class="tool_bar_btn" type="link" @click="saveFile">保存</a-button>
        <a-button class="tool_bar_btn" type="link" @click="exportFile">导出文件</a-button>
        <span style="color: #ff4d4f;">不支持复杂的Excel文件，仅支持简单的文本编辑、数字计算等操作。如果文件非常重要，请自行做好备份。</span>
      </a-space>
    </div>
    <div
      id="luckysheet"
      style="margin:0px;padding:0px;position:absolute;width:100%;left: 0px;top: 30px;bottom:0px;"
    />
  </div>
</template>

<script>
import { exportExcel } from '@/utils/excel-export-utils'
/* eslint-disable*/
export default {
  name: 'LuckySheet',
  data() {
    return {
      id: '',
      loading: false
    }
  },
  mounted() {
    const that = this
    document.onkeydown = function(e) {
      let key = window.event.keyCode;
      if (key === 83 && event.ctrlKey) {
        window.event.preventDefault()
        that.saveFile()
      }
    }
    this.$nextTick(() => {
      const id = this.$route.query.id
      this.id = id
      if (this.$utils.isEmpty(id)) {
        this.$msg.error('Excel文件不存在！')
        return
      }
      this.$api.sw.excel.getContent(id).then(res => {
        const exportJson = JSON.parse(res)
        $(function() {
          luckysheet.create({
            container: 'luckysheet',
            lang: 'zh',
            showinfobar: false,
            showtoolbarConfig: {
              image:false,
              link:false,
              chart: false,
              postil:  false,
              pivotTable: false,
              screenshot: false,
              protection:false,
              print:false
            },
            cellRightClickConfig: {
              chart: false,
              image: false,
              link: false
            },
            data: exportJson.sheets,
            title: exportJson.info.name,
            userInfo: exportJson.info.name.creator
          })
        })
      })
    })
  },
  methods: {
    saveFile() {
      const sheets = luckysheet.getAllSheets()
      this.loading = true
      this.$api.sw.excel.modifyContent({
        id: this.id,
        content: JSON.stringify(sheets)
      }).then(() => {
        this.$msg.successTip('保存成功')
      }).finally(() => {
        this.loading = false
      })
    },
    exportFile() {
      exportExcel(luckysheet.getluckysheetfile())
    }
  }
}
</script>
<style lang="less" scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
.tool_bar_btn {
  cursor: pointer !important;
}
</style>
