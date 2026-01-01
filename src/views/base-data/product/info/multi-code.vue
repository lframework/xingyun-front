<template>
  <a-modal
    v-model:open="visible"
    :mask-closable="false"
    width="40%"
    :style="{ top: '20px' }"
    title="一品多码"
    :footer="null"
  >
    <div
      v-if="visible"
      v-permission="['base-data:product:info:add', 'base-data:product:info:modify']"
      v-loading="loading"
    >
      <a-form
        ref="form"
        :label-col="{ span: 4 }"
        :wrapper-col="{ span: 16 }"
        :model="formData"
        :rules="rules"
      >
        <a-form-item label="主编号" name="code">
          <a-input-group compact>
            <a-input
              v-model:value.trim="formData.code"
              style="width: calc(100% - 75px)"
              allow-clear
            />
            <a-button type="primary" @click="() => onGenerateCode(formData)">点此生成</a-button>
          </a-input-group>
        </a-form-item>
        <template v-for="(item, index) in codeList" :key="index">
          <a-form-item :label="'扩展编号' + (index + 1)" required>
            <a-input-group compact>
              <a-input
                v-model:value.trim="item.code"
                style="width: calc(100% - 125px)"
                allow-clear
              />
              <div>
                <a-space-compact block>
                  <a-button type="primary" @click="() => onGenerateCode(item)">点此生成</a-button>
                  <a-button
                    v-if="index !== 0"
                    type="primary"
                    danger
                    @click="() => onDeleteExtCode(index)"
                    >删除</a-button
                  >
                </a-space-compact>
              </div>
            </a-input-group>
          </a-form-item>
        </template>
        <a-form-item label=" " :colon="false">
          <div class="text-align-center">
            <a-button type="primary" class="w-full" @click="() => codeList.push({ code: '' })"
              ><PlusOutlined /> 新增</a-button
            >
          </div>
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
  import { generateCode } from '@/api/components';
  import { createError } from '@/hooks/web/msg';
  import { GENERATE_CODE_TYPE } from '@/enums/biz/generateCodeType';
  import { isCode, isEmpty } from '@/utils/utils';
  import { PlusOutlined } from '@ant-design/icons-vue';

  export default defineComponent({
    components: {
      PlusOutlined,
    },
    props: {
      mainCode: {
        type: String,
        default: '',
      },
      multiCodes: {
        type: Array,
        default: () => [],
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
          code: [{ required: true, message: '请输入主编号' }, { validator: validCode }],
        },
        code: '',
        codeList: [],
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
          code: this.mainCode,
        };

        this.codeList = [];

        if (isEmpty(this.multiCodes)) {
          this.codeList.push({
            code: '',
          });
        } else {
          this.codeList = this.multiCodes.map((item) => {
            return {
              code: item,
            };
          });
        }
      },
      // 提交表单事件
      submit() {
        this.$refs.form.validate().then((valid) => {
          if (valid) {
            let hasError = false;
            this.codeList.some((item, index) => {
              if (isEmpty(item.code)) {
                createError('扩展编号' + (index + 1) + '不能为空');
                hasError = true;
                return true; // 终止遍历
              }

              if (!isCode(item.code)) {
                createError(
                  '扩展编号' + (index + 1) + '必须由字母、数字、“-_.”组成，长度不能超过20位',
                );
                hasError = true;
                return true;
              }
              return false;
            });

            if (hasError) {
              return; // 验证失败，停止后续执行
            }

            const checkArr = [];
            this.codeList.forEach((item) => {
              checkArr.push(item.code);
            });
            checkArr.push(this.formData.code);
            // 判断checkArr中是否有重复项
            if (new Set(checkArr).size !== checkArr.length) {
              createError('主编号和扩展编号不能重复');
              return;
            }

            this.$emit('complete', {
              mainCode: this.formData.code,
              multiCodes: this.codeList.map((item) => {
                return item.code;
              }),
            });

            this.closeDialog();
          }
        });
      },
      // 页面显示时触发
      open() {
        // 初始化表单数据
        this.initFormData();
      },
      onGenerateCode(item) {
        generateCode(GENERATE_CODE_TYPE.PRODUCT.code).then((res) => {
          item.code = res;
        });
      },
      onDeleteExtCode(index) {
        this.codeList.splice(index, 1);
      },
    },
  });
</script>
