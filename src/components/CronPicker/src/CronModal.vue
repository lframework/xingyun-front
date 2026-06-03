<template>
  <a-modal
    title="Cron表达式"
    :width="modalWidth"
    v-model:open="visible"
    :confirm-loading="confirmLoading"
    cancel-text="关闭"
    :destroy-on-close="true"
    @ok="handleSubmit"
    @cancel="close"
  >
    <div class="card-container">
      <a-tabs type="card">
        <a-tab-pane key="1" type="card">
          <template #tab>
            <span> <ScheduleOutlined />秒 </span>
          </template>
          <a-radio-group
            v-model:value="result.second.cronEvery"
            @change="selectCronOption('second', result.second.cronEvery)"
          >
            <a-row>
              <a-col :span="24">
                <a-radio value="1">每一秒钟</a-radio>
              </a-col>
            </a-row>
            <a-row>
              <a-col :span="24">
                <a-radio value="2">
                  <a-space>
                    从
                    <a-input-number
                      v-model:value="result.second.incrementStart"
                      size="small"
                      :min="0"
                      :max="59"
                      @focus="selectCronOption('second', '2')"
                    />秒开始, 每隔
                    <a-input-number
                      v-model:value="result.second.incrementIncrement"
                      size="small"
                      :min="1"
                      :max="60"
                      @focus="selectCronOption('second', '2')"
                    />秒执行
                  </a-space>
                </a-radio>
              </a-col>
            </a-row>
            <a-row>
              <a-col :span="24">
                <a-radio value="3">
                  <a-space>
                    具体秒数(可多选)
                    <a-select
                      v-model:value="result.second.specificSpecific"
                      style="width: 354px"
                      size="small"
                      mode="multiple"
                      @focus="selectCronOption('second', '3')"
                    >
                      <a-select-option v-for="(val, index) in 60" :key="index" :value="index">{{
                        index
                      }}</a-select-option>
                    </a-select>
                  </a-space>
                </a-radio>
              </a-col>
            </a-row>
            <a-row>
              <a-col :span="24">
                <a-radio value="4">
                  <a-space>
                    周期从
                    <a-input-number
                      v-model:value="result.second.rangeStart"
                      size="small"
                      :min="0"
                      :max="59"
                      @focus="selectCronOption('second', '4')"
                    />到
                    <a-input-number
                      v-model:value="result.second.rangeEnd"
                      size="small"
                      :min="0"
                      :max="59"
                      @focus="selectCronOption('second', '4')"
                    />秒
                  </a-space>
                </a-radio>
              </a-col>
            </a-row>
          </a-radio-group>
        </a-tab-pane>
        <a-tab-pane key="2">
          <template #tab>
            <span> <ScheduleOutlined />分 </span>
          </template>
          <a-radio-group
            v-model:value="result.minute.cronEvery"
            @change="selectCronOption('minute', result.minute.cronEvery)"
          >
            <a-row
              ><a-col :span="24"> <a-radio value="1">每一分钟</a-radio></a-col>
            </a-row>
            <a-row
              ><a-col :span="24">
                <a-radio value="2">
                  <a-space>
                    从
                    <a-input-number
                      v-model:value="result.minute.incrementStart"
                      size="small"
                      :min="0"
                      :max="59"
                      @focus="selectCronOption('minute', '2')"
                    />分开始, 每隔
                    <a-input-number
                      v-model:value="result.minute.incrementIncrement"
                      size="small"
                      :min="1"
                      :max="59"
                      @focus="selectCronOption('minute', '2')"
                    />分执行
                  </a-space>
                </a-radio></a-col
              >
            </a-row>
            <a-row
              ><a-col :span="24">
                <a-radio value="3">
                  <a-space>
                    具体分钟数(可多选)
                    <a-select
                      v-model:value="result.minute.specificSpecific"
                      style="width: 340px"
                      size="small"
                      mode="multiple"
                      @focus="selectCronOption('minute', '3')"
                    >
                      <a-select-option
                        v-for="(val, index) in Array(60)"
                        :key="index"
                        :value="index"
                        >{{ index }}</a-select-option
                      >
                    </a-select>
                  </a-space>
                </a-radio></a-col
              >
            </a-row>
            <a-row
              ><a-col :span="24">
                <a-radio value="4">
                  <a-space>
                    周期从
                    <a-input-number
                      v-model:value="result.minute.rangeStart"
                      size="small"
                      :min="0"
                      :max="59"
                      @focus="selectCronOption('minute', '4')"
                    />到
                    <a-input-number
                      v-model:value="result.minute.rangeEnd"
                      size="small"
                      :min="0"
                      :max="59"
                      @focus="selectCronOption('minute', '4')"
                    />分
                  </a-space>
                </a-radio></a-col
              >
            </a-row>
          </a-radio-group>
        </a-tab-pane>
        <a-tab-pane key="3">
          <template #tab>
            <span> <ScheduleOutlined />时 </span>
          </template>
          <div class="tabBody">
            <a-radio-group
              v-model:value="result.hour.cronEvery"
              @change="selectCronOption('hour', result.hour.cronEvery)"
            >
              <a-row
                ><a-col :span="24"> <a-radio value="1">每一小时</a-radio></a-col>
              </a-row>
              <a-row
                ><a-col :span="24">
                  <a-radio value="2">
                    <a-space>
                      从
                      <a-input-number
                        v-model:value="result.hour.incrementStart"
                        size="small"
                        :min="0"
                        :max="23"
                        @focus="selectCronOption('hour', '2')"
                      />点开始, 每隔
                      <a-input-number
                        v-model:value="result.hour.incrementIncrement"
                        size="small"
                        :min="1"
                        :max="23"
                        @focus="selectCronOption('hour', '2')"
                      />小时执行
                    </a-space>
                  </a-radio></a-col
                >
              </a-row>
              <a-row
                ><a-col :span="24">
                  <a-radio class="long" value="3">
                    <a-space>
                      具体小时数(可多选)
                      <a-select
                        v-model:value="result.hour.specificSpecific"
                        style="width: 340px"
                        size="small"
                        mode="multiple"
                        @focus="selectCronOption('hour', '3')"
                      >
                        <a-select-option
                          v-for="(val, index) in Array(24)"
                          :key="index"
                          :value="index"
                        >
                          {{ index }}
                        </a-select-option>
                      </a-select>
                    </a-space>
                  </a-radio></a-col
                >
              </a-row>
              <a-row
                ><a-col :span="24">
                  <a-radio value="4">
                    <a-space>
                      周期从
                      <a-input-number
                        v-model:value="result.hour.rangeStart"
                        size="small"
                        :min="0"
                        :max="23"
                        @focus="selectCronOption('hour', '4')"
                      />点到
                      <a-input-number
                        v-model:value="result.hour.rangeEnd"
                        size="small"
                        :min="0"
                        :max="23"
                        @focus="selectCronOption('hour', '4')"
                      />点
                    </a-space>
                  </a-radio></a-col
                >
              </a-row>
            </a-radio-group>
          </div>
        </a-tab-pane>
        <a-tab-pane key="4">
          <template #tab>
            <span> <ScheduleOutlined />天 </span>
          </template>
          <a-radio-group
            v-model:value="result.day.cronEvery"
            @change="selectCronOption('day', result.day.cronEvery)"
          >
            <a-row
              ><a-col :span="24"> <a-radio value="1">每一天</a-radio></a-col>
            </a-row>
            <a-row
              ><a-col :span="24">
                <a-radio value="3">
                  <a-space>
                    从
                    <a-input-number
                      v-model:value="result.day.incrementStart"
                      size="small"
                      :min="1"
                      :max="31"
                      @focus="selectCronOption('day', '3')"
                    />号开始, 每隔
                    <a-input-number
                      v-model:value="result.day.incrementIncrement"
                      size="small"
                      :min="1"
                      :max="31"
                      @focus="selectCronOption('day', '3')"
                    />天执行
                  </a-space>
                </a-radio></a-col
              >
            </a-row>
            <a-row
              ><a-col :span="24">
                <a-radio class="long" value="4">
                  <a-space>
                    具体星期几(可多选)
                    <a-select
                      v-model:value="result.week.specificSpecific"
                      style="width: 340px"
                      size="small"
                      mode="multiple"
                      @focus="selectCronOption('day', '4')"
                    >
                      <a-select-option
                        v-for="(val, index) in Array(7)"
                        :key="index"
                        :value="index + 1"
                        >{{ weekDays[index] }}</a-select-option
                      >
                    </a-select>
                  </a-space>
                </a-radio></a-col
              >
            </a-row>
            <a-row
              ><a-col :span="24">
                <a-radio class="long" value="5">
                  <a-space>
                    具体哪天(可多选)
                    <a-select
                      v-model:value="result.day.specificSpecific"
                      style="width: 354px"
                      size="small"
                      mode="multiple"
                      @focus="selectCronOption('day', '5')"
                    >
                      <a-select-option
                        v-for="(val, index) in Array(31)"
                        :key="index"
                        :value="index + 1"
                        >{{ index + 1 }}</a-select-option
                      >
                    </a-select>
                  </a-space>
                </a-radio></a-col
              >
            </a-row>
            <a-row
              ><a-col :span="24"> <a-radio value="6">在这个月的最后一天</a-radio></a-col>
            </a-row>
            <a-row
              ><a-col :span="24"> <a-radio value="7">在这个月的最后一个工作日</a-radio></a-col>
            </a-row>
            <a-row
              ><a-col :span="24">
                <a-radio value="8">
                  <a-space>
                    在这个月的最后一个
                    <a-select
                      v-model:value="result.week.cronLastSpecificDomDay"
                      size="small"
                      @focus="selectCronOption('day', '8')"
                    >
                      <a-select-option
                        v-for="(val, index) in Array(7)"
                        :key="index"
                        :value="index + 1"
                        >{{ weekDays[index] }}</a-select-option
                      >
                    </a-select>
                  </a-space>
                </a-radio></a-col
              >
            </a-row>
            <a-row
              ><a-col :span="24">
                <a-radio value="9">
                  <a-space>
                    在本月底前
                    <a-input-number
                      v-model:value="result.day.cronDaysBeforeEomMinus"
                      size="small"
                      :min="1"
                      :max="31"
                      @focus="selectCronOption('day', '9')"
                    />天
                  </a-space>
                </a-radio></a-col
              >
            </a-row>
            <a-row
              ><a-col :span="24">
                <a-radio value="10">
                  <a-space>
                    距离本月
                    <a-input-number
                      v-model:value="result.day.cronDaysNearestWeekday"
                      size="small"
                      :min="1"
                      :max="31"
                      @focus="selectCronOption('day', '10')"
                    />日最近的工作日（周一至周五）
                  </a-space>
                </a-radio></a-col
              >
            </a-row>
            <a-row
              ><a-col :span="24">
                <a-radio value="11">
                  <a-space>
                    在这个月的第
                    <a-input-number
                      v-model:value="result.week.cronNthDayNth"
                      size="small"
                      :min="1"
                      :max="5"
                      @focus="selectCronOption('day', '11')"
                    />个
                    <a-select
                      v-model:value="result.week.cronNthDayDay"
                      size="small"
                      @focus="selectCronOption('day', '11')"
                    >
                      <a-select-option
                        v-for="(val, index) in Array(7)"
                        :key="index"
                        :value="index + 1"
                        >{{ weekDays[index] }}</a-select-option
                      >
                    </a-select>
                  </a-space>
                </a-radio></a-col
              >
            </a-row>
            <!-- 周期 星期几 mark1 -->
            <a-row
              ><a-col :span="24">
                <a-radio value="12">
                  <a-space>
                    周期从
                    <a-select
                      v-model:value="result.week.rangeStart"
                      size="small"
                      @focus="selectCronOption('day', '12')"
                    >
                      <a-select-option
                        v-for="(val, index) in Array(7)"
                        :key="index"
                        :value="index + 1"
                        >{{ weekDays[index] }}</a-select-option
                      >
                    </a-select>
                    到
                    <a-select
                      v-model:value="result.week.rangeEnd"
                      size="small"
                      @focus="selectCronOption('day', '12')"
                    >
                      <a-select-option
                        v-for="(val, index) in Array(7)"
                        :key="index"
                        :value="index + 1"
                        >{{ weekDays[index] }}</a-select-option
                      >
                    </a-select>
                  </a-space>
                </a-radio></a-col
              >
            </a-row>
            <!-- 天的周期mark2  -->
            <a-row
              ><a-col :span="24">
                <a-radio value="13">
                  <a-space>
                    周期从
                    <a-input-number
                      v-model:value="result.day.rangeStart"
                      size="small"
                      :min="1"
                      :max="31"
                      @focus="selectCronOption('day', '13')"
                    />
                    号到
                    <a-input-number
                      v-model:value="result.day.rangeEnd"
                      size="small"
                      :min="1"
                      :max="31"
                      @focus="selectCronOption('day', '13')"
                    />号
                  </a-space>
                </a-radio></a-col
              >
            </a-row>
          </a-radio-group>
        </a-tab-pane>
        <a-tab-pane key="5">
          <template #tab>
            <span> <ScheduleOutlined />月 </span>
          </template>
          <a-radio-group
            v-model:value="result.month.cronEvery"
            @change="selectCronOption('month', result.month.cronEvery)"
          >
            <a-row
              ><a-col :span="24"> <a-radio value="1">每一月</a-radio></a-col>
            </a-row>
            <a-row
              ><a-col :span="24">
                <a-radio value="2">
                  <a-space>
                    从
                    <a-input-number
                      v-model:value="result.month.incrementStart"
                      size="small"
                      :min="1"
                      :max="12"
                      @focus="selectCronOption('month', '2')"
                    />月开始, 每隔
                    <a-input-number
                      v-model:value="result.month.incrementIncrement"
                      size="small"
                      :min="1"
                      :max="12"
                      @focus="selectCronOption('month', '2')"
                    />月执行
                  </a-space>
                </a-radio></a-col
              >
            </a-row>
            <a-row
              ><a-col :span="24">
                <a-radio class="long" value="3">
                  <a-space>
                    具体月数(可多选)
                    <a-select
                      v-model:value="result.month.specificSpecific"
                      style="width: 354px"
                      size="small"
                      filterable
                      mode="multiple"
                      @focus="selectCronOption('month', '3')"
                    >
                      <a-select-option
                        v-for="(val, index) in Array(12)"
                        :key="index"
                        :value="index + 1"
                        >{{ index + 1 }}</a-select-option
                      >
                    </a-select>
                  </a-space>
                </a-radio></a-col
              >
            </a-row>
            <a-row
              ><a-col :span="24">
                <a-radio value="4">
                  <a-space>
                    周期从
                    <a-input-number
                      v-model:value="result.month.rangeStart"
                      size="small"
                      :min="1"
                      :max="12"
                      @focus="selectCronOption('month', '4')"
                    />月到
                    <a-input-number
                      v-model:value="result.month.rangeEnd"
                      size="small"
                      :min="1"
                      :max="12"
                      @focus="selectCronOption('month', '4')"
                    />月
                  </a-space>
                </a-radio></a-col
              >
            </a-row>
          </a-radio-group>
        </a-tab-pane>
        <a-tab-pane key="6">
          <template #tab>
            <span> <ScheduleOutlined />年 </span>
          </template>
          <a-radio-group
            v-model:value="result.year.cronEvery"
            @change="selectCronOption('year', result.year.cronEvery)"
          >
            <a-row
              ><a-col :span="24"> <a-radio value="1">每一年</a-radio></a-col>
            </a-row>
            <a-row
              ><a-col :span="24">
                <a-radio value="2">
                  <a-space>
                    从
                    <a-input-number
                      v-model:value="result.year.incrementStart"
                      size="small"
                      :min="2021"
                      :max="2121"
                      @focus="selectCronOption('year', '2')"
                    />年开始, 每隔
                    <a-input-number
                      v-model:value="result.year.incrementIncrement"
                      size="small"
                      :min="1"
                      :max="99"
                      @focus="selectCronOption('year', '2')"
                    />年执行
                  </a-space>
                </a-radio></a-col
              >
            </a-row>
            <a-row
              ><a-col :span="24">
                <a-radio class="long" value="3">
                  <a-space>
                    具体年份(可多选)
                    <a-select
                      v-model:value="result.year.specificSpecific"
                      style="width: 354px"
                      size="small"
                      filterable
                      mode="multiple"
                      @focus="selectCronOption('year', '3')"
                    >
                      <a-select-option
                        v-for="(val, index) in Array(100)"
                        :key="index"
                        :value="2021 + index"
                        >{{ 2021 + index }}</a-select-option
                      >
                    </a-select>
                  </a-space>
                </a-radio></a-col
              >
            </a-row>
            <a-row
              ><a-col :span="24">
                <a-radio value="4">
                  <a-space>
                    周期从
                    <a-input-number
                      v-model:value="result.year.rangeStart"
                      size="small"
                      :min="2021"
                      :max="2121"
                      @focus="selectCronOption('year', '4')"
                    />年到
                    <a-input-number
                      v-model:value="result.year.rangeEnd"
                      size="small"
                      :min="2021"
                      :max="2121"
                      @focus="selectCronOption('year', '4')"
                    />年
                  </a-space>
                </a-radio></a-col
              >
            </a-row>
          </a-radio-group>
        </a-tab-pane>
      </a-tabs>
      <div class="bottom">
        <a-space direction="vertical" size="large">
          <a-space>
            <a-input :value="secondsText" readonly>
              <template #addonAfter>
                <span>秒</span>
              </template>
            </a-input>
            <a-input :value="minutesText" readonly>
              <template #addonAfter>
                <span>分</span>
              </template>
            </a-input>
            <a-input :value="hoursText" readonly>
              <template #addonAfter>
                <span>时</span>
              </template>
            </a-input>
            <a-input :value="daysText" readonly>
              <template #addonAfter>
                <span>日</span>
              </template>
            </a-input>
            <a-input :value="monthsText" readonly>
              <template #addonAfter>
                <span>月</span>
              </template>
            </a-input>
            <a-input :value="weeksText" readonly>
              <template #addonAfter>
                <span>星期</span>
              </template>
            </a-input>
            <a-input :value="yearsText" readonly>
              <template #addonAfter>
                <span>年</span>
              </template>
            </a-input>
          </a-space>
          <a-row>
            <a-col :span="6" />
            <a-col :span="12">
              <a-input-search
                v-model:value="reserveText"
                enter-button="反解析到UI"
                @search="onReserveParse"
              />
            </a-col>
            <a-col :span="6" />
          </a-row>
        </a-space>
      </div>
    </div>
  </a-modal>
