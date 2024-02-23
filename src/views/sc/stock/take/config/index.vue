<template>
  <div>
    <div v-permission="['stock:take:config:modify']">
      <a-row>
        <a-col :md="16" :sm="24">
          <a-card v-loading="loading">
            <a-form
              ref="form"
              :label-col="{ span: 14 }"
              :wrapper-col="{ span: 4 }"
              :model="formData"
              :rules="rules"
            >
              <a-form-item
                label="库存盘点单关联盘点任务后，是否显示盘点任务中的商品数据"
                name="showProduct"
              >
                <a-select v-model:value="formData.showProduct" allow-clear>
                  <a-select-option :value="true">显示</a-select-option>
                  <a-select-option :value="false">不显示</a-select-option>
                </a-select>
              </a-form-item>
              <a-form-item
                label="库存盘点单是否显示盘点任务创建时商品的系统库存数量"
                name="showStock"
              >
                <a-select v-model:value="formData.showStock" allow-clear>
                  <a-select-option :value="true">显示</a-select-option>
                  <a-select-option :value="false">不显示</a-select-option>
                </a-select>
              </a-form-item>
              <a-form-item
                label="盘点差异生成时是否自动调整盘点任务中商品的系统库存数量"
                name="autoChangeStock"
              >
                <a-select v-model:value="formData.autoChangeStock" allow-clear>
                  <a-select-option :value="true">调整</a-select-option>
                  <a-select-option :value="false">不调整</a-select-option>
                </a-select>
              </a-form-item>
              <a-form-item label="盘点差异单中的盘点数量是否允许手动修改" name="allowChangeNum">
                <a-select v-model:value="formData.allowChangeNum" allow-clear>
                  <a-select-option :value="true">允许</a-select-option>
                  <a-select-option :value="false">不允许</a-select-option>
                </a-select>
              </a-form-item>
              <a-form-item label="盘点任务自动作废时间" name="cancelHours">
                <a-input v-model:value="formData.cancelHours" allow-clear>
                  <template #suffix>小时</template>
                </a-input>
              </a-form-item>
            </a-form>
            <div class="form-modal-footer">
              <a-space>
                <a-button type="primary" :loading="loading" @click="submit">保存</a-button>
                <a-button :loading="loading" @click="closeDialog">取消</a-button>
              </a-space>
            </div>
          </a-card>
        </a-col>
      </a-row>
    </div>
  </div>
</template>
<script>
  import { defineComponent } from 'vue';
  import * as api from '@/api/sc/stock/take/config';

  export default defineComponent({
    name: 'TakeStockConfig',
    // 使用组件
    components: {},
    data() {
      return {
        // 是否显示加载框
        loading: false,
        // 表单数据
        formData: {},
        // 表单校验规则
        rules: {
          showProduct: [
            {
              required: true,
              message: '请选择库存盘点单关联盘点任务后，是否显示盘点任务中的商品数据',
            },
          ],
          showStock: [
            { required: true, message: '请选择库存盘点单是否显示盘点任务创建时商品的系统库存数量' },
          ],
          autoChangeStock: [
            {
              required: true,
              message: '请选择盘点差异生成时是否自动调整盘点任务中商品的系统库存数量',
            },
          ],
          allowChangeNum: [
            { required: true, message: '请选择盘点差异单中的盘点数量是否允许手动修改' },
          ],
          cancelHours: [{ required: true, message: '请输入盘点任务自动作废时间' }],
        },
      };
    },
    created() {
      this.initFormData();

      this.openDialog();
    },
    methods: {
      // 打开对话框 由父页面触发
      openDialog() {
        this.$nextTick(() => this.open());
      },
      // 关闭对话框
      closeDialog() {
        this.$utils.closeCurrentPage();
      },
      // 初始化表单数据
      initFormData() {
        this.formData = {
          id: '',
          showProduct: '',
          showStock: '',
          autoChangeStock: '',
          allowChangeNum: '',
          cancelHours: '',
        };
      },
      // 提交表单事件
      submit() {
        if (!this.$utils.isEmpty(this.formData.cancelHours)) {
          if (!this.$utils.isInteger(this.formData.cancelHours)) {
            this.$msg.createError('盘点任务自动作废时间必须是整数');
            return;
          }

          if (!this.$utils.isIntegerGtZero(this.formData.cancelHours)) {
            this.$msg.createError('盘点任务自动作废时间必须大于0');
            return;
          }
        }
        this.$refs.form.validate().then((valid) => {
          if (valid) {
            this.loading = true;
            api
              .update(this.formData)
              .then(() => {
                this.$msg.createSuccess('保存成功！');
                this.$emit('confirm');
                this.visible = false;
              })
              .finally(() => {
                this.loading = false;
              });
          }
        });
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
          .get()
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
