"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _xeUtils = _interopRequireDefault(require("xe-utils"));

var _conf = _interopRequireDefault(require("../../v-x-e-table/src/conf"));

var _size = _interopRequireDefault(require("../../mixins/size"));

var _utils = _interopRequireWildcard(require("../../tools/utils"));

var _dom = _interopRequireDefault(require("../../tools/dom"));

var _event = require("../../tools/event");

var _date = require("./date");

var _number = require("./number");

var _log = require("../../tools/log");

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var yearSize = 20;
var monthSize = 20;
var quarterSize = 8;

function getNumberValue(_vm, val) {
  var type = _vm.type,
      exponential = _vm.exponential,
      digitsValue = _vm.digitsValue,
      inpMaxlength = _vm.inpMaxlength;
  var restVal = type === 'float' ? (0, _number.toFloatValueFixed)(val, digitsValue) : _xeUtils.default.toValueString(val);

  if (exponential && (val === restVal || _xeUtils.default.toValueString(val).toLowerCase() === _xeUtils.default.toNumber(restVal).toExponential())) {
    return val;
  }

  return restVal.slice(0, inpMaxlength);
}

function renderDateLabel(h, _vm, item, label) {
  var festivalMethod = _vm.festivalMethod;

  if (festivalMethod) {
    var festivalRest = festivalMethod(_objectSpread({
      $input: _vm,
      type: _vm.datePanelType,
      viewType: _vm.datePanelType
    }, item));
    var festivalItem = festivalRest ? _xeUtils.default.isString(festivalRest) ? {
      label: festivalRest
    } : festivalRest : {};
    var extraItem = festivalItem.extra ? _xeUtils.default.isString(festivalItem.extra) ? {
      label: festivalItem.extra
    } : festivalItem.extra : null;
    var labels = [h('span', {
      class: ['vxe-input--date-label', {
        'is-notice': festivalItem.notice
      }]
    }, extraItem && extraItem.label ? [h('span', label), h('span', {
      class: ['vxe-input--date-label--extra', extraItem.important ? 'is-important' : '', extraItem.className],
      style: extraItem.style
    }, _xeUtils.default.toValueString(extraItem.label))] : label)];
    var festivalLabel = festivalItem.label;

    if (festivalLabel) {
      // 默认最多支持3个节日重叠
      var festivalLabels = _xeUtils.default.toValueString(festivalLabel).split(',');

      labels.push(h('span', {
        class: ['vxe-input--date-festival', festivalItem.important ? 'is-important' : '', festivalItem.className],
        style: festivalItem.style
      }, [festivalLabels.length > 1 ? h('span', {
        class: ['vxe-input--date-festival--overlap', "overlap--".concat(festivalLabels.length)]
      }, festivalLabels.map(function (label) {
        return h('span', label.substring(0, 3));
      })) : h('span', {
        class: 'vxe-input--date-festival--label'
      }, festivalLabels[0].substring(0, 3))]));
    }

    return labels;
  }

  return label;
}

function isDateDisabled(_vm, item) {
  var disabledMethod = _vm.disabledMethod;
  return disabledMethod && disabledMethod({
    $input: _vm,
    type: _vm.datePanelType,
    viewType: _vm.datePanelType,
    date: item.date
  });
}

function renderDateDayTable(h, _vm) {
  var datePanelType = _vm.datePanelType,
      dateValue = _vm.dateValue,
      datePanelValue = _vm.datePanelValue,
      dateHeaders = _vm.dateHeaders,
      dayDatas = _vm.dayDatas;
  var matchFormat = 'yyyy-MM-dd';
  return [h('table', {
    class: "vxe-input--date-".concat(datePanelType, "-view"),
    attrs: {
      cellspacing: 0,
      cellpadding: 0,
      border: 0
    }
  }, [h('thead', [h('tr', dateHeaders.map(function (item) {
    return h('th', item.label);
  }))]), h('tbody', dayDatas.map(function (rows) {
    return h('tr', rows.map(function (item) {
      return h('td', {
        class: {
          'is--prev': item.isPrev,
          'is--current': item.isCurrent,
          'is--now': item.isNow,
          'is--next': item.isNext,
          'is--disabled': isDateDisabled(_vm, item),
          'is--selected': _xeUtils.default.isDateSame(dateValue, item.date, matchFormat),
          'is--hover': _xeUtils.default.isDateSame(datePanelValue, item.date, matchFormat)
        },
        on: {
          click: function click() {
            return _vm.dateSelectEvent(item);
          },
          mouseenter: function mouseenter() {
            return _vm.dateMouseenterEvent(item);
          }
        }
      }, renderDateLabel(h, _vm, item, item.label));
    }));
  }))])];
}

function renderDateWeekTable(h, _vm) {
  var datePanelType = _vm.datePanelType,
      dateValue = _vm.dateValue,
      datePanelValue = _vm.datePanelValue,
      weekHeaders = _vm.weekHeaders,
      weekDates = _vm.weekDates;
  var matchFormat = 'yyyyMMdd';
  return [h('table', {
    class: "vxe-input--date-".concat(datePanelType, "-view"),
    attrs: {
      cellspacing: 0,
      cellpadding: 0,
      border: 0
    }
  }, [h('thead', [h('tr', weekHeaders.map(function (item) {
    return h('th', item.label);
  }))]), h('tbody', weekDates.map(function (rows) {
    var isSelected = rows.some(function (item) {
      return _xeUtils.default.isDateSame(dateValue, item.date, matchFormat);
    });
    var isHover = rows.some(function (item) {
      return _xeUtils.default.isDateSame(datePanelValue, item.date, matchFormat);
    });
    return h('tr', rows.map(function (item) {
      return h('td', {
        class: {
          'is--prev': item.isPrev,
          'is--current': item.isCurrent,
          'is--now': item.isNow,
          'is--next': item.isNext,
          'is--disabled': isDateDisabled(_vm, item),
          'is--selected': isSelected,
          'is--hover': isHover
        },
        on: {
          click: function click() {
            return _vm.dateSelectEvent(item);
          },
          mouseenter: function mouseenter() {
            return _vm.dateMouseenterEvent(item);
          }
        }
      }, renderDateLabel(h, _vm, item, item.label));
    }));
  }))])];
}

function renderDateMonthTable(h, _vm) {
  var dateValue = _vm.dateValue,
      datePanelType = _vm.datePanelType,
      monthDatas = _vm.monthDatas,
      datePanelValue = _vm.datePanelValue;
  var matchFormat = 'yyyyMM';
  return [h('table', {
    class: "vxe-input--date-".concat(datePanelType, "-view"),
    attrs: {
      cellspacing: 0,
      cellpadding: 0,
      border: 0
    }
  }, [h('tbody', monthDatas.map(function (rows) {
    return h('tr', rows.map(function (item) {
      return h('td', {
        class: {
          'is--prev': item.isPrev,
          'is--current': item.isCurrent,
          'is--now': item.isNow,
          'is--next': item.isNext,
          'is--disabled': isDateDisabled(_vm, item),
          'is--selected': _xeUtils.default.isDateSame(dateValue, item.date, matchFormat),
          'is--hover': _xeUtils.default.isDateSame(datePanelValue, item.date, matchFormat)
        },
        on: {
          click: function click() {
            return _vm.dateSelectEvent(item);
          },
          mouseenter: function mouseenter() {
            return _vm.dateMouseenterEvent(item);
          }
        }
      }, renderDateLabel(h, _vm, item, _conf.default.i18n("vxe.input.date.months.m".concat(item.month))));
    }));
  }))])];
}

function renderDateQuarterTable(h, _vm) {
  var dateValue = _vm.dateValue,
      datePanelType = _vm.datePanelType,
      quarterDatas = _vm.quarterDatas,
      datePanelValue = _vm.datePanelValue;
  var matchFormat = 'yyyyq';
  return [h('table', {
    class: "vxe-input--date-".concat(datePanelType, "-view"),
    attrs: {
      cellspacing: 0,
      cellpadding: 0,
      border: 0
    }
  }, [h('tbody', quarterDatas.map(function (rows) {
    return h('tr', rows.map(function (item) {
      return h('td', {
        class: {
          'is--prev': item.isPrev,
          'is--current': item.isCurrent,
          'is--now': item.isNow,
          'is--next': item.isNext,
          'is--disabled': isDateDisabled(_vm, item),
          'is--selected': _xeUtils.default.isDateSame(dateValue, item.date, matchFormat),
          'is--hover': _xeUtils.default.isDateSame(datePanelValue, item.date, matchFormat)
        },
        on: {
          click: function click() {
            return _vm.dateSelectEvent(item);
          },
          mouseenter: function mouseenter() {
            return _vm.dateMouseenterEvent(item);
          }
        }
      }, renderDateLabel(h, _vm, item, _conf.default.i18n("vxe.input.date.quarters.q".concat(item.quarter))));
    }));
  }))])];
}

