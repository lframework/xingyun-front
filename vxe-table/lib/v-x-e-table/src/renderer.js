"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.renderer = void 0;

var _xeUtils = _interopRequireDefault(require("xe-utils"));

var _conf = _interopRequireDefault(require("../../v-x-e-table/src/conf"));

var _utils = _interopRequireWildcard(require("../../tools/utils"));

var _log = require("../../tools/log");

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var defaultCompProps = {
  transfer: true
};
var componentDefaultModelProp = 'value';

function isEmptyValue(cellValue) {
  return cellValue === null || cellValue === undefined || cellValue === '';
}

function getChangeEvent(renderOpts) {
  switch (renderOpts.name) {
    case 'input':
    case 'textarea':
    case '$input':
    case '$textarea':
      return 'input';
  }

  return 'change';
}

function parseDate(value, props) {
  return value && props.valueFormat ? _xeUtils.default.toStringDate(value, props.valueFormat) : value;
}

function getFormatDate(value, props, defaultFormat) {
  var _props$dateConfig = props.dateConfig,
      dateConfig = _props$dateConfig === void 0 ? {} : _props$dateConfig;
  return _xeUtils.default.toDateString(parseDate(value, props), dateConfig.labelFormat || defaultFormat);
}

function getLabelFormatDate(value, props) {
  return getFormatDate(value, props, _conf.default.i18n("vxe.input.date.labelFormat.".concat(props.type)));
}

function getDefaultComponentName(_ref) {
  var name = _ref.name;
  return "vxe-".concat(name.replace('$', ''));
}

function handleConfirmFilter(params, checked, option) {
  var $panel = params.$panel;
  $panel.changeOption({}, checked, option);
}

function getNativeAttrs(_ref2) {
  var name = _ref2.name,
      attrs = _ref2.attrs;

  if (name === 'input') {
    attrs = Object.assign({
      type: 'text'
    }, attrs);
  }

  return attrs;
}

function getInputImmediateModel(renderOpts) {
  var name = renderOpts.name,
      immediate = renderOpts.immediate,
      props = renderOpts.props;

  if (!immediate) {
    if (name === '$input') {
      var _ref3 = props || {},
          type = _ref3.type;

      return !(!type || type === 'text' || type === 'number' || type === 'integer' || type === 'float');
    }

    if (name === 'input' || name === 'textarea' || name === '$textarea') {
      return false;
    }

    return true;
  }

  return immediate;
}

function isImmediateCell(renderOpts, params) {
  return params.$type === 'cell' || getInputImmediateModel(renderOpts);
}

function getCellEditProps(renderOpts, params, value, defaultProps) {
  var vSize = params.$table.vSize;
  return _xeUtils.default.assign({
    immediate: getInputImmediateModel(renderOpts)
  }, vSize ? {
    size: vSize
  } : {}, defaultCompProps, defaultProps, renderOpts.props, _defineProperty({}, componentDefaultModelProp, value));
}

function getFilterProps(renderOpts, params, value, defaultProps) {
  var vSize = params.$table.vSize;
  return _xeUtils.default.assign(vSize ? {
    size: vSize
  } : {}, defaultCompProps, defaultProps, renderOpts.props, _defineProperty({}, componentDefaultModelProp, value));
}

function getItemProps(renderOpts, params, value, defaultProps) {
  var vSize = params.$form.vSize;
  return _xeUtils.default.assign(vSize ? {
    size: vSize
  } : {}, defaultCompProps, defaultProps, renderOpts.props, _defineProperty({}, componentDefaultModelProp, value));
}

function getCellLabelVNs(h, renderOpts, params, cellLabel) {
  var placeholder = renderOpts.placeholder;
  return [h('span', {
    class: 'vxe-cell--label'
  }, placeholder && isEmptyValue(cellLabel) ? [h('span', {
    class: 'vxe-cell--placeholder'
  }, _utils.default.formatText((0, _utils.getFuncText)(placeholder), 1))] : _utils.default.formatText(cellLabel, 1))];
}

function getNativeOns(renderOpts, params) {
  var nativeEvents = renderOpts.nativeEvents;
  var nativeOns = {};

  _xeUtils.default.objectEach(nativeEvents, function (func, key) {
    nativeOns[key] = function () {
      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      func.apply(void 0, [params].concat(args));
    };
  });

  return nativeOns;
}

