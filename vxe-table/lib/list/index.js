"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.List = void 0;

var _list = _interopRequireDefault(require("./src/list"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var List = Object.assign(_list.default, {
  install: function install(Vue) {
    Vue.component(_list.default.name, _list.default);
  }
});
exports.List = List;
var _default = List;
exports.default = _default;