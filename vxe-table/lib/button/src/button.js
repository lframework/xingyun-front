"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _xeUtils = _interopRequireDefault(require("xe-utils"));

var _conf = _interopRequireDefault(require("../../v-x-e-table/src/conf"));

var _size = _interopRequireDefault(require("../../mixins/size"));

var _utils = _interopRequireWildcard(require("../../tools/utils"));

var _dom = _interopRequireDefault(require("../../tools/dom"));

var _event = require("../../tools/event");

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var _default2 = {
  name: 'VxeButton',
  mixins: [_size.default],
  props: {
    type: String,
    size: {
      type: String,
      default: function _default() {
        return _conf.default.button.size || _conf.default.size;
      }
    },
    name: [String, Number],
    content: String,
    placement: String,
    status: String,
    icon: String,
    round: Boolean,
    circle: Boolean,
    disabled: Boolean,
    loading: Boolean,
    destroyOnClose: Boolean,
    className: String,
    transfer: {
      type: Boolean,
      default: function _default() {
        return _conf.default.button.transfer;
      }
    }
  },
  data: function data() {
    return {
      inited: false,
      showPanel: false,
      animatVisible: false,
      panelIndex: 0,
      panelStyle: null,
      panelPlacement: null
    };
  },
  computed: {
    isText: function isText() {
      return this.type === 'text';
    },
    isFormBtn: function isFormBtn() {
      return ['submit', 'reset', 'button'].indexOf(this.type) > -1;
    },
    btnType: function btnType() {
      return this.isText ? this.type : 'button';
    }
  },
  created: function created() {
    _event.GlobalEvent.on(this, 'mousewheel', this.handleGlobalMousewheelEvent);
  },
  beforeDestroy: function beforeDestroy() {
    var panelElem = this.$refs.panel;

    if (panelElem && panelElem.parentNode) {
      panelElem.parentNode.removeChild(panelElem);
    }
  },
  destroyed: function destroyed() {
    _event.GlobalEvent.off(this, 'mousewheel');
  },
  render: function render(h) {
    var _ref,
        _ref2,
        _this = this,
        _ref3,
        _ref4;

    var $scopedSlots = this.$scopedSlots,
        $listeners = this.$listeners,
        className = this.className,
        inited = this.inited,
        type = this.type,
        destroyOnClose = this.destroyOnClose,
        isFormBtn = this.isFormBtn,
        status = this.status,
        btnType = this.btnType,
        vSize = this.vSize,
        name = this.name,
        disabled = this.disabled,
        loading = this.loading,
        showPanel = this.showPanel,
        animatVisible = this.animatVisible,
        panelPlacement = this.panelPlacement;
    var downsSlot = $scopedSlots.dropdowns;
    return downsSlot ? h('div', {
      class: ['vxe-button--dropdown', className, (_ref = {}, _defineProperty(_ref, "size--".concat(vSize), vSize), _defineProperty(_ref, 'is--active', showPanel), _ref)]
    }, [h('button', {
      ref: 'xBtn',
      class: ['vxe-button', "type--".concat(btnType), (_ref2 = {}, _defineProperty(_ref2, "size--".concat(vSize), vSize), _defineProperty(_ref2, "theme--".concat(status), status), _defineProperty(_ref2, 'is--round', this.round), _defineProperty(_ref2, 'is--circle', this.circle), _defineProperty(_ref2, 'is--disabled', disabled || loading), _defineProperty(_ref2, 'is--loading', loading), _ref2)],
      attrs: {
        name: name,
        type: isFormBtn ? type : 'button',
        disabled: disabled || loading
      },
      on: Object.assign({
        mouseenter: this.mouseenterTargetEvent,
        mouseleave: this.mouseleaveEvent
      }, _xeUtils.default.objectMap($listeners, function (cb, type) {
        return function (evnt) {
          return _this.$emit(type, {
            $event: evnt
          });
        };
      }))
    }, this.renderContent(h).concat([h('i', {
      class: "vxe-button--dropdown-arrow ".concat(_conf.default.icon.BUTTON_DROPDOWN)
    })])), h('div', {
      ref: 'panel',
      class: ['vxe-button--dropdown-panel', (_ref3 = {}, _defineProperty(_ref3, "size--".concat(vSize), vSize), _defineProperty(_ref3, 'animat--leave', animatVisible), _defineProperty(_ref3, 'animat--enter', showPanel), _ref3)],
      attrs: {
        placement: panelPlacement
      },
      style: this.panelStyle
    }, inited ? [h('div', {
      class: 'vxe-button--dropdown-wrapper',
      on: {
        mousedown: this.mousedownDropdownEvent,
        click: this.clickDropdownEvent,
        mouseenter: this.mouseenterEvent,
        mouseleave: this.mouseleaveEvent
      }
    }, destroyOnClose && !showPanel ? [] : downsSlot.call(this, {}, h))] : null)]) : h('button', {
      ref: 'xBtn',
      class: ['vxe-button', "type--".concat(btnType), className, (_ref4 = {}, _defineProperty(_ref4, "size--".concat(vSize), vSize), _defineProperty(_ref4, "theme--".concat(status), status), _defineProperty(_ref4, 'is--round', this.round), _defineProperty(_ref4, 'is--circle', this.circle), _defineProperty(_ref4, 'is--disabled', disabled || loading), _defineProperty(_ref4, 'is--loading', loading), _ref4)],
      attrs: {
        name: name,
        type: isFormBtn ? type : 'button',
        disabled: disabled || loading
      },
      on: _xeUtils.default.objectMap($listeners, function (cb, type) {
        return function (evnt) {
          return _this.$emit(type, {
            $event: evnt
          });
        };
      })
    }, this.renderContent(h));
  },
  methods: {
    renderContent: function renderContent(h) {
      var $scopedSlots = this.$scopedSlots,
          content = this.content,
          icon = this.icon,
          loading = this.loading;
      var contents = [];

      if (loading) {
        contents.push(h('i', {
          class: ['vxe-button--loading-icon', _conf.default.icon.BUTTON_LOADING]
        }));
      } else if (icon) {
        contents.push(h('i', {
          class: ['vxe-button--icon', icon]
        }));
      }

      if ($scopedSlots.default) {
        contents.push(h('span', {
          class: 'vxe-button--content'
        }, $scopedSlots.default.call(this)));
      } else if (content) {
        contents.push(h('span', {
          class: 'vxe-button--content'
        }, [(0, _utils.getFuncText)(content)]));
      }

      return contents;
    },
    handleGlobalMousewheelEvent: function handleGlobalMousewheelEvent(evnt) {
      if (this.showPanel && !_dom.default.getEventTargetNode(evnt, this.$refs.panel).flag) {
        this.closePanel();
      }
    },
    updateZindex: function updateZindex() {
      if (this.panelIndex < _utils.default.getLastZIndex()) {
        this.panelIndex = _utils.default.nextZIndex();
      }
    },
    mousedownDropdownEvent: function mousedownDropdownEvent(evnt) {
      var isLeftBtn = evnt.button === 0;

      if (isLeftBtn) {
        evnt.stopPropagation();
      }
    },
    clickDropdownEvent: function clickDropdownEvent(evnt) {
      var _this2 = this;

      var dropdownElem = evnt.currentTarget;
      var panelElem = this.$refs.panel;

      var _DomTools$getEventTar = _dom.default.getEventTargetNode(evnt, dropdownElem, 'vxe-button'),
          flag = _DomTools$getEventTar.flag,
          targetElem = _DomTools$getEventTar.targetElem;

      if (flag) {
        if (panelElem) {
          panelElem.dataset.active = 'N';
        }

        this.showPanel = false;
        setTimeout(function () {
          if (!panelElem || panelElem.dataset.active !== 'Y') {
            _this2.animatVisible = false;
          }
        }, 350);
        this.$emit('dropdown-click', {
          name: targetElem.getAttribute('name'),
          $event: evnt
        });
      }
    },
    mouseenterTargetEvent: function mouseenterTargetEvent() {
      var _this3 = this;

      var panelElem = this.$refs.panel;
      panelElem.dataset.active = 'Y';

      if (!this.inited) {
        this.inited = true;

        if (this.transfer) {
          document.body.appendChild(panelElem);
        }
      }

      this.showTime = setTimeout(function () {
        if (panelElem.dataset.active === 'Y') {
          _this3.mouseenterEvent();
        } else {
          _this3.animatVisible = false;
        }
      }, 250);
    },
    mouseenterEvent: function mouseenterEvent() {
      var _this4 = this;

      var panelElem = this.$refs.panel;
      panelElem.dataset.active = 'Y';
      this.animatVisible = true;
      setTimeout(function () {
        if (panelElem.dataset.active === 'Y') {
          _this4.showPanel = true;

          _this4.updateZindex();

          _this4.updatePlacement();

          setTimeout(function () {
            if (_this4.showPanel) {
              _this4.updatePlacement();
            }
          }, 50);
        }
      }, 20);
    },
    mouseleaveEvent: function mouseleaveEvent() {
      this.closePanel();
    },
    closePanel: function closePanel() {
      var _this5 = this;

      var panelElem = this.$refs.panel;
      clearTimeout(this.showTime);

      if (panelElem) {
        panelElem.dataset.active = 'N';
        setTimeout(function () {
          if (panelElem.dataset.active !== 'Y') {
            _this5.showPanel = false;
            setTimeout(function () {
              if (panelElem.dataset.active !== 'Y') {
                _this5.animatVisible = false;
              }
            }, 350);
          }
        }, 100);
      } else {
        this.animatVisible = false;
        this.showPanel = false;
      }
    },
    updatePlacement: function updatePlacement() {
      var _this6 = this;

      return this.$nextTick().then(function () {
        var $refs = _this6.$refs,
            transfer = _this6.transfer,
            placement = _this6.placement,
            panelIndex = _this6.panelIndex;
        var targetElem = $refs.xBtn;
        var panelElem = $refs.panel;

        if (panelElem && targetElem) {
          var targetHeight = targetElem.offsetHeight;
          var targetWidth = targetElem.offsetWidth;
          var panelHeight = panelElem.offsetHeight;
          var panelWidth = panelElem.offsetWidth;
          var marginSize = 5;
          var panelStyle = {
            zIndex: panelIndex
          };

          var _DomTools$getAbsolute = _dom.default.getAbsolutePos(targetElem),
              top = _DomTools$getAbsolute.top,
              left = _DomTools$getAbsolute.left,
              boundingTop = _DomTools$getAbsolute.boundingTop,
              visibleHeight = _DomTools$getAbsolute.visibleHeight,
              visibleWidth = _DomTools$getAbsolute.visibleWidth;

          var panelPlacement = 'bottom';

          if (transfer) {
            var btnLeft = left + targetWidth - panelWidth;
            var btnTop = top + targetHeight;

            if (placement === 'top') {
              panelPlacement = 'top';
              btnTop = top - panelHeight;
            } else if (!placement) {
              // 如果下面不够放，则向上
              if (boundingTop + targetHeight + panelHeight + marginSize > visibleHeight) {
                panelPlacement = 'top';
                btnTop = top - panelHeight;
              } // 如果上面不够放，则向下（优先）


              if (btnTop < marginSize) {
                panelPlacement = 'bottom';
                btnTop = top + targetHeight;
              }
            } // 如果溢出右边


            if (btnLeft + panelWidth + marginSize > visibleWidth) {
              btnLeft -= btnLeft + panelWidth + marginSize - visibleWidth;
            } // 如果溢出左边


            if (btnLeft < marginSize) {
              btnLeft = marginSize;
            }

            Object.assign(panelStyle, {
              left: "".concat(btnLeft, "px"),
              right: 'auto',
              top: "".concat(btnTop, "px"),
              minWidth: "".concat(targetWidth, "px")
            });
          } else {
            if (placement === 'top') {
              panelPlacement = 'top';
              panelStyle.bottom = "".concat(targetHeight, "px");
            } else if (!placement) {
              // 如果下面不够放，则向上
              if (boundingTop + targetHeight + panelHeight > visibleHeight) {
                // 如果上面不够放，则向下（优先）
                if (boundingTop - targetHeight - panelHeight > marginSize) {
                  panelPlacement = 'top';
                  panelStyle.bottom = "".concat(targetHeight, "px");
                }
              }
            }
          }

          _this6.panelStyle = panelStyle;
          _this6.panelPlacement = panelPlacement;
          return _this6.$nextTick();
        }
      });
    },
    focus: function focus() {
      this.$el.focus();
      return this.$nextTick();
    },
    blur: function blur() {
      this.$el.blur();
      return this.$nextTick();
    }
  }
};
exports.default = _default2;