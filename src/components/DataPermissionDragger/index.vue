<template>
  <a-modal
    v-model:open="visible"
    v-loading="loading"
    :mask-closable="false"
    width="80%"
    title="设置数据权限"
    :style="{ top: '20px' }"
    :footer="null"
  >
    <a-row>
      <a-col :span="8">
        <div class="panel-wrapper">
          <a-collapse v-model:activeKey="activeKey">
            <a-collapse-panel key="1" header="运算节点">
              <draggable
                :list="calcTypes"
                item-key="id"
                :group="{ name: 'g1', pull: 'clone', put: false }"
                :sort="false"
                :clone="onClone"
              >
                <template #item="{ element }">
                  <div style="width: 80px; height: 80px; padding: 5px; display: inline-block">
                    <a-avatar shape="square" :size="70" class="panel-node">
                      {{ element.name }}
                    </a-avatar>
                  </div>
                </template>
              </draggable>
            </a-collapse-panel>
            <a-collapse-panel key="2" header="条件节点">
              <draggable
                :list="conditions"
                item-key="id"
                :group="{ name: 'g1', pull: 'clone', put: false }"
                :sort="false"
                :clone="onClone"
              >
                <template #item="{ element }">
                  <div style="width: 80px; height: 80px; padding: 5px; display: inline-block">
                    <a-tooltip :title="element.name">
                      <a-avatar shape="square" :size="70" class="panel-node">
                        {{ element.name }}
                      </a-avatar>
                    </a-tooltip>
                  </div>
                </template>
              </draggable>
            </a-collapse-panel>
          </a-collapse>
        </div>
      </a-col>
      <a-col :span="14" :offset="2">
        <div class="panel-wrapper">
          <nested-draggable :list="nodes" @removeNodes="removeNodes" />
        </div>
      </a-col>
    </a-row>
    <div class="form-modal-footer">
      <a-space>
        <a-button type="primary" :loading="loading" html-type="submit" @click="submit"
          >确定</a-button
        >
        <a-button :loading="loading" @click="preview">预览</a-button>
        <a-button :loading="loading" @click="closeDialog">取消</a-button>
      </a-space>
    </div>
  </a-modal>
</template>