function getOns(renderOpts, params, inputFunc, changeFunc) {
  var name = renderOpts.name,
      events = renderOpts.events;
  var modelEvent = 'input';
  var changeEvent = getChangeEvent(renderOpts);
  var isSameEvent = changeEvent === modelEvent;
  var ons = {};

  _xeUtils.default.objectEach(events, function (func, key) {
    ons[key] = function () {
      for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        args[_key2] = arguments[_key2];
      }

      func.apply(void 0, [params].concat(args));
    };
  });

  if (inputFunc) {
    ons[modelEvent] = function (targetEvnt) {
      // 对输入框进行优化
      inputFunc(name === '$input' || name === '$textarea' ? targetEvnt.value : targetEvnt);

      if (events && events[modelEvent]) {
        events[modelEvent](params, targetEvnt);
      }

      if (isSameEvent && changeFunc) {
        changeFunc(targetEvnt);
      }
    };
  }

  if (!isSameEvent && changeFunc) {
    ons[changeEvent] = function () {
      for (var _len3 = arguments.length, args = new Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
        args[_key3] = arguments[_key3];
      }

      changeFunc.apply(void 0, args);

      if (events && events[changeEvent]) {
        events[changeEvent].apply(events, [params].concat(args));
      }
    };
  }

  return ons;
}

function getEditOns(renderOpts, params) {
  var $table = params.$table,
      row = params.row,
      column = params.column;
  var name = renderOpts.name;
  var model = column.model;
  var isImmediate = isImmediateCell(renderOpts, params);
  return getOns(renderOpts, params, function (cellValue) {
    // 处理 model 值双向绑定
    if (isImmediate) {
      _utils.default.setCellValue(row, column, cellValue);
    } else {
      model.update = true;
      model.value = cellValue;
    }
  }, function (eventParams) {
    // 处理 change 事件相关逻辑
    if (!isImmediate && (name === '$input' || name === '$textarea')) {
      $table.updateStatus(params, eventParams.value);
    } else {
      $table.updateStatus(params);
    }
  });
}

function getFilterOns(renderOpts, params, option) {
  return getOns(renderOpts, params, function (value) {
    // 处理 model 值双向绑定
    option.data = value;
  }, function () {
    handleConfirmFilter(params, !_xeUtils.default.eqNull(option.data), option);
  });
}

function getItemOns(renderOpts, params) {
  var $form = params.$form,
      data = params.data,
      property = params.property;
  return getOns(renderOpts, params, function (value) {
    // 处理 model 值双向绑定
    _xeUtils.default.set(data, property, value);
  }, function () {
    // 处理 change 事件相关逻辑
    $form.updateStatus(params);
  });
}

function getNativeEditOns(renderOpts, params) {
  var $table = params.$table,
      row = params.row,
      column = params.column;
  var model = column.model;
  return getOns(renderOpts, params, function (evnt) {
    // 处理 model 值双向绑定
    var cellValue = evnt.target.value;

    if (isImmediateCell(renderOpts, params)) {
      _utils.default.setCellValue(row, column, cellValue);
    } else {
      model.update = true;
      model.value = cellValue;
    }
  }, function (evnt) {
    // 处理 change 事件相关逻辑
    var cellValue = evnt.target.value;
    $table.updateStatus(params, cellValue);
  });
}

function getNativeFilterOns(renderOpts, params, option) {
  return getOns(renderOpts, params, function (evnt) {
    // 处理 model 值双向绑定
    option.data = evnt.target.value;
  }, function () {
    handleConfirmFilter(params, !_xeUtils.default.eqNull(option.data), option);
  });
}

function getNativeItemOns(renderOpts, params) {
  var $form = params.$form,
      data = params.data,
      property = params.property;
  return getOns(renderOpts, params, function (evnt) {
    // 处理 model 值双向绑定
    var itemValue = evnt.target.value;

    _xeUtils.default.set(data, property, itemValue);
  }, function () {
    // 处理 change 事件相关逻辑
    $form.updateStatus(params);
  });
}
/**
 * 单元格可编辑渲染-原生的标签
 * input、textarea、select
 */


