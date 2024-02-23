<template>
  <a-modal
    v-model:open="visible"
    :mask-closable="false"
    width="40%"
    :style="{ top: '20px' }"
    title="发货"
    :footer="null"
  >
    <div v-if="visible" v-permission="['logistics:sheet:delivery']" v-loading="loading">
      <a-form
        ref="form"
        :label-col="{ span: 4 }"
        :wrapper-col="{ span: 16 }"
        :model="formData"
        :rules="rules"
      >
        <a-form-item label="物流单号" name="logisticsNo">
          <a-input v-model:value="formData.logisticsNo" allow-clear />
        </a-form-item>
        <a-form-item label="物流费（元）" name="totalAmount">
          <a-input v-model:value="formData.totalAmount" allow-clear />
        </a-form-item>
        <div class="form-modal-footer">
          <a-space>
            <a-button type="primary" :loading="loading" html-type="submit" @click="submit"
              >确定</a-button
            >
            <a-button :loading="loading" @click="closeDialog">取消</a-button>
          </a-space>
        </div>
      </a-form>
    </div>
  </a-modal>
</template>
<script>
  import { defineComponent } from 'vue';
  import * as api from '@/api/sc/logistics/sheet';

  export default defineComponent({
    components: {},
    props: {
      sheetId: {
        type: String,
        required: true,
      },
    },
    data() {
      return {
        // 是否可见
        visible: false,
        // 是否显示加载框
        loading: false,
        // 表单数据
        formData: {},
        // 表单校验规则
        rules: {
          totalAmount: [
            {
              validator: (rule, value, callback) => {
                if (!this.$utils.isEmpty(value)) {
                  if (!this.$utils.isFloat(value)) {
                    return callback(new Error('物流费必须为数字类型'));
                  }
                  if (!this.$utils.isFloatGeZero(value)) {
                    return callback(new Error('物流费必须大于0'));
                  }
                  if (!this.$utils.isNumberPrecision(value, 2)) {
                    return callback(new Error('物流费最多允许2位小数'));
                  }
                }
                return callback();
              },
            },
          ],
        },
      };
    },
    computed: {},
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
      // 初始化表单数据
      initFormData() {
        this.formData = {
          logisticsNo: '',
          totalAmount: '',
        };
      },
      // 提交表单事件
      submit() {
        this.$refs.form.validate().then((valid) => {
          if (valid) {
            this.loading = true;
            const params = Object.assign({}, this.formData, { id: this.sheetId });
            api
              .delivery(params)
              .then(() => {
                this.$msg.createSuccess('发货成功！');
                this.$emit('confirm');
                this.closeDialog();
              })
              .finally(() => {
                this.loading = false;
              });
          }
        });
      },
      // 页面显示时触发
      open() {
        // 初始化表单数据
        this.initFormData();

        this.loadData();
      },
      loadData() {
        this.loading = true;
        api
          .queryDelivery(this.sheetId)
          .then((data) => {
            this.formData = data;
          })
          .finally(() => {
            this.loading = false;
          });
      },
    },
  });
</script>