function renderDateYearTable(h, _vm) {
  var dateValue = _vm.dateValue,
      datePanelType = _vm.datePanelType,
      yearDatas = _vm.yearDatas,
      datePanelValue = _vm.datePanelValue;
  var matchFormat = 'yyyy';
  return [h('table', {
    class: "vxe-input--date-".concat(datePanelType, "-view"),
    attrs: {
      cellspacing: 0,
      cellpadding: 0,
      border: 0
    }
  }, [h('tbody', yearDatas.map(function (rows) {
    return h('tr', rows.map(function (item) {
      return h('td', {
        class: {
          'is--disabled': isDateDisabled(_vm, item),
          'is--current': item.isCurrent,
          'is--now': item.isNow,
          'is--selected': _xeUtils.default.isDateSame(dateValue, item.date, matchFormat),
          'is--hover': _xeUtils.default.isDateSame(datePanelValue, item.date, matchFormat)
        },
        on: {
          click: function click() {
            return _vm.dateSelectEvent(item);
          },
          mouseenter: function mouseenter() {
            return _vm.dateMouseenterEvent(item);
          }
        }
      }, renderDateLabel(h, _vm, item, item.year));
    }));
  }))])];
}

function renderDateTable(h, _vm) {
  var datePanelType = _vm.datePanelType;

  switch (datePanelType) {
    case 'week':
      return renderDateWeekTable(h, _vm);

    case 'month':
      return renderDateMonthTable(h, _vm);

    case 'quarter':
      return renderDateQuarterTable(h, _vm);

    case 'year':
      return renderDateYearTable(h, _vm);
  }

  return renderDateDayTable(h, _vm);
}

function renderDatePanel(h, _vm) {
  var datePanelType = _vm.datePanelType,
      selectDatePanelLabel = _vm.selectDatePanelLabel,
      isDisabledPrevDateBtn = _vm.isDisabledPrevDateBtn,
      isDisabledNextDateBtn = _vm.isDisabledNextDateBtn;
  return [h('div', {
    class: 'vxe-input--date-picker-header'
  }, [h('div', {
    class: 'vxe-input--date-picker-type-wrapper'
  }, [datePanelType === 'year' ? h('span', {
    class: 'vxe-input--date-picker-label'
  }, selectDatePanelLabel) : h('span', {
    class: 'vxe-input--date-picker-btn',
    on: {
      click: _vm.dateToggleTypeEvent
    }
  }, selectDatePanelLabel)]), h('div', {
    class: 'vxe-input--date-picker-btn-wrapper'
  }, [h('span', {
    class: ['vxe-input--date-picker-btn vxe-input--date-picker-prev-btn', {
      'is--disabled': isDisabledPrevDateBtn
    }],
    on: {
      click: _vm.datePrevEvent
    }
  }, [h('i', {
    class: 'vxe-icon--caret-left'
  })]), h('span', {
    class: 'vxe-input--date-picker-btn vxe-input--date-picker-current-btn',
    on: {
      click: _vm.dateTodayMonthEvent
    }
  }, [h('i', {
    class: 'vxe-icon--dot'
  })]), h('span', {
    class: ['vxe-input--date-picker-btn vxe-input--date-picker-next-btn', {
      'is--disabled': isDisabledNextDateBtn
    }],
    on: {
      click: _vm.dateNextEvent
    }
  }, [h('i', {
    class: 'vxe-icon--caret-right'
  })])])]), h('div', {
    class: 'vxe-input--date-picker-body'
  }, renderDateTable(h, _vm))];
}

function renderTimePanel(h, _vm) {
  var dateTimeLabel = _vm.dateTimeLabel,
      datetimePanelValue = _vm.datetimePanelValue,
      hourList = _vm.hourList,
      minuteList = _vm.minuteList,
      secondList = _vm.secondList;
  return [h('div', {
    class: 'vxe-input--time-picker-header'
  }, [h('span', {
    class: 'vxe-input--time-picker-title'
  }, dateTimeLabel), h('button', {
    class: 'vxe-input--time-picker-confirm',
    attrs: {
      type: 'button'
    },
    on: {
      click: _vm.dateConfirmEvent
    }
  }, _conf.default.i18n('vxe.button.confirm'))]), h('div', {
    ref: 'timeBody',
    class: 'vxe-input--time-picker-body'
  }, [h('ul', {
    class: 'vxe-input--time-picker-hour-list'
  }, hourList.map(function (item, index) {
    return h('li', {
      key: index,
      class: {
        'is--selected': datetimePanelValue && datetimePanelValue.getHours() === item.value
      },
      on: {
        click: function click(evnt) {
          return _vm.dateHourEvent(evnt, item);
        }
      }
    }, item.label);
  })), h('ul', {
    class: 'vxe-input--time-picker-minute-list'
  }, minuteList.map(function (item, index) {
    return h('li', {
      key: index,
      class: {
        'is--selected': datetimePanelValue && datetimePanelValue.getMinutes() === item.value
      },
      on: {
        click: function click(evnt) {
          return _vm.dateMinuteEvent(evnt, item);
        }
      }
    }, item.label);
  })), h('ul', {
    class: 'vxe-input--time-picker-second-list'
  }, secondList.map(function (item, index) {
    return h('li', {
      key: index,
      class: {
        'is--selected': datetimePanelValue && datetimePanelValue.getSeconds() === item.value
      },
      on: {
        click: function click(evnt) {
          return _vm.dateSecondEvent(evnt, item);
        }
      }
    }, item.label);
  }))])];
}

function renderPanel(h, _vm) {
  var type = _vm.type,
      vSize = _vm.vSize,
      isDatePickerType = _vm.isDatePickerType,
      transfer = _vm.transfer,
      animatVisible = _vm.animatVisible,
      visiblePanel = _vm.visiblePanel,
      panelPlacement = _vm.panelPlacement,
      panelStyle = _vm.panelStyle;
  var renders = [];

  if (isDatePickerType) {
    var _ref;

    if (type === 'datetime') {
      renders.push(h('div', {
        class: 'vxe-input--panel-layout-wrapper'
      }, [h('div', {
        class: 'vxe-input--panel-left-wrapper'
      }, renderDatePanel(h, _vm)), h('div', {
        class: 'vxe-input--panel-right-wrapper'
      }, renderTimePanel(h, _vm))]));
    } else if (type === 'time') {
      renders.push(h('div', {
        class: 'vxe-input--panel-wrapper'
      }, renderTimePanel(h, _vm)));
    } else {
      renders.push(h('div', {
        class: 'vxe-input--panel-wrapper'
      }, renderDatePanel(h, _vm)));
    }

    return h('div', {
      ref: 'panel',
      class: ['vxe-table--ignore-clear vxe-input--panel', "type--".concat(type), (_ref = {}, _defineProperty(_ref, "size--".concat(vSize), vSize), _defineProperty(_ref, 'is--transfer', transfer), _defineProperty(_ref, 'animat--leave', animatVisible), _defineProperty(_ref, 'animat--enter', visiblePanel), _ref)],
      attrs: {
        placement: panelPlacement
      },
      style: panelStyle
    }, renders);
  }

  return null;
}

function renderNumberIcon(h, _vm) {
  return h('span', {
    class: 'vxe-input--number-suffix'
  }, [h('span', {
    class: 'vxe-input--number-prev is--prev',
    on: {
      mousedown: _vm.numberMousedownEvent,
      mouseup: _vm.numberStopDown,
      mouseleave: _vm.numberStopDown
    }
  }, [h('i', {
    class: ['vxe-input--number-prev-icon', _conf.default.icon.INPUT_PREV_NUM]
  })]), h('span', {
    class: 'vxe-input--number-next is--next',
    on: {
      mousedown: _vm.numberMousedownEvent,
      mouseup: _vm.numberStopDown,
      mouseleave: _vm.numberStopDown
    }
  }, [h('i', {
    class: ['vxe-input--number-next-icon', _conf.default.icon.INPUT_NEXT_NUM]
  })])]);
}

function renderDatePickerIcon(h, _vm) {
  return h('span', {
    class: 'vxe-input--date-picker-suffix',
    on: {
      click: _vm.datePickerOpenEvent
    }
  }, [h('i', {
    class: ['vxe-input--date-picker-icon', _conf.default.icon.INPUT_DATE]
  })]);
}

function renderSearchIcon(h, _vm) {
  return h('span', {
    class: 'vxe-input--search-suffix',
    on: {
      click: _vm.searchEvent
    }
  }, [h('i', {
    class: ['vxe-input--search-icon', _conf.default.icon.INPUT_SEARCH]
  })]);
}

function renderPasswordIcon(h, _vm) {
  var showPwd = _vm.showPwd;
  return h('span', {
    class: 'vxe-input--password-suffix',
    on: {
      click: _vm.passwordToggleEvent
    }
  }, [h('i', {
    class: ['vxe-input--password-icon', showPwd ? _conf.default.icon.INPUT_SHOW_PWD : _conf.default.icon.INPUT_PWD]
  })]);
}

function rendePrefixIcon(h, _vm) {
  var $scopedSlots = _vm.$scopedSlots,
      prefixIcon = _vm.prefixIcon;
  var icons = [];

  if ($scopedSlots.prefix) {
    icons.push(h('span', {
      class: 'vxe-input--prefix-icon'
    }, $scopedSlots.prefix.call(this, {}, h)));
  } else if (prefixIcon) {
    icons.push(h('i', {
      class: ['vxe-input--prefix-icon', prefixIcon]
    }));
  }

  return icons.length ? h('span', {
    class: 'vxe-input--prefix',
    on: {
      click: _vm.clickPrefixEvent
    }
  }, icons) : null;
}

