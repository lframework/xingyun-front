"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.msgQueue = exports.default = exports.allActivedModals = void 0;

var _conf = _interopRequireDefault(require("../../v-x-e-table/src/conf"));

var _size = _interopRequireDefault(require("../../mixins/size"));

var _xeUtils = _interopRequireDefault(require("xe-utils"));

var _utils = _interopRequireWildcard(require("../../tools/utils"));

var _dom = _interopRequireDefault(require("../../tools/dom"));

var _event = require("../../tools/event");

var _log = require("../../tools/log");

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"]; if (_i == null) return; var _arr = []; var _n = true; var _d = false; var _s, _e; try { for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var allActivedModals = [];
exports.allActivedModals = allActivedModals;
var msgQueue = [];
exports.msgQueue = msgQueue;
var _default2 = {
  name: 'VxeModal',
  mixins: [_size.default],
  props: {
    value: Boolean,
    id: String,
    type: {
      type: String,
      default: 'modal'
    },
    loading: {
      type: Boolean,
      default: null
    },
    status: String,
    iconStatus: String,
    className: String,
    top: {
      type: [Number, String],
      default: function _default() {
        return _conf.default.modal.top;
      }
    },
    position: [String, Object],
    title: String,
    duration: {
      type: [Number, String],
      default: function _default() {
        return _conf.default.modal.duration;
      }
    },
    // 请使用 content
    message: [String, Function],
    content: [String, Function],
    cancelButtonText: {
      type: String,
      default: function _default() {
        return _conf.default.modal.cancelButtonText;
      }
    },
    confirmButtonText: {
      type: String,
      default: function _default() {
        return _conf.default.modal.confirmButtonText;
      }
    },
    lockView: {
      type: Boolean,
      default: function _default() {
        return _conf.default.modal.lockView;
      }
    },
    lockScroll: Boolean,
    mask: {
      type: Boolean,
      default: function _default() {
        return _conf.default.modal.mask;
      }
    },
    maskClosable: {
      type: Boolean,
      default: function _default() {
        return _conf.default.modal.maskClosable;
      }
    },
    escClosable: {
      type: Boolean,
      default: function _default() {
        return _conf.default.modal.escClosable;
      }
    },
    resize: {
      type: Boolean,
      default: function _default() {
        return _conf.default.modal.resize;
      }
    },
    showHeader: {
      type: Boolean,
      default: function _default() {
        return _conf.default.modal.showHeader;
      }
    },
    showFooter: {
      type: Boolean,
      default: function _default() {
        return _conf.default.modal.showFooter;
      }
    },
    showZoom: {
      type: Boolean,
      default: null
    },
    showClose: {
      type: Boolean,
      default: function _default() {
        return _conf.default.modal.showClose;
      }
    },
    dblclickZoom: {
      type: Boolean,
      default: function _default() {
        return _conf.default.modal.dblclickZoom;
      }
    },
    width: [Number, String],
    height: [Number, String],
    minWidth: {
      type: [Number, String],
      default: function _default() {
        return _conf.default.modal.minWidth;
      }
    },
    minHeight: {
      type: [Number, String],
      default: function _default() {
        return _conf.default.modal.minHeight;
      }
    },
    zIndex: Number,
    marginSize: {
      type: [Number, String],
      default: function _default() {
        return _conf.default.modal.marginSize;
      }
    },
    fullscreen: Boolean,
    draggable: {
      type: Boolean,
      default: function _default() {
        return _conf.default.modal.draggable;
      }
    },
    remember: {
      type: Boolean,
      default: function _default() {
        return _conf.default.modal.remember;
      }
    },
    destroyOnClose: {
      type: Boolean,
      default: function _default() {
        return _conf.default.modal.destroyOnClose;
      }
    },
    showTitleOverflow: {
      type: Boolean,
      default: function _default() {
        return _conf.default.modal.showTitleOverflow;
      }
    },
    transfer: {
      type: Boolean,
      default: function _default() {
        return _conf.default.modal.transfer;
      }
    },
    storage: {
      type: Boolean,
      default: function _default() {
        return _conf.default.modal.storage;
      }
    },
    storageKey: {
      type: String,
      default: function _default() {
        return _conf.default.modal.storageKey;
      }
    },
    animat: {
      type: Boolean,
      default: function _default() {
        return _conf.default.modal.animat;
      }
    },
    size: {
      type: String,
      default: function _default() {
        return _conf.default.modal.size || _conf.default.size;
      }
    },
    beforeHideMethod: {
      type: Function,
      default: function _default() {
        return _conf.default.modal.beforeHideMethod;
      }
    },
    slots: Object,
    events: Object
  },
  data: function data() {
    return {
      inited: false,
      visible: false,
      contentVisible: false,
      modalTop: 0,
      modalZindex: 0,
      zoomLocat: null,
      firstOpen: false
    };
  },
  computed: {
    isMsg: function isMsg() {
      return this.type === 'message';
    }
  },
  watch: {
    width: function width() {
      this.recalculate();
    },
    height: function height() {
      this.recalculate();
    },
    value: function value(visible) {
      this[visible ? 'open' : 'close']('model');
    }
  },
  created: function created() {
    if (this.storage && !this.id) {
      (0, _log.errLog)('vxe.error.reqProp', ['modal.id']);
    }
  },
  mounted: function mounted() {
    var $listeners = this.$listeners,
        _this$events = this.events,
        events = _this$events === void 0 ? {} : _this$events;

    if (this.value) {
      this.open();
    }

    this.recalculate();

    if (this.escClosable) {
      _event.GlobalEvent.on(this, 'keydown', this.handleGlobalKeydownEvent);
    } // 触发 inserted 事件


    var type = 'inserted';
    var params = {
      type: type,
      $modal: this,
      $event: {
        type: type
      }
    };

    if ($listeners.inserted) {
      this.$emit('inserted', params);
    } else if (events.inserted) {
      events.inserted.call(this, params);
    }
  },
  beforeDestroy: function beforeDestroy() {
    var $el = this.$el;

    _event.GlobalEvent.off(this, 'keydown');

    this.removeMsgQueue();

    if ($el.parentNode === document.body) {
      $el.parentNode.removeChild($el);
    }
  },
  render: function render(h) {
    var _ref,
        _this = this;

    var _e = this._e,
        $scopedSlots = this.$scopedSlots,
        _this$slots = this.slots,
        slots = _this$slots === void 0 ? {} : _this$slots,
        inited = this.inited,
        vSize = this.vSize,
        className = this.className,
        type = this.type,
        resize = this.resize,
        showClose = this.showClose,
        showZoom = this.showZoom,
        animat = this.animat,
        draggable = this.draggable,
        loading = this.loading,
        status = this.status,
        iconStatus = this.iconStatus,
        showFooter = this.showFooter,
        zoomLocat = this.zoomLocat,
        modalTop = this.modalTop,
        dblclickZoom = this.dblclickZoom,
        contentVisible = this.contentVisible,
        visible = this.visible,
        title = this.title,
        lockScroll = this.lockScroll,
        lockView = this.lockView,
        mask = this.mask,
        isMsg = this.isMsg,
        showTitleOverflow = this.showTitleOverflow,
        destroyOnClose = this.destroyOnClose;
    var content = this.content || this.message;
    var defaultSlot = $scopedSlots.default || slots.default;
    var footerSlot = $scopedSlots.footer || slots.footer;
    var headerSlot = $scopedSlots.header || slots.header;
    var titleSlot = $scopedSlots.title || slots.title;
    var headerOns = {};

    if (draggable) {
      headerOns.mousedown = this.mousedownEvent;
    }

    if (showZoom && dblclickZoom && type === 'modal') {
      headerOns.dblclick = this.toggleZoomEvent;
    }

    return h('div', {
      class: ['vxe-modal--wrapper', "type--".concat(type), className || '', (_ref = {}, _defineProperty(_ref, "size--".concat(vSize), vSize), _defineProperty(_ref, "status--".concat(status), status), _defineProperty(_ref, 'is--animat', animat), _defineProperty(_ref, 'lock--scroll', lockScroll), _defineProperty(_ref, 'lock--view', lockView), _defineProperty(_ref, 'is--resize', resize), _defineProperty(_ref, 'is--mask', mask), _defineProperty(_ref, 'is--maximize', zoomLocat), _defineProperty(_ref, 'is--visible', contentVisible), _defineProperty(_ref, 'is--active', visible), _defineProperty(_ref, 'is--loading', loading), _ref)],
      style: {
        zIndex: this.modalZindex,
        top: modalTop ? "".concat(modalTop, "px") : null
      },
      on: {
        click: this.selfClickEvent
      }
    }, [h('div', {
      class: 'vxe-modal--box',
      on: {
        mousedown: this.boxMousedownEvent
      },
      ref: 'modalBox'
    }, [this.showHeader ? h('div', {
      class: ['vxe-modal--header', {
        'is--drag': draggable,
        'is--ellipsis': !isMsg && showTitleOverflow
      }],
      on: headerOns
    }, headerSlot ? !inited || destroyOnClose && !visible ? [] : headerSlot.call(this, {
      $modal: this
    }, h) : [titleSlot ? titleSlot.call(this, {
      $modal: this
    }, h) : h('span', {
      class: 'vxe-modal--title'
    }, title ? (0, _utils.getFuncText)(title) : _conf.default.i18n('vxe.alert.title')), showZoom ? h('i', {
      class: ['vxe-modal--zoom-btn', 'trigger--btn', zoomLocat ? _conf.default.icon.MODAL_ZOOM_OUT : _conf.default.icon.MODAL_ZOOM_IN],
      attrs: {
        title: _conf.default.i18n("vxe.modal.zoom".concat(zoomLocat ? 'Out' : 'In'))
      },
      on: {
        click: this.toggleZoomEvent
      }
    }) : _e(), showClose ? h('i', {
      class: ['vxe-modal--close-btn', 'trigger--btn', _conf.default.icon.MODAL_CLOSE],
      attrs: {
        title: _conf.default.i18n('vxe.modal.close')
      },
      on: {
        click: this.closeEvent
      }
    }) : _e()]) : null, h('div', {
      class: 'vxe-modal--body'
    }, [status ? h('div', {
      class: 'vxe-modal--status-wrapper'
    }, [h('i', {
      class: ['vxe-modal--status-icon', iconStatus || _conf.default.icon["MODAL_".concat(status).toLocaleUpperCase()]]
    })]) : null, h('div', {
      class: 'vxe-modal--content'
    }, defaultSlot ? !inited || destroyOnClose && !visible ? [] : defaultSlot.call(this, {
      $modal: this
    }, h) : (0, _utils.getFuncText)(content)), !isMsg ? h('div', {
      class: ['vxe-loading', {
        'is--visible': loading
      }]
    }, [h('div', {
      class: 'vxe-loading--spinner'
    })]) : null]), showFooter ? h('div', {
      class: 'vxe-modal--footer'
    }, footerSlot ? !inited || destroyOnClose && !visible ? [] : footerSlot.call(this, {
      $modal: this
    }, h) : [type === 'confirm' ? h('vxe-button', {
      ref: 'cancelBtn',
      on: {
        click: this.cancelEvent
      }
    }, this.cancelButtonText || _conf.default.i18n('vxe.button.cancel')) : null, h('vxe-button', {
      ref: 'confirmBtn',
      props: {
        status: 'primary'
      },
      on: {
        click: this.confirmEvent
      }
    }, this.confirmButtonText || _conf.default.i18n('vxe.button.confirm'))]) : null, !isMsg && resize ? h('span', {
      class: 'vxe-modal--resize'
    }, ['wl', 'wr', 'swst', 'sest', 'st', 'swlb', 'selb', 'sb'].map(function (type) {
      return h('span', {
        class: "".concat(type, "-resize"),
        attrs: {
          type: type
        },
        on: {
          mousedown: _this.dragEvent
        }
      });
    })) : null])]);
  },
  methods: {
    recalculate: function recalculate() {
      var width = this.width,
          height = this.height;
      var modalBoxElem = this.getBox();
      modalBoxElem.style.width = width ? isNaN(width) ? width : "".concat(width, "px") : null;
      modalBoxElem.style.height = height ? isNaN(height) ? height : "".concat(height, "px") : null;
      return this.$nextTick();
    },
    selfClickEvent: function selfClickEvent(evnt) {
      if (this.maskClosable && evnt.target === this.$el) {
        var type = 'mask';
        this.close(type);
      }
    },
    updateZindex: function updateZindex() {
      var zIndex = this.zIndex,
          modalZindex = this.modalZindex;

      if (zIndex) {
        this.modalZindex = zIndex;
      } else if (modalZindex < _utils.default.getLastZIndex()) {
        this.modalZindex = _utils.default.nextZIndex();
      }
    },
    closeEvent: function closeEvent(evnt) {
      var _this$events2 = this.events,
          events = _this$events2 === void 0 ? {} : _this$events2;
      var type = 'close';
      var params = {
        type: type,
        $modal: this,
        $event: evnt
      };

      if (events[type]) {
        events[type].call(this, params);
      } else {
        this.$emit(type, params);
      }

      this.close(type);
    },
    confirmEvent: function confirmEvent(evnt) {
      var _this$events3 = this.events,
          events = _this$events3 === void 0 ? {} : _this$events3;
      var type = 'confirm';
      var params = {
        type: type,
        $modal: this,
        $event: evnt
      };

      if (events[type]) {
        events[type].call(this, params);
      } else {
        this.$emit(type, params);
      }

      this.close(type);
    },
    cancelEvent: function cancelEvent(evnt) {
      var _this$events4 = this.events,
          events = _this$events4 === void 0 ? {} : _this$events4;
      var type = 'cancel';
      var params = {
        type: type,
        $modal: this,
        $event: evnt
      };

      if (events[type]) {
        events[type].call(this, params);
      } else {
        this.$emit(type, params);
      }

      this.close(type);
    },
    open: function open() {
      var _this2 = this;

      var $refs = this.$refs,
          _this$events5 = this.events,
          events = _this$events5 === void 0 ? {} : _this$events5,
          inited = this.inited,
          duration = this.duration,
          visible = this.visible,
          isMsg = this.isMsg,
          remember = this.remember,
          showFooter = this.showFooter;

      if (!inited) {
        this.inited = true;

        if (this.transfer) {
          document.body.appendChild(this.$el);
        }
      }

      if (!visible) {
        if (!remember) {
          this.recalculate();
        }

        this.visible = true;
        this.contentVisible = false;
        this.updateZindex();
        allActivedModals.push(this);
        setTimeout(function () {
          _this2.contentVisible = true;

          _this2.$nextTick(function () {
            if (showFooter) {
              var operBtn = $refs.confirmBtn || $refs.cancelBtn;

              if (operBtn) {
                operBtn.focus();
              }
            }

            var type = '';
            var params = {
              type: type,
              $modal: _this2
            };

            if (events.show) {
              events.show.call(_this2, params);
            } else {
              _this2.$emit('input', true);

              _this2.$emit('show', params);
            }
          });
        }, 10);

        if (isMsg) {
          this.addMsgQueue();

          if (duration !== -1) {
            setTimeout(function () {
              return _this2.close('close');
            }, _xeUtils.default.toNumber(duration));
          }
        } else {
          this.$nextTick(function () {
            var firstOpen = _this2.firstOpen,
                fullscreen = _this2.fullscreen;

            if (!remember || !firstOpen) {
              _this2.updatePosition().then(function () {
                setTimeout(function () {
                  return _this2.updatePosition();
                }, 20);
              });
            }

            if (!firstOpen) {
              _this2.firstOpen = true;

              if (_this2.hasPosStorage()) {
                _this2.restorePosStorage();
              } else if (fullscreen) {
                _this2.$nextTick(function () {
                  return _this2.maximize();
                });
              }
            }
          });
        }
      }
    },
    addMsgQueue: function addMsgQueue() {
      if (msgQueue.indexOf(this) === -1) {
        msgQueue.push(this);
      }

      this.updateStyle();
    },
    removeMsgQueue: function removeMsgQueue() {
      var _this3 = this;

      if (msgQueue.indexOf(this) > -1) {
        _xeUtils.default.remove(msgQueue, function (comp) {
          return comp === _this3;
        });
      }

      this.updateStyle();
    },
    updateStyle: function updateStyle() {
      this.$nextTick(function () {
        var offsetTop = 0;
        msgQueue.forEach(function (comp) {
          offsetTop += _xeUtils.default.toNumber(comp.top);
          comp.modalTop = offsetTop;
          offsetTop += comp.$refs.modalBox.clientHeight;
        });
      });
    },
    updatePosition: function updatePosition() {
      var _this4 = this;

      return this.$nextTick().then(function () {
        var marginSize = _this4.marginSize,
            position = _this4.position;

        var modalBoxElem = _this4.getBox();

        var clientVisibleWidth = document.documentElement.clientWidth || document.body.clientWidth;
        var clientVisibleHeight = document.documentElement.clientHeight || document.body.clientHeight;
        var isPosCenter = position === 'center';

        var _ref2 = isPosCenter ? {
          top: position,
          left: position
        } : Object.assign({}, position),
            top = _ref2.top,
            left = _ref2.left;

        var topCenter = isPosCenter || top === 'center';
        var leftCenter = isPosCenter || left === 'center';
        var posTop = '';
        var posLeft = '';

        if (left && !leftCenter) {
          posLeft = isNaN(left) ? left : "".concat(left, "px");
        } else {
          posLeft = "".concat(Math.max(marginSize, clientVisibleWidth / 2 - modalBoxElem.offsetWidth / 2), "px");
        }

        if (top && !topCenter) {
          posTop = isNaN(top) ? top : "".concat(top, "px");
        } else {
          posTop = "".concat(Math.max(marginSize, clientVisibleHeight / 2 - modalBoxElem.offsetHeight / 2), "px");
        }

        modalBoxElem.style.top = posTop;
        modalBoxElem.style.left = posLeft;
      });
    },
    close: function close(type) {
      var _this5 = this;

      var _this$events6 = this.events,
          events = _this$events6 === void 0 ? {} : _this$events6,
          remember = this.remember,
          visible = this.visible,
          isMsg = this.isMsg,
          beforeHideMethod = this.beforeHideMethod;
      var params = {
        type: type,
        $modal: this
      };

      if (visible) {
        Promise.resolve(beforeHideMethod ? beforeHideMethod(params) : null).then(function (rest) {
          if (!_xeUtils.default.isError(rest)) {
            if (isMsg) {
              _this5.removeMsgQueue();
            }

            _this5.contentVisible = false;

            if (!remember) {
              _this5.zoomLocat = null;
            }

            _xeUtils.default.remove(allActivedModals, function (item) {
              return item === _this5;
            });

            _this5.$emit('before-hide', params);

            setTimeout(function () {
              _this5.visible = false;

              if (events.hide) {
                events.hide.call(_this5, params);
              } else {
                _this5.$emit('input', false);

                _this5.$emit('hide', params);
              }
            }, 200);
          }
        }).catch(function (e) {
          return e;
        });
      }
    },
    handleGlobalKeydownEvent: function handleGlobalKeydownEvent(evnt) {
      var _this6 = this;

      var isEsc = evnt.keyCode === 27;

      if (isEsc) {
        var lastModal = _xeUtils.default.max(allActivedModals, function (item) {
          return item.modalZindex;
        }); // 多个时，只关掉最上层的窗口


        if (lastModal) {
          setTimeout(function () {
            if (lastModal === _this6 && lastModal.escClosable) {
              _this6.close('exit');
            }
          }, 10);
        }
      }
    },
    getBox: function getBox() {
      return this.$refs.modalBox;
    },
    isMaximized: function isMaximized() {
      return !!this.zoomLocat;
    },
    maximize: function maximize() {
      var _this7 = this;

      return this.$nextTick().then(function () {
        if (!_this7.zoomLocat) {
          var marginSize = Math.max(0, _this7.marginSize);

          var modalBoxElem = _this7.getBox();

          var _DomTools$getDomNode = _dom.default.getDomNode(),
              visibleHeight = _DomTools$getDomNode.visibleHeight,
              visibleWidth = _DomTools$getDomNode.visibleWidth;

          _this7.zoomLocat = {
            top: modalBoxElem.offsetTop,
            left: modalBoxElem.offsetLeft,
            width: modalBoxElem.offsetWidth + (modalBoxElem.style.width ? 0 : 1),
            height: modalBoxElem.offsetHeight + (modalBoxElem.style.height ? 0 : 1)
          };
          Object.assign(modalBoxElem.style, {
            top: "".concat(marginSize, "px"),
            left: "".concat(marginSize, "px"),
            width: "".concat(visibleWidth - marginSize * 2, "px"),
            height: "".concat(visibleHeight - marginSize * 2, "px")
          });

          _this7.savePosStorage();
        }
      });
    },
    revert: function revert() {
      var _this8 = this;

      return this.$nextTick().then(function () {
        var zoomLocat = _this8.zoomLocat;

        if (zoomLocat) {
          var modalBoxElem = _this8.getBox();

          _this8.zoomLocat = null;
          Object.assign(modalBoxElem.style, {
            top: "".concat(zoomLocat.top, "px"),
            left: "".concat(zoomLocat.left, "px"),
            width: "".concat(zoomLocat.width, "px"),
            height: "".concat(zoomLocat.height, "px")
          });

          _this8.savePosStorage();
        }
      });
    },
    zoom: function zoom() {
      var _this9 = this;

      return this[this.zoomLocat ? 'revert' : 'maximize']().then(function () {
        return _this9.isMaximized();
      });
    },
    toggleZoomEvent: function toggleZoomEvent(evnt) {
      var _this10 = this;

      var $listeners = this.$listeners,
          zoomLocat = this.zoomLocat,
          _this$events7 = this.events,
          events = _this$events7 === void 0 ? {} : _this$events7;
      var params = {
        type: zoomLocat ? 'revert' : 'max',
        $modal: this,
        $event: evnt
      };
      return this.zoom().then(function () {
        if ($listeners.zoom) {
          _this10.$emit('zoom', params);
        } else if (events.zoom) {
          events.zoom.call(_this10, params);
        }
      });
    },
    getPosition: function getPosition() {
      if (!this.isMsg) {
        var modalBoxElem = this.getBox();

        if (modalBoxElem) {
          return {
            top: modalBoxElem.offsetTop,
            left: modalBoxElem.offsetLeft
          };
        }
      }

      return null;
    },
    setPosition: function setPosition(top, left) {
      if (!this.isMsg) {
        var modalBoxElem = this.getBox();

        if (_xeUtils.default.isNumber(top)) {
          modalBoxElem.style.top = "".concat(top, "px");
        }

        if (_xeUtils.default.isNumber(left)) {
          modalBoxElem.style.left = "".concat(left, "px");
        }
      }

      return this.$nextTick();
    },
    boxMousedownEvent: function boxMousedownEvent() {
      var modalZindex = this.modalZindex;

      if (allActivedModals.some(function (_vm) {
        return _vm.visible && _vm.modalZindex > modalZindex;
      })) {
        this.updateZindex();
      }
    },
    mousedownEvent: function mousedownEvent(evnt) {
      var _this11 = this;

      var remember = this.remember,
          storage = this.storage,
          marginSize = this.marginSize,
          zoomLocat = this.zoomLocat;
      var modalBoxElem = this.getBox();

      if (!zoomLocat && evnt.button === 0 && !_dom.default.getEventTargetNode(evnt, modalBoxElem, 'trigger--btn').flag) {
        evnt.preventDefault();
        var domMousemove = document.onmousemove;
        var domMouseup = document.onmouseup;
        var disX = evnt.clientX - modalBoxElem.offsetLeft;
        var disY = evnt.clientY - modalBoxElem.offsetTop;

        var _DomTools$getDomNode2 = _dom.default.getDomNode(),
            visibleHeight = _DomTools$getDomNode2.visibleHeight,
            visibleWidth = _DomTools$getDomNode2.visibleWidth;

        document.onmousemove = function (evnt) {
          evnt.preventDefault();
          var offsetWidth = modalBoxElem.offsetWidth;
          var offsetHeight = modalBoxElem.offsetHeight;
          var minX = marginSize;
          var maxX = visibleWidth - offsetWidth - marginSize - 1;
          var minY = marginSize;
          var maxY = visibleHeight - offsetHeight - marginSize - 1;
          var left = evnt.clientX - disX;
          var top = evnt.clientY - disY;

          if (left > maxX) {
            left = maxX;
          }

          if (left < minX) {
            left = minX;
          }

          if (top > maxY) {
            top = maxY;
          }

          if (top < minY) {
            top = minY;
          }

          modalBoxElem.style.left = "".concat(left, "px");
          modalBoxElem.style.top = "".concat(top, "px");
        };

        document.onmouseup = function () {
          document.onmousemove = domMousemove;
          document.onmouseup = domMouseup;

          if (remember && storage) {
            _this11.$nextTick(function () {
              _this11.savePosStorage();
            });
          }
        };
      }
    },
    dragEvent: function dragEvent(evnt) {
      var _this12 = this;

      evnt.preventDefault();
      var $listeners = this.$listeners,
          marginSize = this.marginSize,
          _this$events8 = this.events,
          events = _this$events8 === void 0 ? {} : _this$events8,
          remember = this.remember,
          storage = this.storage;

      var _DomTools$getDomNode3 = _dom.default.getDomNode(),
          visibleHeight = _DomTools$getDomNode3.visibleHeight,
          visibleWidth = _DomTools$getDomNode3.visibleWidth;

      var type = evnt.target.getAttribute('type');

      var minWidth = _xeUtils.default.toNumber(this.minWidth);

      var minHeight = _xeUtils.default.toNumber(this.minHeight);

      var maxWidth = visibleWidth;
      var maxHeight = visibleHeight;
      var modalBoxElem = this.getBox();
      var domMousemove = document.onmousemove;
      var domMouseup = document.onmouseup;
      var clientWidth = modalBoxElem.clientWidth;
      var clientHeight = modalBoxElem.clientHeight;
      var disX = evnt.clientX;
      var disY = evnt.clientY;
      var offsetTop = modalBoxElem.offsetTop;
      var offsetLeft = modalBoxElem.offsetLeft;
      var params = {
        type: 'resize',
        $modal: this
      };

      document.onmousemove = function (evnt) {
        evnt.preventDefault();
        var dragLeft;
        var dragTop;
        var width;
        var height;

        switch (type) {
          case 'wl':
            dragLeft = disX - evnt.clientX;
            width = dragLeft + clientWidth;

            if (offsetLeft - dragLeft > marginSize) {
              if (width > minWidth) {
                modalBoxElem.style.width = "".concat(width < maxWidth ? width : maxWidth, "px");
                modalBoxElem.style.left = "".concat(offsetLeft - dragLeft, "px");
              }
            }

            break;

          case 'swst':
            dragLeft = disX - evnt.clientX;
            dragTop = disY - evnt.clientY;
            width = dragLeft + clientWidth;
            height = dragTop + clientHeight;

            if (offsetLeft - dragLeft > marginSize) {
              if (width > minWidth) {
                modalBoxElem.style.width = "".concat(width < maxWidth ? width : maxWidth, "px");
                modalBoxElem.style.left = "".concat(offsetLeft - dragLeft, "px");
              }
            }

            if (offsetTop - dragTop > marginSize) {
              if (height > minHeight) {
                modalBoxElem.style.height = "".concat(height < maxHeight ? height : maxHeight, "px");
                modalBoxElem.style.top = "".concat(offsetTop - dragTop, "px");
              }
            }

            break;

          case 'swlb':
            dragLeft = disX - evnt.clientX;
            dragTop = evnt.clientY - disY;
            width = dragLeft + clientWidth;
            height = dragTop + clientHeight;

            if (offsetLeft - dragLeft > marginSize) {
              if (width > minWidth) {
                modalBoxElem.style.width = "".concat(width < maxWidth ? width : maxWidth, "px");
                modalBoxElem.style.left = "".concat(offsetLeft - dragLeft, "px");
              }
            }

            if (offsetTop + height + marginSize < visibleHeight) {
              if (height > minHeight) {
                modalBoxElem.style.height = "".concat(height < maxHeight ? height : maxHeight, "px");
              }
            }

            break;

          case 'st':
            dragTop = disY - evnt.clientY;
            height = clientHeight + dragTop;

            if (offsetTop - dragTop > marginSize) {
              if (height > minHeight) {
                modalBoxElem.style.height = "".concat(height < maxHeight ? height : maxHeight, "px");
                modalBoxElem.style.top = "".concat(offsetTop - dragTop, "px");
              }
            }

            break;

          case 'wr':
            dragLeft = evnt.clientX - disX;
            width = dragLeft + clientWidth;

            if (offsetLeft + width + marginSize < visibleWidth) {
              if (width > minWidth) {
                modalBoxElem.style.width = "".concat(width < maxWidth ? width : maxWidth, "px");
              }
            }

            break;

          case 'sest':
            dragLeft = evnt.clientX - disX;
            dragTop = disY - evnt.clientY;
            width = dragLeft + clientWidth;
            height = dragTop + clientHeight;

            if (offsetLeft + width + marginSize < visibleWidth) {
              if (width > minWidth) {
                modalBoxElem.style.width = "".concat(width < maxWidth ? width : maxWidth, "px");
              }
            }

            if (offsetTop - dragTop > marginSize) {
              if (height > minHeight) {
                modalBoxElem.style.height = "".concat(height < maxHeight ? height : maxHeight, "px");
                modalBoxElem.style.top = "".concat(offsetTop - dragTop, "px");
              }
            }

            break;

          case 'selb':
            dragLeft = evnt.clientX - disX;
            dragTop = evnt.clientY - disY;
            width = dragLeft + clientWidth;
            height = dragTop + clientHeight;

            if (offsetLeft + width + marginSize < visibleWidth) {
              if (width > minWidth) {
                modalBoxElem.style.width = "".concat(width < maxWidth ? width : maxWidth, "px");
              }
            }

            if (offsetTop + height + marginSize < visibleHeight) {
              if (height > minHeight) {
                modalBoxElem.style.height = "".concat(height < maxHeight ? height : maxHeight, "px");
              }
            }

            break;

          case 'sb':
            dragTop = evnt.clientY - disY;
            height = dragTop + clientHeight;

            if (offsetTop + height + marginSize < visibleHeight) {
              if (height > minHeight) {
                modalBoxElem.style.height = "".concat(height < maxHeight ? height : maxHeight, "px");
              }
            }

            break;
        }

        modalBoxElem.className = modalBoxElem.className.replace(/\s?is--drag/, '') + ' is--drag';

        if (remember && storage) {
          _this12.savePosStorage();
        }

        if ($listeners.zoom) {
          _this12.$emit('zoom', params);
        } else if (events.zoom) {
          events.zoom.call(_this12, params);
        }
      };

      document.onmouseup = function () {
        _this12.zoomLocat = null;
        document.onmousemove = domMousemove;
        document.onmouseup = domMouseup;
        setTimeout(function () {
          modalBoxElem.className = modalBoxElem.className.replace(/\s?is--drag/, '');
        }, 50);
      };
    },
    getStorageMap: function getStorageMap(key) {
      var version = _conf.default.version;

      var rest = _xeUtils.default.toStringJSON(localStorage.getItem(key));

      return rest && rest._v === version ? rest : {
        _v: version
      };
    },
    hasPosStorage: function hasPosStorage() {
      var id = this.id,
          remember = this.remember,
          storage = this.storage,
          storageKey = this.storageKey;
      return !!(remember && storage && this.getStorageMap(storageKey)[id]);
    },
    restorePosStorage: function restorePosStorage() {
      var id = this.id,
          remember = this.remember,
          storage = this.storage,
          storageKey = this.storageKey;

      if (remember && storage) {
        var posStorage = this.getStorageMap(storageKey)[id];

        if (posStorage) {
          var modalBoxElem = this.getBox();

          var _posStorage$split = posStorage.split(','),
              _posStorage$split2 = _slicedToArray(_posStorage$split, 8),
              left = _posStorage$split2[0],
              top = _posStorage$split2[1],
              width = _posStorage$split2[2],
              height = _posStorage$split2[3],
              zoomLeft = _posStorage$split2[4],
              zoomTop = _posStorage$split2[5],
              zoomWidth = _posStorage$split2[6],
              zoomHeight = _posStorage$split2[7];

          if (left) {
            modalBoxElem.style.left = "".concat(left, "px");
          }

          if (top) {
            modalBoxElem.style.top = "".concat(top, "px");
          }

          if (width) {
            modalBoxElem.style.width = "".concat(width, "px");
          }

          if (height) {
            modalBoxElem.style.height = "".concat(height, "px");
          }

          if (zoomLeft && zoomTop) {
            this.zoomLocat = {
              left: zoomLeft,
              top: zoomTop,
              width: zoomWidth,
              height: zoomHeight
            };
          }
        }
      }
    },
    savePosStorage: function savePosStorage() {
      var id = this.id,
          remember = this.remember,
          storage = this.storage,
          storageKey = this.storageKey,
          zoomLocat = this.zoomLocat;

      if (remember && storage) {
        var modalBoxElem = this.getBox();
        var posStorageMap = this.getStorageMap(storageKey);
        posStorageMap[id] = [modalBoxElem.style.left, modalBoxElem.style.top, modalBoxElem.style.width, modalBoxElem.style.height].concat(zoomLocat ? [zoomLocat.left, zoomLocat.top, zoomLocat.width, zoomLocat.height] : []).map(function (val) {
          return val ? _xeUtils.default.toNumber(val) : '';
        }).join(',');
        localStorage.setItem(storageKey, _xeUtils.default.toJSONString(posStorageMap));
      }
    }
  }
};
exports.default = _default2;