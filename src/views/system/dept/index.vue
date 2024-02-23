<template>
  <page-wrapper content-full-height fixed-height>
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

              <a-dropdown v-permission="['system:dept:modify']">
                <template #overlay>
                  <a-menu @click="handleCommand">
                    <a-menu-item key="batchEnable">
                      <template #icon><CheckOutlined /></template>批量启用
                    </a-menu-item>
                    <a-menu-item key="batchUnable">
                      <template #icon><StopOutlined /></template>批量停用
                    </a-menu-item>
                  </a-menu>
                </template>
                <a-button>更多 <DownOutlined /></a-button>
              </a-dropdown>
              <a-switch
                v-model:checked="showAllDepts"
                checked-children="显示全部部门"
                un-checked-children="只显示启用部门"
                @change="showChange"
              />
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
                  <span v-if="treeNode.available">
                    {{ treeNode.name }}
                  </span>
                  <span v-else class="unable-tree-node">
                    {{ treeNode.name }}
                  </span>
                </template>
              </a-tree>
            </div>
          </a-card>
        </a-col>
        <a-col :span="10">
          <a-card>
            <modify
              v-if="!$utils.isEmpty(id)"
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
        :biz-type="$enums.SYS_DATA_PERMISSION_DATA_BIZ_TYPE.DEPT.code"
      />
    </div>
  </page-wrapper>
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
    ExpandAltOutlined,
    ShrinkOutlined,
    RestOutlined,
  } from '@ant-design/icons-vue';

  export default defineComponent({
    name: 'Dept',
    components: {
      Add,
      Modify,
      BatchDataPermission,
      DownOutlined,
      CheckOutlined,
      StopOutlined,
      ExpandAltOutlined,
      ShrinkOutlined,
      RestOutlined,
    },
    setup() {
      return {
        h,
        PlusOutlined,
        ReloadOutlined,
        SettingOutlined,
      };
    },
    data() {
      return {
        loading: false,
        // 部门树形数据
        treeData: [],
        // 部门数据
        depts: [],
        // 是否显示停用的部门
        showAllDepts: false,
        id: '',
        expandedKeys: [],
        checkedKeys: {
          checked: [],
          halfChecked: [],
        },
        ids: [],
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
            if (!this.$utils.isEmpty(res)) {
              let treeData = this.$utils.toArrayTree(res, {
                key: 'id',
                parentKey: 'parentId',
                children: 'children',
                strict: true,
              });

              this.$utils.eachTree(treeData, (item) => {
                if (this.$utils.isEmpty(item.children)) {
                  item.scopedSlots = { switcherIcon: 'child' };
                }
              });

              res = this.$utils.toTreeArray(treeData, {
                key: 'id',
                parentKey: 'parentId',
                children: 'children',
                strict: true,
              });

              treeData = res;
              this.depts = res;
              if (!this.showAllDepts) {
                treeData = treeData.filter((item) => item.available);
              }

              this.treeData = this.$utils.toArrayTree(treeData, {
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
        if (key === 'batchEnable') {
          this.batchEnable();
        } else if (key === 'batchUnable') {
          this.batchUnable();
        } else if (key === 'allOpen') {
          this.expandedKeys = this.depts.map((item) => item.id);
        } else if (key === 'allFold') {
          this.expandedKeys = [];
        } else if (key === 'allCheck') {
          const treeData = this.$utils.toTreeArray(this.treeData, {
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
          const treeData = this.$utils.toTreeArray(this.treeData, {
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
      batchUnable() {
        const records = [...this.checkedKeys.checked, ...this.checkedKeys.halfChecked];

        if (this.$utils.isEmpty(records)) {
          this.$msg.createError('请选择要停用的部门！');
          return;
        }

        this.$msg.createConfirm('是否确定停用选择的部门及其下级部门？').then(() => {
          this.loading = true;
          const ids = records;
          api
            .batchUnable(ids)
            .then((data) => {
              this.$msg.createSuccess('停用成功！');
              this.getDeptTrees();
            })
            .finally(() => {
              this.loading = false;
            });
        });
      },
      batchEnable() {
        const records = [...this.checkedKeys.checked, ...this.checkedKeys.halfChecked];

        if (this.$utils.isEmpty(records)) {
          this.$msg.createError('请选择要启用的部门！');
          return;
        }

        this.$msg.createConfirm('是否确定启用选择的部门及其上级部门？').then(() => {
          this.loading = true;
          const ids = records;
          api
            .batchEnable(ids)
            .then((data) => {
              this.$msg.createSuccess('启用成功！');
              this.getDeptTrees();
            })
            .finally(() => {
              this.loading = false;
            });
        });
      },
      showChange(val) {
        let treeData = this.depts;
        if (!val) {
          treeData = treeData.filter((item) => item.available);

          const currentIds = treeData.map((item) => item.id);
          this.checkedKeys = {
            checked: this.checkedKeys.checked.filter((item) => currentIds.includes(item)),
            halfChecked: this.checkedKeys.halfChecked.filter((item) => currentIds.includes(item)),
          };
        }
        this.treeData = this.$utils.toArrayTree(treeData);
      },
      // 选中的部门发生改变
      currentChange(data) {
        this.id = '';
        if (!this.$utils.isEmpty(data)) {
          this.$nextTick(() => {
            this.id = data[0];
          });
        }
      },
      batchDataPermmission() {
        const records = [...this.checkedKeys.checked, ...this.checkedKeys.halfChecked];

        if (this.$utils.isEmpty(records)) {
          this.$msg.createError('请选择要设置数据权限的部门！');
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
