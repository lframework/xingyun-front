"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.Input = void 0;

var _input = _interopRequireDefault(require("./src/input"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Input = Object.assign(_input.default, {
  install: function install(Vue) {
    Vue.component(_input.default.name, _input.default);
  }
});
exports.Input = Input;
var _default = Input;
exports.default = _default;