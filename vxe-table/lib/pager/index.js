"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.Pager = void 0;

var _pager = _interopRequireDefault(require("./src/pager"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Pager = Object.assign(_pager.default, {
  install: function install(Vue) {
    Vue.component(_pager.default.name, _pager.default);
  }
});
exports.Pager = Pager;
var _default = Pager;
exports.default = _default;