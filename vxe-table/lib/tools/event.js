"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.hasEventKey = exports.GlobalEvent = exports.EVENT_KEYS = void 0;

var _xeUtils = _interopRequireDefault(require("xe-utils"));

var _dom = require("./dom");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var EVENT_KEYS = {
  F2: 'F2',
  ESCAPE: 'Escape',
  ENTER: 'Enter',
  TAB: 'Tab',
  DELETE: 'Delete',
  BACKSPACE: 'Backspace',
  SPACEBAR: ' ',
  CONTEXT_MENU: 'ContextMenu',
  ARROW_UP: 'ArrowUp',
  ARROW_DOWN: 'ArrowDown',
  ARROW_LEFT: 'ArrowLeft',
  ARROW_RIGHT: 'ArrowRight',
  PAGE_UP: 'PageUp',
  PAGE_DOWN: 'PageDown'
};
exports.EVENT_KEYS = EVENT_KEYS;
var convertEventKeys = {
  ' ': 'Spacebar',
  Apps: EVENT_KEYS.CONTEXT_MENU,
  Del: EVENT_KEYS.DELETE,
  Up: EVENT_KEYS.ARROW_UP,
  Down: EVENT_KEYS.ARROW_DOWN,
  Left: EVENT_KEYS.ARROW_LEFT,
  Right: EVENT_KEYS.ARROW_RIGHT
}; // 监听全局事件

var wheelName = _dom.browse.firefox ? 'DOMMouseScroll' : 'mousewheel';
var eventStore = [];

var hasEventKey = function hasEventKey(evnt, targetKey) {
  var key = evnt.key;
  targetKey = targetKey.toLowerCase();
  return key ? targetKey === key.toLowerCase() || !!(convertEventKeys[key] && convertEventKeys[key].toLowerCase() === targetKey) : false;
};

exports.hasEventKey = hasEventKey;
var GlobalEvent = {
  on: function on(comp, type, cb) {
    if (cb) {
      eventStore.push({
        comp: comp,
        type: type,
        cb: cb
      });
    }
  },
  off: function off(comp, type) {
    _xeUtils.default.remove(eventStore, function (item) {
      return item.comp === comp && item.type === type;
    });
  },
  trigger: function trigger(evnt) {
    var isWheel = evnt.type === wheelName;
    eventStore.forEach(function (_ref) {
      var comp = _ref.comp,
          type = _ref.type,
          cb = _ref.cb;

      // 如果被取消冒泡，不再执行
      if (!evnt.cancelBubble) {
        if (type === evnt.type || isWheel && type === 'mousewheel') {
          cb.call(comp, evnt);
        }
      }
    });
  },
  eqKeypad: function eqKeypad(evnt, keyVal) {
    var key = evnt.key;

    if (keyVal.toLowerCase() === key.toLowerCase()) {
      return true;
    }

    return false;
  }
};
exports.GlobalEvent = GlobalEvent;

if (_dom.browse.isDoc) {
  if (!_dom.browse.msie) {
    document.addEventListener('copy', GlobalEvent.trigger, false);
    document.addEventListener('cut', GlobalEvent.trigger, false);
    document.addEventListener('paste', GlobalEvent.trigger, false);
  }

  document.addEventListener('keydown', GlobalEvent.trigger, false);
  document.addEventListener('contextmenu', GlobalEvent.trigger, false);
  window.addEventListener('mousedown', GlobalEvent.trigger, false);
  window.addEventListener('blur', GlobalEvent.trigger, false);
  window.addEventListener('resize', GlobalEvent.trigger, false);
  window.addEventListener(wheelName, _xeUtils.default.throttle(GlobalEvent.trigger, 100, {
    leading: true,
    trailing: false
  }), false);
}