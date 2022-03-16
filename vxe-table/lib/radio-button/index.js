"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.RadioButton = void 0;

var _button = _interopRequireDefault(require("../radio/src/button"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var RadioButton = Object.assign(_button.default, {
  install: function install(Vue) {
    Vue.component(_button.default.name, _button.default);
  }
});
exports.RadioButton = RadioButton;
var _default = RadioButton;
exports.default = _default;