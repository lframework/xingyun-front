"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.formats = void 0;

var _store = _interopRequireDefault(require("./store"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var formats = new _store.default();
exports.formats = formats;

if (process.env.NODE_ENV === 'development') {
  Object.assign(formats, {
    _name: 'Formats'
  });
}