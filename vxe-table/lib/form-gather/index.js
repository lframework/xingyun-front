"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.FormGather = void 0;

var _formGather = _interopRequireDefault(require("../form/src/form-gather"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var FormGather = Object.assign(_formGather.default, {
  install: function install(Vue) {
    Vue.component(_formGather.default.name, _formGather.default);
  }
});
exports.FormGather = FormGather;
var _default = FormGather;
exports.default = _default;