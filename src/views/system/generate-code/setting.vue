<template>
  <a-modal
    v-model:open="visible"
    :mask-closable="false"
    width="90%"
    title="设置"
    :style="{ top: '20px' }"
    :footer="null"
  >
    <div v-if="visible" v-permission="['system:generate-code:manage']" v-loading="loading">
      <a-row>
        <a-col :span="24">
          <div class="generate-code-wrapper">
            <h4
              >拖拽节点配置规则，拖拽到右侧即可。已拖拽到右侧的节点，双击可以删除。注意判断最终生成的编号长度是否能存入数据库中，否则会影响功能。</h4
            >
          </div>
        </a-col>
      </a-row>
      <a-row>
        <a-col :span="6">
          <div class="generate-code-wrapper">
            <a-card>
              <draggable
                :list="ruleList"
                item-key="type"
                :group="{ name: 'g1', pull: 'clone', put: false }"
                :sort="false"
                :clone="onClone"
              >
                <template #item="{ element }">
                  <div class="generate-code-node" style="width: 25%">
                    <a-button type="primary" block>{{ element.name }}</a-button>
                  </div>
                </template>
              </draggable>
            </a-card>
          </div>
        </a-col>
        <a-col :span="6" :offset="1">
          <div class="generate-code-wrapper">
            <draggable
              class="drag-area"
              tag="ul"
              :list="list"
              item-key="id"
              group="g1"
              @change="onChange"
            >
              <template #item="{ element }">
                <div class="generate-code-node" style="width: 25%">
                  <a-button
                    type="primary"
                    block
                    @click="() => clickNode(element)"
                    @dblclick="(e) => removeNode(element)"
                    >{{ element.name }}</a-button
                  >
                </div>
              </template>
            </draggable>
          </div>
        </a-col>
        <a-col :span="8" :offset="1">
          <div class="generate-code-wrapper">
            <a-card v-if="$utils.keys(formData).length > 3">
              <a-form
                :label-col="{ span: 4 }"
                :wrapper-col="{ span: 16 }"
                v-if="formData.type === 1"
              >
                <a-form-item label="时间格式">
                  <a-input v-model:value="formData.pattern" allow-clear />
                </a-form-item>
              </a-form>
              <a-form
                :label-col="{ span: 4 }"
                :wrapper-col="{ span: 16 }"
                v-if="formData.type === 2"
              >
                <a-form-item label="可选字符">
                  <a-input v-model:value="formData.pool" allow-clear />
                </a-form-item>
                <a-form-item label="随机个数">
                  <a-input v-model:value="formData.len" allow-clear />
                </a-form-item>
              </a-form>
              <a-form
                :label-col="{ span: 4 }"
                :wrapper-col="{ span: 16 }"
                v-if="formData.type === 3"
              >
                <a-form-item label="唯一标识">
                  <a-input v-model:value="formData.key" allow-clear />
                </a-form-item>
                <a-form-item label="最大长度">
                  <a-input v-model:value="formData.len" allow-clear />
                </a-form-item>
                <a-form-item label="步长">
                  <a-input v-model:value="formData.step" allow-clear />
                </a-form-item>
                <a-form-item label="过期秒数">
                  <a-input v-model:value="formData.expireSeconds" allow-clear />
                </a-form-item>
              </a-form>
              <a-form
                :label-col="{ span: 4 }"
                :wrapper-col="{ span: 16 }"
                v-if="formData.type === 4"
              >
                <a-form-item label="随机个数">
                  <a-input v-model:value="formData.len" allow-clear />
                </a-form-item>
              </a-form>
              <a-form
                :label-col="{ span: 4 }"
                :wrapper-col="{ span: 16 }"
                v-if="formData.type === 6"
              >
                <a-form-item label="字符">
                  <a-input v-model:value="formData.val" allow-clear />
                </a-form-item>
              </a-form>
            </a-card>
          </div>
        </a-col>
      </a-row>
    </div>
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
  import { defineComponent } from 'vue';
  import * as api from '@/api/system/generate-code';
  import clipboard from '@/utils/clipboard';
  import Draggable from 'vuedraggable';
  import * as constants from './constants';

  export default defineComponent({
    // 使用组件
    components: { Draggable },
    props: {
      id: {
        type: String,
        required: true,
      },
    },
    setup() {
      const { ruleList } = constants;
      return {
        ruleList,
      };
    },
    data() {
      return {
        // 是否可见
        visible: false,
        // 是否显示加载框
        loading: false,
        // 表单数据
        formData: {},
        list: [],
      };
    },
    created() {
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
      // 初始化表单数据
      initFormData() {
        this.formData = {};
      },
      // 页面显示时触发
      open() {
        // 初始化数据
        this.initFormData();

        // 查询数据
        this.loadFormData();
      },
      // 查询数据
      loadFormData() {
        this.list = [];
        this.loading = true;
        api
          .get(this.id)
          .then((data) => {
            this.formData = {};
            const configStr = data.configStr;

            const configArr = JSON.parse(configStr);
            this.list = configArr.map((item) => {
              return Object.assign({}, item, {
                id: this.$utils.uuid(),
                name: this.ruleList.filter((r) => r.type === item.type)[0].name,
              });
            });
          })
          .finally(() => {
            this.loading = false;
          });
      },
      handleClipboard(text, event) {
        clipboard(text, event);
      },
      onClone(e) {
        let initConfig = {
          id: this.$utils.uuid(),
        };
        if (e.type === 1) {
          initConfig.pattern = 'yyyyMMddHHmmss';
        }
        if (e.type === 2) {
          initConfig.pool = 'abcdefghijklmnopqrstuvwxyz';
          initConfig.len = 1;
        }
        if (e.type === 3) {
          initConfig.key = this.$utils.uuid();
          initConfig.len = 10;
          initConfig.step = 1;
          initConfig.expireSeconds = 24 * 60 * 60;
        }
        if (e.type === 4) {
          initConfig.len = 1;
        }
        if (e.type === 6) {
          initConfig.val = 'A';
        }
        return Object.assign({}, e, initConfig);
      },
      onChange(e) {
        this.focusNode(e?.added?.element);
      },
      clickNode(e) {
        this.focusNode(e);
      },
      focusNode(node) {
        if (!node) {
          this.formData = {};
          return;
        }

        this.formData = node;
      },
      removeNode(e) {
        this.list = this.list.filter((item) => item.id !== e.id);
        this.focusNode();
      },
      preview() {
        if (this.validNode()) {
          this.loading = true;
          api
            .preview({ configStr: JSON.stringify(this.getNodeRequestParams()) })
            .then((res) => {
              const msg = `示例编号：${res} 长度：${res.length}`;
              this.$msg.createConfirm(msg, '预览', {
                icon: 'check-circle',
                footer: null,
              });
            })
            .finally(() => {
              this.loading = false;
            });
        }
      },
      validNode() {
        if (this.$utils.isEmpty(this.list)) {
          this.$msg.createError('节点不能为空！');
          return false;
        }

        for (let i = 0; i < this.list.length; i++) {
          const node = this.list[i];
          if (node.type === 2) {
            if (this.$utils.isEmpty(node.pool)) {
              this.$msg.createError('【' + node.name + '】' + '可选字符不能为空！');
              return false;
            }

            if (this.$utils.isEmpty(node.len)) {
              this.$msg.createError('【' + node.name + '】' + '随机个数不能为空！');
              return false;
            }

            if (!this.$utils.isIntegerGtZero(node.len)) {
              this.$msg.createError('【' + node.name + '】' + '随机个数必须是数字类型并且大于0！');
              return false;
            }
          } else if (node.type === 3) {
            if (this.$utils.isEmpty(node.key)) {
              this.$msg.createError('【' + node.name + '】' + '唯一标识不能为空！');
              return false;
            }

            if (this.$utils.isEmpty(node.len)) {
              this.$msg.createError('【' + node.name + '】' + '最大长度不能为空！');
              return false;
            }

            if (!this.$utils.isIntegerGtZero(node.len)) {
              this.$msg.createError('【' + node.name + '】' + '最大长度必须是数字类型并且大于0！');
              return false;
            }

            if (this.$utils.isEmpty(node.step)) {
              this.$msg.createError('【' + node.name + '】' + '步长不能为空！');
              return false;
            }

            if (!this.$utils.isIntegerGtZero(node.step)) {
              this.$msg.createError('【' + node.name + '】' + '步长必须是数字类型并且大于0！');
              return false;
            }

            if (this.$utils.isEmpty(node.expireSeconds)) {
              this.$msg.createError('【' + node.name + '】' + '过期秒数不能为空！');
              return false;
            }

            if (!this.$utils.isIntegerGtZero(node.expireSeconds)) {
              this.$msg.createError('【' + node.name + '】' + '过期秒数必须是数字类型并且大于0！');
              return false;
            }
          } else if (node.type === 4) {
            if (this.$utils.isEmpty(node.len)) {
              this.$msg.createError('【' + node.name + '】' + '随机个数不能为空！');
              return false;
            }

            if (!this.$utils.isIntegerGtZero(node.len)) {
              this.$msg.createError('【' + node.name + '】' + '随机个数必须是数字类型并且大于0！');
              return false;
            }
          } else if (node.type === 6) {
            if (this.$utils.isEmpty(node.val)) {
              this.$msg.createError('【' + node.name + '】' + '字符不能为空！');
              return false;
            }
          }
        }

        return true;
      },
      getNodeRequestParams() {
        return this.list.map((item) => Object.assign({}, item, { id: undefined, name: undefined }));
      },
      submit() {
        if (this.validNode()) {
          this.loading = true;
          api
            .setting({
              id: this.id,
              configStr: JSON.stringify(this.getNodeRequestParams()),
            })
            .then(() => {
              this.$msg.createSuccess('设置成功！');
              this.$emit('confirm');
              this.closeDialog();
            })
            .finally(() => {
              this.loading = false;
            });
        }
      },
    },
  });
</script>
<style lang="less" scoped>
  .generate-code-wrapper {
    padding: 10px;
  }
  .generate-code-node {
    padding: 2px 4px;
    display: inline-block;
  }
  .drag-area {
    min-height: 50px;
    outline: 1px dashed @border-color-light;
    padding: 10px;
  }
</style>
