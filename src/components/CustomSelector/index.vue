<template>
  <div>
    <a-input
      v-model="label"
      read-only
      :disabled="disabled"
      :placeholder="config.placeholder || ''"
      class="dialog-table--input"
      @click.native="onOpen"
    >
      <a-icon slot="suffix" type="search" />
    </a-input>

    <a-modal
      v-if="loadedConfig"
      v-model="dialogVisible"
      :title="$utils.isEmpty(config.dialogTittle) ? '选择' : config.dialogTittle"
      :width="config.dialogWidth"
      :force-render="true"
      :mask-closable="false"
      :keyboard="false"
      :dialog-style="{ top: '20px' }"
    >
      <div>
        <custom-list ref="customList" :custom-list-id="config.customListId" @cellDblClick="doSelect" @loadedConfig="customListLoaded" />
      </div>

      <template slot="footer">
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
import CustomList from '@/components/CustomList'
export default {
  name: 'CustomSelector',
  components: {
    CustomList
  },
  props: {
    customSelectorId: {
      type: String,
      required: true
    },
    multiple: { type: Boolean, default: false },
    value: { type: [Object, Array], required: true },
    title: { type: String, default: '选择' },
    option: {
      type: Object, default: () => {
        return { label: 'name', value: 'id' }
      }
    },
    disabled: {
      type: Boolean,
      default: false
    },
    beforeOpen: {
      type: Function,
      default: e => {
        return () => {
          return true
        }
      }
    }
  },
  data() {
    return {
      loading: false,
      dialogVisible: false,
      label: undefined,
      loadedConfig: false,
      config: {}
    }
  },
  computed: {
  },
  watch: {
    customSelectorId(val) {
      this.initConfig()
    }
  },
  mounted() {
    this.initConfig()
  },
  methods: {
    async initConfig() {
      if (this.$utils.isEmpty(this.customSelectorId)) {
        return
      }
      const that = this
      await this.$api.development.gen.getCustomSelectorConfig(this.customSelectorId).then(res => {
        that.config = res

        this.loadedConfig = true
      })
    },
    onOpen() {
      if (this.disabled) {
        return
      }
      if (!this.loadedConfig) {
        return
      }
      const result = this.beforeOpen()
      if (this.$utils.isPromise(result)) {
        result.then(() => {
          this.dialogVisible = true
        })
      } else {
        if (result) {
          this.dialogVisible = true
        }
      }
    },
    clear() {
      this.label = undefined

      this.$emit('input', this.$refs.customList.getEmptyRecords(), this.value)

      this.$emit('clear')

      this.handleClose()
    },
    open() {
    },
    doSelect() {
      const selectData = this.$refs.customList.getSelectedRecords()
      this.label = selectData[this.config.nameColumn]
      this.$emit('input', selectData[this.config.idColumn], this.value)
      this.handleClose()
    },
    handleClose() {
      this.dialogVisible = false
    },
    customListLoaded() {
      if (!this.$utils.isEmpty(this.value)) {
        this.$refs.customList.getRecordsByIds(this.value).then(res => {
          const records = res
          if (this.$utils.isArray(records)) {
            this.label = records.map(item => item[this.config.nameColumn]).join(',')
          } else {
            this.label = records[this.config.nameColumn]
          }
        })
      }
    }
  }
}
</script>

<style lang="less">
.dialog-table--input {
  input {
    cursor: pointer;
  }
}
</style>
