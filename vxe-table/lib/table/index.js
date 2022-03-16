"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.Table = void 0;

var _table = _interopRequireDefault(require("./src/table"));

var _body = _interopRequireDefault(require("./src/body"));

var _vXETable = _interopRequireDefault(require("../v-x-e-table"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Table = Object.assign(_table.default, {
  install: function install(Vue) {
    if (typeof window !== 'undefined' && window.VXETableMixin) {
      _table.default.mixins.push(window.VXETableMixin);

      delete window.VXETableMixin;
    }

    _vXETable.default.Vue = Vue;
    _vXETable.default.Table = _table.default;
    _vXETable.default.TableComponent = _table.default;

    if (!Vue.prototype.$vxe) {
      Vue.prototype.$vxe = {
        t: _vXETable.default.t,
        _t: _vXETable.default._t
      };
    } else {
      Vue.prototype.$vxe.t = _vXETable.default.t;
      Vue.prototype.$vxe._t = _vXETable.default._t;
    }

    Vue.component(_table.default.name, _table.default);
    Vue.component(_body.default.name, _body.default);
  }
});
exports.Table = Table;
var _default = Table;
exports.default = _default;