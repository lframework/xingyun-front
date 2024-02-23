<template>
  <div>
    <a-input
      v-model:value="label"
      readonly
      :disabled="disabled"
      :placeholder="config.placeholder || ''"
      class="dialog-table--input"
      @click="onOpen"
    >
      <template #suffix>
        <SearchOutlined />
      </template>
    </a-input>

    <a-modal
      v-if="loadedConfig"
      v-model:open="dialogVisible"
      :title="$utils.isEmpty(config.dialogTittle) ? '选择' : config.dialogTittle"
      :width="config.dialogWidth"
      :force-render="true"
      :mask-closable="false"
      :keyboard="false"
      :style="{ top: '20px' }"
    >
      <div>
        <custom-list
          ref="customList"
          :custom-list-id="config.customListId"
          @cellDblClick="doSelect"
          @loadedConfig="customListLoaded"
        />
      </div>

      <template #footer>
        <div>
          <a-button @click="handleClose">取 消</a-button>
          <a-button :loading="loading" @click="clear">清 空</a-button>
          <a-button type="primary" :loading="loading" @click="doSelect">确 定</a-button>
        </div>
      </template>
    </a-modal>
  </div>
</template>
<script>
  import { defineComponent } from 'vue';
  import { SearchOutlined } from '@ant-design/icons-vue';
  import * as api from '@/api/development/gen/api';

  export default defineComponent({
    name: 'CustomSelector',
    components: {
      SearchOutlined,
    },
    props: {
      customSelectorId: {
        type: String,
        required: true,
      },
      value: { type: [Object, Array], required: true },
      disabled: {
        type: Boolean,
        default: false,
      },
      beforeOpen: {
        type: Function,
        default: (e) => {
          return () => {
            return true;
          };
        },
      },
    },
    data() {
      return {
        loading: false,
        dialogVisible: false,
        label: undefined,
        loadedConfig: false,
        config: {},
      };
    },
    computed: {},
    watch: {
      customSelectorId(val) {
        this.initConfig();
      },
    },
    mounted() {
      this.initConfig();
    },
    methods: {
      async initConfig() {
        if (this.$utils.isEmpty(this.customSelectorId)) {
          return;
        }
        const that = this;
        await api.getCustomSelectorConfig(this.customSelectorId).then((res) => {
          that.config = res;

          this.loadedConfig = true;
        });
      },
      onOpen() {
        if (this.disabled) {
          return;
        }
        if (!this.loadedConfig) {
          return;
        }
        const result = this.beforeOpen();
        if (this.$utils.isPromise(result)) {
          result.then(() => {
            this.dialogVisible = true;
          });
        } else {
          if (result) {
            this.dialogVisible = true;
          }
        }
      },
      clear() {
        this.label = undefined;

        this.$emit('update:value', this.$refs.customList.getEmptyRecords(), this.value);

        this.$emit('clear');

        this.handleClose();
      },
      open() {},
      doSelect() {
        const selectData = this.$refs.customList.getSelectedRecords();
        if (!this.$utils.isEmpty(selectData)) {
          this.label = selectData[this.config.nameColumn];
          this.$emit('update:value', selectData[this.config.idColumn], this.value);
        }
        this.handleClose();
      },
      handleClose() {
        this.dialogVisible = false;
      },
      customListLoaded() {
        if (!this.$utils.isEmpty(this.value)) {
          this.$refs.customList.getRecordsByIds(this.value).then((res) => {
            const records = res;
            if (this.$utils.isArray(records)) {
              this.label = records.map((item) => item[this.config.nameColumn]).join(',');
            } else {
              this.label = records[this.config.nameColumn];
            }
          });
        }
      },
    },
  });
</script>

<style lang="less">
  .dialog-table--input {
    input {
      cursor: pointer;
    }
  }
</style>
