"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _column = _interopRequireDefault(require("./column"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _default = {
  name: 'VxeColgroup',
  extends: _column.default,
  provide: function provide() {
    return {
      xecolgroup: this,
      $xegrid: null
    };
  }
};
exports.default = _default;