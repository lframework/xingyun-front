<template>
  <div class="app-simple-container">
    <div v-permission="['system:dept:query']">
      <a-row :gutter="20">
        <a-col :span="14">
          <a-card>
            <a-space>
              <a-button
                v-permission="['system:dept:add']"
                type="primary"
                :icon="h(PlusOutlined)"
                @click="$refs.addDialog.openDialog()"
                >新增</a-button
              >
              <a-button :icon="h(ReloadOutlined)" @click="getDeptTrees"> 刷新</a-button>
              <a-button
                v-permission="['system:dept:permission']"
                :icon="h(SettingOutlined)"
                @click="batchDataPermmission"
                >批量数据权限</a-button
              >
              <a-dropdown>
                <template #overlay>
                  <a-menu @click="handleCommand">
                    <a-menu-item key="allOpen">
                      <template #icon><ExpandAltOutlined /></template>展开所有
                    </a-menu-item>
                    <a-menu-item key="allFold">
                      <template #icon><ShrinkOutlined /></template>折叠所有
                    </a-menu-item>
                    <a-menu-item key="allCheck">
                      <template #icon><CheckOutlined /></template>全选
                    </a-menu-item>
                    <a-menu-item key="allUnCheck">
                      <template #icon><StopOutlined /></template>取消选择
                    </a-menu-item>
                    <a-menu-item key="reserveCheck">
                      <template #icon><RestOutlined /></template>反选
                    </a-menu-item>
                  </a-menu>
                </template>
                <a-button>操作 <DownOutlined /></a-button>
              </a-dropdown>

              <a-dropdown>
                <template #overlay>
                  <a-menu @click="handleCommand">
                    <a-menu-item key="batchDelete">
                      <template #icon><DeleteOutlined /></template>批量删除
                    </a-menu-item>
                  </a-menu>
                </template>
                <a-button v-permission="['system:dept:delete']">更多 <DownOutlined /></a-button>
              </a-dropdown>
            </a-space>
            <a-divider />
            <div v-loading="loading" class="tree-container">
              <a-tree
                ref="tree"
                v-model:checkedKeys="checkedKeys"
                :tree-data="treeData"
                :checkable="true"
                :show-line="true"
                :show-icon="true"
                :height="70 * $vh"
                v-model:expanded-keys="expandedKeys"
                :field-names="{
                  children: 'children',
                  title: 'name',
                  key: 'id',
                }"
                :check-strictly="true"
                :indent="0"
                style="margin-top: 10px"
                @select="currentChange"
              >
                <template #title="treeNode">
                  {{ treeNode.name }}
                </template>
              </a-tree>
            </div>
          </a-card>
        </a-col>
        <a-col :span="10">
          <a-card>
            <modify
              v-if="!isEmpty(id)"
              :id="id"
              ref="updateDialog"
              @confirm="
                (e) => {
                  id = '';
                  getDeptTrees();
                }
              "
            />
          </a-card>
        </a-col>
      </a-row>

      <!-- 新增窗口 -->
      <add ref="addDialog" @confirm="getDeptTrees" />
      <!-- 数据权限窗口 -->
      <batch-data-permission
        ref="batchDataPermissionDialog"
        :biz-ids="ids"
        :biz-type="SYS_DATA_PERMISSION_DATA_BIZ_TYPE.DEPT.code"
      />

      <!-- 批量操作 -->
      <batch-handler
        ref="batchDeleteHandlerDialog"
        :table-column="[{ field: 'name', title: '部门', minWidth: 160 }]"
        title="批量删除"
        tip="删除部门时，会将该部门及其子部门同时删除。"
        :tableData="batchHandleDatas"
        :handle-fn="doBatchDelete"
        @confirm="getDeptTrees"
      />
    </div>
  </div>
</template>

