"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.modal = exports.default = exports.Modal = void 0;

var _xeUtils = _interopRequireDefault(require("xe-utils"));

var _modal = _interopRequireWildcard(require("./src/modal"));

var _vXETable = _interopRequireDefault(require("../v-x-e-table"));

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* eslint-disable @typescript-eslint/no-use-before-define */
var ModalClass = null;

function openModal(opts) {
  var options = Object.assign({}, opts, {
    transfer: true
  });
  return new Promise(function (resolve) {
    if (options && options.id && _modal.allActivedModals.some(function (comp) {
      return comp.id === options.id;
    })) {
      resolve('exist');
    } else {
      var events = options.events || {};
      options.events = Object.assign({}, events, {
        hide: function hide(params) {
          if (events.hide) {
            events.hide.call(this, params);
          }

          setTimeout(function () {
            return $modal.$destroy();
          }, $modal.isMsg ? 500 : 100);
          resolve(params.type);
        }
      });
      var $modal = new ModalClass({
        el: document.createElement('div'),
        propsData: options
      });
      setTimeout(function () {
        if ($modal.isDestroy) {
          $modal.close();
        } else {
          $modal.open();
        }
      });
    }
  });
}
/**
 * 全局关闭动态的活动窗口（只能用于关闭动态的创建的活动窗口）
 * 如果传 id 则关闭指定的窗口
 * 如果不传则关闭所有窗口
 */


function closeModal(id) {
  var modals = arguments.length ? [getModal(id)] : _modal.allActivedModals;
  modals.forEach(function ($modal) {
    if ($modal) {
      $modal.isDestroy = true;
      $modal.close('close');
    }
  });
  return Promise.resolve();
}

function getModal(id) {
  return _xeUtils.default.find(_modal.allActivedModals, function ($modal) {
    return $modal.id === id;
  });
}

var ModalController = {
  get: getModal,
  close: closeModal,
  open: openModal
};
var modal = ModalController;
exports.modal = modal;
var shortcutTypes = ['alert', 'confirm', 'message'];
shortcutTypes.forEach(function (type, index) {
  var defOpts = index === 2 ? {
    mask: false,
    lockView: false,
    showHeader: false
  } : {
    showFooter: true
  };
  defOpts.type = type;
  defOpts.dblclickZoom = false;

  if (index === 1) {
    defOpts.status = 'question';
  }

  ModalController[type] = function (content, title, options) {
    var opts = {};

    if (_xeUtils.default.isObject(content)) {
      opts = content;
    } else {
      if (title) {
        opts = index === 2 ? {
          status: title
        } : {
          title: title
        };
      }

      opts.content = _xeUtils.default.toValueString(content);
    }

    return openModal(Object.assign({
      type: type
    }, defOpts, opts, options));
  };
});
var Modal = Object.assign(_modal.default, {
  install: function install(Vue) {
    _vXETable.default._modal = 1;
    Vue.component(_modal.default.name, _modal.default);
    ModalClass = Vue.extend(_modal.default);
    _vXETable.default.modal = ModalController;

    if (!Vue.prototype.$vxe) {
      Vue.prototype.$vxe = {
        modal: ModalController
      };
    } else {
      Vue.prototype.$vxe.modal = ModalController;
    }
  }
});
exports.Modal = Modal;
var _default = Modal;
exports.default = _default;