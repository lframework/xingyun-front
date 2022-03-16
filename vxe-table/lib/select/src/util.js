"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.assemOption = assemOption;
exports.createOption = createOption;
exports.destroyOption = destroyOption;
exports.getOptionConfig = getOptionConfig;
exports.isOption = isOption;

var _xeUtils = _interopRequireDefault(require("xe-utils"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }

var OptionConfig = /*#__PURE__*/function () {
  function OptionConfig($xeselect, _vm) {
    _classCallCheck(this, OptionConfig);

    Object.assign(this, {
      value: _vm.value,
      label: _vm.label,
      visible: _vm.visible,
      className: _vm.className,
      disabled: _vm.disabled
    });
  }

  _createClass(OptionConfig, [{
    key: "update",
    value: function update(name, value) {
      this[name] = value;
    }
  }]);

  return OptionConfig;
}();

function isOption(option) {
  return option instanceof OptionConfig;
}

function getOptionConfig($xeselect, _vm, options) {
  return isOption(_vm) ? _vm : new OptionConfig($xeselect, _vm, options);
}

function createOption($xeselect, _vm) {
  return getOptionConfig($xeselect, _vm);
}

function destroyOption(_vm) {
  var $xeselect = _vm.$xeselect,
      optionConfig = _vm.optionConfig;

  var matchObj = _xeUtils.default.findTree($xeselect.collectOption, function (option) {
    return option === optionConfig;
  }, {
    children: 'options'
  });

  if (matchObj) {
    matchObj.items.splice(matchObj.index, 1);
  }
}

function assemOption(_vm) {
  var $el = _vm.$el,
      $xeselect = _vm.$xeselect,
      $xeoptgroup = _vm.$xeoptgroup,
      optionConfig = _vm.optionConfig;
  var groupConfig = $xeoptgroup ? $xeoptgroup.optionConfig : null;

  if (groupConfig) {
    // 子选项才允许自定义插槽
    optionConfig.slots = _vm.$slots;

    if (!groupConfig.options) {
      groupConfig.options = [];
    }

    groupConfig.options.splice([].indexOf.call($xeoptgroup.$el.children, $el), 0, optionConfig);
  } else {
    $xeselect.collectOption.splice([].indexOf.call($xeselect.$refs.hideOption.children, $el), 0, optionConfig);
  }
}