"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.menus = void 0;

var _store = _interopRequireDefault(require("./store"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var menus = new _store.default();
exports.menus = menus;

if (process.env.NODE_ENV === 'development') {
  Object.assign(menus, {
    _name: 'Menus'
  });
}