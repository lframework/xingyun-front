<template>
  <div class="app-card-container">
    <div v-permission="['stock:take:config:modify']">
      <a-row>
        <a-col :md="16" :sm="24">
          <a-card v-loading="loading">
            <vxe-form
              border
              title-background
              title-width="260"
              ref="form"
              :data="formData"
              :rules="rules"
            >
              <vxe-form-group span="24" title="盘点任务设置" title-bold vertical>
                <vxe-form-item
                  title="库存盘点单关联盘点任务后，是否显示盘点任务中的商品数据"
                  field="showProduct"
                  span="24"
                >
                  <a-select v-model:value="formData.showProduct" allow-clear>
                    <a-select-option :value="true">显示</a-select-option>
                    <a-select-option :value="false">不显示</a-select-option>
                  </a-select>
                </vxe-form-item>
                <vxe-form-item
                  title="库存盘点单是否显示盘点任务创建时商品的系统库存数量"
                  field="showStock"
                  span="24"
                >
                  <a-select v-model:value="formData.showStock" allow-clear>
                    <a-select-option :value="true">显示</a-select-option>
                    <a-select-option :value="false">不显示</a-select-option>
                  </a-select>
                </vxe-form-item>
                <vxe-form-item title="盘点任务自动作废时间" field="cancelHours" span="24">
                  <a-input v-model:value="formData.cancelHours" allow-clear>
                    <template #suffix>小时</template>
                  </a-input>
                </vxe-form-item>
              </vxe-form-group>
              <vxe-form-group span="24" title="盘点差异设置" title-bold vertical>
                <vxe-form-item
                  title="盘点差异生成时是否自动调整盘点任务中商品的系统库存数量"
                  field="autoChangeStock"
                  span="24"
                >
                  <a-select v-model:value="formData.autoChangeStock" allow-clear>
                    <a-select-option :value="true">调整</a-select-option>
                    <a-select-option :value="false">不调整</a-select-option>
                  </a-select>
                </vxe-form-item>
                <vxe-form-item
                  title="盘点差异单中的盘点数量是否允许手动修改"
                  field="allowChangeNum"
                  span="24"
                >
                  <a-select v-model:value="formData.allowChangeNum" allow-clear>
                    <a-select-option :value="true">允许</a-select-option>
                    <a-select-option :value="false">不允许</a-select-option>
                  </a-select>
                </vxe-form-item>
              </vxe-form-group>
              <vxe-form-item span="24">
                <div class="form-modal-footer">
                  <a-space>
                    <a-button type="primary" :loading="loading" html-type="submit" @click="submit"
                      >保存</a-button
                    >
                    <a-button :loading="loading" @click="closeDialog">取消</a-button>
                  </a-space>
                </div>
              </vxe-form-item>
            </vxe-form>
          </a-card>
        </a-col>
      </a-row>
    </div>
  </div>
</template>
<script>
  import { defineComponent } from 'vue';
  import * as api from '@/api/sc/stock/take/config';
  import { multiplePageMix } from '@/mixins/multiplePageMix';
  import { isEmpty, isInteger, isIntegerGtZero } from '@/utils/utils';
  import { createSuccess, createError } from '@/hooks/web/msg';

  export default defineComponent({
    name: 'TakeStockConfig',
    // 使用组件
    components: {},
    mixins: [multiplePageMix],
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
        this.closeCurrentPage();
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
        if (!isEmpty(this.formData.cancelHours)) {
          if (!isInteger(this.formData.cancelHours)) {
            createError('盘点任务自动作废时间必须是整数');
            return;
          }

          if (!isIntegerGtZero(this.formData.cancelHours)) {
            createError('盘点任务自动作废时间必须大于0');
            return;
          }
        }
        this.$refs.form.validate().then((errMaps) => {
          if (!errMaps) {
            this.loading = true;
            api
              .update(this.formData)
              .then(() => {
                createSuccess('修改成功！');
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
