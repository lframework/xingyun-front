"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.FormItem = void 0;

var _formItem = _interopRequireDefault(require("../form/src/form-item"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var FormItem = Object.assign(_formItem.default, {
  install: function install(Vue) {
    Vue.component(_formItem.default.name, _formItem.default);
  }
});
exports.FormItem = FormItem;
var _default = FormItem;
exports.default = _default;