function nativeEditRender(h, renderOpts, params) {
  var row = params.row,
      column = params.column;
  var name = renderOpts.name;
  var attrs = getNativeAttrs(renderOpts);
  var cellValue = isImmediateCell(renderOpts, params) ? _utils.default.getCellValue(row, column) : column.model.value;
  return [h(name, {
    class: "vxe-default-".concat(name),
    attrs: attrs,
    domProps: {
      value: cellValue
    },
    on: getNativeEditOns(renderOpts, params)
  })];
}

function defaultEditRender(h, renderOpts, params) {
  var row = params.row,
      column = params.column;

  var cellValue = _utils.default.getCellValue(row, column);

  return [h(getDefaultComponentName(renderOpts), {
    props: getCellEditProps(renderOpts, params, cellValue),
    on: getEditOns(renderOpts, params),
    nativeOn: getNativeOns(renderOpts, params)
  })];
}

function defaultButtonEditRender(h, renderOpts, params) {
  return [h('vxe-button', {
    props: getCellEditProps(renderOpts, params),
    on: getOns(renderOpts, params),
    nativeOn: getNativeOns(renderOpts, params)
  })];
}

function defaultButtonsEditRender(h, renderOpts, params) {
  return renderOpts.children.map(function (childRenderOpts) {
    return defaultButtonEditRender(h, childRenderOpts, params)[0];
  });
}

function renderNativeOptgroups(h, renderOpts, params, renderOptionsMethods) {
  var optionGroups = renderOpts.optionGroups,
      _renderOpts$optionGro = renderOpts.optionGroupProps,
      optionGroupProps = _renderOpts$optionGro === void 0 ? {} : _renderOpts$optionGro;
  var groupOptions = optionGroupProps.options || 'options';
  var groupLabel = optionGroupProps.label || 'label';
  return optionGroups.map(function (group, gIndex) {
    return h('optgroup', {
      key: gIndex,
      domProps: {
        label: group[groupLabel]
      }
    }, renderOptionsMethods(h, group[groupOptions], renderOpts, params));
  });
}
/**
 * 渲染原生的 option 标签
 */


function renderNativeOptions(h, options, renderOpts, params) {
  var _renderOpts$optionPro = renderOpts.optionProps,
      optionProps = _renderOpts$optionPro === void 0 ? {} : _renderOpts$optionPro;
  var row = params.row,
      column = params.column;
  var labelProp = optionProps.label || 'label';
  var valueProp = optionProps.value || 'value';
  var disabledProp = optionProps.disabled || 'disabled';
  var cellValue = isImmediateCell(renderOpts, params) ? _utils.default.getCellValue(row, column) : column.model.value;
  return options.map(function (option, oIndex) {
    return h('option', {
      key: oIndex,
      attrs: {
        value: option[valueProp],
        disabled: option[disabledProp]
      },
      domProps: {
        /* eslint-disable eqeqeq */
        selected: option[valueProp] == cellValue
      }
    }, option[labelProp]);
  });
}

function nativeFilterRender(h, renderOpts, params) {
  var column = params.column;
  var name = renderOpts.name;
  var attrs = getNativeAttrs(renderOpts);
  return column.filters.map(function (option, oIndex) {
    return h(name, {
      key: oIndex,
      class: "vxe-default-".concat(name),
      attrs: attrs,
      domProps: {
        value: option.data
      },
      on: getNativeFilterOns(renderOpts, params, option)
    });
  });
}

function defaultFilterRender(h, renderOpts, params) {
  var column = params.column;
  return column.filters.map(function (option, oIndex) {
    var optionValue = option.data;
    return h(getDefaultComponentName(renderOpts), {
      key: oIndex,
      props: getFilterProps(renderOpts, renderOpts, optionValue),
      on: getFilterOns(renderOpts, params, option)
    });
  });
}

function handleFilterMethod(_ref4) {
  var option = _ref4.option,
      row = _ref4.row,
      column = _ref4.column;
  var data = option.data;

  var cellValue = _xeUtils.default.get(row, column.property);
  /* eslint-disable eqeqeq */


  return cellValue == data;
}

function nativeSelectEditRender(h, renderOpts, params) {
  return [h('select', {
    class: 'vxe-default-select',
    attrs: getNativeAttrs(renderOpts),
    on: getNativeEditOns(renderOpts, params)
  }, renderOpts.optionGroups ? renderNativeOptgroups(h, renderOpts, params, renderNativeOptions) : renderNativeOptions(h, renderOpts.options, renderOpts, params))];
}

