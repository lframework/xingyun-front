"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.Radio = void 0;

var _radio = _interopRequireDefault(require("./src/radio"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Radio = Object.assign(_radio.default, {
  install: function install(Vue) {
    Vue.component(_radio.default.name, _radio.default);
  }
});
exports.Radio = Radio;
var _default = Radio;
exports.default = _default;