<template>
  <div>
    <img v-if="disabled && !$utils.isEmpty(value)" :src="value" class="img-uploader-container" />
    <span v-else-if="disabled && $utils.isEmpty(value)"></span>
    <a-upload
      v-else
      accept="image/png, image/jpeg, image/bmp, image/jpg, image/gif"
      list-type="picture-card"
      :show-upload-list="true"
      v-model:file-list="fileList"
      :custom-request="onRequest"
      @preview="handlePreview"
      @change="handleChange"
    >
      <div v-if="fileList.length < 1">
        <a-icon style="font-size: 32px; color: #999" :type="loading ? 'loading' : 'picture'" />
        <div style="margin-top: 8px; color: #666"> 上传图片 </div>
      </div>
    </a-upload>
    <a-modal v-model:open="previewVisible" :footer="null" @cancel="handleCancel">
      <img style="width: 100%" :src="previewImage" />
    </a-modal>
  </div>
</template>
<script>
  import { defineComponent } from 'vue';
  import { defHttp } from '@/utils/http/axios';
  import * as api from '@/api/components';
  import { ContentTypeEnum } from '@/enums/httpEnum';

  export default defineComponent({
    name: 'JImgUpload',

    componentName: 'JImgUpload',

    props: {
      value: {
        type: String,
        required: true,
      },
      url: {
        type: [String, Function],
        default: (e) => {
          return api.uploadImage;
        },
      },
      region: {
        type: String,
        default: '',
      },
      method: {
        type: String,
        default: '',
      },
      params: {
        type: Object,
        default: () => {
          return {};
        },
      },
      disabled: {
        type: Boolean,
        default: false,
      },
    },
    data() {
      return {
        loading: false,
        previewVisible: false,
        fileList: [],
        previewImage: '',
      };
    },
    computed: {},
    watch: {
      value(val) {
        this.loadImg();
      },
    },
    mounted() {
      this.loadImg();
    },
    methods: {
      loadImg() {
        if (!this.$utils.isEmpty(this.value)) {
          this.fileList = [
            {
              url: this.value,
              uid: this.$utils.uuid(),
            },
          ];
        } else {
          this.fileList = [];
        }
      },
      handleCancel() {
        this.previewVisible = false;
      },
      handleChange(e) {
        if (this.$utils.isEmpty(e.fileList)) {
          this.fileList = [];
          this.$emit('update:value', undefined);
        }
      },
      async handlePreview(file) {
        if (!file.url && !file.preview) {
          file.preview = await this.$utils.readImg(file.originFileObj);
        }
        this.previewImage = file.url || file.preview;
        this.previewVisible = true;
      },
      onRequest(e) {
        this.loading = true;
        const requestPromise = this.$utils.isFunction(this.url) ? this.url : this.doRequest;
        requestPromise(
          {
            file: e.file,
          },
          this.params,
        )
          .then((res) => {
            e.onSuccess({ status: 'success' }, e.file);
            this.$emit('update:value', res);
          })
          .catch(() => {
            e.onError({ status: 'error' }, e.file);
            this.$emit('update:value', undefined);
          })
          .finally(() => {
            this.loading = false;
          });
      },
      doRequest(data) {
        return defHttp.request(
          {
            method: this.method,
            data,
            params: this.params,
          },
          {
            region: this.region,
            contentType: ContentTypeEnum.BLOB,
          },
        );
      },
    },
  });
</script>
