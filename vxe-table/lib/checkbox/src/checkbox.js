"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _utils = require("../../tools/utils");

var _xeUtils = _interopRequireDefault(require("xe-utils"));

var _conf = _interopRequireDefault(require("../../v-x-e-table/src/conf"));

var _size = _interopRequireDefault(require("../../mixins/size"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var _default2 = {
  name: 'VxeCheckbox',
  mixins: [_size.default],
  props: {
    value: [String, Number, Boolean],
    label: [String, Number],
    indeterminate: Boolean,
    title: [String, Number],
    content: [String, Number],
    checkedValue: {
      type: [String, Number, Boolean],
      default: true
    },
    uncheckedValue: {
      type: [String, Number, Boolean],
      default: false
    },
    disabled: Boolean,
    size: {
      type: String,
      default: function _default() {
        return _conf.default.checkbox.size || _conf.default.size;
      }
    }
  },
  inject: {
    $xecheckboxgroup: {
      default: null
    }
  },
  computed: {
    isGroup: function isGroup() {
      return this.$xecheckboxgroup;
    },
    isDisabled: function isDisabled() {
      return this.disabled || this.isGroup && this.$xecheckboxgroup.disabled;
    }
  },
  render: function render(h) {
    var _ref;

    var $scopedSlots = this.$scopedSlots,
        $xecheckboxgroup = this.$xecheckboxgroup,
        isGroup = this.isGroup,
        isDisabled = this.isDisabled,
        title = this.title,
        vSize = this.vSize,
        indeterminate = this.indeterminate,
        value = this.value,
        label = this.label,
        content = this.content,
        checkedValue = this.checkedValue;
    var attrs = {};

    if (title) {
      attrs.title = title;
    }

    return h('label', {
      class: ['vxe-checkbox', (_ref = {}, _defineProperty(_ref, "size--".concat(vSize), vSize), _defineProperty(_ref, 'is--indeterminate', indeterminate), _defineProperty(_ref, 'is--disabled', isDisabled), _ref)],
      attrs: attrs
    }, [h('input', {
      class: 'vxe-checkbox--input',
      attrs: {
        type: 'checkbox',
        disabled: isDisabled
      },
      domProps: {
        checked: isGroup ? _xeUtils.default.includes($xecheckboxgroup.value, label) : value === checkedValue
      },
      on: {
        change: this.changeEvent
      }
    }), h('span', {
      class: 'vxe-checkbox--icon'
    }), h('span', {
      class: 'vxe-checkbox--label'
    }, $scopedSlots.default ? $scopedSlots.default.call(this, {}) : [(0, _utils.getFuncText)(content)])]);
  },
  methods: {
    changeEvent: function changeEvent(evnt) {
      var $xecheckboxgroup = this.$xecheckboxgroup,
          isGroup = this.isGroup,
          isDisabled = this.isDisabled,
          label = this.label,
          checkedValue = this.checkedValue,
          uncheckedValue = this.uncheckedValue;

      if (!isDisabled) {
        var checked = evnt.target.checked;
        var value = checked ? checkedValue : uncheckedValue;
        var params = {
          checked: checked,
          value: value,
          label: label,
          $event: evnt
        };

        if (isGroup) {
          $xecheckboxgroup.handleChecked(params);
        } else {
          this.$emit('input', value);
          this.$emit('change', params);
        }
      }
    }
  }
};
exports.default = _default2;