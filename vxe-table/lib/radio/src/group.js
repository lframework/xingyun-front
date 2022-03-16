"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _xeUtils = _interopRequireDefault(require("xe-utils"));

var _conf = _interopRequireDefault(require("../../v-x-e-table/src/conf"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _default2 = {
  name: 'VxeRadioGroup',
  props: {
    value: [String, Number, Boolean],
    disabled: Boolean,
    strict: {
      type: Boolean,
      default: function _default() {
        return _conf.default.radioGroup.strict;
      }
    },
    size: {
      type: String,
      default: function _default() {
        return _conf.default.radioGroup.size || _conf.default.size;
      }
    }
  },
  provide: function provide() {
    return {
      $xeradiogroup: this
    };
  },
  computed: {
    vSize: function vSize() {
      return this.size || this.$parent.size || this.$parent.vSize;
    }
  },
  data: function data() {
    return {
      name: _xeUtils.default.uniqueId('xegroup_')
    };
  },
  render: function render(h) {
    var $scopedSlots = this.$scopedSlots;
    return h('div', {
      class: 'vxe-radio-group'
    }, $scopedSlots.default ? $scopedSlots.default.call(this, {}) : []);
  },
  methods: {
    handleChecked: function handleChecked(params) {
      this.$emit('input', params.label);
      this.$emit('change', params);
    }
  }
};
exports.default = _default2;