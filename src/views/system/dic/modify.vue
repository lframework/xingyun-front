<template>
  <a-modal
    v-model:open="visible"
    :mask-closable="false"
    width="40%"
    title="修改"
    :style="{ top: '20px' }"
    :footer="null"
  >
    <div v-if="visible" v-permission="['system:dic:modify']" v-loading="loading">
      <a-form
        ref="form"
        :label-col="{ span: 4 }"
        :wrapper-col="{ span: 16 }"
        :model="formData"
        :rules="rules"
      >
        <a-form-item name="code">
          <template #label>
            <a-space>
              <span> 编号 </span>
              <a-tooltip title="编号是字典的关联字段，请谨慎修改"
                ><QuestionCircleOutlined
              /></a-tooltip>
            </a-space>
          </template>
          <a-input v-model:value.trim="formData.code" allow-clear />
        </a-form-item>
        <a-form-item label="名称" name="name">
          <a-input v-model:value.trim="formData.name" allow-clear />
        </a-form-item>
        <a-form-item label="分类" name="categoryId">
          <sys-data-dic-category-selector v-model:value="formData.categoryId" />
        </a-form-item>
        <div class="form-modal-footer">
          <a-space>
            <a-button type="primary" :loading="loading" html-type="submit" @click="submit"
              >保存</a-button
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
  import { validCode } from '@/utils/validate';
  import * as api from '@/api/system/dic';
  import { QuestionCircleOutlined } from '@ant-design/icons-vue';

  export default defineComponent({
    // 使用组件
    components: {
      QuestionCircleOutlined,
    },
    props: {
      id: {
        type: String,
        required: true,
      },
    },
    data() {
      return {
        // 是否可见
        visible: false,
        // 字段类型是否禁用
        columnTypeDisabled: false,
        // 是否显示加载框
        loading: false,
        // 表单数据
        formData: {},
        // 表单校验规则
        rules: {
          code: [{ required: true, message: '请输入编号' }, { validator: validCode }],
          name: [{ required: true, message: '请输入名称' }],
        },
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
          code: '',
          name: '',
          categoryId: '',
        };
      },
      // 提交表单事件
      submit() {
        if (this.$enums.PROPERTY_TYPE.APPOINT.equalsCode(this.formData.propertyType)) {
          if (this.$utils.isEmpty(this.formData.categories)) {
            this.$msg.createError('请选择商品类目');
            return;
          }
        }
        this.$refs.form.validate().then((valid) => {
          if (valid) {
            this.loading = true;
            const params = Object.assign({}, this.formData);

            api
              .update(params)
              .then(() => {
                this.$msg.createSuccess('修改成功！');
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
          .get(this.id)
          .then((data) => {
            this.formData = Object.assign({}, this.formData, data);
            this.formData.categoryId = data.categoryId;
          })
          .finally(() => {
            this.loading = false;
          });
      },
    },
  });
</script>