function defaultSelectEditRender(h, renderOpts, params) {
  var row = params.row,
      column = params.column;
  var options = renderOpts.options,
      optionProps = renderOpts.optionProps,
      optionGroups = renderOpts.optionGroups,
      optionGroupProps = renderOpts.optionGroupProps;

  var cellValue = _utils.default.getCellValue(row, column);

  return [h(getDefaultComponentName(renderOpts), {
    props: getCellEditProps(renderOpts, params, cellValue, {
      options: options,
      optionProps: optionProps,
      optionGroups: optionGroups,
      optionGroupProps: optionGroupProps
    }),
    on: getEditOns(renderOpts, params)
  })];
}

function getSelectCellValue(renderOpts, _ref5) {
  var row = _ref5.row,
      column = _ref5.column;
  var _renderOpts$props = renderOpts.props,
      props = _renderOpts$props === void 0 ? {} : _renderOpts$props,
      options = renderOpts.options,
      optionGroups = renderOpts.optionGroups,
      _renderOpts$optionPro2 = renderOpts.optionProps,
      optionProps = _renderOpts$optionPro2 === void 0 ? {} : _renderOpts$optionPro2,
      _renderOpts$optionGro2 = renderOpts.optionGroupProps,
      optionGroupProps = _renderOpts$optionGro2 === void 0 ? {} : _renderOpts$optionGro2;

  var cellValue = _xeUtils.default.get(row, column.property);

  var selectItem;
  var labelProp = optionProps.label || 'label';
  var valueProp = optionProps.value || 'value';

  if (!isEmptyValue(cellValue)) {
    return _xeUtils.default.map(props.multiple ? cellValue : [cellValue], optionGroups ? function (value) {
      var groupOptions = optionGroupProps.options || 'options';

      for (var index = 0; index < optionGroups.length; index++) {
        /* eslint-disable eqeqeq */
        selectItem = _xeUtils.default.find(optionGroups[index][groupOptions], function (item) {
          return item[valueProp] == value;
        });

        if (selectItem) {
          break;
        }
      }

      return selectItem ? selectItem[labelProp] : value;
    } : function (value) {
      /* eslint-disable eqeqeq */
      selectItem = _xeUtils.default.find(options, function (item) {
        return item[valueProp] == value;
      });
      return selectItem ? selectItem[labelProp] : value;
    }).join(', ');
  }

  return null;
}
/**
 * 渲染表单-项
 * 用于渲染原生的标签
 */


function nativeItemRender(h, renderOpts, params) {
  var data = params.data,
      property = params.property;
  var name = renderOpts.name;
  var attrs = getNativeAttrs(renderOpts);

  var itemValue = _xeUtils.default.get(data, property);

  return [h(name, {
    class: "vxe-default-".concat(name),
    attrs: attrs,
    domProps: attrs && name === 'input' && (attrs.type === 'submit' || attrs.type === 'reset') ? null : {
      value: itemValue
    },
    on: getNativeItemOns(renderOpts, params)
  })];
}

function defaultItemRender(h, renderOpts, params) {
  var data = params.data,
      property = params.property;

  var itemValue = _xeUtils.default.get(data, property);

  return [h(getDefaultComponentName(renderOpts), {
    props: getItemProps(renderOpts, params, itemValue),
    on: getItemOns(renderOpts, params),
    nativeOn: getNativeOns(renderOpts, params)
  })];
}

function defaultButtonItemRender(h, renderOpts, params) {
  return [h('vxe-button', {
    props: getItemProps(renderOpts, params),
    on: getOns(renderOpts, params),
    nativeOn: getNativeOns(renderOpts, params)
  })];
}

function defaultButtonsItemRender(h, renderOpts, params) {
  return renderOpts.children.map(function (childRenderOpts) {
    return defaultButtonItemRender(h, childRenderOpts, params)[0];
  });
}
/**
 * 渲染原生的 select 标签
 */


function renderNativeFormOptions(h, options, renderOpts, params) {
  var data = params.data,
      property = params.property;
  var _renderOpts$optionPro3 = renderOpts.optionProps,
      optionProps = _renderOpts$optionPro3 === void 0 ? {} : _renderOpts$optionPro3;
  var labelProp = optionProps.label || 'label';
  var valueProp = optionProps.value || 'value';
  var disabledProp = optionProps.disabled || 'disabled';

  var cellValue = _xeUtils.default.get(data, property);

  return options.map(function (item, oIndex) {
    return h('option', {
      key: oIndex,
      attrs: {
        value: item[valueProp],
        disabled: item[disabledProp]
      },
      domProps: {
        /* eslint-disable eqeqeq */
        selected: item[valueProp] == cellValue
      }
    }, item[labelProp]);
  });
}

