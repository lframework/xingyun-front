"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.Option = void 0;

var _option = _interopRequireDefault(require("../select/src/option"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Option = Object.assign(_option.default, {
  install: function install(Vue) {
    Vue.component(_option.default.name, _option.default);
  }
});
exports.Option = Option;
var _default = Option;
exports.default = _default;