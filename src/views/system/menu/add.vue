<template>
  <a-modal v-model:open="visible" :mask-closable="false" width="50%" title="新增" :footer="null">
    <div v-if="visible" v-permission="['system:menu:add']" v-loading="loading">
      <a-form
        ref="form"
        :label-col="{ span: 4 }"
        :wrapper-col="{ span: 16 }"
        :model="formData"
        :rules="rules"
      >
        <a-form-item label="编号" name="code">
          <a-input v-model:value.trim="formData.code" allow-clear />
        </a-form-item>
        <a-form-item label="标题" name="title">
          <a-input v-model:value.trim="formData.title" allow-clear />
        </a-form-item>
        <a-form-item label="类型" name="display">
          <a-radio-group v-model:value="formData.display" @change="displayChange">
            <a-radio
              v-for="item in $enums.MENU_DISPLAY.values()"
              :key="item.code"
              :value="item.code"
              >{{ item.desc }}</a-radio
            >
          </a-radio-group>
        </a-form-item>
        <a-form-item
          v-if="
            $enums.MENU_DISPLAY.CATALOG.equalsCode(formData.display) ||
            $enums.MENU_DISPLAY.FUNCTION.equalsCode(formData.display)
          "
          label="图标"
          name="icon"
        >
          <icon-picker v-model:value="formData.icon" />
        </a-form-item>
        <a-form-item label="父级菜单" name="parentId">
          <sys-menu-selector v-model:value="formData.parentId" :only-final="false" />
        </a-form-item>
        <a-form-item
          v-if="
            $enums.MENU_DISPLAY.FUNCTION.equalsCode(formData.display) ||
            $enums.MENU_DISPLAY.PERMISSION.equalsCode(formData.display)
          "
          label="权限"
          name="permission"
        >
          <a-input v-model:value.trim="formData.permission" allow-clear />
        </a-form-item>
        <a-form-item label="备注" name="description">
          <a-textarea v-model:value.trim="formData.description" />
        </a-form-item>
        <div
          v-if="
            !$utils.isEmpty(formData.display) &&
            !$enums.MENU_DISPLAY.PERMISSION.equalsCode(formData.display)
          "
        >
          <a-divider>以下均为前端配置项</a-divider>
          <a-form-item
            v-if="!$enums.MENU_DISPLAY.PERMISSION.equalsCode(formData.display)"
            label="路由名称"
            name="name"
          >
            <a-input
              v-model:value.trim="formData.name"
              placeholder="对应路由当中的name属性"
              allow-clear
            />
          </a-form-item>
          <a-form-item
            v-if="$enums.MENU_DISPLAY.FUNCTION.equalsCode(formData.display)"
            label="组件类型"
            name="componentType"
          >
            <a-select v-model:value="formData.componentType" allow-clear>
              <a-select-option
                v-for="item in $enums.MENU_COMPONENT_TYPE.values()"
                :key="item.code"
                :value="item.code"
                >{{ item.desc }}</a-select-option
              >
            </a-select>
          </a-form-item>
          <a-form-item
            v-if="
              $enums.MENU_DISPLAY.FUNCTION.equalsCode(formData.display) &&
              $enums.MENU_COMPONENT_TYPE.NORMAL.equalsCode(formData.componentType)
            "
            name="component"
          >
            <template #label>
              <a-space>
                <span>组件</span>
                <a-tooltip title="如果需要内嵌iframe页面，那么此处填写固定值：/iframes/index"
                  ><QuestionCircleOutlined
                /></a-tooltip>
              </a-space>
            </template>
            <a-input
              v-model:value.trim="formData.component"
              placeholder="对应路由当中的component属性"
              allow-clear
            />
          </a-form-item>
          <a-form-item
            v-if="
              $enums.MENU_DISPLAY.FUNCTION.equalsCode(formData.display) &&
              $enums.MENU_COMPONENT_TYPE.CUSTOM_LIST.equalsCode(formData.componentType)
            "
            label="自定义列表"
            name="customListId"
          >
            <gen-custom-list-selector
              v-model:value="formData.customListId"
              :request-params="{ available: true }"
            />
          </a-form-item>
          <a-form-item
            v-if="
              $enums.MENU_DISPLAY.FUNCTION.equalsCode(formData.display) &&
              $enums.MENU_COMPONENT_TYPE.CUSTOM_PAGE.equalsCode(formData.componentType)
            "
            label="自定义页面"
            name="customPageId"
          >
            <gen-custom-page-selector v-model:value="formData.customPageId" />
          </a-form-item>
          <a-form-item
            v-if="!$enums.MENU_DISPLAY.PERMISSION.equalsCode(formData.display)"
            name="path"
          >
            <template #label>
              <a-space>
                <span>路由路径</span>
                <a-tooltip
                  title="如果需要内嵌iframe页面，那么此处填写值规则：路由地址/src=iframe地址，例如：/baidu?src=https://www.baidu.com"
                  ><QuestionCircleOutlined
                /></a-tooltip>
              </a-space>
            </template>
            <a-input
              v-model:value.trim="formData.path"
              placeholder="对应路由当中的path属性"
              allow-clear
            />
          </a-form-item>
          <a-form-item
            v-if="$enums.MENU_DISPLAY.FUNCTION.equalsCode(formData.display)"
            label="是否不缓存"
            name="noCache"
          >
            <a-switch v-model:checked="formData.noCache" />
          </a-form-item>
          <a-form-item
            v-if="!$enums.MENU_DISPLAY.PERMISSION.equalsCode(formData.display)"
            label="是否隐藏"
            name="hidden"
          >
            <a-switch v-model:checked="formData.hidden" />
          </a-form-item>
          <a-divider />
        </div>
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
    <json-editor
      ref="requestParamEditor"
      v-model:value="formData.requestParam"
      :description="`参数应为对象的json字符串，如：{&quot;name&quot;: &quot;名称&quot;}。`"
    />
  </a-modal>
