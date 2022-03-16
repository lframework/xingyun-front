"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.Textarea = void 0;

var _textarea = _interopRequireDefault(require("./src/textarea"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Textarea = Object.assign(_textarea.default, {
  install: function install(Vue) {
    Vue.component(_textarea.default.name, _textarea.default);
  }
});
exports.Textarea = Textarea;
var _default = Textarea;
exports.default = _default;