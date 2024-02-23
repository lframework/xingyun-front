<template>
  <j-border v-show="!$utils.isEmpty(domLines)">
    <div style="padding: 5px">
      <a-timeline>
        <transition-group enter-active-class="animated fadeIn">
          <a-timeline-item
            v-for="item in domLines"
            :key="item.id"
            :color="color(item)"
            class="order-timeline-item-wrapper"
          >
            <template #dot>
              <ExclamationCircleOutlined
                v-if="$enums.ORDER_TIME_LINE_BIZ_TYPE.APPROVE_RETURN.equalsCode(item.bizType)"
              />
              <ExclamationCircleOutlined
                v-else-if="$enums.ORDER_TIME_LINE_BIZ_TYPE.CANCEL_APPROVE.equalsCode(item.bizType)"
              />
              <CheckCircleOutlined
                v-else-if="$enums.ORDER_TIME_LINE_BIZ_TYPE.APPROVE_PASS.equalsCode(item.bizType)"
              />
              <ClockCircleOutlined v-else />
            </template>
            <p>{{ item.content }}</p>
            <p>{{ item.createBy }}</p>
            <p>{{ item.createTime }}</p>
          </a-timeline-item>
        </transition-group>
      </a-timeline>
      <div v-if="showCollapse" class="order-timeline-footer">
        <a v-if="collapseStatus" class="order-timeline-footer-item" type="info" @click="collapse"
          >收起<UpOutlined
        /></a>
        <a v-else type="info" class="order-timeline-footer-item" @click="expand"
          >展开<DownOutlined
        /></a>
      </div>
    </div>
  </j-border>
</template>
<script>
  import { defineComponent } from 'vue';
  import {
    ExclamationCircleOutlined,
    CheckCircleOutlined,
    ClockCircleOutlined,
    UpOutlined,
    DownOutlined,
  } from '@ant-design/icons-vue';
  import * as api from '@/api/components';

  export default defineComponent({
    name: 'OrderTimeLine',
    components: {
      ExclamationCircleOutlined,
      CheckCircleOutlined,
      ClockCircleOutlined,
      UpOutlined,
      DownOutlined,
    },
    props: {
      id: {
        type: String,
        required: true,
      },
    },
    data() {
      return {
        collapseStatus: false,
        lines: [],
      };
    },
    computed: {
      showCollapse() {
        return !this.$utils.isEmpty(this.lines) && this.lines.length > 1;
      },
      domLines() {
        if (this.$utils.isEmpty(this.lines)) {
          return [];
        }
        return this.collapseStatus ? this.lines : [this.lines[this.lines.length - 1]];
      },
    },
    created() {
      this.getList().then((res) => {
        this.lines = res;
      });
    },
    methods: {
      getList() {
        return api.getOrderTimeLine(this.id);
      },
      color(item) {
        if (this.$enums.ORDER_TIME_LINE_BIZ_TYPE.NORMAL.equalsCode(item.bizType)) {
          return 'gray';
        } else if (this.$enums.ORDER_TIME_LINE_BIZ_TYPE.CREATE.equalsCode(item.bizType)) {
          return 'gray';
        } else if (this.$enums.ORDER_TIME_LINE_BIZ_TYPE.APPROVE_PASS.equalsCode(item.bizType)) {
          return 'green';
        } else if (this.$enums.ORDER_TIME_LINE_BIZ_TYPE.APPROVE_RETURN.equalsCode(item.bizType)) {
          return 'red';
        } else if (this.$enums.ORDER_TIME_LINE_BIZ_TYPE.CANCEL_APPROVE.equalsCode(item.bizType)) {
          return 'red';
        }

        return undefined;
      },
      collapse() {
        this.collapseStatus = false;
      },
      expand() {
        const lines = this.lines;
        this.lines = [];
        this.$nextTick(() => {
          this.collapseStatus = true;
          this.lines = lines;
        });
      },
    },
  });
</script>
<style lang="less">
  .order-timeline-item-wrapper {
    p {
      margin: 0;
      line-height: 1.5;
      color: rgba(0, 0, 0, 0.65);
    }
  }
  .order-timeline-footer {
    text-align: center;

    .order-timeline-footer-item {
      font-size: 14px;
    }
  }
</style>