</template>
<script>
  import { defineComponent } from 'vue';
  import { ScheduleOutlined } from '@ant-design/icons-vue';
  import { isEmpty } from '@/utils/utils';
  import {
    applyCronSelection,
    buildCronExpression,
    buildCronFields,
    createDefaultCronResult,
    normalizeEverySelections,
    normalizeCronExpression,
  } from './cronUtils.mjs';

  export default defineComponent({
    name: 'CronModal',
    components: {
      ScheduleOutlined,
    },
    props: {
      data: {
        type: String,
        default: '',
      },
    },
    data() {
      return {
        visible: false,
        confirmLoading: false,
        size: 'large',
        weekDays: ['天', '一', '二', '三', '四', '五', '六'].map((val) => '星期' + val),
        result: {
          second: {},
          minute: {},
          hour: {},
          day: {},
          week: {},
          month: {},
          year: {},
        },
        defaultValue: createDefaultCronResult(),
        reserveText: '',
      };
    },
    computed: {
      modalWidth() {
        return 1000;
      },
      cronFields() {
        return buildCronFields(this.result);
      },
      secondsText() {
        return this.cronFields.seconds;
      },
      minutesText() {
        return this.cronFields.minutes;
      },
      hoursText() {
        return this.cronFields.hours;
      },
      daysText() {
        return this.cronFields.days;
      },
      weeksText() {
        return this.cronFields.weeks;
      },
      monthsText() {
        return this.cronFields.months;
      },
      yearsText() {
        return this.cronFields.years;
      },
      cron() {
        return buildCronExpression(this.result);
      },
    },
    watch: {
      visible: {
        handler() {
          const label = normalizeCronExpression(this.data);
          if (label) {
            this.secondsReverseExp(label);
            this.minutesReverseExp(label);
            this.hoursReverseExp(label);
            this.daysReverseExp(label);
            this.monthsReverseExp(label);
            this.yearReverseExp(label);
            normalizeEverySelections(this.result, label);
          } else {
            this.result = createDefaultCronResult();
          }
        },
      },
    },
    methods: {
      selectCronOption(unit, cronEvery) {
        applyCronSelection(this.result, unit, cronEvery);
      },
      show() {
        this.visible = true;
      },
      handleSubmit() {
        this.$emit('setCron', this.cron);
        this.close();
        // this.visible = false;
      },
      close() {
        this.visible = false;
      },
      secondsReverseExp(seconds) {
        const val = seconds.split(' ')[0];
        // alert(val);
        const second = {
          cronEvery: '',
          incrementStart: 3,
          incrementIncrement: 5,
          rangeStart: 0,
          rangeEnd: 0,
          specificSpecific: [],
        };
        switch (true) {
          case val.includes('*'):
            second.cronEvery = '1';
            break;
          case val.includes('/'):
            second.cronEvery = '2';
            second.incrementStart = val.split('/')[0];
            second.incrementIncrement = val.split('/')[1];
            break;
          case val.includes(','):
            second.cronEvery = '3';
            second.specificSpecific = val.split(',').map(Number).sort();
            break;
          case val.includes('-'):
            second.cronEvery = '4';
            second.rangeStart = val.split('-')[0];
            second.rangeEnd = val.split('-')[1];
            break;
          // 放到最后
          case toString.call(Number(val)) === '[object Number]':
            // console.log('数字') 多选框但是只单选一个时间
            second.cronEvery = '3';
            second.specificSpecific = [Number(val)];
            break;
          default:
            // console.log('默认值')
            second.cronEvery = '1';
        }
        this.result.second = second;
      },
      minutesReverseExp(minutes) {
        const val = minutes.split(' ')[1];
        const minute = {
          cronEvery: '',
          incrementStart: 3,
          incrementIncrement: 5,
          rangeStart: 0,
          rangeEnd: 0,
          specificSpecific: [],
        };
        switch (true) {
          case val.includes('*'):
            minute.cronEvery = '1';
            break;
          case val.includes('/'):
            minute.cronEvery = '2';
            minute.incrementStart = val.split('/')[0];
            minute.incrementIncrement = val.split('/')[1];
            break;
          case val.includes(','):
            minute.cronEvery = '3';
            minute.specificSpecific = val.split(',').map(Number).sort();
            break;
          case val.includes('-'):
            minute.cronEvery = '4';
            minute.rangeStart = val.split('-')[0];
            minute.rangeEnd = val.split('-')[1];
            break;
          // 放到最后
          case toString.call(Number(val)) === '[object Number]':
            // console.log('数字') 多选框但是只单选一个时间
            minute.cronEvery = '3';
            minute.specificSpecific = [Number(val)];
            break;
          default:
            minute.cronEvery = '1';
        }
        this.result.minute = minute;
      },
      hoursReverseExp(hours) {
        const val = hours.split(' ')[2];
        const hour = {
          cronEvery: '',
          incrementStart: 3,
          incrementIncrement: 5,
          rangeStart: 0,
          rangeEnd: '0',
          specificSpecific: [],
        };
        switch (true) {
          case val.includes('*'):
            hour.cronEvery = '1';
            break;
          case val.includes('/'):
            hour.cronEvery = '2';
            hour.incrementStart = val.split('/')[0];
            hour.incrementIncrement = val.split('/')[1];
            break;
          case val.includes(','):
            hour.cronEvery = '3';
            hour.specificSpecific = val.split(',').map(Number).sort();
            break;
          case val.includes('-'):
            hour.cronEvery = '4';
            hour.rangeStart = val.split('-')[0];
            hour.rangeEnd = val.split('-')[1];
            break;
          // 放到最后
          case toString.call(Number(val)) === '[object Number]':
            // console.log('数字') 多选框但是只单选一个时间
            hour.cronEvery = '3';
            hour.specificSpecific = [Number(val)];
            break;
          default:
            hour.cronEvery = '1';
        }
        this.result.hour = hour;
      },
      daysReverseExp(cron) {
        const days = cron.split(' ')[3];
        const weeks = cron.split(' ')[5];
        const day = {
          cronEvery: '',
          incrementStart: 1,
          incrementIncrement: 1,
          rangeStart: 1,
          rangeEnd: 1,
          specificSpecific: [],
          cronDaysBeforeEomMinus: 1,
          cronDaysNearestWeekday: 1,
        };
        const week = {
          cronEvery: '',
          incrementStart: 1,
          incrementIncrement: 1,
          specificSpecific: [],
          cronNthDayDay: 1,
          cronNthDayNth: '1',
          cronLastSpecificDomDay: 1,
          rangeStart: 1,
          rangeEnd: 1,
        };
        if (!days.includes('?')) {
          switch (true) {
            case days.includes('*'):
              day.cronEvery = '1';
              break;
            case days.includes('?'):
              // 2、4、11
              break;
            case days.includes('/'):
              day.cronEvery = '3';
              day.incrementStart = days.split('/')[0];
              day.incrementIncrement = days.split('/')[1];
              break;
            case days.includes(','):
              day.cronEvery = '5';
              day.specificSpecific = days.split(',').map(Number).sort();
              // day.specificSpecific.forEach(function (value, index) {
              //   day.specificSpecific[index] = value -1;
              // });
              break;
            case days.includes('LW'):
              day.cronEvery = '7';
              break;
            case days.includes('L-'):
              day.cronEvery = '9';
              day.cronDaysBeforeEomMinus = days.split('L-')[1];
              break;
            case days.includes('L'):
              day.cronEvery = '6';
              break;
            case days.includes('W'):
              day.cronEvery = '10';
              day.cronDaysNearestWeekday = days.split('W')[0];
              break;
            case days.includes('-'):
              day.cronEvery = '13';
              day.rangeStart = Number(days.split('-')[0]);
              day.rangeEnd = Number(days.split('-')[1]);
              break;
            // 放到最后
            case toString.call(Number(days)) === '[object Number]':
              // console.log('数字') 多选框但是只单选一个时间
              day.cronEvery = '5';
              day.specificSpecific = [Number(days)];
              break;
            default:
              day.cronEvery = '1';
          }
        } else {
          switch (true) {
            case weeks.includes('/'):
              day.cronEvery = '2';
              week.incrementStart = weeks.split('/')[0];
              week.incrementIncrement = weeks.split('/')[1];
              break;
            case weeks.includes(','):
              day.cronEvery = '4';
              week.specificSpecific = weeks.split(',').map(Number).sort();
              break;
            case weeks.includes('L'):
              day.cronEvery = '8';
              week.cronLastSpecificDomDay = Number(weeks.split('L')[0]);
              break;
            case weeks.includes('#'):
              day.cronEvery = '11';
              week.cronNthDayDay = Number(weeks.split('#')[0]);
              week.cronNthDayNth = weeks.split('#')[1];
              break;
            case weeks.includes('-'):
              day.cronEvery = '12';
              week.rangeStart = Number(weeks.split('-')[0]);
              week.rangeEnd = Number(weeks.split('-')[1]);
              break;
            // 放到最后
            case toString.call(Number(weeks)) === '[object Number]':
              // console.log('数字') 多选框但是只单选一个时间
              day.cronEvery = '4';
              week.specificSpecific = [Number(weeks)];
              break;
            default:
              day.cronEvery = '1';
              week.cronEvery = '1';
          }
        }
        this.result.day = day;
        this.result.week = week;
      },
      monthsReverseExp(cron) {
        const months = cron.split(' ')[4];
        const month = {
          cronEvery: '',
          incrementStart: 3,
          incrementIncrement: 5,
          rangeStart: 1,
          rangeEnd: 1,
          specificSpecific: [],
        };
        switch (true) {
          case months.includes('*'):
            month.cronEvery = '1';
            break;
          case months.includes('/'):
            month.cronEvery = '2';
            month.incrementStart = months.split('/')[0];
            month.incrementIncrement = months.split('/')[1];
            break;
          case months.includes(','):
            month.cronEvery = '3';
            month.specificSpecific = months.split(',').map(Number).sort();
            break;
          case months.includes('-'):
            month.cronEvery = '4';
            month.rangeStart = months.split('-')[0];
            month.rangeEnd = months.split('-')[1];
            break;
          // 放到最后
          case toString.call(Number(months)) === '[object Number]':
            // console.log('数字') 多选框但是只单选一个时间
            month.cronEvery = '3';
            month.specificSpecific = [Number(months)];
            break;
          default:
            month.cronEvery = '1';
        }
        this.result.month = month;
      },
      yearReverseExp(cron) {
        const years = cron.split(' ')[6];
        const year = {
          cronEvery: '',
          incrementStart: 2021,
          incrementIncrement: 5,
          rangeStart: 2021,
          rangeEnd: 2021,
          specificSpecific: [],
        };
        switch (true) {
          case years.includes('*'):
            year.cronEvery = '1';
            break;
          case years.includes('/'):
            year.cronEvery = '2';
            year.incrementStart = years.split('/')[0];
            year.incrementIncrement = years.split('/')[1];
            break;
          case years.includes(','):
            year.cronEvery = '3';
            year.specificSpecific = years.split(',').map(Number).sort();
            break;
          case years.includes('-'):
            year.cronEvery = '4';
            year.rangeStart = years.split('-')[0];
            year.rangeEnd = years.split('-')[1];
            break;
          // 放到最后
          case toString.call(Number(years)) === '[object Number]':
            // console.log('数字') 多选框但是只单选一个时间
            year.cronEvery = '3';
            year.specificSpecific = [Number(years)];
            break;
          default:
            year.cronEvery = '1';
        }
        this.result.year = year;
      },
      onReserveParse() {
        const label = normalizeCronExpression(this.reserveText);
        if (!isEmpty(label)) {
          this.reserveText = label;
          this.secondsReverseExp(label);
          this.minutesReverseExp(label);
          this.hoursReverseExp(label);
          this.daysReverseExp(label);
          this.monthsReverseExp(label);
          this.yearReverseExp(label);
          normalizeEverySelections(this.result, label);
        }
      },
    },
  });
