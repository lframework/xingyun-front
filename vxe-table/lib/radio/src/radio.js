"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _utils = require("../../tools/utils");

var _conf = _interopRequireDefault(require("../../v-x-e-table/src/conf"));

var _size = _interopRequireDefault(require("../../mixins/size"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var _default2 = {
  name: 'VxeRadio',
  mixins: [_size.default],
  props: {
    value: [String, Number, Boolean],
    label: [String, Number, Boolean],
    title: [String, Number],
    content: [String, Number],
    disabled: Boolean,
    name: String,
    strict: {
      type: Boolean,
      default: function _default() {
        return _conf.default.radio.strict;
      }
    },
    size: {
      type: String,
      default: function _default() {
        return _conf.default.radio.size || _conf.default.size;
      }
    }
  },
  inject: {
    $xeradiogroup: {
      default: null
    }
  },
  computed: {
    isDisabled: function isDisabled() {
      var $xeradiogroup = this.$xeradiogroup;
      return this.disabled || $xeradiogroup && $xeradiogroup.disabled;
    },
    isStrict: function isStrict() {
      var $xeradiogroup = this.$xeradiogroup;
      return $xeradiogroup ? $xeradiogroup.strict : this.strict;
    }
  },
  render: function render(h) {
    var _ref;

    var $scopedSlots = this.$scopedSlots,
        $xeradiogroup = this.$xeradiogroup,
        isDisabled = this.isDisabled,
        title = this.title,
        vSize = this.vSize,
        value = this.value,
        label = this.label,
        name = this.name,
        content = this.content;
    var attrs = {};

    if (title) {
      attrs.title = title;
    }

    return h('label', {
      class: ['vxe-radio', (_ref = {}, _defineProperty(_ref, "size--".concat(vSize), vSize), _defineProperty(_ref, 'is--disabled', isDisabled), _ref)],
      attrs: attrs
    }, [h('input', {
      class: 'vxe-radio--input',
      attrs: {
        type: 'radio',
        name: $xeradiogroup ? $xeradiogroup.name : name,
        disabled: isDisabled
      },
      domProps: {
        checked: $xeradiogroup ? $xeradiogroup.value === label : value === label
      },
      on: {
        change: this.changeEvent,
        click: this.clickEvent
      }
    }), h('span', {
      class: 'vxe-radio--icon'
    }), h('span', {
      class: 'vxe-radio--label'
    }, $scopedSlots.default ? $scopedSlots.default.call(this, {}) : [(0, _utils.getFuncText)(content)])]);
  },
  methods: {
    handleValue: function handleValue(label, evnt) {
      var $xeradiogroup = this.$xeradiogroup;
      var params = {
        label: label,
        $event: evnt
      };

      if ($xeradiogroup) {
        $xeradiogroup.handleChecked(params);
      } else {
        this.$emit('input', label);
        this.$emit('change', params);
      }
    },
    changeEvent: function changeEvent(evnt) {
      var isDisabled = this.isDisabled;

      if (!isDisabled) {
        this.handleValue(this.label, evnt);
      }
    },
    clickEvent: function clickEvent(evnt) {
      var $xeradiogroup = this.$xeradiogroup,
          isDisabled = this.isDisabled,
          isStrict = this.isStrict;

      if (!isDisabled && !isStrict) {
        if (this.label === ($xeradiogroup ? $xeradiogroup.value : this.value)) {
          this.handleValue(null, evnt);
        }
      }
    }
  }
};
exports.default = _default2;