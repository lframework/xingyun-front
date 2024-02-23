<template>
  <div>
    <draggable class="dragArea" tag="ul" :list="list" item-key="id" group="g1" @change="onChange">
      <template #item="{ element }">
        <ul>
          <j-form
            v-if="
              $enums.SYS_DATA_PERMISSION_MODEL_DETAIL_NODE_TYPE.CALC.equalsCode(element.nodeType)
            "
          >
            <j-form-item :span="2" :colon="false" :hidden-label="true">
              <a-icon style="cursor: move" type="drag" />
            </j-form-item>
            <j-form-item label="运算类型" :span="6">
              <a-select v-model:value="element.calcType" style="width: 100%">
                <a-select-option
                  v-for="item in $enums.SYS_DATA_PERMISSION_MODEL_DETAIL_CALC_TYPE.values()"
                  :key="item.code"
                  :value="item.code"
                  >{{ item.desc }}</a-select-option
                >
              </a-select>
            </j-form-item>
            <j-form-item />
            <j-form-item :hidden-label="true" :colon="false" :content-nest="false">
              <div style="text-align: right; width: 100%">
                <a-popconfirm
                  :title="'确认删除此节点以及包含的子节点？'"
                  ok-text="是"
                  cancel-text="否"
                  @confirm="(e) => removeNodes(element.id)"
                >
                  <a-button type="link" class="ant-btn-link-danger">删除</a-button>
                </a-popconfirm>
              </div>
            </j-form-item>
          </j-form>
          <j-form
            v-else-if="
              $enums.SYS_DATA_PERMISSION_MODEL_DETAIL_NODE_TYPE.CONDITION.equalsCode(
                element.nodeType,
              )
            "
          >
            <j-form-item :span="2" :colon="false" :hidden-label="true">
              <a-icon style="cursor: move" type="drag" />
            </j-form-item>
            <j-form-item :hidden-label="true" :span="20" :content-nest="false">
              <a-space>
                <div>{{ element.name }}</div>
                <a-select
                  v-if="
                    !$enums.SYS_DATA_PERMISSION_MODEL_DETAIL_INPUT_TYPE.SQL.equalsCode(
                      element.inputType,
                    )
                  "
                  v-model:value="element.conditionType"
                  style="width: 150px"
                >
                  <a-select-option
                    v-for="item in element.conditionTypes"
                    :key="item.code"
                    :value="item.code"
                    >{{ item.desc }}</a-select-option
                  >
                </a-select>
                <div
                  v-if="
                    $enums.SYS_DATA_PERMISSION_MODEL_DETAIL_INPUT_TYPE.INPUT.equalsCode(
                      element.inputType,
                    )
                  "
                >
                  <a-select
                    v-if="
                      $enums.SYS_DATA_PERMISSION_MODEL_DETAIL_CONDITION_TYPE.IN.equalsCode(
                        element.conditionType,
                      ) ||
                      $enums.SYS_DATA_PERMISSION_MODEL_DETAIL_CONDITION_TYPE.NOT_IN.equalsCode(
                        element.conditionType,
                      )
                    "
                    v-model:value="element.values"
                    style="min-width: 175px"
                    mode="tags"
                  />
                  <a-input v-else v-model:value="element.value" />
                </div>
                <div
                  v-else-if="
                    $enums.SYS_DATA_PERMISSION_MODEL_DETAIL_INPUT_TYPE.SELECT.equalsCode(
                      element.inputType,
                    )
                  "
                >
                  <a-select
                    v-if="
                      $enums.SYS_DATA_PERMISSION_MODEL_DETAIL_CONDITION_TYPE.IN.equalsCode(
                        element.conditionType,
                      ) ||
                      $enums.SYS_DATA_PERMISSION_MODEL_DETAIL_CONDITION_TYPE.NOT_IN.equalsCode(
                        element.conditionType,
                      )
                    "
                    v-model:value="element.values"
                    style="min-width: 175px"
                    mode="multiple"
                  >
                    <a-select-option
                      v-for="item in $enums[element.enumName]"
                      :key="item.code"
                      :value="item.code"
                      >{{ item.desc }}</a-select-option
                    >
                  </a-select>
                  <a-select v-else v-model:value="element.value" style="min-width: 175px">
                    <a-select-option
                      v-for="item in $enums[element.enumName]"
                      :key="item.code"
                      :value="item.code"
                      >{{ item.desc }}</a-select-option
                    >
                  </a-select>
                </div>
                <div
                  v-else-if="
                    $enums.SYS_DATA_PERMISSION_MODEL_DETAIL_INPUT_TYPE.DATE_TIME.equalsCode(
                      element.inputType,
                    )
                  "
                >
                  <a-date-picker
                    v-model:value="element.value"
                    placeholder=""
                    value-format="YYYY-MM-DD HH:mm:ss"
                    show-time
                  />
                </div>
                <div
                  v-else-if="
                    $enums.SYS_DATA_PERMISSION_MODEL_DETAIL_INPUT_TYPE.DATE.equalsCode(
                      element.inputType,
                    )
                  "
                >
                  <a-date-picker
                    v-model:value="element.value"
                    placeholder=""
                    value-format="YYYY-MM-DD"
                  />
                </div>
              </a-space>
            </j-form-item>
            <j-form-item :hidden-label="true" :colon="false" :content-nest="false" :span="2">
              <div style="text-align: right; width: 100%">
                <a-popconfirm
                  :title="'确认删除此节点？'"
                  ok-text="是"
                  cancel-text="否"
                  @confirm="(e) => removeNodes(element.id)"
                >
                  <a-button type="link" class="ant-btn-link-danger">删除</a-button>
                </a-popconfirm>
              </div>
            </j-form-item>
          </j-form>
          <data-permission-nested
            v-if="
              $enums.SYS_DATA_PERMISSION_MODEL_DETAIL_NODE_TYPE.CALC.equalsCode(element.nodeType)
            "
            :list="element.children"
            :only-calc-node="false"
            @removeNodes="(e) => $emit('removeNodes', e)"
          />
        </ul>
      </template>
    </draggable>
  </div>
