"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.CheckboxGroup = void 0;

var _group = _interopRequireDefault(require("../checkbox/src/group"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var CheckboxGroup = Object.assign(_group.default, {
  install: function install(Vue) {
    Vue.component(_group.default.name, _group.default);
  }
});
exports.CheckboxGroup = CheckboxGroup;
var _default = CheckboxGroup;
exports.default = _default;