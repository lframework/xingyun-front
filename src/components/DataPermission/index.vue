<template>
  <a-modal
    v-model:open="visible"
    :mask-closable="false"
    width="40%"
    title="数据权限"
    :style="{ top: '20px' }"
    :footer="null"
  >
    <j-form :enable-collapse="false">
      <j-form-item
        v-for="item in $enums.SYS_DATA_PERMISSION_DATA_PERMISSION_TYPE.values()"
        :key="item.code"
        :label="item.desc + '数据权限'"
        :span="24"
      >
        <a @click="openDraggerDialog(item)">点此设置</a>
      </j-form-item>
    </j-form>
    <div class="form-modal-footer">
      <a-space>
        <a-button type="primary" :loading="loading" html-type="submit" @click="submit"
          >保存</a-button
        >
        <a-button :loading="loading" @click="closeDialog">取消</a-button>
      </a-space>
    </div>
    <data-permission-dragger
      v-for="item in $enums.SYS_DATA_PERMISSION_DATA_PERMISSION_TYPE_NAME.values()"
      :key="item.code"
      :ref="item.desc + 'DataPermission'"
      :model-id="item.code"
    />
  </a-modal>
</template>
<script>
  import { defineComponent } from 'vue';
  import DataPermissionDragger from '@/components/DataPermissionDragger/index.vue';
  import * as api from '@/api/system/data-permission';
  import * as modelDetailApi from '@/api/system/data-permission-model-detail';

  export default defineComponent({
    name: 'DataPermission',
    components: {
      DataPermissionDragger,
    },
    props: {
      bizId: {
        type: String,
        required: true,
      },
      bizType: {
        type: Number,
        required: true,
      },
    },
    data() {
      return {
        visible: false,
        loading: false,
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
      loadData() {
        const permissionTypes = this.$enums.SYS_DATA_PERMISSION_DATA_PERMISSION_TYPE_NAME.values();
        for (let i = 0; i < permissionTypes.length; i++) {
          const permissionType = permissionTypes[i];
          modelDetailApi.queryByBizId(this.bizId, this.bizType, permissionType.code).then((res) => {
            const model = res || [];
            this.$utils.eachTree(model, (item) => {
              if (!this.$utils.isEmpty(item.conditionTypes)) {
                item.conditionTypes = item.conditionTypes.map((conditionType) => {
                  return this.$enums.SYS_DATA_PERMISSION_MODEL_DETAIL_CONDITION_TYPE.getByCode(
                    conditionType,
                  );
                });
              }
            });
            this.$refs[permissionType.desc + 'DataPermission'][0].setModel(res || []);
          });
        }
      },
      // 页面显示时触发
      open() {
        // 初始化表单数据
        this.initFormData();
        this.loadData();
      },
      openDraggerDialog(permissionType) {
        this.$refs[
          this.$enums.SYS_DATA_PERMISSION_DATA_PERMISSION_TYPE_NAME.getDesc(permissionType.code) +
            'DataPermission'
        ][0].openDialog();
      },
      submit() {
        const permissionTypes = this.$enums.SYS_DATA_PERMISSION_DATA_PERMISSION_TYPE_NAME.values();
        const datas = [];
        for (let i = 0; i < permissionTypes.length; i++) {
          const permissionType = permissionTypes[i];
          if (!this.$refs[permissionType.desc + 'DataPermission'][0].validModel()) {
            this.$refs[permissionType.desc + 'DataPermission'][0].openDialog();
            break;
          }
          datas.push({
            bizIds: [this.bizId],
            bizType: this.bizType,
            permissionType: permissionType.code,
            permission: JSON.stringify(
              this.$refs[permissionType.desc + 'DataPermission'][0].getModel(),
            ),
          });
        }

        this.loading = true;
        api
          .save(datas)
          .then(() => {
            this.$msg.createSuccess('保存成功！');
            this.closeDialog();
          })
          .finally(() => {
            this.loading = false;
          });
      },
    },
  });
</script>
<style lang="less" scoped></style>
