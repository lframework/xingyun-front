"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.errLog = void 0;
exports.getLog = getLog;
exports.warnLog = void 0;

var _conf = _interopRequireDefault(require("../v-x-e-table/src/conf"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function getLog(message, params) {
  return "[vxe-table v".concat("3.5.0", "] ", _conf.default.i18n(message, params));
}

function outLog(type) {
  return function (message, params) {
    var msg = getLog(message, params);
    console[type](msg);
    return msg;
  };
}

var warnLog = outLog('warn');
exports.warnLog = warnLog;
var errLog = outLog('error');
exports.errLog = errLog;