function renderSuffixIcon(h, _vm) {
  var $scopedSlots = _vm.$scopedSlots,
      inputValue = _vm.inputValue,
      isClearable = _vm.isClearable,
      disabled = _vm.disabled,
      suffixIcon = _vm.suffixIcon;
  var icons = [];

  if ($scopedSlots.suffix) {
    icons.push(h('span', {
      class: 'vxe-input--suffix-icon'
    }, $scopedSlots.suffix.call(this, {}, h)));
  } else if (suffixIcon) {
    icons.push(h('i', {
      class: ['vxe-input--suffix-icon', suffixIcon]
    }));
  }

  if (isClearable) {
    icons.push(h('i', {
      class: ['vxe-input--clear-icon', _conf.default.icon.INPUT_CLEAR]
    }));
  }

  return icons.length ? h('span', {
    class: ['vxe-input--suffix', {
      'is--clear': isClearable && !disabled && !(inputValue === '' || _xeUtils.default.eqNull(inputValue))
    }],
    on: {
      click: _vm.clickSuffixEvent
    }
  }, icons) : null;
}

function renderExtraSuffixIcon(h, _vm) {
  var controls = _vm.controls,
      isPawdType = _vm.isPawdType,
      isNumType = _vm.isNumType,
      isDatePickerType = _vm.isDatePickerType,
      isSearch = _vm.isSearch;
  var icons;

  if (isPawdType) {
    icons = renderPasswordIcon(h, _vm);
  } else if (isNumType) {
    if (controls) {
      icons = renderNumberIcon(h, _vm);
    }
  } else if (isDatePickerType) {
    icons = renderDatePickerIcon(h, _vm);
  } else if (isSearch) {
    icons = renderSearchIcon(h, _vm);
  }

  return icons ? h('span', {
    class: 'vxe-input--extra-suffix'
  }, [icons]) : null;
}

