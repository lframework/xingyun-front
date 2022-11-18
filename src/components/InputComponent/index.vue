<template>
  <a-input v-if="$enums.GEN_VIEW_TYPE.INPUT.equalsCode(queryParam.viewType)" v-model="formData" allow-clear />
  <a-textarea v-else-if="$enums.GEN_VIEW_TYPE.TEXTAREA.equalsCode(queryParam.viewType)" v-model="formData" allow-clear />
  <a-date-picker
    v-else-if="$enums.GEN_VIEW_TYPE.DATETIME.equalsCode(queryParam.viewType)"
    v-model="formData"
    placeholder=""
    value-format="YYYY-MM-DD HH:mm:ss"
    show-time
  />
  <a-date-picker
    v-else-if="$enums.GEN_VIEW_TYPE.DATE.equalsCode(queryParam.viewType)"
    v-model="formData"
    placeholder=""
    value-format="YYYY-MM-DD"
  />
  <a-time-picker
    v-else-if="$enums.GEN_VIEW_TYPE.TIME.equalsCode(queryParam.viewType)"
    v-model="formData"
    placeholder=""
    value-format="HH:mm:ss"
  />
  <div v-else-if="$enums.GEN_VIEW_TYPE.SELECT.equalsCode(queryParam.viewType)">
    <div v-if="queryParam.fixEnum">
      <a-select v-model="formData" allow-clear>
        <a-select-option v-for="item in $enums[queryParam.frontType].values()" :key="item.code" :value="item.code">{{ item.desc }}</a-select-option>
      </a-select>
    </div>
    <div v-else>
      <div v-if="queryParam.hasAvailableTag">
        <a-select v-model="formData" allow-clear>
          <a-select-option v-for="item in $enums.AVAILABLE.values()" :key="item.code" :value="item.code">{{ item.desc }}</a-select-option>
        </a-select>
      </div>
      <div v-else>
        <a-select v-model="formData" allow-clear>
          <a-select-option :value="true">是</a-select-option>
          <a-select-option :value="false">否</a-select-option>
        </a-select>
      </div>
    </div>
  </div>
  <div v-else-if="$enums.GEN_VIEW_TYPE.DATE_RANGE.equalsCode(queryParam.viewType)">
    <div v-if="$enums.GEN_DATA_TYPE.LOCAL_DATE_TIME.equalsCode(queryParam.dataType)" class="date-range-container">
      <a-date-picker
        v-model="formDataStart"
        placeholder=""
        value-format="YYYY-MM-DD 00:00:00"
      />
      <span class="date-split">至</span>
      <a-date-picker
        v-model="formDataEnd"
        placeholder=""
        value-format="YYYY-MM-DD 23:59:59"
      />
    </div>
    <div v-else class="date-range-container">
      <a-date-picker
        v-model="formDataStart"
        placeholder=""
        show-time
        value-format="YYYY-MM-DD HH:mm:ss"
      />
      <span class="date-split">至</span>
      <a-date-picker
        v-model="formDataEnd"
        placeholder=""
        show-time
        value-format="YYYY-MM-DD HH:mm:ss"
      />
    </div>
  </div>
  <data-dic-picker v-else-if="$enums.GEN_VIEW_TYPE.DATA_DIC.equalsCode(queryParam.viewType)" v-model="formData" :code="queryParam.dataDicCode" />
</template>
<script>

export default {
  name: 'InputComponent',
  props: {
    queryParam: {
      type: Object,
      required: true
    },
    searchCondition: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      formData: undefined,
      formDataStart: undefined,
      formDataEnd: undefined
    }
  },
  watch: {
    formData(val) {
      if (!this.$enums.GEN_VIEW_TYPE.DATE_RANGE.equalsCode(this.queryParam.viewType)) {
        this.searchCondition[this.queryParam.tableAlias + '_' + this.queryParam.columnName] = this.buildData(val, 0)
      }
    },
    formDataStart(val) {
      if (this.$enums.GEN_VIEW_TYPE.DATE_RANGE.equalsCode(this.queryParam.viewType)) {
        this.searchCondition[this.queryParam.tableAlias + '_' + this.queryParam.columnName + '_Start'] = this.buildData(val, 1)
      }
    },
    formDataEnd(val) {
      if (this.$enums.GEN_VIEW_TYPE.DATE_RANGE.equalsCode(this.queryParam.viewType)) {
        this.searchCondition[this.queryParam.tableAlias + '_' + this.queryParam.columnName + '_End'] = this.buildData(val, 2)
      }
    }
  },
  mounted() {
    if (!this.$enums.GEN_VIEW_TYPE.DATE_RANGE.equalsCode(this.queryParam.viewType)) {
      if (!this.$utils.isEmpty(this.queryParam.defaultValue)) {
        this.formData = this.queryParam.defaultValue
      }
    } else {
      if (!this.$utils.isEmpty(this.queryParam.defaultValue)) {
        this.formDataStart = this.$utils.formatDateTime(this.$utils.getDateTimeWithMinTime(this.$utils.getCurrentDate().add(-this.queryParam.defaultValue, 'd')))
        this.formDataEnd = this.$utils.formatDateTime(this.$utils.getDateTimeWithMaxTime(this.$utils.getCurrentDate()))
      }
    }
  },
  methods: {
    buildData(val, type) {
      const obj = {
        tableAlias: this.queryParam.tableAlias,
        columnName: this.queryParam.columnName,
        queryType: this.queryParam.queryType
      }

      if (this.$enums.GEN_VIEW_TYPE.DATE_RANGE.equalsCode(this.queryParam.viewType)) {
        if (type === 1) {
          obj.queryType = this.$enums.GEN_QUERY_TYPE.GE.code
        } else if (type === 2) {
          obj.queryType = this.$enums.GEN_QUERY_TYPE.LE.code
        }
      }

      if (this.$enums.GEN_QUERY_TYPE.IN.equalsCode(this.queryParam.queryType)) {
        obj.values = val
      } else if (this.$enums.GEN_QUERY_TYPE.NOT_IN.equalsCode(this.queryParam.queryType)) {
        obj.values = val
      } else if (this.$enums.GEN_QUERY_TYPE.LEFT_LIKE.equalsCode(this.queryParam.queryType)) {
        obj.value = val
      } else if (this.$enums.GEN_QUERY_TYPE.RIGHT_LIKE.equalsCode(this.queryParam.queryType)) {
        obj.value = val
      } else if (this.$enums.GEN_QUERY_TYPE.AROUND_LIKE.equalsCode(this.queryParam.queryType)) {
        obj.value = val
      } else {
        obj.value = val
      }

      return obj
    }
  }
}
</script>
