<template>
  <a-modal
    v-model:open="visible"
    :mask-closable="false"
    width="50%"
    title="查看"
    :style="{ top: '20px' }"
    :footer="null"
  >
    <div v-if="visible" v-permission="['system:oplog:query']" v-loading="loading">
      <vxe-form border title-background title-width="80" :data="formData">
        <vxe-form-item title="日志名称" field="name" span="24" />
        <vxe-form-item title="日志类型" field="logType" span="12">
          {{ OP_LOG_TYPE.getDesc(formData.logType) }}
        </vxe-form-item>
        <vxe-form-item title="IP地址" field="ip" span="12" />
        <vxe-form-item title="创建人" field="createBy" span="12" />
        <vxe-form-item title="创建时间" field="createTime" span="12" />
        <vxe-form-item title="补充信息" field="extra" span="24">
          <a-textarea
            v-if="!isEmpty(formData.extra)"
            v-model:value="formData.extra"
            readonly
            @click="handleClipboard(formData.extra, $event)"
          />
        </vxe-form-item>
      </vxe-form>
    </div>
  </a-modal>
</template>
<script>
  import { defineComponent } from 'vue';
  import clipboard from '@/utils/clipboard';
  import * as api from '@/api/system/op-log';
  import { isEmpty } from '@/utils/utils';
  import { OP_LOG_TYPE } from '@/enums/biz/opLogType';

  export default defineComponent({
    components: {},
    props: {
      id: {
        type: String,
        required: true,
      },
    },

    setup() {
      return {
        isEmpty,
        OP_LOG_TYPE,
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
        this.formData = {
          id: '',
          name: '',
          logType: '',
          ip: '',
          createBy: '',
          createTime: '',
          extra: '',
        };
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
        this.loading = true;
        api
          .get(this.id)
          .then((data) => {
            this.formData = data;
          })
          .finally(() => {
            this.loading = false;
          });
      },
      handleClipboard(text, event) {
        clipboard(text, event);
      },
    },
  });
</script>
