"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.Button = void 0;

var _button = _interopRequireDefault(require("./src/button"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Button = Object.assign(_button.default, {
  install: function install(Vue) {
    Vue.component(_button.default.name, _button.default);
  }
});
exports.Button = Button;
var _default = Button;
exports.default = _default;