</template>
<script>
  import Draggable from 'vuedraggable';
  import { Empty } from 'ant-design-vue';
  import { defineComponent } from 'vue';

  export default defineComponent({
    name: 'DataPermissionNested',
    components: {
      Draggable,
    },
    props: {
      list: {
        required: true,
        type: Array,
      },
      onlyCalcNode: {
        type: Boolean,
        default: true,
      },
    },
    computed: {
      empty() {
        return Empty;
      },
    },
    methods: {
      removeNodes(e) {
        this.$emit('removeNodes', e);
      },
      onChange(e) {
        if (this.onlyCalcNode) {
          const added = e.added;
          if (
            added &&
            !this.$enums.SYS_DATA_PERMISSION_MODEL_DETAIL_NODE_TYPE.CALC.equalsCode(
              added.element.nodeType,
            )
          ) {
            this.$msg.createError('此区域只允许添加运算节点');
            this.removeNodes(added.element.id);
          }

          const moved = e.moved;
          if (
            moved &&
            !this.$enums.SYS_DATA_PERMISSION_MODEL_DETAIL_NODE_TYPE.CALC.equalsCode(
              moved.element.nodeType,
            )
          ) {
            this.$msg.createError('此区域只允许添加运算节点');
            this.removeNodes(added.element.id);
          }
        }
      },
    },
  });
</script>
<style lang="less" scoped>
  .dragArea {
    min-height: 50px;
    outline: 1px dashed @border-color-light;
    padding: 10px;
  }
  .descrption-text {
    color: @border-color-light;
    font-size: 12px;
    text-align: center;
  }
</style>
