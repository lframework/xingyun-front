<template>
  <div>
    <a-list
      :grid="{gutter: 24}"
      :data-source="opLogs"
    >
      <a-list-item slot="renderItem" slot-scope="item">
        <a-card :hoverable="true">
          <a-card-meta>
            <div slot="title" style="margin-bottom: 3px"><a-tooltip :title="item.name"><div class="meta-title">{{ item.name }}</div></a-tooltip></div>
            <svg-icon slot="avatar" icon-class="log" style="font-size: 16px;" />
            <div slot="description" class="meta-content">
              <a-row>
                <a-col :span="24" class="meta-content-item">
                  日志类型: {{ $enums.OP_LOG_TYPE.getDesc(item.logType) }}
                </a-col>
                <a-col :span="24" class="meta-content-item">
                  IP: {{ item.ip }}
                </a-col>
                <a-col :span="24" class="meta-content-item">
                  创建时间: {{ item.createTime }}
                </a-col>
              </a-row>
            </div>
          </a-card-meta>
        </a-card>
      </a-list-item>
    </a-list>
    <div style="text-align: center;">
      <a-button v-if="hasNext" type="link" @click="loadOpLogs">加载更多<a-icon :type="loading ? 'loading' : 'down'" /></a-button>
    </div>
  </div>
</template>

<script>
export default {
  components: {
  },
  data() {
    return {
      loading: false,
      opLogs: [],
      pageIndex: 1,
      pageSize: 10,
      hasNext: true
    }
  },
  created() {
    this.loadOpLogs()
  },
  methods: {
    loadOpLogs() {
      if (this.loading) {
        return
      }
      this.loading = true
      this.$api.userCenter.queryOpLogs({
        pageIndex: this.pageIndex,
        pageSize: this.pageSize
      }).then(res => {
        res.datas.forEach(item => this.opLogs.push(item))
        this.hasNext = res.hasNext
        if (this.hasNext) {
          this.pageIndex++
        }

        this.$emit('loaded', this.opLogs.length)
      }).finally(() => {
        this.loading = false
      })
    }
  }
}
</script>
<style lang="less" scoped>
.meta-title {
  white-space:nowrap;
  overflow:hidden;
  text-overflow: ellipsis;
}
.meta-content {
  .meta-content-item {
    line-height: 2;
  }
}
</style>
