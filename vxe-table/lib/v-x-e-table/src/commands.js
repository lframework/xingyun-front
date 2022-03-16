"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.commands = void 0;

var _store = _interopRequireDefault(require("./store"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var commands = new _store.default();
exports.commands = commands;

if (process.env.NODE_ENV === 'development') {
  Object.assign(commands, {
    _name: 'Commands'
  });
}