<template>
  <div :class="prefixCls">
    <a-space :size="24">
      <a-badge :count="count" :numberStyle="numberStyle">
        <CloudDownloadOutlined @click="openDrawer" />
      </a-badge>
    </a-space>
    <a-drawer
      title="导出中心"
      :width="860"
      :open="open"
      :destroyOnClose="true"
      @close="closeDrawer"
    >
      <div class="h-full p1">
        <a-tabs tab-position="left" class="h-full" v-model:activeKey="activeKey">
          <a-tab-pane key="1">
            <template #tab>
              <a-space>
                <span>正在导出</span>
                <span v-if="unFinishedSummary !== 0 && unFinishedSummary < 100"
                  >({{ unFinishedSummary }})</span
                >
                <span v-if="unFinishedSummary >= 100">(99+)</span>
              </a-space>
            </template>
            <div>
              <a-list bordered item-layout="horizontal" :data-source="exportingDataList">
                <template #renderItem="{ item }">
                  <a-list-item>
                    <a-list-item-meta>
                      <template #title>
                        {{ item.name }}
                      </template>
                      <template #description>
                        <div v-if="$enums.EXPORT_TASK_STATUS.EXPORTING.equalsCode(item.status)">
                          <a-progress
                            :stroke-color="projectSetting.themeColor"
                            :percent="
                              item.totalCount === 0
                                ? 0
                                : $utils.getNumber(
                                    $utils.mul($utils.div(item.curCount, item.totalCount), 100),
                                    2,
                                  )
                            "
                            status="active"
                          />
                        </div>
                        <div v-else> {{ $enums.EXPORT_TASK_STATUS.CREATED.desc }} </div>
                      </template>
                    </a-list-item-meta>
                  </a-list-item>
                </template>
              </a-list>
            </div>
          </a-tab-pane>
          <a-tab-pane key="2">
            <template #tab>
              <a-space>
                <span>导出完成</span>
                <span v-if="successSummary !== 0 && successSummary < 100"
                  >({{ successSummary }})</span
                >
                <span v-if="successSummary >= 100">(99+)</span>
              </a-space>
            </template>
            <success-list v-if="activeKey === '2'" />
          </a-tab-pane>
          <a-tab-pane key="3">
            <template #tab>
              <a-space>
                <span>导出失败</span>
                <span v-if="failSummary !== 0 && failSummary < 100">({{ failSummary }})</span>
                <span v-if="failSummary >= 100">(99+)</span>
              </a-space>
            </template>
            <fail-list v-if="activeKey === '3'" />
          </a-tab-pane>
        </a-tabs>
      </div>
    </a-drawer>
  </div>
</template>
<script lang="ts">
  import { computed, defineComponent, Ref, ref } from 'vue';
  import { CloudDownloadOutlined } from '@ant-design/icons-vue';
  import { useDesign } from '@/hooks/web/useDesign';
  import eventBus from '@/events/eventBus';
  import * as api from '@/api/export-task';
  import { uuid } from '@/utils/utils';
  import { ExportingExportTaskBo } from '@/api/export-task/model/exportingExportTaskBo';
  import projectSetting from '@/settings/projectSetting';
  import SuccessList from './SuccessList.vue';
  import FailList from './FailList.vue';

  export default defineComponent({
    components: {
      CloudDownloadOutlined,
      SuccessList,
      FailList,
    },
    setup() {
      const { prefixCls } = useDesign('header-export-center');

      const open = ref(false);

      function openDrawer() {
        open.value = true;

        beginExecuteQuery();
      }

      function closeDrawer() {
        open.value = false;

        endExecuteQuery();
      }

      const activeKey = ref('1');

      const unFinishedSummary = ref(0);
      const successSummary = ref(0);
      const failSummary = ref(0);

      const count = computed(() => {
        let count = unFinishedSummary.value;
        if (count >= 100) {
          return '99+';
        } else {
          return count;
        }
      });

      const eventBusOff = ref([]);

      eventBusOff.value.push(eventBus.$on(eventBus.$pullEvent.EXPORT_TASK, onExportTaskSummary));

      function onExportTaskSummary(e) {
        const { unFinishedCount, successCount, failCount } = e;
        unFinishedSummary.value = unFinishedCount;
        successSummary.value = successCount;
        failSummary.value = failCount;
      }

      const queryTimer: Ref<NodeJS.Timer | null> = ref(null);
      const queryId = ref('');

      function beginExecuteQuery() {
        queryTimer.value = setInterval(executeQuery, 1000);
      }

      function endExecuteQuery() {
        clearInterval(queryTimer.value);
      }

      const exportingDataList: Ref<ExportingExportTaskBo[]> = ref([]);

      function executeQuery() {
        const id = uuid();
        queryId.value = id;
        api.queryExporting().then((res) => {
          if (id === queryId.value) {
            exportingDataList.value = res;
          }
        });
      }

      return {
        prefixCls,
        unFinishedSummary,
        successSummary,
        failSummary,
        count,
        numberStyle: {},
        open,
        openDrawer,
        closeDrawer,
        eventBusOff,
        queryTimer,
        exportingDataList,
        projectSetting,
        activeKey,
      };
    },
    mounted() {},
    unmounted() {
      this.eventBusOff.forEach((item) => item());
    },
    methods: {},
  });
</script>
<style lang="less">
  @prefix-cls: ~'@{namespace}-header-export-center';

  .@{prefix-cls} {
    padding-bottom: 1px;

    &__overlay {
      width: 360px;
      height: 300px;
    }

    .ant-tabs-content {
      height: 300px;
    }

    .ant-badge {
      display: flex;
      align-items: center;
      font-size: 16px;

      .ant-badge-multiple-words {
        padding: 0 4px;
      }

      svg {
        width: 0.9em;
      }
    }
  }
</style>
