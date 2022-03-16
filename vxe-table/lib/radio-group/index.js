"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.RadioGroup = void 0;

var _group = _interopRequireDefault(require("../radio/src/group"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var RadioGroup = Object.assign(_group.default, {
  install: function install(Vue) {
    Vue.component(_group.default.name, _group.default);
  }
});
exports.RadioGroup = RadioGroup;
var _default = RadioGroup;
exports.default = _default;