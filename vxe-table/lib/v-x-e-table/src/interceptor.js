"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.interceptor = void 0;

var _xeUtils = _interopRequireDefault(require("xe-utils"));

var _log = require("../../tools/log");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function toType(type) {
  return _xeUtils.default.toValueString(type).replace('_', '').toLowerCase();
}

var eventTypes = 'created,mounted,activated,beforeDestroy,destroyed,event.clearActived,event.clearFilter,event.clearAreas,event.showMenu,event.keydown,event.export,event.import'.split(',').map(toType);
var storeMap = {};
var interceptor = {
  mixin: function mixin(map) {
    _xeUtils.default.each(map, function (callback, type) {
      return interceptor.add(type, callback);
    });

    return interceptor;
  },
  get: function get(type) {
    return storeMap[toType(type)] || [];
  },
  add: function add(type, callback) {
    type = toType(type); // 检测类型

    if (process.env.NODE_ENV === 'development') {
      if (eventTypes.indexOf(type) === -1) {
        (0, _log.warnLog)('vxe.error.errProp', ["Interceptor.".concat(type), eventTypes.join('|')]);
      }
    }

    if (callback && eventTypes.indexOf(type) > -1) {
      var eList = storeMap[type];

      if (!eList) {
        eList = storeMap[type] = [];
      } // 检测重复


      if (process.env.NODE_ENV === 'development') {
        if (eList.indexOf(callback) > -1) {
          (0, _log.warnLog)('vxe.error.coverProp', ['Interceptor', type]);
        }
      }

      eList.push(callback);
    }

    return interceptor;
  },
  delete: function _delete(type, callback) {
    var eList = storeMap[toType(type)];

    if (eList) {
      _xeUtils.default.remove(eList, function (fn) {
        return fn === callback;
      });
    }

    return interceptor;
  }
};
exports.interceptor = interceptor;