var _default2 = {
  name: 'VxeInput',
  mixins: [_size.default],
  model: {
    prop: 'value',
    event: 'modelValue'
  },
  props: {
    value: [String, Number, Date],
    immediate: {
      type: Boolean,
      default: true
    },
    name: String,
    type: {
      type: String,
      default: 'text'
    },
    clearable: {
      type: Boolean,
      default: function _default() {
        return _conf.default.input.clearable;
      }
    },
    readonly: Boolean,
    disabled: Boolean,
    placeholder: String,
    maxlength: [String, Number],
    autocomplete: {
      type: String,
      default: 'off'
    },
    align: String,
    form: String,
    className: String,
    size: {
      type: String,
      default: function _default() {
        return _conf.default.input.size || _conf.default.size;
      }
    },
    // number、integer、float
    min: {
      type: [String, Number],
      default: null
    },
    max: {
      type: [String, Number],
      default: null
    },
    step: [String, Number],
    exponential: {
      type: Boolean,
      default: function _default() {
        return _conf.default.input.exponential;
      }
    },
    // number、integer、float、password
    controls: {
      type: Boolean,
      default: function _default() {
        return _conf.default.input.controls;
      }
    },
    // float
    digits: {
      type: [String, Number],
      default: function _default() {
        return _conf.default.input.digits;
      }
    },
    // date、week、month、year
    dateConfig: Object,
    minDate: {
      type: [String, Number, Date],
      default: function _default() {
        return _conf.default.input.minDate;
      }
    },
    maxDate: {
      type: [String, Number, Date],
      default: function _default() {
        return _conf.default.input.maxDate;
      }
    },
    // 已废弃 startWeek，被 startDay 替换
    startWeek: Number,
    startDay: {
      type: [String, Number],
      default: function _default() {
        return _conf.default.input.startDay;
      }
    },
    labelFormat: {
      type: String,
      default: function _default() {
        return _conf.default.input.labelFormat;
      }
    },
    valueFormat: {
      type: String,
      default: function _default() {
        return _conf.default.input.valueFormat;
      }
    },
    editable: {
      type: Boolean,
      default: true
    },
    festivalMethod: {
      type: Function,
      default: function _default() {
        return _conf.default.input.festivalMethod;
      }
    },
    disabledMethod: {
      type: Function,
      default: function _default() {
        return _conf.default.input.disabledMethod;
      }
    },
    // week
    selectDay: {
      type: Number,
      default: function _default() {
        return _conf.default.input.selectDay;
      }
    },
    prefixIcon: String,
    suffixIcon: String,
    placement: String,
    transfer: {
      type: Boolean,
      default: function _default() {
        return _conf.default.input.transfer;
      }
    }
  },
  data: function data() {
    return {
      panelIndex: 0,
      showPwd: false,
      visiblePanel: false,
      animatVisible: false,
      panelStyle: null,
      panelPlacement: null,
      isActivated: false,
      inputValue: this.value,
      datetimePanelValue: null,
      datePanelValue: null,
      datePanelLabel: '',
      datePanelType: 'day',
      selectMonth: null,
      currentDate: null
    };
  },
  computed: {
    isNumType: function isNumType() {
      return ['number', 'integer', 'float'].indexOf(this.type) > -1;
    },
    isDatePickerType: function isDatePickerType() {
      return this.hasTime || ['date', 'week', 'month', 'quarter', 'year'].indexOf(this.type) > -1;
    },
    hasTime: function hasTime() {
      var type = this.type;
      return type === 'time' || type === 'datetime';
    },
    isPawdType: function isPawdType() {
      return this.type === 'password';
    },
    isSearch: function isSearch() {
      return this.type === 'search';
    },
    stepValue: function stepValue() {
      var type = this.type,
          step = this.step;

      if (type === 'integer') {
        return _xeUtils.default.toInteger(step) || 1;
      } else if (type === 'float') {
        return _xeUtils.default.toNumber(step) || 1 / Math.pow(10, this.digitsValue);
      }

      return _xeUtils.default.toNumber(step) || 1;
    },
    digitsValue: function digitsValue() {
      return _xeUtils.default.toInteger(this.digits) || 1;
    },
    isClearable: function isClearable() {
      return this.clearable && (this.isPawdType || this.isNumType || this.isDatePickerType || this.type === 'text' || this.type === 'search');
    },
    isDisabledPrevDateBtn: function isDisabledPrevDateBtn() {
      var selectMonth = this.selectMonth,
          dateMinTime = this.dateMinTime;

      if (selectMonth) {
        return selectMonth <= dateMinTime;
      }

      return false;
    },
    isDisabledNextDateBtn: function isDisabledNextDateBtn() {
      var selectMonth = this.selectMonth,
          dateMaxTime = this.dateMaxTime;

      if (selectMonth) {
        return selectMonth >= dateMaxTime;
      }

      return false;
    },
    dateMinTime: function dateMinTime() {
      return this.minDate ? _xeUtils.default.toStringDate(this.minDate) : null;
    },
    dateMaxTime: function dateMaxTime() {
      return this.maxDate ? _xeUtils.default.toStringDate(this.maxDate) : null;
    },
    dateValue: function dateValue() {
      var value = this.value,
          isDatePickerType = this.isDatePickerType,
          dateValueFormat = this.dateValueFormat;
      var val = null;

      if (value && isDatePickerType) {
        var date = this.parseDate(value, dateValueFormat);

        if (_xeUtils.default.isValidDate(date)) {
          val = date;
        }
      }

      return val;
    },
    dateTimeLabel: function dateTimeLabel() {
      var datetimePanelValue = this.datetimePanelValue;

      if (datetimePanelValue) {
        return _xeUtils.default.toDateString(datetimePanelValue, 'HH:mm:ss');
      }

      return '';
    },
    hmsTime: function hmsTime() {
      var dateValue = this.dateValue;
      return dateValue && this.hasTime ? (dateValue.getHours() * 3600 + dateValue.getMinutes() * 60 + dateValue.getSeconds()) * 1000 : 0;
    },
    dateLabelFormat: function dateLabelFormat() {
      if (this.isDatePickerType) {
        return this.labelFormat || _conf.default.i18n("vxe.input.date.labelFormat.".concat(this.type));
      }

      return null;
    },
    dateValueFormat: function dateValueFormat() {
      var type = this.type;
      return type === 'time' ? 'HH:mm:ss' : this.valueFormat || (type === 'datetime' ? 'yyyy-MM-dd HH:mm:ss' : 'yyyy-MM-dd');
    },
    selectDatePanelLabel: function selectDatePanelLabel() {
      if (this.isDatePickerType) {
        var datePanelType = this.datePanelType,
            selectMonth = this.selectMonth,
            yearList = this.yearList;
        var year = '';
        var month;

        if (selectMonth) {
          year = selectMonth.getFullYear();
          month = selectMonth.getMonth() + 1;
        }

        if (datePanelType === 'quarter') {
          return _conf.default.i18n('vxe.input.date.quarterLabel', [year]);
        } else if (datePanelType === 'month') {
          return _conf.default.i18n('vxe.input.date.monthLabel', [year]);
        } else if (datePanelType === 'year') {
          return yearList.length ? "".concat(yearList[0].year, " - ").concat(yearList[yearList.length - 1].year) : '';
        }

        return _conf.default.i18n('vxe.input.date.dayLabel', [year, month ? _conf.default.i18n("vxe.input.date.m".concat(month)) : '-']);
      }

      return '';
    },
    firstDayOfWeek: function firstDayOfWeek() {
      var startDay = this.startDay,
          startWeek = this.startWeek;
      return _xeUtils.default.toNumber(_xeUtils.default.isNumber(startDay) || _xeUtils.default.isString(startDay) ? startDay : startWeek);
    },
    weekDatas: function weekDatas() {
      var weeks = [];

      if (this.isDatePickerType) {
        var sWeek = this.firstDayOfWeek;
        weeks.push(sWeek);

        for (var index = 0; index < 6; index++) {
          if (sWeek >= 6) {
            sWeek = 0;
          } else {
            sWeek++;
          }

          weeks.push(sWeek);
        }
      }

      return weeks;
    },
    dateHeaders: function dateHeaders() {
      if (this.isDatePickerType) {
        return this.weekDatas.map(function (day) {
          return {
            value: day,
            label: _conf.default.i18n("vxe.input.date.weeks.w".concat(day))
          };
        });
      }

      return [];
    },
    weekHeaders: function weekHeaders() {
      if (this.isDatePickerType) {
        return [{
          label: _conf.default.i18n('vxe.input.date.weeks.w')
        }].concat(this.dateHeaders);
      }

      return [];
    },
    yearList: function yearList() {
      var selectMonth = this.selectMonth,
          currentDate = this.currentDate;
      var months = [];

      if (selectMonth && currentDate) {
        var currFullYear = currentDate.getFullYear();
        var startYear = new Date(('' + selectMonth.getFullYear()).replace(/\d{1}$/, '0'), 0, 1);

        for (var index = -10; index < yearSize - 10; index++) {
          var date = _xeUtils.default.getWhatYear(startYear, index, 'first');

          var itemFullYear = date.getFullYear();
          months.push({
            date: date,
            isCurrent: true,
            isNow: currFullYear === itemFullYear,
            year: itemFullYear
          });
        }
      }

      return months;
    },
    yearDatas: function yearDatas() {
      return _xeUtils.default.chunk(this.yearList, 4);
    },
    quarterList: function quarterList() {
      var selectMonth = this.selectMonth,
          currentDate = this.currentDate;
      var quarters = [];

      if (selectMonth && currentDate) {
        var currFullYear = currentDate.getFullYear();
        var currQuarter = (0, _date.getDateQuarter)(currentDate);

        var firstYear = _xeUtils.default.getWhatYear(selectMonth, 0, 'first');

        var selFullYear = firstYear.getFullYear();

        for (var index = -2; index < quarterSize - 2; index++) {
          var date = _xeUtils.default.getWhatQuarter(firstYear, index);

          var itemFullYear = date.getFullYear();
          var itemQuarter = (0, _date.getDateQuarter)(date);
          var isPrev = itemFullYear < selFullYear;
          quarters.push({
            date: date,
            isPrev: isPrev,
            isCurrent: itemFullYear === selFullYear,
            isNow: itemFullYear === currFullYear && itemQuarter === currQuarter,
            isNext: !isPrev && itemFullYear > selFullYear,
            quarter: itemQuarter
          });
        }
      }

      return quarters;
    },
    quarterDatas: function quarterDatas() {
      return _xeUtils.default.chunk(this.quarterList, 2);
    },
    monthList: function monthList() {
      var selectMonth = this.selectMonth,
          currentDate = this.currentDate;
      var months = [];

      if (selectMonth && currentDate) {
        var currFullYear = currentDate.getFullYear();
        var currMonth = currentDate.getMonth();

        var selFullYear = _xeUtils.default.getWhatYear(selectMonth, 0, 'first').getFullYear();

        for (var index = -4; index < monthSize - 4; index++) {
          var date = _xeUtils.default.getWhatYear(selectMonth, 0, index);

          var itemFullYear = date.getFullYear();
          var itemMonth = date.getMonth();
          var isPrev = itemFullYear < selFullYear;
          months.push({
            date: date,
            isPrev: isPrev,
            isCurrent: itemFullYear === selFullYear,
            isNow: itemFullYear === currFullYear && itemMonth === currMonth,
            isNext: !isPrev && itemFullYear > selFullYear,
            month: itemMonth
          });
        }
      }

      return months;
    },
    monthDatas: function monthDatas() {
      return _xeUtils.default.chunk(this.monthList, 4);
    },
    dayList: function dayList() {
      var weekDatas = this.weekDatas,
          selectMonth = this.selectMonth,
          currentDate = this.currentDate,
          hmsTime = this.hmsTime;
      var days = [];

      if (selectMonth && currentDate) {
        var currFullYear = currentDate.getFullYear();
        var currMonth = currentDate.getMonth();
        var currDate = currentDate.getDate();
        var selFullYear = selectMonth.getFullYear();
        var selMonth = selectMonth.getMonth();
        var selDay = selectMonth.getDay();
        var prevOffsetDate = -weekDatas.indexOf(selDay);
        var startDate = new Date(_xeUtils.default.getWhatDay(selectMonth, prevOffsetDate).getTime() + hmsTime);

        for (var index = 0; index < 42; index++) {
          var date = _xeUtils.default.getWhatDay(startDate, index);

          var itemFullYear = date.getFullYear();
          var itemMonth = date.getMonth();
          var itemDate = date.getDate();
          var isPrev = date < selectMonth;
          days.push({
            date: date,
            isPrev: isPrev,
            isCurrent: itemFullYear === selFullYear && itemMonth === selMonth,
            isNow: itemFullYear === currFullYear && itemMonth === currMonth && itemDate === currDate,
            isNext: !isPrev && selMonth !== itemMonth,
            label: itemDate
          });
        }
      }

      return days;
    },
    dayDatas: function dayDatas() {
      return _xeUtils.default.chunk(this.dayList, 7);
    },
    weekDates: function weekDates() {
      var dayDatas = this.dayDatas,
          firstDayOfWeek = this.firstDayOfWeek;
      return dayDatas.map(function (list) {
        var firstItem = list[0];
        var item = {
          date: firstItem.date,
          isWeekNumber: true,
          isPrev: false,
          isCurrent: false,
          isNow: false,
          isNext: false,
          label: _xeUtils.default.getYearWeek(firstItem.date, firstDayOfWeek)
        };
        return [item].concat(list);
      });
    },
    hourList: function hourList() {
      var list = [];

      if (this.hasTime) {
        for (var index = 0; index < 24; index++) {
          list.push({
            value: index,
            label: ('' + index).padStart(2, 0)
          });
        }
      }

      return list;
    },
    minuteList: function minuteList() {
      var list = [];

      if (this.hasTime) {
        for (var index = 0; index < 60; index++) {
          list.push({
            value: index,
            label: ('' + index).padStart(2, 0)
          });
        }
      }

      return list;
    },
    secondList: function secondList() {
      return this.minuteList;
    },
    inpImmediate: function inpImmediate() {
      var type = this.type,
          immediate = this.immediate;
      return immediate || !(type === 'text' || type === 'number' || type === 'integer' || type === 'float');
    },
    inpPlaceholder: function inpPlaceholder() {
      var placeholder = this.placeholder;

      if (placeholder) {
        return (0, _utils.getFuncText)(placeholder);
      }

      return '';
    },
    inputType: function inputType() {
      var isDatePickerType = this.isDatePickerType,
          isNumType = this.isNumType,
          isPawdType = this.isPawdType,
          type = this.type,
          showPwd = this.showPwd;

      if (isDatePickerType || isNumType || isPawdType && showPwd || type === 'number') {
        return 'text';
      }

      return type;
    },
    inpMaxlength: function inpMaxlength() {
      var isNumType = this.isNumType,
          maxlength = this.maxlength; // 数值最大长度限制 16 位，包含小数

      return isNumType && !_xeUtils.default.toNumber(maxlength) ? 16 : maxlength;
    },
    inpReadonly: function inpReadonly() {
      var type = this.type,
          readonly = this.readonly,
          editable = this.editable;
      return readonly || !editable || type === 'week' || type === 'quarter';
    }
  },
  watch: {
    value: function value(val) {
      this.inputValue = val;
      this.changeValue();
    },
    type: function type() {
      // 切换类型是重置内置变量
      Object.assign(this, {
        inputValue: this.value,
        datetimePanelValue: null,
        datePanelValue: null,
        datePanelLabel: '',
        datePanelType: 'day',
        selectMonth: null,
        currentDate: null
      });
      this.initValue();
    },
    dateLabelFormat: function dateLabelFormat() {
      if (this.isDatePickerType) {
        this.dateParseValue(this.datePanelValue);
        this.inputValue = this.datePanelLabel;
      }
    }
  },
  created: function created() {
    this.initValue();

    _event.GlobalEvent.on(this, 'mousewheel', this.handleGlobalMousewheelEvent);

    _event.GlobalEvent.on(this, 'mousedown', this.handleGlobalMousedownEvent);

    _event.GlobalEvent.on(this, 'keydown', this.handleGlobalKeydownEvent);

    _event.GlobalEvent.on(this, 'blur', this.handleGlobalBlurEvent);
  },
  mounted: function mounted() {
    if (this.dateConfig) {
      (0, _log.warnLog)('vxe.error.removeProp', ['date-config']);
    }

    if (this.isDatePickerType) {
      if (this.transfer) {
        document.body.appendChild(this.$refs.panel);
      }
    }
  },
  beforeDestroy: function beforeDestroy() {
    var panelElem = this.$refs.panel;

    if (panelElem && panelElem.parentNode) {
      panelElem.parentNode.removeChild(panelElem);
    }
  },
  destroyed: function destroyed() {
    this.numberStopDown();

    _event.GlobalEvent.off(this, 'mousewheel');

    _event.GlobalEvent.off(this, 'mousedown');

    _event.GlobalEvent.off(this, 'keydown');

    _event.GlobalEvent.off(this, 'blur');
  },
  render: function render(h) {
    var _ref2;

    var name = this.name,
        form = this.form,
        inputType = this.inputType,
        inpPlaceholder = this.inpPlaceholder,
        inpMaxlength = this.inpMaxlength,
        inpReadonly = this.inpReadonly,
        className = this.className,
        controls = this.controls,
        inputValue = this.inputValue,
        isDatePickerType = this.isDatePickerType,
        visiblePanel = this.visiblePanel,
        isActivated = this.isActivated,
        vSize = this.vSize,
        type = this.type,
        align = this.align,
        readonly = this.readonly,
        disabled = this.disabled,
        autocomplete = this.autocomplete;
    var childs = [];
    var prefix = rendePrefixIcon(h, this);
    var suffix = renderSuffixIcon(h, this); // 前缀图标

    if (prefix) {
      childs.push(prefix);
    } // 输入框


    childs.push(h('input', {
      ref: 'input',
      class: 'vxe-input--inner',
      domProps: {
        value: inputValue
      },
      attrs: {
        name: name,
        form: form,
        type: inputType,
        placeholder: inpPlaceholder,
        maxlength: inpMaxlength,
        readonly: inpReadonly,
        disabled: disabled,
        autocomplete: autocomplete
      },
      on: {
        keydown: this.keydownEvent,
        keyup: this.triggerEvent,
        wheel: this.wheelEvent,
        click: this.clickEvent,
        input: this.inputEvent,
        change: this.changeEvent,
        focus: this.focusEvent,
        blur: this.blurEvent
      }
    })); // 后缀图标

    if (suffix) {
      childs.push(suffix);
    } // 特殊功能图标


    childs.push(renderExtraSuffixIcon(h, this)); // 面板容器

    if (isDatePickerType) {
      childs.push(renderPanel(h, this));
    }

    return h('div', {
      class: ['vxe-input', "type--".concat(type), className, (_ref2 = {}, _defineProperty(_ref2, "size--".concat(vSize), vSize), _defineProperty(_ref2, "is--".concat(align), align), _defineProperty(_ref2, 'is--controls', controls), _defineProperty(_ref2, 'is--prefix', !!prefix), _defineProperty(_ref2, 'is--suffix', !!suffix), _defineProperty(_ref2, 'is--readonly', readonly), _defineProperty(_ref2, 'is--visivle', visiblePanel), _defineProperty(_ref2, 'is--disabled', disabled), _defineProperty(_ref2, 'is--active', isActivated), _ref2)]
    }, childs);
  },
  methods: {
    focus: function focus() {
      this.isActivated = true;
      this.$refs.input.focus();
      return this.$nextTick();
    },
    blur: function blur() {
      this.$refs.input.blur();
      this.isActivated = false;
      return this.$nextTick();
    },
    triggerEvent: function triggerEvent(evnt) {
      var $refs = this.$refs,
          inputValue = this.inputValue;
      this.$emit(evnt.type, {
        $panel: $refs.panel,
        value: inputValue,
        $event: evnt
      });
    },
    emitModel: function emitModel(value, evnt) {
      this.inputValue = value;
      this.$emit('modelValue', value);
      this.$emit('input', {
        value: value,
        $event: evnt
      });

      if (_xeUtils.default.toValueString(this.value) !== value) {
        this.$emit('change', {
          value: value,
          $event: evnt
        });
      }
    },
    emitInputEvent: function emitInputEvent(value, evnt) {
      var inpImmediate = this.inpImmediate,
          isDatePickerType = this.isDatePickerType;
      this.inputValue = value;

      if (!isDatePickerType) {
        if (inpImmediate) {
          this.emitModel(value, evnt);
        } else {
          this.$emit('input', {
            value: value,
            $event: evnt
          });
        }
      }
    },
    inputEvent: function inputEvent(evnt) {
      var value = evnt.target.value;
      this.emitInputEvent(value, evnt);
    },
    changeEvent: function changeEvent(evnt) {
      var inpImmediate = this.inpImmediate;

      if (!inpImmediate) {
        this.triggerEvent(evnt);
      }
    },
    focusEvent: function focusEvent(evnt) {
      this.isActivated = true;
      this.triggerEvent(evnt);
    },
    blurEvent: function blurEvent(evnt) {
      var inputValue = this.inputValue,
          inpImmediate = this.inpImmediate;
      var value = inputValue;

      if (!inpImmediate) {
        this.emitModel(value, evnt);
      }

      this.afterCheckValue();

      if (!this.visiblePanel) {
        this.isActivated = false;
      }

      this.$emit('blur', {
        value: value,
        $event: evnt
      });
    },
    keydownEvent: function keydownEvent(evnt) {
      var exponential = this.exponential,
          controls = this.controls,
          isNumType = this.isNumType;

      if (isNumType) {
        var isCtrlKey = evnt.ctrlKey;
        var isShiftKey = evnt.shiftKey;
        var isAltKey = evnt.altKey;
        var keyCode = evnt.keyCode;

        if (!isCtrlKey && !isShiftKey && !isAltKey && (keyCode === 32 || (!exponential || keyCode !== 69) && keyCode >= 65 && keyCode <= 90 || keyCode >= 186 && keyCode <= 188 || keyCode >= 191)) {
          evnt.preventDefault();
        }

        if (controls) {
          this.numberKeydownEvent(evnt);
        }
      }

      this.triggerEvent(evnt);
    },
    wheelEvent: function wheelEvent(evnt) {
      if (this.isNumType && this.controls) {
        if (this.isActivated) {
          var delta = evnt.deltaY;

          if (delta > 0) {
            this.numberNextEvent(evnt);
          } else if (delta < 0) {
            this.numberPrevEvent(evnt);
          }

          evnt.preventDefault();
        }
      }

      this.triggerEvent(evnt);
    },
    clickEvent: function clickEvent(evnt) {
      var isDatePickerType = this.isDatePickerType;

      if (isDatePickerType) {
        this.datePickerOpenEvent(evnt);
      }

      this.triggerEvent(evnt);
    },
    clickPrefixEvent: function clickPrefixEvent(evnt) {
      var $refs = this.$refs,
          disabled = this.disabled,
          inputValue = this.inputValue;

      if (!disabled) {
        this.$emit('prefix-click', {
          $panel: $refs.panel,
          value: inputValue,
          $event: evnt
        });
      }
    },
    clickSuffixEvent: function clickSuffixEvent(evnt) {
      var $refs = this.$refs,
          disabled = this.disabled,
          inputValue = this.inputValue;

      if (!disabled) {
        if (_dom.default.hasClass(evnt.currentTarget, 'is--clear')) {
          this.emitModel('', evnt);
          this.clearValueEvent(evnt, '');
        } else {
          this.$emit('suffix-click', {
            $panel: $refs.panel,
            value: inputValue,
            $event: evnt
          });
        }
      }
    },
    clearValueEvent: function clearValueEvent(evnt, value) {
      var $refs = this.$refs,
          type = this.type,
          isNumType = this.isNumType;

      if (this.isDatePickerType) {
        this.hidePanel();
      }

      if (isNumType || ['text', 'search', 'password'].indexOf(type) > -1) {
        this.focus();
      }

      this.$emit('clear', {
        $panel: $refs.panel,
        value: value,
        $event: evnt
      });
    },
    parseDate: function parseDate(value, format) {
      var type = this.type;

      if (type === 'time') {
        return (0, _date.toStringTimeDate)(value);
      }

      return _xeUtils.default.toStringDate(value, format);
    },

    /**
     * 检查初始值
     */
    initValue: function initValue() {
      var type = this.type,
          isDatePickerType = this.isDatePickerType,
          inputValue = this.inputValue,
          digitsValue = this.digitsValue;

      if (isDatePickerType) {
        this.changeValue();
      } else if (type === 'float') {
        if (inputValue) {
          var validValue = (0, _number.toFloatValueFixed)(inputValue, digitsValue);

          if (inputValue !== validValue) {
            this.emitModel(validValue, {
              type: 'init'
            });
          }
        }
      }
    },

    /**
     * 值变化时处理
     */
    changeValue: function changeValue() {
      if (this.isDatePickerType) {
        this.dateParseValue(this.inputValue);
        this.inputValue = this.datePanelLabel;
      }
    },
    afterCheckValue: function afterCheckValue() {
      var type = this.type,
          exponential = this.exponential,
          inpReadonly = this.inpReadonly,
          inputValue = this.inputValue,
          isDatePickerType = this.isDatePickerType,
          isNumType = this.isNumType,
          datetimePanelValue = this.datetimePanelValue,
          dateLabelFormat = this.dateLabelFormat,
          min = this.min,
          max = this.max,
          firstDayOfWeek = this.firstDayOfWeek;

      if (!inpReadonly) {
        if (isNumType) {
          if (inputValue) {
            var inpNumVal = type === 'integer' ? _xeUtils.default.toInteger((0, _number.handleNumber)(inputValue)) : _xeUtils.default.toNumber((0, _number.handleNumber)(inputValue));

            if (!this.vaildMinNum(inpNumVal)) {
              inpNumVal = min;
            } else if (!this.vaildMaxNum(inpNumVal)) {
              inpNumVal = max;
            }

            if (exponential) {
              var inpStringVal = _xeUtils.default.toValueString(inputValue).toLowerCase();

              if (inpStringVal === _xeUtils.default.toNumber(inpNumVal).toExponential()) {
                inpNumVal = inpStringVal;
              }
            }

            this.emitModel(getNumberValue(this, inpNumVal), {
              type: 'check'
            });
          }
        } else if (isDatePickerType) {
          if (inputValue) {
            if (type === 'week' || type === 'quarter') {// 周和季度选择器不支持解析，无需处理
            } else {
              var inpDateVal = this.parseDate(inputValue, dateLabelFormat);

              if (_xeUtils.default.isValidDate(inpDateVal)) {
                if (type === 'time') {
                  inpDateVal = (0, _date.toStringTimeDate)(inpDateVal);

                  if (inputValue !== inpDateVal) {
                    this.emitModel(inpDateVal, {
                      type: 'check'
                    });
                  }

                  this.inputValue = inpDateVal;
                } else {
                  var isChange = false;

                  if (type === 'datetime') {
                    if (inputValue !== _xeUtils.default.toDateString(this.dateValue, dateLabelFormat) || inputValue !== _xeUtils.default.toDateString(inpDateVal, dateLabelFormat)) {
                      isChange = true;
                      datetimePanelValue.setHours(inpDateVal.getHours());
                      datetimePanelValue.setMinutes(inpDateVal.getMinutes());
                      datetimePanelValue.setSeconds(inpDateVal.getSeconds());
                    }
                  } else {
                    isChange = true;
                  }

                  this.inputValue = _xeUtils.default.toDateString(inpDateVal, dateLabelFormat, {
                    firstDay: firstDayOfWeek
                  });

                  if (isChange) {
                    this.dateChange(inpDateVal);
                  }
                }
              } else {
                this.dateRevert();
              }
            }
          } else {
            this.emitModel('', {
              type: 'check'
            });
          }
        }
      }
    },
    // 密码
    passwordToggleEvent: function passwordToggleEvent(evnt) {
      var disabled = this.disabled,
          readonly = this.readonly,
          showPwd = this.showPwd;

      if (!disabled && !readonly) {
        this.showPwd = !showPwd;
      }

      this.$emit('toggle-visible', {
        visible: this.showPwd,
        $event: evnt
      });
    },
    // 密码
    // 搜索
    searchEvent: function searchEvent(evnt) {
      this.$emit('search-click', {
        $event: evnt
      });
    },
    // 搜索
    // 数值
    vaildMinNum: function vaildMinNum(num) {
      return this.min === null || num >= _xeUtils.default.toNumber(this.min);
    },
    vaildMaxNum: function vaildMaxNum(num) {
      return this.max === null || num <= _xeUtils.default.toNumber(this.max);
    },
    numberStopDown: function numberStopDown() {
      clearTimeout(this.downbumTimeout);
    },
    numberDownPrevEvent: function numberDownPrevEvent(evnt) {
      var _this = this;

      this.downbumTimeout = setTimeout(function () {
        _this.numberPrevEvent(evnt);

        _this.numberDownPrevEvent(evnt);
      }, 60);
    },
    numberDownNextEvent: function numberDownNextEvent(evnt) {
      var _this2 = this;

      this.downbumTimeout = setTimeout(function () {
        _this2.numberNextEvent(evnt);

        _this2.numberDownNextEvent(evnt);
      }, 60);
    },
    numberKeydownEvent: function numberKeydownEvent(evnt) {
      var keyCode = evnt.keyCode;
      var isUpArrow = keyCode === 38;
      var isDwArrow = keyCode === 40;

      if (isUpArrow || isDwArrow) {
        evnt.preventDefault();

        if (isUpArrow) {
          this.numberPrevEvent(evnt);
        } else {
          this.numberNextEvent(evnt);
        }
      }
    },
    numberMousedownEvent: function numberMousedownEvent(evnt) {
      var _this3 = this;

      this.numberStopDown();

      if (evnt.button === 0) {
        var isPrevNumber = _dom.default.hasClass(evnt.currentTarget, 'is--prev');

        if (isPrevNumber) {
          this.numberPrevEvent(evnt);
        } else {
          this.numberNextEvent(evnt);
        }

        this.downbumTimeout = setTimeout(function () {
          if (isPrevNumber) {
            _this3.numberDownPrevEvent(evnt);
          } else {
            _this3.numberDownNextEvent(evnt);
          }
        }, 500);
      }
    },
    numberPrevEvent: function numberPrevEvent(evnt) {
      var disabled = this.disabled,
          readonly = this.readonly;
      clearTimeout(this.downbumTimeout);

      if (!disabled && !readonly) {
        this.numberChange(true, evnt);
      }

      this.$emit('prev-number', {
        $event: evnt
      });
    },
    numberNextEvent: function numberNextEvent(evnt) {
      var disabled = this.disabled,
          readonly = this.readonly;
      clearTimeout(this.downbumTimeout);

      if (!disabled && !readonly) {
        this.numberChange(false, evnt);
      }

      this.$emit('next-number', {
        $event: evnt
      });
    },
    numberChange: function numberChange(isPlus, evnt) {
      var min = this.min,
          max = this.max,
          type = this.type,
          inputValue = this.inputValue,
          stepValue = this.stepValue;
      var numValue = type === 'integer' ? _xeUtils.default.toInteger((0, _number.handleNumber)(inputValue)) : _xeUtils.default.toNumber((0, _number.handleNumber)(inputValue));
      var newValue = isPlus ? _xeUtils.default.add(numValue, stepValue) : _xeUtils.default.subtract(numValue, stepValue);
      var restNum;

      if (!this.vaildMinNum(newValue)) {
        restNum = min;
      } else if (!this.vaildMaxNum(newValue)) {
        restNum = max;
      } else {
        restNum = newValue;
      }

      this.emitInputEvent(getNumberValue(this, restNum), evnt);
    },
    // 数值
    // 日期
    datePickerOpenEvent: function datePickerOpenEvent(evnt) {
      var readonly = this.readonly;

      if (!readonly) {
        evnt.preventDefault();
        this.showPanel();
      }
    },
    dateMonthHandle: function dateMonthHandle(date, offsetMonth) {
      this.selectMonth = _xeUtils.default.getWhatMonth(date, offsetMonth, 'first');
    },
    dateNowHandle: function dateNowHandle() {
      var currentDate = _xeUtils.default.getWhatDay(Date.now(), 0, 'first');

      this.currentDate = currentDate;
      this.dateMonthHandle(currentDate, 0);
    },
    dateToggleTypeEvent: function dateToggleTypeEvent() {
      var datePanelType = this.datePanelType;

      if (datePanelType === 'month' || datePanelType === 'quarter') {
        datePanelType = 'year';
      } else {
        datePanelType = 'month';
      }

      this.datePanelType = datePanelType;
    },
    datePrevEvent: function datePrevEvent(evnt) {
      var isDisabledPrevDateBtn = this.isDisabledPrevDateBtn,
          type = this.type,
          datePanelType = this.datePanelType;

      if (!isDisabledPrevDateBtn) {
        if (type === 'year') {
          this.selectMonth = _xeUtils.default.getWhatYear(this.selectMonth, -yearSize, 'first');
        } else if (type === 'month' || type === 'quarter') {
          if (datePanelType === 'year') {
            this.selectMonth = _xeUtils.default.getWhatYear(this.selectMonth, -yearSize, 'first');
          } else {
            this.selectMonth = _xeUtils.default.getWhatYear(this.selectMonth, -1, 'first');
          }
        } else {
          if (datePanelType === 'year') {
            this.selectMonth = _xeUtils.default.getWhatYear(this.selectMonth, -yearSize, 'first');
          } else if (datePanelType === 'month') {
            this.selectMonth = _xeUtils.default.getWhatYear(this.selectMonth, -1, 'first');
          } else {
            this.selectMonth = _xeUtils.default.getWhatMonth(this.selectMonth, -1, 'first');
          }
        }

        this.$emit('date-prev', {
          type: type,
          $event: evnt
        });
      }
    },
    dateTodayMonthEvent: function dateTodayMonthEvent(evnt) {
      this.dateNowHandle();
      this.dateChange(this.currentDate);
      this.hidePanel();
      this.$emit('date-today', {
        type: this.type,
        $event: evnt
      });
    },
    dateNextEvent: function dateNextEvent(evnt) {
      var isDisabledNextDateBtn = this.isDisabledNextDateBtn,
          type = this.type,
          datePanelType = this.datePanelType;

      if (!isDisabledNextDateBtn) {
        if (type === 'year') {
          this.selectMonth = _xeUtils.default.getWhatYear(this.selectMonth, yearSize, 'first');
        } else if (type === 'month' || type === 'quarter') {
          if (datePanelType === 'year') {
            this.selectMonth = _xeUtils.default.getWhatYear(this.selectMonth, yearSize, 'first');
          } else {
            this.selectMonth = _xeUtils.default.getWhatYear(this.selectMonth, 1, 'first');
          }
        } else {
          if (datePanelType === 'year') {
            this.selectMonth = _xeUtils.default.getWhatYear(this.selectMonth, yearSize, 'first');
          } else if (datePanelType === 'month') {
            this.selectMonth = _xeUtils.default.getWhatYear(this.selectMonth, 1, 'first');
          } else {
            this.selectMonth = _xeUtils.default.getWhatMonth(this.selectMonth, 1, 'first');
          }
        }

        this.$emit('date-next', {
          type: type,
          $event: evnt
        });
      }
    },
    dateSelectEvent: function dateSelectEvent(item) {
      if (!isDateDisabled(this, item)) {
        this.dateSelectItem(item.date);
      }
    },
    dateSelectItem: function dateSelectItem(date) {
      var type = this.type,
          datePanelType = this.datePanelType;
      var isWeekType = type === 'week';

      if (type === 'month') {
        if (datePanelType === 'year') {
          this.datePanelType = 'month';
          this.dateCheckMonth(date);
        } else {
          this.dateChange(date);
          this.hidePanel();
        }
      } else if (type === 'year') {
        this.hidePanel();
        this.dateChange(date);
      } else if (type === 'quarter') {
        if (datePanelType === 'year') {
          this.datePanelType = 'quarter';
          this.dateCheckMonth(date);
        } else {
          this.dateChange(date);
          this.hidePanel();
        }
      } else {
        if (datePanelType === 'month') {
          this.datePanelType = type === 'week' ? type : 'day';
          this.dateCheckMonth(date);
        } else if (datePanelType === 'year') {
          this.datePanelType = 'month';
          this.dateCheckMonth(date);
        } else {
          this.dateChange(date);
          this.hidePanel();
        }
      }

      if (isWeekType) {
        this.changeValue();
      }
    },
    dateMouseenterEvent: function dateMouseenterEvent(item) {
      if (!isDateDisabled(this, item)) {
        var datePanelType = this.datePanelType;

        if (datePanelType === 'month') {
          this.dateMoveMonth(item.date);
        } else if (datePanelType === 'quarter') {
          this.dateMoveQuarter(item.date);
        } else if (datePanelType === 'year') {
          this.dateMoveYear(item.date);
        } else {
          this.dateMoveDay(item.date);
        }
      }
    },
    dateHourEvent: function dateHourEvent(evnt, item) {
      this.datetimePanelValue.setHours(item.value);
      this.dateTimeChangeEvent(evnt);
    },
    dateConfirmEvent: function dateConfirmEvent() {
      this.dateChange(this.dateValue || this.currentDate);
      this.hidePanel();
    },
    dateMinuteEvent: function dateMinuteEvent(evnt, item) {
      this.datetimePanelValue.setMinutes(item.value);
      this.dateTimeChangeEvent(evnt);
    },
    dateSecondEvent: function dateSecondEvent(evnt, item) {
      this.datetimePanelValue.setSeconds(item.value);
      this.dateTimeChangeEvent(evnt);
    },
    dateTimeChangeEvent: function dateTimeChangeEvent(evnt) {
      this.datetimePanelValue = new Date(this.datetimePanelValue.getTime());
      this.updateTimePos(evnt.currentTarget);
    },
    updateTimePos: function updateTimePos(liElem) {
      if (liElem) {
        var height = liElem.offsetHeight;
        liElem.parentNode.scrollTop = liElem.offsetTop - height * 4;
      }
    },
    dateMoveDay: function dateMoveDay(offsetDay) {
      if (!isDateDisabled(this, {
        date: offsetDay
      })) {
        if (!this.dayList.some(function (item) {
          return _xeUtils.default.isDateSame(item.date, offsetDay, 'yyyyMMdd');
        })) {
          this.dateCheckMonth(offsetDay);
        }

        this.dateParseValue(offsetDay);
      }
    },
    dateMoveMonth: function dateMoveMonth(offsetMonth) {
      if (!isDateDisabled(this, {
        date: offsetMonth
      })) {
        if (!this.monthList.some(function (item) {
          return _xeUtils.default.isDateSame(item.date, offsetMonth, 'yyyyMM');
        })) {
          this.dateCheckMonth(offsetMonth);
        }

        this.dateParseValue(offsetMonth);
      }
    },
    dateMoveQuarter: function dateMoveQuarter(offsetQuarter) {
      if (!isDateDisabled(this, {
        date: offsetQuarter
      })) {
        if (!this.quarterList.some(function (item) {
          return _xeUtils.default.isDateSame(item.date, offsetQuarter, 'yyyyq');
        })) {
          this.dateCheckMonth(offsetQuarter);
        }

        this.dateParseValue(offsetQuarter);
      }
    },
    dateMoveYear: function dateMoveYear(offsetYear) {
      if (!isDateDisabled(this, {
        date: offsetYear
      })) {
        if (!this.yearList.some(function (item) {
          return _xeUtils.default.isDateSame(item.date, offsetYear, 'yyyy');
        })) {
          this.dateCheckMonth(offsetYear);
        }

        this.dateParseValue(offsetYear);
      }
    },
    dateParseValue: function dateParseValue(date) {
      var type = this.type,
          dateLabelFormat = this.dateLabelFormat,
          valueFormat = this.valueFormat,
          firstDayOfWeek = this.firstDayOfWeek;
      var dValue = null;
      var dLabel = '';

      if (date) {
        dValue = this.parseDate(date, valueFormat);
      }

      if (_xeUtils.default.isValidDate(dValue)) {
        dLabel = _xeUtils.default.toDateString(dValue, dateLabelFormat, {
          firstDay: firstDayOfWeek
        }); // 由于年份和第几周是冲突的行为，所以需要特殊处理，判断是否跨年

        if (dateLabelFormat && type === 'week') {
          var firstWeekDate = _xeUtils.default.getWhatWeek(dValue, 0, firstDayOfWeek, firstDayOfWeek);

          if (firstWeekDate.getFullYear() < dValue.getFullYear()) {
            var yyIndex = dateLabelFormat.indexOf('yyyy');

            if (yyIndex > -1) {
              var yyNum = Number(dLabel.substring(yyIndex, yyIndex + 4));

              if (yyNum && !isNaN(yyNum)) {
                dLabel = dLabel.replace("".concat(yyNum), "".concat(yyNum - 1));
              }
            }
          }
        }
      } else {
        dValue = null;
      }

      this.datePanelValue = dValue;
      this.datePanelLabel = dLabel;
    },
    dateOffsetEvent: function dateOffsetEvent(evnt) {
      var isActivated = this.isActivated,
          datePanelValue = this.datePanelValue,
          datePanelType = this.datePanelType,
          firstDayOfWeek = this.firstDayOfWeek;

      if (isActivated) {
        evnt.preventDefault();
        var keyCode = evnt.keyCode;
        var isLeftArrow = keyCode === 37;
        var isUpArrow = keyCode === 38;
        var isRightArrow = keyCode === 39;
        var isDwArrow = keyCode === 40;

        if (datePanelType === 'year') {
          var offsetYear = _xeUtils.default.getWhatYear(datePanelValue || Date.now(), 0, 'first');

          if (isLeftArrow) {
            offsetYear = _xeUtils.default.getWhatYear(offsetYear, -1);
          } else if (isUpArrow) {
            offsetYear = _xeUtils.default.getWhatYear(offsetYear, -4);
          } else if (isRightArrow) {
            offsetYear = _xeUtils.default.getWhatYear(offsetYear, 1);
          } else if (isDwArrow) {
            offsetYear = _xeUtils.default.getWhatYear(offsetYear, 4);
          }

          this.dateMoveYear(offsetYear);
        } else if (datePanelType === 'quarter') {
          var offsetQuarter = _xeUtils.default.getWhatQuarter(datePanelValue || Date.now(), 0, 'first');

          if (isLeftArrow) {
            offsetQuarter = _xeUtils.default.getWhatQuarter(offsetQuarter, -1);
          } else if (isUpArrow) {
            offsetQuarter = _xeUtils.default.getWhatQuarter(offsetQuarter, -2);
          } else if (isRightArrow) {
            offsetQuarter = _xeUtils.default.getWhatQuarter(offsetQuarter, 1);
          } else if (isDwArrow) {
            offsetQuarter = _xeUtils.default.getWhatQuarter(offsetQuarter, 2);
          }

          this.dateMoveQuarter(offsetQuarter);
        } else if (datePanelType === 'month') {
          var offsetMonth = _xeUtils.default.getWhatMonth(datePanelValue || Date.now(), 0, 'first');

          if (isLeftArrow) {
            offsetMonth = _xeUtils.default.getWhatMonth(offsetMonth, -1);
          } else if (isUpArrow) {
            offsetMonth = _xeUtils.default.getWhatMonth(offsetMonth, -4);
          } else if (isRightArrow) {
            offsetMonth = _xeUtils.default.getWhatMonth(offsetMonth, 1);
          } else if (isDwArrow) {
            offsetMonth = _xeUtils.default.getWhatMonth(offsetMonth, 4);
          }

          this.dateMoveMonth(offsetMonth);
        } else {
          var offsetDay = datePanelValue || _xeUtils.default.getWhatDay(Date.now(), 0, 'first');

          if (isLeftArrow) {
            offsetDay = _xeUtils.default.getWhatDay(offsetDay, -1);
          } else if (isUpArrow) {
            offsetDay = _xeUtils.default.getWhatWeek(offsetDay, -1, firstDayOfWeek);
          } else if (isRightArrow) {
            offsetDay = _xeUtils.default.getWhatDay(offsetDay, 1);
          } else if (isDwArrow) {
            offsetDay = _xeUtils.default.getWhatWeek(offsetDay, 1, firstDayOfWeek);
          }

          this.dateMoveDay(offsetDay);
        }
      }
    },
    datePgOffsetEvent: function datePgOffsetEvent(evnt) {
      var isActivated = this.isActivated;

      if (isActivated) {
        var isPgUp = evnt.keyCode === 33;
        evnt.preventDefault();

        if (isPgUp) {
          this.datePrevEvent(evnt);
        } else {
          this.dateNextEvent(evnt);
        }
      }
    },
    dateChange: function dateChange(date) {
      var value = this.value,
          datetimePanelValue = this.datetimePanelValue,
          dateValueFormat = this.dateValueFormat,
          firstDayOfWeek = this.firstDayOfWeek;

      if (this.type === 'week') {
        var sWeek = _xeUtils.default.toNumber(this.selectDay);

        date = _xeUtils.default.getWhatWeek(date, 0, sWeek, firstDayOfWeek);
      } else if (this.hasTime) {
        date.setHours(datetimePanelValue.getHours());
        date.setMinutes(datetimePanelValue.getMinutes());
        date.setSeconds(datetimePanelValue.getSeconds());
      }

      var inpVal = _xeUtils.default.toDateString(date, dateValueFormat, {
        firstDay: firstDayOfWeek
      });

      this.dateCheckMonth(date);

      if (!_xeUtils.default.isEqual(value, inpVal)) {
        this.emitModel(inpVal, {
          type: 'update'
        });
      }
    },
    dateCheckMonth: function dateCheckMonth(date) {
      var month = _xeUtils.default.getWhatMonth(date, 0, 'first');

      if (!_xeUtils.default.isEqual(month, this.selectMonth)) {
        this.selectMonth = month;
      }
    },
    dateOpenPanel: function dateOpenPanel() {
      var _this4 = this;

      var type = this.type,
          dateValue = this.dateValue;

      if (['year', 'quarter', 'month', 'week'].indexOf(type) > -1) {
        this.datePanelType = type;
      } else {
        this.datePanelType = 'day';
      }

      this.currentDate = _xeUtils.default.getWhatDay(Date.now(), 0, 'first');

      if (dateValue) {
        this.dateMonthHandle(dateValue, 0);
        this.dateParseValue(dateValue);
      } else {
        this.dateNowHandle();
      }

      if (this.hasTime) {
        this.datetimePanelValue = this.datePanelValue || _xeUtils.default.getWhatDay(Date.now(), 0, 'first');
        this.$nextTick(function () {
          _xeUtils.default.arrayEach(_this4.$refs.timeBody.querySelectorAll('li.is--selected'), _this4.updateTimePos);
        });
      }
    },
    dateRevert: function dateRevert() {
      this.inputValue = this.datePanelLabel;
    },
    // 日期
    // 弹出面板
    updateZindex: function updateZindex() {
      if (this.panelIndex < _utils.default.getLastZIndex()) {
        this.panelIndex = _utils.default.nextZIndex();
      }
    },
    showPanel: function showPanel() {
      var _this5 = this;

      var disabled = this.disabled,
          visiblePanel = this.visiblePanel,
          isDatePickerType = this.isDatePickerType;

      if (!disabled && !visiblePanel) {
        clearTimeout(this.hidePanelTimeout);
        this.isActivated = true;
        this.animatVisible = true;

        if (isDatePickerType) {
          this.dateOpenPanel();
        }

        setTimeout(function () {
          _this5.visiblePanel = true;
        }, 10);
        this.updateZindex();
        this.updatePlacement();
      }
    },
    hidePanel: function hidePanel() {
      var _this6 = this;

      this.visiblePanel = false;
      this.hidePanelTimeout = setTimeout(function () {
        _this6.animatVisible = false;
      }, 350);
    },
    updatePlacement: function updatePlacement() {
      var _this7 = this;

      return this.$nextTick().then(function () {
        var $refs = _this7.$refs,
            transfer = _this7.transfer,
            placement = _this7.placement,
            panelIndex = _this7.panelIndex;
        var targetElem = $refs.input;
        var panelElem = $refs.panel;

        if (targetElem && panelElem) {
          var targetHeight = targetElem.offsetHeight;
          var targetWidth = targetElem.offsetWidth;
          var panelHeight = panelElem.offsetHeight;
          var panelWidth = panelElem.offsetWidth;
          var marginSize = 5;
          var panelStyle = {
            zIndex: panelIndex
          };

          var _DomTools$getAbsolute = _dom.default.getAbsolutePos(targetElem),
              boundingTop = _DomTools$getAbsolute.boundingTop,
              boundingLeft = _DomTools$getAbsolute.boundingLeft,
              visibleHeight = _DomTools$getAbsolute.visibleHeight,
              visibleWidth = _DomTools$getAbsolute.visibleWidth;

          var panelPlacement = 'bottom';

          if (transfer) {
            var left = boundingLeft;
            var top = boundingTop + targetHeight;

            if (placement === 'top') {
              panelPlacement = 'top';
              top = boundingTop - panelHeight;
            } else if (!placement) {
              // 如果下面不够放，则向上
              if (top + panelHeight + marginSize > visibleHeight) {
                panelPlacement = 'top';
                top = boundingTop - panelHeight;
              } // 如果上面不够放，则向下（优先）


              if (top < marginSize) {
                panelPlacement = 'bottom';
                top = boundingTop + targetHeight;
              }
            } // 如果溢出右边


            if (left + panelWidth + marginSize > visibleWidth) {
              left -= left + panelWidth + marginSize - visibleWidth;
            } // 如果溢出左边


            if (left < marginSize) {
              left = marginSize;
            }

            Object.assign(panelStyle, {
              left: "".concat(left, "px"),
              top: "".concat(top, "px"),
              minWidth: "".concat(targetWidth, "px")
            });
          } else {
            if (placement === 'top') {
              panelPlacement = 'top';
              panelStyle.bottom = "".concat(targetHeight, "px");
            } else if (!placement) {
              // 如果下面不够放，则向上
              if (boundingTop + targetHeight + panelHeight > visibleHeight) {
                // 如果上面不够放，则向下（优先）
                if (boundingTop - targetHeight - panelHeight > marginSize) {
                  panelPlacement = 'top';
                  panelStyle.bottom = "".concat(targetHeight, "px");
                }
              }
            }
          }

          _this7.panelStyle = panelStyle;
          _this7.panelPlacement = panelPlacement;
          return _this7.$nextTick();
        }
      });
    },
    // 弹出面板
    // 全局事件
    handleGlobalMousedownEvent: function handleGlobalMousedownEvent(evnt) {
      var $refs = this.$refs,
          $el = this.$el,
          disabled = this.disabled,
          visiblePanel = this.visiblePanel,
          isActivated = this.isActivated;

      if (!disabled && isActivated) {
        this.isActivated = _dom.default.getEventTargetNode(evnt, $el).flag || _dom.default.getEventTargetNode(evnt, $refs.panel).flag;

        if (!this.isActivated) {
          // 如果是日期类型
          if (this.isDatePickerType) {
            if (visiblePanel) {
              this.hidePanel();
              this.afterCheckValue();
            }
          } else {
            this.afterCheckValue();
          }
        }
      }
    },
    handleGlobalKeydownEvent: function handleGlobalKeydownEvent(evnt) {
      var isDatePickerType = this.isDatePickerType,
          visiblePanel = this.visiblePanel,
          clearable = this.clearable,
          disabled = this.disabled;

      if (!disabled) {
        var keyCode = evnt.keyCode;
        var isTab = keyCode === 9;
        var isDel = keyCode === 46;
        var isEsc = keyCode === 27;
        var isEnter = keyCode === 13;
        var isLeftArrow = keyCode === 37;
        var isUpArrow = keyCode === 38;
        var isRightArrow = keyCode === 39;
        var isDwArrow = keyCode === 40;
        var isPgUp = keyCode === 33;
        var isPgDn = keyCode === 34;
        var operArrow = isLeftArrow || isUpArrow || isRightArrow || isDwArrow;
        var isActivated = this.isActivated;

        if (isTab) {
          if (isActivated) {
            this.afterCheckValue();
          }

          isActivated = false;
          this.isActivated = isActivated;
        } else if (operArrow) {
          if (isDatePickerType) {
            if (isActivated) {
              if (visiblePanel) {
                this.dateOffsetEvent(evnt);
              } else if (isUpArrow || isDwArrow) {
                this.datePickerOpenEvent(evnt);
              }
            }
          }
        } else if (isEnter) {
          if (isDatePickerType) {
            if (visiblePanel) {
              if (this.datePanelValue) {
                this.dateSelectItem(this.datePanelValue);
              } else {
                this.hidePanel();
              }
            } else if (isActivated) {
              this.datePickerOpenEvent(evnt);
            }
          }
        } else if (isPgUp || isPgDn) {
          if (isDatePickerType) {
            if (isActivated) {
              this.datePgOffsetEvent(evnt);
            }
          }
        }

        if (isTab || isEsc) {
          if (visiblePanel) {
            this.hidePanel();
          }
        } else if (isDel && clearable) {
          if (isActivated) {
            this.clearValueEvent(evnt, null);
          }
        }
      }
    },
    handleGlobalMousewheelEvent: function handleGlobalMousewheelEvent(evnt) {
      var $refs = this.$refs,
          disabled = this.disabled,
          visiblePanel = this.visiblePanel;

      if (!disabled) {
        if (visiblePanel) {
          if (_dom.default.getEventTargetNode(evnt, $refs.panel).flag) {
            this.updatePlacement();
          } else {
            this.hidePanel();
            this.afterCheckValue();
          }
        }
      }
    },
    handleGlobalBlurEvent: function handleGlobalBlurEvent() {
      var isActivated = this.isActivated,
          visiblePanel = this.visiblePanel;

      if (visiblePanel) {
        this.hidePanel();
        this.afterCheckValue();
      } else if (isActivated) {
        this.afterCheckValue();
      }
    } // 全局事件

  }
};
exports.default = _default2;