"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.Colgroup = void 0;

var _group = _interopRequireDefault(require("../table/src/group"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Colgroup = Object.assign(_group.default, {
  install: function install(Vue) {
    Vue.component(_group.default.name, _group.default); // 兼容旧用法

    Vue.component('VxeTableColgroup', _group.default);
  }
});
exports.Colgroup = Colgroup;
var _default = Colgroup;
exports.default = _default;