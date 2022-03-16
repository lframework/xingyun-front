"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.Switch = void 0;

var _switch = _interopRequireDefault(require("./src/switch"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Switch = Object.assign(_switch.default, {
  install: function install(Vue) {
    Vue.component(_switch.default.name, _switch.default);
  }
});
exports.Switch = Switch;
var _default = Switch;
exports.default = _default;