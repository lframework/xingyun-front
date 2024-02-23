<template>
  <a-modal
    v-model:open="visible"
    :mask-closable="false"
    width="80%"
    :style="{ top: '20px' }"
    title="选择"
  >
    <div v-permission="['logistics:sheet:add', 'logistics:sheet:modify']">
      <!-- 数据列表 -->
      <vxe-grid
        ref="grid"
        resizable
        show-overflow
        highlight-hover-row
        keep-source
        row-id="bizId"
        height="500"
        :proxy-config="proxyConfig"
        :columns="tableColumn"
        :toolbar-config="toolbarConfig"
        :checkbox-config="{
          trigger: 'row',
          highlight: true,
        }"
        :pager-config="{}"
        :loading="loading"
      >
        <template #form>
          <j-border>
            <j-form>
              <j-form-item label="业务单据号">
                <a-input v-model:value="searchFormData.code" allow-clear />
              </j-form-item>
              <j-form-item label="操作人">
                <user-selector v-model:value="searchFormData.createBy" />
              </j-form-item>
              <j-form-item label="操作日期" :content-nest="false">
                <div class="date-range-container">
                  <a-date-picker
                    v-model:value="searchFormData.createStartTime"
                    placeholder=""
                    value-format="YYYY-MM-DD 00:00:00"
                  />
                  <span class="date-split">至</span>
                  <a-date-picker
                    v-model:value="searchFormData.createEndTime"
                    placeholder=""
                    value-format="YYYY-MM-DD 23:59:59"
                  />
                </div>
              </j-form-item>
            </j-form>
          </j-border>
        </template>
        <!-- 工具栏 -->
        <template #toolbar_buttons>
          <a-space>
            <a-button type="primary" :icon="h(SearchOutlined)" @click="search">查询</a-button>
          </a-space>
        </template>
      </vxe-grid>
    </div>
    <template #footer>
      <a-space>
        <a-button :loading="loading" @click="closeDialog">取消</a-button>
        <a-button type="primary" :loading="loading" @click="submit">确定</a-button>
      </a-space>
    </template>
  </a-modal>
</template>
<script>
  import { h, defineComponent } from 'vue';
  import moment from 'moment/moment';
  import { SearchOutlined } from '@ant-design/icons-vue';
  import * as api from '@/api/sc/logistics/sheet';

  export default defineComponent({
    components: {},
    setup() {
      return {
        h,
        SearchOutlined,
      };
    },
    data() {
      return {
        visible: false,
        // 是否显示加载框
        loading: false,
        // 工具栏配置
        toolbarConfig: {
          slots: {
            buttons: 'toolbar_buttons',
          },
        },
        // 列表数据配置
        tableColumn: [
          { type: 'checkbox', width: 45 },
          { field: 'bizCode', title: '业务单据号', minWidth: 120 },
          {
            field: 'bizType',
            title: '业务类型',
            width: 120,
            formatter: ({ cellValue }) => {
              return this.$enums.LOGISTICS_SHEET_DETAIL_BIZ_TYPE.getDesc(cellValue);
            },
          },
          { field: 'scName', title: '仓库名称', width: 100 },
          { field: 'receiverName', title: '收货人', width: 120 },
          { field: 'createTime', title: '操作时间', width: 170 },
          { field: 'createBy', title: '操作人', width: 100 },
        ],
        // 查询列表的查询条件
        searchFormData: {
          code: '',
          createBy: '',
          createStartTime: this.$utils.formatDateTime(
            this.$utils.getDateTimeWithMinTime(moment().subtract(1, 'M')),
          ),
          createEndTime: this.$utils.formatDateTime(this.$utils.getDateTimeWithMaxTime(moment())),
        },
        // 请求接口配置
        proxyConfig: {
          props: {
            // 响应结果列表字段
            result: 'datas',
            // 响应结果总条数字段
            total: 'totalCount',
          },
          ajax: {
            // 查询接口
            query: ({ page }) => {
              return api.queryBizOrder(this.buildQueryParams(page));
            },
          },
        },
      };
    },
    computed: {},
    created() {
      this.initFormData();
    },
    methods: {
      // 列表发生查询时的事件
      search() {
        this.$refs.grid.commitProxy('reload');
      },
      // 打开对话框 由父页面触发
      openDialog() {
        // 初始化表单数据
        this.visible = true;

        this.$nextTick(() => this.open());
      },
      // 页面显示时触发
      open() {
        // 初始化表单数据
        this.initFormData();
      },
      // 关闭对话框
      closeDialog() {
        this.visible = false;
        this.$emit('close');
      },
      // 查询前构建查询参数结构
      buildQueryParams(page) {
        return Object.assign(
          {
            pageIndex: page.currentPage,
            pageSize: page.pageSize,
          },
          this.buildSearchFormData(),
        );
      },
      // 查询前构建具体的查询参数
      buildSearchFormData() {
        return Object.assign({}, this.searchFormData);
      },
      // 初始化表单数据
      initFormData() {},
      submit() {
        const records = this.$refs.grid.getCheckboxRecords();
        if (!this.$utils.isEmpty(records)) {
          this.$emit('confirm', records);
        }
        this.closeDialog();
      },
    },
  });
</script>
<style></style>
