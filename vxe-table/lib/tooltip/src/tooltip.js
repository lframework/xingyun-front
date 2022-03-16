"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _xeUtils = _interopRequireDefault(require("xe-utils"));

var _conf = _interopRequireDefault(require("../../v-x-e-table/src/conf"));

var _size = _interopRequireDefault(require("../../mixins/size"));

var _utils = _interopRequireDefault(require("../../tools/utils"));

var _dom = _interopRequireDefault(require("../../tools/dom"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function updateTipStyle(_vm) {
  var wrapperElem = _vm.$el,
      tipTarget = _vm.tipTarget,
      tipStore = _vm.tipStore;

  if (tipTarget) {
    var _DomTools$getDomNode = _dom.default.getDomNode(),
        scrollTop = _DomTools$getDomNode.scrollTop,
        scrollLeft = _DomTools$getDomNode.scrollLeft,
        visibleWidth = _DomTools$getDomNode.visibleWidth;

    var _DomTools$getAbsolute = _dom.default.getAbsolutePos(tipTarget),
        top = _DomTools$getAbsolute.top,
        left = _DomTools$getAbsolute.left;

    var marginSize = 6;
    var offsetHeight = wrapperElem.offsetHeight;
    var offsetWidth = wrapperElem.offsetWidth;
    var tipTop = top - offsetHeight - marginSize;
    var tipLeft = Math.max(marginSize, left + Math.floor((tipTarget.offsetWidth - offsetWidth) / 2));

    if (tipLeft + offsetWidth + marginSize > scrollLeft + visibleWidth) {
      tipLeft = scrollLeft + visibleWidth - offsetWidth - marginSize;
    }

    if (top - offsetHeight < scrollTop + marginSize) {
      tipStore.placement = 'bottom';
      tipTop = top + tipTarget.offsetHeight + marginSize;
    }

    tipStore.style.top = "".concat(tipTop, "px");
    tipStore.style.left = "".concat(tipLeft, "px");
    tipStore.arrowStyle.left = "".concat(left - tipLeft + tipTarget.offsetWidth / 2, "px");
  }
}

function showTip(_vm) {
  var $el = _vm.$el,
      tipStore = _vm.tipStore,
      zIndex = _vm.zIndex;
  var parentNode = $el.parentNode;

  if (!parentNode) {
    document.body.appendChild($el);
  }

  _vm.updateValue(true);

  _vm.updateZindex();

  tipStore.placement = 'top';
  tipStore.style = {
    width: 'auto',
    left: 0,
    top: 0,
    zIndex: zIndex || _vm.tipZindex
  };
  tipStore.arrowStyle = {
    left: '50%'
  };
  return _vm.updatePlacement();
}

function renderContent(h, _vm) {
  var $scopedSlots = _vm.$scopedSlots,
      useHTML = _vm.useHTML,
      tipContent = _vm.tipContent;

  if ($scopedSlots.content) {
    return h('div', {
      key: 1,
      class: 'vxe-table--tooltip-content'
    }, $scopedSlots.content.call(this, {}));
  }

  if (useHTML) {
    return h('div', {
      key: 2,
      class: 'vxe-table--tooltip-content',
      domProps: {
        innerHTML: tipContent
      }
    });
  }

  return h('div', {
    key: 3,
    class: 'vxe-table--tooltip-content'
  }, _utils.default.formatText(tipContent));
}

var _default2 = {
  name: 'VxeTooltip',
  mixins: [_size.default],
  props: {
    value: Boolean,
    size: {
      type: String,
      default: function _default() {
        return _conf.default.tooltip.size || _conf.default.size;
      }
    },
    trigger: {
      type: String,
      default: function _default() {
        return _conf.default.tooltip.trigger;
      }
    },
    theme: {
      type: String,
      default: function _default() {
        return _conf.default.tooltip.theme;
      }
    },
    content: {
      type: [String, Number],
      default: null
    },
    useHTML: Boolean,
    zIndex: [String, Number],
    isArrow: {
      type: Boolean,
      default: true
    },
    enterable: Boolean,
    enterDelay: {
      type: Number,
      default: function _default() {
        return _conf.default.tooltip.enterDelay;
      }
    },
    leaveDelay: {
      type: Number,
      default: function _default() {
        return _conf.default.tooltip.leaveDelay;
      }
    }
  },
  data: function data() {
    return {
      isUpdate: false,
      visible: false,
      tipContent: '',
      tipActive: false,
      tipTarget: null,
      tipZindex: 0,
      tipStore: {
        style: {},
        placement: '',
        arrowStyle: null
      }
    };
  },
  watch: {
    content: function content(value) {
      this.tipContent = value;
    },
    value: function value(_value) {
      if (!this.isUpdate) {
        this[_value ? 'open' : 'close']();
      }

      this.isUpdate = false;
    }
  },
  created: function created() {
    var _this = this;

    this.showDelayTip = _xeUtils.default.debounce(function () {
      if (_this.tipActive) {
        showTip(_this);
      }
    }, this.enterDelay, {
      leading: false,
      trailing: true
    });
  },
  mounted: function mounted() {
    var $el = this.$el,
        trigger = this.trigger,
        content = this.content,
        value = this.value;
    var parentNode = $el.parentNode;
    var target;
    this.tipContent = content;
    this.tipZindex = _utils.default.nextZIndex();

    _xeUtils.default.arrayEach($el.children, function (elem, index) {
      if (index > 1) {
        parentNode.insertBefore(elem, $el);

        if (!target) {
          target = elem;
        }
      }
    });

    parentNode.removeChild($el);
    this.target = target;

    if (target) {
      if (trigger === 'hover') {
        target.onmouseleave = this.targetMouseleaveEvent;
        target.onmouseenter = this.targetMouseenterEvent;
      } else if (trigger === 'click') {
        target.onclick = this.clickEvent;
      }
    }

    if (value) {
      this.open();
    }
  },
  beforeDestroy: function beforeDestroy() {
    var $el = this.$el,
        target = this.target,
        trigger = this.trigger;
    var parentNode = $el.parentNode;

    if (parentNode) {
      parentNode.removeChild($el);
    }

    if (target) {
      if (trigger === 'hover') {
        target.onmouseenter = null;
        target.onmouseleave = null;
      } else if (trigger === 'click') {
        target.onclick = null;
      }
    }
  },
  render: function render(h) {
    var _ref;

    var $scopedSlots = this.$scopedSlots,
        vSize = this.vSize,
        theme = this.theme,
        tipActive = this.tipActive,
        isArrow = this.isArrow,
        visible = this.visible,
        tipStore = this.tipStore,
        enterable = this.enterable;
    var on;

    if (enterable) {
      on = {
        mouseenter: this.wrapperMouseenterEvent,
        mouseleave: this.wrapperMouseleaveEvent
      };
    }

    return h('div', {
      class: ['vxe-table--tooltip-wrapper', "theme--".concat(theme), (_ref = {}, _defineProperty(_ref, "size--".concat(vSize), vSize), _defineProperty(_ref, "placement--".concat(tipStore.placement), tipStore.placement), _defineProperty(_ref, 'is--enterable', enterable), _defineProperty(_ref, 'is--visible', visible), _defineProperty(_ref, 'is--arrow', isArrow), _defineProperty(_ref, 'is--actived', tipActive), _ref)],
      style: tipStore.style,
      ref: 'tipWrapper',
      on: on
    }, [renderContent(h, this), h('div', {
      class: 'vxe-table--tooltip-arrow',
      style: tipStore.arrowStyle
    })].concat($scopedSlots.default ? $scopedSlots.default.call(this, {}) : []));
  },
  methods: {
    open: function open(target, content) {
      return this.toVisible(target || this.target, content);
    },
    close: function close() {
      this.tipTarget = null;
      this.tipActive = false;
      Object.assign(this.tipStore, {
        style: {},
        placement: '',
        arrowStyle: null
      });
      this.updateValue(false);
      return this.$nextTick();
    },
    updateValue: function updateValue(value) {
      if (value !== this.visible) {
        this.visible = value;
        this.isUpdate = true;

        if (this.$listeners.input) {
          this.$emit('input', this.visible);
        }
      }
    },
    updateZindex: function updateZindex() {
      if (this.tipZindex < _utils.default.getLastZIndex()) {
        this.tipZindex = _utils.default.nextZIndex();
      }
    },
    toVisible: function toVisible(target, content) {
      if (target) {
        var trigger = this.trigger,
            enterDelay = this.enterDelay;
        this.tipActive = true;
        this.tipTarget = target;

        if (content) {
          this.tipContent = content;
        }

        if (enterDelay && trigger === 'hover') {
          this.showDelayTip();
        } else {
          return showTip(this);
        }
      }

      return this.$nextTick();
    },
    updatePlacement: function updatePlacement() {
      var _this2 = this;

      return this.$nextTick().then(function () {
        var wrapperElem = _this2.$el,
            tipTarget = _this2.tipTarget;

        if (tipTarget && wrapperElem) {
          updateTipStyle(_this2);
          return _this2.$nextTick().then(function () {
            return updateTipStyle(_this2);
          });
        }
      });
    },
    isActived: function isActived() {
      return this.tipActive;
    },
    setActived: function setActived(actived) {
      this.tipActive = !!actived;
    },
    clickEvent: function clickEvent() {
      this[this.visible ? 'close' : 'open']();
    },
    targetMouseenterEvent: function targetMouseenterEvent() {
      this.open();
    },
    targetMouseleaveEvent: function targetMouseleaveEvent() {
      var _this3 = this;

      var trigger = this.trigger,
          enterable = this.enterable,
          leaveDelay = this.leaveDelay;
      this.tipActive = false;

      if (enterable && trigger === 'hover') {
        setTimeout(function () {
          if (!_this3.tipActive) {
            _this3.close();
          }
        }, leaveDelay);
      } else {
        this.close();
      }
    },
    wrapperMouseenterEvent: function wrapperMouseenterEvent() {
      this.tipActive = true;
    },
    wrapperMouseleaveEvent: function wrapperMouseleaveEvent() {
      var _this4 = this;

      var trigger = this.trigger,
          enterable = this.enterable,
          leaveDelay = this.leaveDelay;
      this.tipActive = false;

      if (enterable && trigger === 'hover') {
        setTimeout(function () {
          if (!_this4.tipActive) {
            _this4.close();
          }
        }, leaveDelay);
      }
    }
  }
};
exports.default = _default2;