<script>
  import Draggable from 'vuedraggable';
  import NestedDraggable from './nested.vue';
  import { defineComponent } from 'vue';
  import * as api from '@/api/system/data-permission-model-detail';

  export default defineComponent({
    name: 'DataPermissionDragger',
    components: {
      Draggable,
      NestedDraggable,
    },
    props: {
      modelId: {
        type: Number,
        required: true,
      },
    },
    data() {
      return {
        loading: false,
        visible: false,
        calcTypes: [
          {
            id: -1,
            nodeType: this.$enums.SYS_DATA_PERMISSION_MODEL_DETAIL_NODE_TYPE.CALC.code,
            name: this.$enums.SYS_DATA_PERMISSION_MODEL_DETAIL_CALC_TYPE.AND.desc,
            calcType: this.$enums.SYS_DATA_PERMISSION_MODEL_DETAIL_CALC_TYPE.AND.code,
          },
          {
            id: -2,
            nodeType: this.$enums.SYS_DATA_PERMISSION_MODEL_DETAIL_NODE_TYPE.CALC.code,
            name: this.$enums.SYS_DATA_PERMISSION_MODEL_DETAIL_CALC_TYPE.OR.desc,
            calcType: this.$enums.SYS_DATA_PERMISSION_MODEL_DETAIL_CALC_TYPE.OR.code,
          },
        ],
        conditions: [],
        nodes: [],
        activeKey: '1',
      };
    },
    created() {
      // 初始化表单数据
      this.initFormData();
    },
    methods: {
      // 打开对话框 由父页面触发
      openDialog() {
        this.visible = true;

        this.$nextTick(() => this.open());
      },
      // 关闭对话框
      closeDialog() {
        this.visible = false;
        this.$emit('close');
      },
      initFormData() {},
      onClone(e) {
        return Object.assign({}, e, { id: this.$utils.uuid(), detailId: e.id, children: [] });
      },
      removeNodes(e) {
        const ids = [e];
        this.nodes = this.nodes
          .filter((item) => !ids.includes(item.id))
          .map((item) => {
            return Object.assign({}, item, {
              children: this.buildChildren(item.children, ids),
            });
          });
      },
      buildChildren(children, ids) {
        if (this.$utils.isEmpty(children)) {
          return children;
        }

        return children
          .filter((item) => !ids.includes(item.id))
          .map((item) => {
            return Object.assign({}, item, {
              children: this.buildChildren(item.children, ids),
            });
          });
      },
      loadData() {
        api.getByModelId(this.modelId).then((res) => {
          this.conditions = res.map((item) => {
            const condition = Object.assign({}, item, {
              nodeType: this.$enums.SYS_DATA_PERMISSION_MODEL_DETAIL_NODE_TYPE.CONDITION.code,
              value: undefined,
              values: [],
              conditionTypes: item.conditionTypes.map((t) =>
                this.$enums.SYS_DATA_PERMISSION_MODEL_DETAIL_CONDITION_TYPE.getByCode(t),
              ),
            });

            condition.conditionType = condition.conditionTypes[0].code;

            return condition;
          });
        });
      },
      // 页面显示时触发
      open() {
        // 初始化表单数据
        this.initFormData();
        this.loadData();
      },
      getModel() {
        return this.nodes;
      },
      setModel(model) {
        this.nodes = model;
      },
      validModel() {
        if (!this.$utils.isEmpty(this.nodes)) {
          let flag = true;
          for (let i = 0; i < this.nodes.length; i++) {
            const node = this.nodes[i];
            if (
              !this.$enums.SYS_DATA_PERMISSION_MODEL_DETAIL_NODE_TYPE.CALC.equalsCode(node.nodeType)
            ) {
              this.$msg.createError('最外层必须是运算节点');
              flag = false;
              break;
            }

            if (this.$utils.isEmpty(node.children)) {
              this.$msg.createError('运算节点必须包含子节点');
              flag = false;
              break;
            }

            flag &= this.validChild(node.children);
            if (!flag) {
              break;
            }
          }

          return flag;
        }

        return true;
      },
      validChild(children) {
        if (this.$utils.isEmpty(children)) {
          return true;
        }

        let flag = true;
        for (let i = 0; i < children.length; i++) {
          const child = children[i];
          if (
            this.$enums.SYS_DATA_PERMISSION_MODEL_DETAIL_NODE_TYPE.CALC.equalsCode(child.nodeType)
          ) {
            if (this.$utils.isEmpty(child.children)) {
              this.$msg.createError('运算节点必须包含子节点');
              flag = false;
              break;
            }
            flag &= this.validChild(child.children);
            if (!flag) {
              break;
            }
          } else {
            if (
              this.$enums.SYS_DATA_PERMISSION_MODEL_DETAIL_CONDITION_TYPE.IN.equalsCode(
                child.conditionType,
              ) ||
              this.$enums.SYS_DATA_PERMISSION_MODEL_DETAIL_CONDITION_TYPE.NOT_IN.equalsCode(
                child.conditionType,
              )
            ) {
              if (
                !this.$enums.SYS_DATA_PERMISSION_MODEL_DETAIL_INPUT_TYPE.SQL.equalsCode(
                  child.inputType,
                )
              ) {
                if (this.$utils.isEmpty(child.values)) {
                  this.$msg.createError('节点：【' + child.name + '】请输入值');
                  flag = false;
                  break;
                }
              }
            } else {
              if (this.$utils.isEmpty(child.value)) {
                this.$msg.createError('节点：【' + child.name + '】请输入值');
                flag = false;
                break;
              }
            }
          }
        }

        return flag;
      },
      preview() {
        if (this.validModel()) {
          this.loading = true;
          api
            .preview(this.nodes)
            .then((res) => {
              this.$msg.createConfirm(res, '数据权限SQL', {
                icon: 'check-circle',
                footer: null,
              });
            })
            .finally(() => {
              this.loading = false;
            });
        }
      },
      submit() {
        if (this.validModel()) {
          this.closeDialog();
        }
      },
    },
  });
</script>
<style lang="less" scoped>
  .panel-wrapper {
    padding: 10px;
  }
  .panel-node {
    background-color: @primary-color;
    vertical-align: middle;
    cursor: pointer;
  }
</style>
