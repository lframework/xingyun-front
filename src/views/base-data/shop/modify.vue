<template>
  <a-modal v-model="visible" :mask-closable="false" width="40%" title="修改" :dialog-style="{ top: '20px' }" :footer="null">
    <div v-if="visible" v-permission="['base-data:shop:modify']" v-loading="loading">
      <a-form-model ref="form" :label-col="{span: 4}" :wrapper-col="{span: 16}" :model="formData" :rules="rules">
        <a-form-model-item label="编号" prop="code">
          <a-input v-model="formData.code" allow-clear />
        </a-form-model-item>
        <a-form-model-item label="名称" prop="name">
          <a-input v-model="formData.name" allow-clear />
        </a-form-model-item>
        <a-form-model-item label="所属部门" prop="deptId">
          <sys-dept-selector v-model="formData.deptId" :only-final="false" />
        </a-form-model-item>
        <a-form-model-item label="位置" prop="location">
          <location-map ref="map" v-model="location" allow-clear />
        </a-form-model-item>
        <a-form-model-item label="状态" prop="available">
          <a-select v-model="formData.available" allow-clear>
            <a-select-option v-for="item in $enums.AVAILABLE.values()" :key="item.code" :value="item.code">{{ item.desc }}</a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item label="备注" prop="description">
          <a-textarea v-model="formData.description" allow-clear />
        </a-form-model-item>
        <div class="form-modal-footer">
          <a-space>
            <a-button type="primary" :loading="loading" html-type="submit" @click="submit">保存</a-button>
            <a-button :loading="loading" @click="closeDialog">取消</a-button>
          </a-space>
        </div>
      </a-form-model>
    </div>
  </a-modal>
</template>
<script>
import SysDeptSelector from '@/components/Selector/SysDeptSelector'
import LocationMap from '@/components/LocationMap'
import { validCode } from '@/utils/validate'
export default {
  // 使用组件
  components: {
    SysDeptSelector, LocationMap
  },
  props: {
    id: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      // 是否可见
      visible: false,
      // 是否显示加载框
      loading: false,
      // 表单数据
      formData: {},
      // 位置数据
      location: {},
      // 表单校验规则
      rules: {
        code: [
          { required: true, message: '请输入编号' },
          { validator: validCode }
        ],
        name: [
          { required: true, message: '请输入名称' }
        ],
        available: [
          { required: true, message: '请选择状态' }
        ]
      }
    }
  },
  created() {
    this.initFormData()
  },
  methods: {
    // 打开对话框 由父页面触发
    openDialog() {
      this.visible = true

      this.open()
    },
    // 关闭对话框
    closeDialog() {
      this.visible = false
      this.$emit('close')
    },
    // 初始化表单数据
    initFormData() {
      this.formData = {
        id: '',
        code: '',
        name: '',
        deptId: '',
        lng: '',
        lat: '',
        available: '',
        description: ''
      }
      this.location = {}
    },
    // 提交表单事件
    submit() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.loading = true
          const params = Object.assign({}, this.formData, this.location)
          this.$api.baseData.shop.modify(params).then(() => {
            this.$msg.success('修改成功！')
            this.$emit('confirm')
            this.visible = false
          }).finally(() => {
            this.loading = false
          })
        }
      })
    },
    // 页面显示时触发
    open() {
      // 初始化数据
      this.initFormData()

      // 查询数据
      this.loadFormData()
    },
    // 查询数据
    async loadFormData() {
      this.loading = true
      await this.$api.baseData.shop.get(this.id).then(data => {
        this.formData = data
        this.location = {
          lng: data.lng,
          lat: data.lat
        }
        this.$refs.map.initLocation()
      }).finally(() => {
        this.loading = false
      })
    }
  }
}
</script>
