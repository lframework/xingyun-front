"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.Form = void 0;

var _form = _interopRequireDefault(require("./src/form"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Form = Object.assign(_form.default, {
  install: function install(Vue) {
    Vue.component(_form.default.name, _form.default);
  }
});
exports.Form = Form;
var _default = Form;
exports.default = _default;