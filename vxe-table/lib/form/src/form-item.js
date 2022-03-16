"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _xeUtils = _interopRequireDefault(require("xe-utils"));

var _conf = _interopRequireDefault(require("../../v-x-e-table/src/conf"));

var _vXETable = _interopRequireDefault(require("../../v-x-e-table"));

var _utils = require("../../tools/utils");

var _util = require("./util");

var _render = require("./render");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var props = {
  title: String,
  field: String,
  size: String,
  span: [String, Number],
  align: String,
  titleAlign: String,
  titleWidth: [String, Number],
  className: [String, Function],
  titleOverflow: {
    type: [Boolean, String],
    default: null
  },
  titlePrefix: Object,
  titleSuffix: Object,
  resetValue: {
    default: null
  },
  visible: {
    type: Boolean,
    default: null
  },
  visibleMethod: Function,
  folding: Boolean,
  collapseNode: Boolean,
  itemRender: Object
};
var watch = {};
Object.keys(props).forEach(function (name) {
  watch[name] = function (value) {
    this.itemConfig.update(name, value);
  };
});

var renderItem = function renderItem(h, _vm, item, slots) {
  var rules = _vm.rules,
      data = _vm.data,
      collapseAll = _vm.collapseAll,
      validOpts = _vm.validOpts,
      allTitleOverflow = _vm.titleOverflow;
  var title = item.title,
      folding = item.folding,
      visible = item.visible,
      visibleMethod = item.visibleMethod,
      field = item.field,
      collapseNode = item.collapseNode,
      itemRender = item.itemRender,
      showError = item.showError,
      errRule = item.errRule,
      className = item.className,
      titleOverflow = item.titleOverflow;
  var compConf = (0, _utils.isEnableConf)(itemRender) ? _vXETable.default.renderer.get(itemRender.name) : null;
  var span = item.span || _vm.span;
  var align = item.align || _vm.align;
  var titleAlign = item.titleAlign || _vm.titleAlign;
  var titleWidth = item.titleWidth || _vm.titleWidth;
  var itemVisibleMethod = visibleMethod;
  var itemOverflow = _xeUtils.default.isUndefined(titleOverflow) || _xeUtils.default.isNull(titleOverflow) ? allTitleOverflow : titleOverflow;
  var showEllipsis = itemOverflow === 'ellipsis';
  var showTitle = itemOverflow === 'title';
  var showTooltip = itemOverflow === true || itemOverflow === 'tooltip';
  var hasEllipsis = showTitle || showTooltip || showEllipsis;
  var params = {
    data: data,
    property: field,
    item: item,
    $form: _vm
  };
  var isRequired;

  if (!itemVisibleMethod && compConf && compConf.itemVisibleMethod) {
    itemVisibleMethod = compConf.itemVisibleMethod;
  }

  if (rules) {
    var itemRules = rules[field];

    if (itemRules) {
      isRequired = itemRules.some(function (rule) {
        return rule.required;
      });
    }
  }

  var contentVNs = [];

  if (slots && slots.default) {
    contentVNs = _vm.callSlot(slots.default, params, h);
  } else if (compConf && compConf.renderItemContent) {
    contentVNs = compConf.renderItemContent.call(_vm, h, itemRender, params);
  } else if (compConf && compConf.renderItem) {
    contentVNs = compConf.renderItem.call(_vm, h, itemRender, params);
  } else if (field) {
    contentVNs = ["".concat(_xeUtils.default.get(data, field))];
  }

  var ons = showTooltip ? {
    mouseenter: function mouseenter(evnt) {
      _vm.triggerTitleTipEvent(evnt, params);
    },
    mouseleave: _vm.handleTitleTipLeaveEvent
  } : {};
  return h('div', {
    class: ['vxe-form--item', item.id, span ? "vxe-col--".concat(span, " is--span") : null, className ? _xeUtils.default.isFunction(className) ? className(params) : className : '', {
      'is--title': title,
      'is--required': isRequired,
      'is--hidden': visible === false || folding && collapseAll,
      'is--active': !itemVisibleMethod || itemVisibleMethod(params),
      'is--error': showError
    }]
  }, [h('div', {
    class: 'vxe-form--item-inner'
  }, [title || slots && slots.title ? h('div', {
    class: ['vxe-form--item-title', titleAlign ? "align--".concat(titleAlign) : null, {
      'is--ellipsis': hasEllipsis
    }],
    style: titleWidth ? {
      width: isNaN(titleWidth) ? titleWidth : "".concat(titleWidth, "px")
    } : null,
    attrs: {
      title: showTitle ? (0, _utils.getFuncText)(title) : null
    },
    on: ons
  }, (0, _render.renderTitle)(h, _vm, item)) : null, h('div', {
    class: ['vxe-form--item-content', align ? "align--".concat(align) : null]
  }, contentVNs.concat([collapseNode ? h('div', {
    class: 'vxe-form--item-trigger-node',
    on: {
      click: _vm.toggleCollapseEvent
    }
  }, [h('span', {
    class: 'vxe-form--item-trigger-text'
  }, collapseAll ? _conf.default.i18n('vxe.form.unfolding') : _conf.default.i18n('vxe.form.folding')), h('i', {
    class: ['vxe-form--item-trigger-icon', collapseAll ? _conf.default.icon.FORM_FOLDING : _conf.default.icon.FORM_UNFOLDING]
  })]) : null, errRule && validOpts.showMessage ? h('div', {
    class: 'vxe-form--item-valid',
    style: errRule.maxWidth ? {
      width: "".concat(errRule.maxWidth, "px")
    } : null
  }, errRule.message) : null]))])]);
};

var _default = {
  name: 'VxeFormItem',
  props: props,
  inject: {
    $xeform: {
      default: null
    },
    xeformgather: {
      default: null
    }
  },
  data: function data() {
    return {
      itemConfig: null
    };
  },
  watch: watch,
  mounted: function mounted() {
    (0, _util.assemItem)(this);
  },
  created: function created() {
    this.itemConfig = (0, _util.createItem)(this.$xeform, this);
  },
  destroyed: function destroyed() {
    (0, _util.destroyItem)(this);
  },
  render: function render(h) {
    var $xeform = this.$xeform;
    return $xeform && $xeform.customLayout ? renderItem(h, $xeform, this.itemConfig, this.$scopedSlots) : h('div');
  }
};
exports.default = _default;