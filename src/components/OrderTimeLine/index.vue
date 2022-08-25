<template>
  <j-border v-show="!$utils.isEmpty(domLines)">
    <div style="padding: 5px;">
      <a-timeline>
        <transition-group
          enter-active-class="animated fadeIn"
        >
          <a-timeline-item v-for="item in domLines" :key="item.id" :color="color(item)" class="order-timeline-item-wrapper">
            <a-icon v-if="$enums.ORDER_TIME_LINE_BIZ_TYPE.APPROVE_RETURN.equalsCode(item.bizType)" slot="dot" type="exclamation-circle" />
            <a-icon v-else-if="$enums.ORDER_TIME_LINE_BIZ_TYPE.CANCEL_APPROVE.equalsCode(item.bizType)" slot="dot" type="exclamation-circle" />
            <a-icon v-else-if="$enums.ORDER_TIME_LINE_BIZ_TYPE.APPROVE_PASS.equalsCode(item.bizType)" slot="dot" type="check-circle" />
            <p>{{ item.content }}</p>
            <p>{{ item.createBy }}</p>
            <p>{{ item.createTime }}</p>
          </a-timeline-item>
        </transition-group>
      </a-timeline>
      <div v-if="showCollapse" class="order-timeline-footer">
        <a v-if="collapseStatus" class="order-timeline-footer-item" type="info" @click="collapse">收起<a-icon type="up" /></a>
        <a v-else type="info" class="order-timeline-footer-item" @click="expand">展开<a-icon type="down" /></a>
      </div>
    </div>
  </j-border>
</template>
<script>
import { request } from '@/utils/request'

export default {
  name: 'OrderTimeLine',
  components: {
  },
  props: {
    id: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      collapseStatus: false,
      lines: []
    }
  },
  computed: {
    showCollapse() {
      return !this.$utils.isEmpty(this.lines) && this.lines.length > 1
    },
    domLines() {
      if (this.$utils.isEmpty(this.lines)) {
        return []
      }
      return this.collapseStatus ? this.lines : [this.lines[this.lines.length - 1]]
    }
  },
  created() {
    this.getList().then(res => {
      this.lines = res
    })
  },
  methods: {
    getList() {
      return request({
        url: '/component/timeline/order',
        method: 'get',
        region: 'common-api',
        params: {
          orderId: this.id
        }
      })
    },
    color(item) {
      if (this.$enums.ORDER_TIME_LINE_BIZ_TYPE.NORMAL.equalsCode(item.bizType)) {
        return 'gray'
      } else if (this.$enums.ORDER_TIME_LINE_BIZ_TYPE.CREATE.equalsCode(item.bizType)) {
        return 'gray'
      } else if (this.$enums.ORDER_TIME_LINE_BIZ_TYPE.APPROVE_PASS.equalsCode(item.bizType)) {
        return 'green'
      } else if (this.$enums.ORDER_TIME_LINE_BIZ_TYPE.APPROVE_RETURN.equalsCode(item.bizType)) {
        return 'red'
      } else if (this.$enums.ORDER_TIME_LINE_BIZ_TYPE.CANCEL_APPROVE.equalsCode(item.bizType)) {
        return 'red'
      }

      return undefined
    },
    collapse() {
      this.collapseStatus = false
    },
    expand() {
      const lines = this.lines
      this.lines = []
      this.$nextTick(() => {
        this.collapseStatus = true
        this.lines = lines
      })
    }
  }
}
</script>
<style lang="less">
.order-timeline-item-wrapper {
  p {
    margin: 0;
    line-height: 1.5;
    color: rgba(0,0,0,.65);
  }
}
.order-timeline-footer {
  text-align: center;

  .order-timeline-footer-item {
    font-size: 14px;
  }
}
</style>
