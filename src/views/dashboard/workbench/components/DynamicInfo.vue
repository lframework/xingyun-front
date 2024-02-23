<template>
  <Card title="最新动态" v-bind="$attrs" :loading="loading">
    <List item-layout="horizontal" :data-source="oplogs">
      <template #renderItem="{ item, index }">
        <ListItem>
          <ListItemMeta>
            <template #description>
              <div class="flex flex-col flex-nowrap">
                <span class="font-size-3"><RelativeTime :value="item.createTime" /></span>
              </div>
            </template>
            <!-- eslint-disable-next-line -->
            <template #title>
              <a-row>
                <a-col :span="20">
                  <span>{{ item.name }}</span>
                </a-col>
                <a-col :span="3" :offset="1">
                  <a-tag :bordered="false" color="processing">{{ item.ip }}</a-tag>
                </a-col>
              </a-row>
            </template>
            <template #avatar>
              <div style="width: 80px; text-align: right">
                <a-tag :color="colors[index]">{{ $enums.OP_LOG_TYPE.getDesc(item.logType) }}</a-tag>
              </div>
            </template>
          </ListItemMeta>
        </ListItem>
      </template>
    </List>
  </Card>
</template>
<script setup>
  import { onMounted, ref } from 'vue';
  import { Card, List } from 'ant-design-vue';
  import { RelativeTime } from '@/components/RelativeTime';
  import * as api from '@/api/sys/center';

  const ListItem = List.Item;
  const ListItemMeta = List.Item.Meta;
  const oplogs = ref([]);
  const loading = ref(false);
  const colors = ref(['pink', 'orange', 'green', 'cyan', 'blue', 'purple']);

  onMounted(() => {
    loading.value = true;
    api
      .oplog({
        pageIndex: 1,
        pageSize: 6,
      })
      .then((res) => {
        oplogs.value = res?.datas || [];
      })
      .finally(() => {
        loading.value = false;
      });
  });
</script>
