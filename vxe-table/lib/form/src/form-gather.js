"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _formItem = _interopRequireDefault(require("./form-item"));

var _log = require("../../tools/log");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _default = {
  name: 'VxeFormGather',
  extends: _formItem.default,
  provide: function provide() {
    return {
      xeformgather: this
    };
  },
  created: function created() {
    var _this = this;

    if (process.env.NODE_ENV === 'development') {
      this.$nextTick(function () {
        if (_this.$xeform && _this.$xeform.customLayout) {
          (0, _log.errLog)('vxe.error.errConflicts', ['custom-layout', '<form-gather ...>']);
        }
      });
    }
  },
  render: function render(h) {
    return h('div', this.$slots.default);
  }
};
exports.default = _default;