function handleExportSelectMethod(params) {
  var row = params.row,
      column = params.column,
      options = params.options;
  return options.original ? _utils.default.getCellValue(row, column) : getSelectCellValue(column.editRender || column.cellRender, params);
}
/**
 * 渲染表单-项中
 * 单选框和复选框
 */


function defaultFormItemRadioAndCheckboxRender(h, renderOpts, params) {
  var options = renderOpts.options,
      _renderOpts$optionPro4 = renderOpts.optionProps,
      optionProps = _renderOpts$optionPro4 === void 0 ? {} : _renderOpts$optionPro4;
  var data = params.data,
      property = params.property;
  var labelProp = optionProps.label || 'label';
  var valueProp = optionProps.value || 'value';
  var disabledProp = optionProps.disabled || 'disabled';

  var itemValue = _xeUtils.default.get(data, property);

  var name = getDefaultComponentName(renderOpts); // 如果是分组

  if (options) {
    return [h("".concat(name, "-group"), {
      props: getItemProps(renderOpts, params, itemValue),
      on: getItemOns(renderOpts, params),
      nativeOn: getNativeOns(renderOpts, params)
    }, options.map(function (item, index) {
      return h(name, {
        key: index,
        props: {
          label: item[valueProp],
          content: item[labelProp],
          disabled: item[disabledProp]
        }
      });
    }))];
  }

  return [h(name, {
    props: getItemProps(renderOpts, params, itemValue),
    on: getItemOns(renderOpts, params),
    nativeOn: getNativeOns(renderOpts, params)
  })];
}
/**
 * 内置的组件渲染
 */


