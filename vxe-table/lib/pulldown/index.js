"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.Pulldown = void 0;

var _pulldown = _interopRequireDefault(require("./src/pulldown"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Pulldown = Object.assign(_pulldown.default, {
  install: function install(Vue) {
    Vue.component(_pulldown.default.name, _pulldown.default);
  }
});
exports.Pulldown = Pulldown;
var _default = Pulldown;
exports.default = _default;