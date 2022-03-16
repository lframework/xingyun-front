"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.Optgroup = void 0;

var _optgroup = _interopRequireDefault(require("../select/src/optgroup"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Optgroup = Object.assign(_optgroup.default, {
  install: function install(Vue) {
    Vue.component(_optgroup.default.name, _optgroup.default);
  }
});
exports.Optgroup = Optgroup;
var _default = Optgroup;
exports.default = _default;