var renderMap = {
  input: {
    autofocus: 'input',
    renderEdit: nativeEditRender,
    renderDefault: nativeEditRender,
    renderFilter: nativeFilterRender,
    defaultFilterMethod: handleFilterMethod,
    renderItemContent: nativeItemRender
  },
  textarea: {
    autofocus: 'textarea',
    renderEdit: nativeEditRender,
    renderItemContent: nativeItemRender
  },
  select: {
    renderEdit: nativeSelectEditRender,
    renderDefault: nativeSelectEditRender,
    renderCell: function renderCell(h, renderOpts, params) {
      return getCellLabelVNs(h, renderOpts, params, getSelectCellValue(renderOpts, params));
    },
    renderFilter: function renderFilter(h, renderOpts, params) {
      var column = params.column;
      return column.filters.map(function (option, oIndex) {
        return h('select', {
          key: oIndex,
          class: 'vxe-default-select',
          attrs: getNativeAttrs(renderOpts),
          on: getNativeFilterOns(renderOpts, params, option)
        }, renderOpts.optionGroups ? renderNativeOptgroups(h, renderOpts, params, renderNativeOptions) : renderNativeOptions(h, renderOpts.options, renderOpts, params));
      });
    },
    defaultFilterMethod: handleFilterMethod,
    renderItemContent: function renderItemContent(h, renderOpts, params) {
      return [h('select', {
        class: 'vxe-default-select',
        attrs: getNativeAttrs(renderOpts),
        on: getNativeItemOns(renderOpts, params)
      }, renderOpts.optionGroups ? renderNativeOptgroups(h, renderOpts, params, renderNativeFormOptions) : renderNativeFormOptions(h, renderOpts.options, renderOpts, params))];
    },
    cellExportMethod: handleExportSelectMethod
  },
  $input: {
    autofocus: '.vxe-input--inner',
    renderEdit: defaultEditRender,
    renderCell: function renderCell(h, renderOpts, params) {
      var _renderOpts$props2 = renderOpts.props,
          props = _renderOpts$props2 === void 0 ? {} : _renderOpts$props2;
      var row = params.row,
          column = params.column;
      var digits = props.digits || _conf.default.input.digits;

      var cellValue = _xeUtils.default.get(row, column.property);

      if (cellValue) {
        switch (props.type) {
          case 'date':
          case 'week':
          case 'month':
          case 'year':
            cellValue = getLabelFormatDate(cellValue, props);
            break;

          case 'float':
            cellValue = _xeUtils.default.toFixed(_xeUtils.default.floor(cellValue, digits), digits);
            break;
        }
      }

      return getCellLabelVNs(h, renderOpts, params, cellValue);
    },
    renderDefault: defaultEditRender,
    renderFilter: defaultFilterRender,
    defaultFilterMethod: handleFilterMethod,
    renderItemContent: defaultItemRender
  },
  $textarea: {
    autofocus: '.vxe-textarea--inner',
    renderItemContent: defaultItemRender
  },
  $button: {
    renderDefault: defaultButtonEditRender,
    renderItemContent: defaultButtonItemRender
  },
  $buttons: {
    renderDefault: defaultButtonsEditRender,
    renderItemContent: defaultButtonsItemRender
  },
  $select: {
    autofocus: '.vxe-input--inner',
    renderEdit: defaultSelectEditRender,
    renderDefault: defaultSelectEditRender,
    renderCell: function renderCell(h, renderOpts, params) {
      return getCellLabelVNs(h, renderOpts, params, getSelectCellValue(renderOpts, params));
    },
    renderFilter: function renderFilter(h, renderOpts, params) {
      var column = params.column;
      var options = renderOpts.options,
          optionProps = renderOpts.optionProps,
          optionGroups = renderOpts.optionGroups,
          optionGroupProps = renderOpts.optionGroupProps;
      var nativeOn = getNativeOns(renderOpts, params);
      return column.filters.map(function (option, oIndex) {
        var optionValue = option.data;
        return h(getDefaultComponentName(renderOpts), {
          key: oIndex,
          props: getFilterProps(renderOpts, params, optionValue, {
            options: options,
            optionProps: optionProps,
            optionGroups: optionGroups,
            optionGroupProps: optionGroupProps
          }),
          on: getFilterOns(renderOpts, params, option),
          nativeOn: nativeOn
        });
      });
    },
    defaultFilterMethod: handleFilterMethod,
    renderItemContent: function renderItemContent(h, renderOpts, params) {
      var data = params.data,
          property = params.property;
      var options = renderOpts.options,
          optionProps = renderOpts.optionProps,
          optionGroups = renderOpts.optionGroups,
          optionGroupProps = renderOpts.optionGroupProps;

      var itemValue = _xeUtils.default.get(data, property);

      return [h(getDefaultComponentName(renderOpts), {
        props: getItemProps(renderOpts, params, itemValue, {
          options: options,
          optionProps: optionProps,
          optionGroups: optionGroups,
          optionGroupProps: optionGroupProps
        }),
        on: getItemOns(renderOpts, params),
        nativeOn: getNativeOns(renderOpts, params)
      })];
    },
    cellExportMethod: handleExportSelectMethod
  },
  $radio: {
    autofocus: '.vxe-radio--input',
    renderItemContent: defaultFormItemRadioAndCheckboxRender
  },
  $checkbox: {
    autofocus: '.vxe-checkbox--input',
    renderItemContent: defaultFormItemRadioAndCheckboxRender
  },
  $switch: {
    autofocus: '.vxe-switch--button',
    renderEdit: defaultEditRender,
    renderDefault: defaultEditRender,
    renderItemContent: defaultItemRender
  }
};
/**
 * 全局渲染器
 */

var renderer = {
  mixin: function mixin(map) {
    _xeUtils.default.each(map, function (options, name) {
      return renderer.add(name, options);
    });

    return renderer;
  },
  get: function get(name) {
    return renderMap[name] || null;
  },
  add: function add(name, options) {
    if (name && options) {
      var renders = renderMap[name];

      if (renders) {
        // 检测是否覆盖
        if (process.env.NODE_ENV === 'development') {
          _xeUtils.default.each(options, function (val, key) {
            if (!_xeUtils.default.eqNull(renders[key]) && renders[key] !== val) {
              (0, _log.warnLog)('vxe.error.coverProp', ["Renderer.".concat(name), key]);
            }
          });
        }

        Object.assign(renders, options);
      } else {
        renderMap[name] = options;
      }
    }

    return renderer;
  },
  delete: function _delete(name) {
    delete renderMap[name];
    return renderer;
  }
};
exports.renderer = renderer;