</script>

<style lang="less" scoped>
  .card-container {
    background: #fff;
    overflow: hidden;
    padding: 12px;
    position: relative;
    width: 100%;
    .ant-tabs {
      border: 1px solid #e6ebf5;
      padding: 0;
      .ant-tabs-bar {
        margin: 0;
        outline: none;
        border-bottom: none;
        .ant-tabs-nav-container {
          margin: 0;
          .ant-tabs-tab {
            padding: 0 24px !important;
            background-color: #f5f7fa !important;
            margin-right: 0px !important;
            border-radius: 0;
            line-height: 38px;
            border: 1px solid transparent !important;
            border-bottom: 1px solid #e6ebf5 !important;
          }
          .ant-tabs-tab-active.ant-tabs-tab {
            color: #409eff;
            background-color: #fff !important;
            border-right: 1px solid #e6ebf5 !important;
            border-left: 1px solid #e6ebf5 !important;
            border-bottom: 1px solid #fff !important;
            font-weight: normal;
            transition: none !important;
          }
        }
      }
      .ant-tabs-tabpane {
        padding: 15px;
        .ant-row {
          margin: 10px 0;
        }
        .ant-select,
        .ant-input-number {
          width: 100px;
        }
      }
    }
  }
</style>
<style lang="less" scoped>
  .card-container {
    .bottom {
      display: flex;
      justify-content: center;
      padding: 10px 0 0 0;
      .cronButton {
        margin: 0 10px;
        line-height: 40px;
      }
    }
  }
</style>