<script>
  import Add from './add.vue';
  import Modify from './modify.vue';
  import BatchDataPermission from '@/components/DataPermission/batch.vue';
  import { h, defineComponent } from 'vue';
  import * as api from '@/api/system/dept';
  import {
    PlusOutlined,
    ReloadOutlined,
    SettingOutlined,
    DownOutlined,
    CheckOutlined,
    StopOutlined,
    DeleteOutlined,
    ExpandAltOutlined,
    ShrinkOutlined,
    RestOutlined,
  } from '@ant-design/icons-vue';
  import { isEmpty, toArrayTree, eachTree, toTreeArray } from '@/utils/utils';
  import { createError } from '@/hooks/web/msg';
  import { SYS_DATA_PERMISSION_DATA_BIZ_TYPE } from '@/enums/biz/sysDataPermissionDataBizType';
  import BatchHandler from '@/components/BatchHandler';

  export default defineComponent({
    name: 'Dept',
    components: {
      Add,
      Modify,
      BatchDataPermission,
      DownOutlined,
      CheckOutlined,
      StopOutlined,
      DeleteOutlined,
      ExpandAltOutlined,
      ShrinkOutlined,
      RestOutlined,
      BatchHandler,
    },
    setup() {
      return {
        h,
        PlusOutlined,
        ReloadOutlined,
        SettingOutlined,
        isEmpty,
        SYS_DATA_PERMISSION_DATA_BIZ_TYPE,
      };
    },
    data() {
      return {
        loading: false,
        // 部门树形数据
        treeData: [],
        // 部门数据
        depts: [],
        id: '',
        expandedKeys: [],
        checkedKeys: {
          checked: [],
          halfChecked: [],
        },
        ids: [],
        batchHandleDatas: [],
      };
    },
    created() {
      this.getDeptTrees();
    },
    methods: {
      getDeptTrees() {
        this.checkedKeys = {
          checked: [],
          halfChecked: [],
        };
        this.expandedKeys = [];
        this.loading = true;
        this.id = '';
        api
          .trees()
          .then((res) => {
            if (!isEmpty(res)) {
              let treeData = toArrayTree(res, {
                key: 'id',
                parentKey: 'parentId',
                children: 'children',
                strict: true,
              });

              eachTree(treeData, (item) => {
                if (isEmpty(item.children)) {
                  item.scopedSlots = { switcherIcon: 'child' };
                }
              });

              res = toTreeArray(treeData, {
                key: 'id',
                parentKey: 'parentId',
                children: 'children',
                strict: true,
              });

              treeData = res;
              this.depts = res;

              this.treeData = toArrayTree(treeData, {
                key: 'id',
                parentKey: 'parentId',
                children: 'children',
                strict: true,
              });
            } else {
              this.treeData = [];
              this.depts = [];
            }

            this.handleCommand({
              key: 'allOpen',
            });
          })
          .finally(() => {
            this.loading = false;
          });
      },
      handleCommand({ key }) {
        if (key === 'batchDelete') {
          this.batchDelete();
        } else if (key === 'allOpen') {
          this.expandedKeys = this.depts.map((item) => item.id);
        } else if (key === 'allFold') {
          this.expandedKeys = [];
        } else if (key === 'allCheck') {
          const treeData = toTreeArray(this.treeData, {
            key: 'id',
            parentKey: 'parentId',
            children: 'children',
            strict: true,
          });
          this.checkedKeys = {
            checked: treeData.map((item) => item.id),
            halfChecked: [],
          };
        } else if (key === 'allUnCheck') {
          this.checkedKeys = {
            checked: [],
            halfChecked: [],
          };
        } else if (key === 'reserveCheck') {
          const treeData = toTreeArray(this.treeData, {
            key: 'id',
            parentKey: 'parentId',
            children: 'children',
            strict: true,
          });
          const allKeys = treeData.map((item) => item.id);
          const unCheckedKeys = allKeys.filter(
            (item) =>
              !this.checkedKeys.checked.includes(item) &&
              !this.checkedKeys.halfChecked.includes(item),
          );

          this.checkedKeys = {
            checked: unCheckedKeys,
            halfChecked: [],
          };
        }
      },
      doBatchDelete(row) {
        return api.deleteById(row.id);
      },
      batchDelete() {
        const records = [...this.checkedKeys.checked, ...this.checkedKeys.halfChecked];

        if (isEmpty(records)) {
          createError('请选择要删除的部门！');
          return;
        }

        let treeData = toTreeArray(this.treeData, {
          key: 'id',
          parentKey: 'parentId',
          children: 'children',
          strict: true,
        });

        treeData = treeData.filter((item) => records.includes(item.id));
        this.batchHandleDatas = treeData;

        this.$refs.batchDeleteHandlerDialog.openDialog();
      },
      // 选中的部门发生改变
      currentChange(data) {
        this.id = '';
        if (!isEmpty(data)) {
          this.$nextTick(() => {
            this.id = data[0];
          });
        }
      },
      batchDataPermmission() {
        const records = [...this.checkedKeys.checked, ...this.checkedKeys.halfChecked];

        if (isEmpty(records)) {
          createError('请选择要设置数据权限的部门！');
          return;
        }

        this.ids = records;
        this.$nextTick(() => this.$refs.batchDataPermissionDialog.openDialog());
      },
    },
  });
</script>
<style lang="less" scoped>
  .unable-tree-node {
    color: @danger-color;
  }
</style>
