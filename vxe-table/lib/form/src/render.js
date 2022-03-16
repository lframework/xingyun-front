"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.renderTitle = renderTitle;

var _conf = _interopRequireDefault(require("../../v-x-e-table/src/conf"));

var _vXETable = _interopRequireDefault(require("../../v-x-e-table"));

var _utils = require("../../tools/utils");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function renderPrefixIcon(h, titlePrefix) {
  return h('span', {
    class: 'vxe-form--item-title-prefix'
  }, [h('i', {
    class: titlePrefix.icon || _conf.default.icon.FORM_PREFIX
  })]);
}

function renderSuffixIcon(h, titleSuffix) {
  return h('span', {
    class: 'vxe-form--item-title-suffix'
  }, [h('i', {
    class: titleSuffix.icon || _conf.default.icon.FORM_SUFFIX
  })]);
}

function renderTitle(h, _vm, item) {
  var data = _vm.data,
      tooltipOpts = _vm.tooltipOpts;
  var slots = item.slots,
      field = item.field,
      itemRender = item.itemRender,
      titlePrefix = item.titlePrefix,
      titleSuffix = item.titleSuffix;
  var compConf = (0, _utils.isEnableConf)(itemRender) ? _vXETable.default.renderer.get(itemRender.name) : null;
  var params = {
    data: data,
    property: field,
    item: item,
    $form: _vm
  };
  var contVNs = [];
  var titVNs = [];

  if (titlePrefix) {
    titVNs.push(titlePrefix.content || titlePrefix.message ? h('vxe-tooltip', {
      props: _objectSpread(_objectSpread(_objectSpread({}, tooltipOpts), titlePrefix), {}, {
        content: (0, _utils.getFuncText)(titlePrefix.content || titlePrefix.message)
      })
    }, [renderPrefixIcon(h, titlePrefix)]) : renderPrefixIcon(h, titlePrefix));
  }

  titVNs.push(h('span', {
    class: 'vxe-form--item-title-label'
  }, compConf && compConf.renderItemTitle ? compConf.renderItemTitle(itemRender, params) : slots && slots.title ? _vm.callSlot(slots.title, params, h) : (0, _utils.getFuncText)(item.title)));
  contVNs.push(h('div', {
    class: 'vxe-form--item-title-content'
  }, titVNs));
  var fixVNs = [];

  if (titleSuffix) {
    fixVNs.push(titleSuffix.content || titleSuffix.message ? h('vxe-tooltip', {
      props: _objectSpread(_objectSpread(_objectSpread({}, tooltipOpts), titlePrefix), {}, {
        content: (0, _utils.getFuncText)(titleSuffix.content || titleSuffix.message)
      })
    }, [renderSuffixIcon(h, titleSuffix)]) : renderSuffixIcon(h, titleSuffix));
  }

  contVNs.push(h('div', {
    class: 'vxe-form--item-title-postfix'
  }, fixVNs));
  return contVNs;
}