</template>
<script>
  import { defineComponent } from 'vue';
  import { validCode } from '@/utils/validate';
  import { IconPicker } from '@/components/Icon';
  import JsonEditor from './json-editor.vue';
  import { QuestionCircleOutlined } from '@ant-design/icons-vue';
  import * as api from '@/api/system/menu';

  export default defineComponent({
    components: {
      IconPicker,
      JsonEditor,
      QuestionCircleOutlined,
    },
    setup() {},
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
          code: [{ required: true, message: '请输入编号' }, { validator: validCode }],
          title: [{ required: true, message: '请输入标题' }],
          display: [{ required: true, message: '请选择类型' }],
          name: [{ required: true, message: '请输入路由名称' }],
          componentType: [{ required: true, message: '请选择组件类型' }],
          component: [{ required: true, message: '请输入组件' }],
          customListId: [{ required: true, message: '请选择自定义列表' }],
          customFormId: [{ required: true, message: '请选择自定义表单' }],
          customPageId: [{ required: true, message: '请选择自定义页面' }],
          path: [{ required: true, message: '请输入路由路径' }],
          noCache: [{ required: true, message: '请选择是否缓存' }],
          hidden: [{ required: true, message: '请选择是否隐藏' }],
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
          code: '',
          title: '',
          display: '',
          icon: '',
          parentId: '',
          permission: '',
          description: '',
          name: '',
          componentType: '',
          component: '',
          customListId: '',
          customFormId: '',
          customPageId: '',
          requestParam: '',
          path: '',
          noCache: false,
          hidden: false,
        };
      },
      // 提交表单事件
      submit() {
        this.$refs.form.validate().then((valid) => {
          if (valid) {
            this.loading = true;
            const params = Object.assign({}, this.formData);
            if (this.$enums.MENU_DISPLAY.FUNCTION.equalsCode(params.display)) {
              if (
                this.$enums.MENU_COMPONENT_TYPE.CUSTOM_LIST.equalsCode(this.formData.componentType)
              ) {
                params.component = params.customListId;
              } else if (
                this.$enums.MENU_COMPONENT_TYPE.CUSTOM_PAGE.equalsCode(this.formData.componentType)
              ) {
                params.component = params.customPageId;
              }
            }
            api
              .create(params)
              .then(() => {
                this.$msg.createSuccess('新增成功！');
                // 初始化表单数据
                this.initFormData();
                this.$emit('confirm');
                this.visible = false;
              })
              .finally(() => {
                this.loading = false;
              });
          }
        });
      },
      // 页面显示时由父页面触发
      open() {
        // 初始化表单数据
        this.initFormData();
      },
      // 类型选择器发生改变时
      displayChange(val) {
        if (this.$enums.MENU_DISPLAY.CATALOG.equalsCode(val)) {
          this.formData = Object.assign(this.formData, {
            componentType: undefined,
            component: '',
            noCache: true,
          });
        } else if (this.$enums.MENU_DISPLAY.PERMISSION.equalsCode(val)) {
          this.formData = Object.assign(this.formData, {
            name: '',
            path: '',
            hidden: false,
            componentType: undefined,
            component: '',
            noCache: true,
          });
        }
      },
    },
  });
</script>
