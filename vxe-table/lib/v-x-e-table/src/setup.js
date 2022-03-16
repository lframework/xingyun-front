"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.setup = setup;

var _conf = _interopRequireDefault(require("../../v-x-e-table/src/conf"));

var _xeUtils = _interopRequireDefault(require("xe-utils"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * 全局参数设置
 */
function setup(options) {
  return _xeUtils.default.merge(_conf.default, options);
}