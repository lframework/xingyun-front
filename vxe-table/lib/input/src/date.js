"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getDateQuarter = getDateQuarter;
exports.toStringTimeDate = toStringTimeDate;

var _xeUtils = _interopRequireDefault(require("xe-utils"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function toStringTimeDate(str) {
  if (str) {
    var rest = new Date();
    var h, m, s;

    if (_xeUtils.default.isDate(str)) {
      h = str.getHours();
      m = str.getMinutes();
      s = str.getSeconds();
    } else {
      str = _xeUtils.default.toValueString(str);
      var parses = str.match(/^(\d{1,2})(:(\d{1,2}))?(:(\d{1,2}))?/);

      if (parses) {
        h = parses[1];
        m = parses[3];
        s = parses[5];
      }
    }

    rest.setHours(h || 0);
    rest.setMinutes(m || 0);
    rest.setSeconds(s || 0);
    return rest;
  }

  return new Date('');
}

function getDateQuarter(date) {
  var month = date.getMonth();

  if (month < 3) {
    return 1;
  } else if (month < 6) {
    return 2;
  } else if (month < 9) {
    return 3;
  }

  return 4;
}