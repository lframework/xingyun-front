"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _utils = require("../../tools/utils");

var _conf = _interopRequireDefault(require("../../v-x-e-table/src/conf"));

var _size = _interopRequireDefault(require("../../mixins/size"));

var _dom = require("../../tools/dom");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var _default2 = {
  name: 'VxeSwitch',
  mixins: [_size.default],
  props: {
    value: [String, Number, Boolean],
    disabled: Boolean,
    className: String,
    size: {
      type: String,
      default: function _default() {
        return _conf.default.switch.size || _conf.default.size;
      }
    },
    openLabel: String,
    closeLabel: String,
    openValue: {
      type: [String, Number, Boolean],
      default: true
    },
    closeValue: {
      type: [String, Number, Boolean],
      default: false
    },
    openIcon: String,
    closeIcon: String
  },
  data: function data() {
    return {
      isActivated: false,
      hasAnimat: false,
      offsetLeft: 0
    };
  },
  computed: {
    isChecked: function isChecked() {
      return this.value === this.openValue;
    },
    onShowLabel: function onShowLabel() {
      return (0, _utils.getFuncText)(this.openLabel);
    },
    offShowLabel: function offShowLabel() {
      return (0, _utils.getFuncText)(this.closeLabel);
    },
    styles: function styles() {
      return _dom.browse.msie && this.isChecked ? {
        left: "".concat(this.offsetLeft, "px")
      } : null;
    }
  },
  created: function created() {
    var _this = this;

    if (_dom.browse.msie) {
      this.$nextTick(function () {
        return _this.updateStyle();
      });
    }
  },
  render: function render(h) {
    var _ref;

    var isChecked = this.isChecked,
        vSize = this.vSize,
        className = this.className,
        disabled = this.disabled,
        openIcon = this.openIcon,
        closeIcon = this.closeIcon;
    return h('div', {
      class: ['vxe-switch', className, isChecked ? 'is--on' : 'is--off', (_ref = {}, _defineProperty(_ref, "size--".concat(vSize), vSize), _defineProperty(_ref, 'is--disabled', disabled), _defineProperty(_ref, 'is--animat', this.hasAnimat), _ref)]
    }, [h('button', {
      ref: 'btn',
      class: 'vxe-switch--button',
      attrs: {
        type: 'button',
        disabled: disabled
      },
      on: {
        click: this.clickEvent,
        focus: this.focusEvent,
        blur: this.blurEvent
      }
    }, [h('span', {
      class: 'vxe-switch--label vxe-switch--label-on'
    }, [openIcon ? h('i', {
      class: ['vxe-switch--label-icon', openIcon]
    }) : null, this.onShowLabel]), h('span', {
      class: 'vxe-switch--label vxe-switch--label-off'
    }, [closeIcon ? h('i', {
      class: ['vxe-switch--label-icon', closeIcon]
    }) : null, this.offShowLabel]), h('span', {
      class: 'vxe-switch--icon',
      style: this.styles
    })])]);
  },
  methods: {
    updateStyle: function updateStyle() {
      // 兼容 IE
      this.hasAnimat = true;
      this.offsetLeft = this.$refs.btn.offsetWidth;
    },
    clickEvent: function clickEvent(evnt) {
      var _this2 = this;

      if (!this.disabled) {
        clearTimeout(this.activeTimeout);
        var value = this.isChecked ? this.closeValue : this.openValue;
        this.hasAnimat = true;

        if (_dom.browse.msie) {
          this.updateStyle();
        }

        this.$emit('input', value);
        this.$emit('change', {
          value: value,
          $event: evnt
        });
        this.activeTimeout = setTimeout(function () {
          _this2.hasAnimat = false;
        }, 400);
      }
    },
    focusEvent: function focusEvent(evnt) {
      this.isActivated = true;
      this.$emit('focus', {
        value: this.value,
        $event: evnt
      });
    },
    blurEvent: function blurEvent(evnt) {
      this.isActivated = false;
      this.$emit('blur', {
        value: this.value,
        $event: evnt
      });
    }
  }
};
exports.default = _default2;