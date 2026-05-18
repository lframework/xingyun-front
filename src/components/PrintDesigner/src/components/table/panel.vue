<template>
  <div>
    <a-form label-width="80px" :model="activeElement" size="mini" class="kr-form">
      <a-row>
        <a-col :span="24">
          <a-form-item label="显示列">
            <a-checkbox-group v-model:value="activeElement.selectCol" @change="changeCol">
              <a-row>
                <a-col v-for="col in activeElement.columnsAttr" :key="col.name" :span="12">
                  <a-checkbox :value="col.name">{{ col.title }}</a-checkbox>
                </a-col>
              </a-row>
            </a-checkbox-group>
          </a-form-item>
        </a-col>
      </a-row>
      <a-row>
        <a-col :span="12">
          <a-form-item label="字号">
            <a-input-number
              v-model:value="activeElement.style.FontSize"
              :min="1"
              class="min-input"
            />
          </a-form-item>
        </a-col>
      </a-row>
      <a-row>
        <a-col :span="12">
          <a-form-item label="字体颜色">
            <a-input v-model:value="activeElement.style.FontColor" />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="边框颜色">
            <a-input v-model:value="activeElement.style.borderColor" />
          </a-form-item>
        </a-col>
      </a-row>
      <a-row>
        <a-form-item label="对齐方式">
          <a-radio-group
            v-model:value="activeElement.style.Alignment"
            :options="[
              { label: '左对齐', value: 'left' },
              { label: '居中', value: 'center' },
              { label: '右对齐', value: 'right' },
            ]"
          />
        </a-form-item>
      </a-row>
      <a-row>
        <a-col :span="12">
          <a-form-item label="高度自动">
            <a-switch
              v-model:checked="activeElement.style.autoHeight"
              :active-value="true"
              :inactive-value="false"
            />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="下边距">
            <a-input-number
              :disabled="!activeElement.style.autoHeight"
              v-model:value="activeElement.style.BottomMargin"
              :min="0"
              class="min-input"
            />
          </a-form-item>
        </a-col>
      </a-row>
      <a-divider>表尾设置</a-divider>
      <a-row>
        <a-col :span="12">
          <a-form-item label="显示表尾">
            <a-switch
              v-model:checked="activeElement.footerEnabled"
              :active-value="true"
              :inactive-value="false"
            />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-button size="small" :disabled="!activeElement.footerEnabled" @click="addFooterRow">
            添加表尾行
          </a-button>
        </a-col>
      </a-row>
      <div v-if="activeElement.footerEnabled" class="footer-config">
        <div v-for="(row, rowIndex) in activeElement.footerRows" :key="rowIndex" class="footer-row">
          <div class="footer-row-header">
            <span>表尾行 {{ rowIndex + 1 }}</span>
            <div>
              <a-button size="small" @click="addFooterCell(row)">添加单元格</a-button>
              <a-button size="small" danger @click="removeFooterRow(rowIndex)">删除行</a-button>
            </div>
          </div>
          <div v-for="(cell, cellIndex) in row.cells" :key="cellIndex" class="footer-cell">
            <div class="footer-cell-main">
              <div class="footer-field">
                <a-form-item label="类型">
                  <a-select v-model:value="cell.type" size="small">
                    <a-select-option value="text">固定文本</a-select-option>
                    <a-select-option value="sum">金额合计</a-select-option>
                    <a-select-option value="numberSum">数字合计</a-select-option>
                    <a-select-option value="moneyUpper">金额大写</a-select-option>
                  </a-select>
                </a-form-item>
              </div>
              <div class="footer-field">
                <a-form-item :label="cell.type === 'text' ? '文本' : '列'">
                  <a-input v-if="cell.type === 'text'" v-model:value="cell.text" size="small" />
                  <a-select v-else v-model:value="cell.column" size="small">
                    <a-select-option
                      v-for="col in activeElement.columns"
                      :key="col.name"
                      :value="col.name"
                      >{{ col.title }}</a-select-option
                    >
                  </a-select>
                </a-form-item>
              </div>
            </div>
            <div class="footer-cell-grid">
              <div class="footer-field">
                <a-form-item label="跨列">
                  <a-input-number
                    v-model:value="cell.colspan"
                    :min="1"
                    :max="activeElement.columns.length || 1"
                    size="small"
                    class="min-input"
                  />
                </a-form-item>
              </div>
              <div class="footer-field">
                <a-form-item label="对齐">
                  <a-select v-model:value="cell.align" size="small">
                    <a-select-option value="left">左</a-select-option>
                    <a-select-option value="center">中</a-select-option>
                    <a-select-option value="right">右</a-select-option>
                  </a-select>
                </a-form-item>
              </div>
            </div>
            <div class="footer-cell-actions">
              <a-button size="small" danger @click="removeFooterCell(row, cellIndex)"
                >删除单元格</a-button
              >
            </div>
          </div>
        </div>
      </div>
    </a-form>
  </div>
</template>
<script>
  import { defineComponent } from 'vue';
  import { usePrintDesignerStore } from '../../store/printDesigner';

  export default defineComponent({
    setup() {
      const printDesignerStore = usePrintDesignerStore();
      return {
        printDesignerStore,
      };
    },
    data() {
      return {};
    },
    computed: {
      activeElement() {
        return this.printDesignerStore.activeElement;
      },
      // 页面高度
      height() {
        return this.printDesignerStore.page.height;
      },
    },
    methods: {
      changeCol() {
        let selectCol = [];
        this.activeElement.selectCol.forEach((itemName) => {
          let colInfo = this.activeElement.columnsAttr.find((col) => col.name === itemName);
          if (colInfo) {
            selectCol.push(colInfo);
          }
        });
        this.activeElement.columns = selectCol; //表格显示的字段
      },
      addFooterRow() {
        if (!this.activeElement.footerRows) {
          this.activeElement.footerRows = [];
        }

        this.activeElement.footerRows.push({
          cells: [this.createFooterCell()],
        });
      },
      removeFooterRow(rowIndex) {
        this.activeElement.footerRows.splice(rowIndex, 1);
      },
      addFooterCell(row) {
        row.cells.push(this.createFooterCell());
      },
      removeFooterCell(row, cellIndex) {
        row.cells.splice(cellIndex, 1);
      },
      createFooterCell() {
        return {
          type: 'text',
          text: '合计',
          column: this.activeElement.columns?.[0]?.name || '',
          colspan: 1,
          align: 'left',
        };
      },
    },
  });
</script>
<style lang="scss" scoped>
  .footer-config {
    border-top: 1px solid #e5e7eb;
    padding-top: 8px;
  }

  .footer-row {
    border: 1px solid #e5e7eb;
    border-radius: 4px;
    margin-bottom: 8px;
    padding: 8px;
  }

  .footer-row-header {
    display: flex;
    gap: 8px;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 8px;

    > div {
      display: flex;
      flex-shrink: 0;
      gap: 4px;
    }
  }

  .footer-cell {
    border-top: 1px dashed #d9d9d9;
    padding-top: 8px;
  }

  .footer-cell-main,
  .footer-cell-grid {
    display: grid;
    gap: 8px;
  }

  .footer-cell-main {
    grid-template-columns: 1fr;
  }

  .footer-cell-grid {
    grid-template-columns: 1fr 1fr;
  }

  .footer-field {
    min-width: 0;

    :deep(.ant-form-item) {
      margin-bottom: 8px;
    }
  }

  .footer-field :deep(.ant-select),
  .footer-field :deep(.ant-input),
  .footer-field :deep(.ant-input-number) {
    width: 100%;
  }

  .footer-cell-actions {
    text-align: right;
  }
</style>
