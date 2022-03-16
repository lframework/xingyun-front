"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _exportNames = {
  use: true,
  config: true,
  t: true,
  _t: true,
  v: true,
  VXETable: true
};
exports.VXETable = void 0;
exports._t = _t;
exports.default = exports.config = void 0;
exports.t = t;
exports.use = use;
exports.v = void 0;

var _xeUtils = _interopRequireDefault(require("xe-utils"));

var _conf = _interopRequireDefault(require("../v-x-e-table/src/conf"));

var _interceptor = require("./src/interceptor");

Object.keys(_interceptor).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _interceptor[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _interceptor[key];
    }
  });
});

var _renderer = require("./src/renderer");

Object.keys(_renderer).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _renderer[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _renderer[key];
    }
  });
});

var _commands = require("./src/commands");

Object.keys(_commands).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _commands[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _commands[key];
    }
  });
});

var _menus = require("./src/menus");

Object.keys(_menus).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _menus[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _menus[key];
    }
  });
});

var _formats = require("./src/formats");

Object.keys(_formats).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _formats[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _formats[key];
    }
  });
});

var _setup = require("./src/setup");

Object.keys(_setup).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _setup[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _setup[key];
    }
  });
});

var _utils = require("../tools/utils");

var _log = require("../tools/log");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }

var installedPlugins = [];

function use(Plugin, options) {
  /* eslint-disable @typescript-eslint/no-use-before-define */
  if (Plugin && Plugin.install) {
    if (installedPlugins.indexOf(Plugin) === -1) {
      Plugin.install(VXETable, options);
      installedPlugins.push(Plugin);
    }
  }

  return VXETable;
}
/**
 * 检测模块的安装顺序是否正确
 */


function reg(key) {
  /* eslint-disable @typescript-eslint/no-use-before-define */
  // 检测安装顺序是否正确
  if (process.env.NODE_ENV === 'development') {
    if (VXETable.Table) {
      (0, _log.errLog)('vxe.error.useErr', [key]);
    }
  }

  VXETable["_".concat(key)] = 1;
}

function getExportOrImpotType(types, flag) {
  var rest = [];

  _xeUtils.default.objectEach(types, function (val, type) {
    if (val === 0 || val === flag) {
      rest.push(type);
    }
  });

  return rest;
}

var VXETableConfig = /*#__PURE__*/function () {
  function VXETableConfig() {
    _classCallCheck(this, VXETableConfig);
  }

  _createClass(VXETableConfig, [{
    key: "zIndex",
    get:
    /**
     * 获取当前的 zIndex
     */
    function get() {
      return _utils.UtilTools.getLastZIndex();
    }
    /**
     * 获取下一个 zIndex
     */

  }, {
    key: "nextZIndex",
    get: function get() {
      return _utils.UtilTools.nextZIndex();
    }
    /**
     * 获取所有导出类型
     */

  }, {
    key: "exportTypes",
    get: function get() {
      return getExportOrImpotType(_conf.default.export.types, 1);
    }
    /**
     * 获取所有导入类型
     */

  }, {
    key: "importTypes",
    get: function get() {
      return getExportOrImpotType(_conf.default.export.types, 2);
    }
  }]);

  return VXETableConfig;
}();

var config = new VXETableConfig();
exports.config = config;

function t(key, args) {
  return _conf.default.i18n(key, args);
}

function _t(key, args) {
  return key ? _xeUtils.default.toValueString(_conf.default.translate ? _conf.default.translate(key, args) : key) : '';
}

var v = 'v3';
exports.v = v;
var VXETable = {
  v: v,
  version: "3.5.0",
  reg: reg,
  use: use,
  setup: _setup.setup,
  interceptor: _interceptor.interceptor,
  renderer: _renderer.renderer,
  commands: _commands.commands,
  formats: _formats.formats,
  menus: _menus.menus,
  config: config,
  t: t,
  _t: _t
};
exports.VXETable = VXETable;
var _default = VXETable;
exports.default = _default;