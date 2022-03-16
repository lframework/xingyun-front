"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _xeUtils = _interopRequireDefault(require("xe-utils"));

var _conf = _interopRequireDefault(require("../../v-x-e-table/src/conf"));

var _size = _interopRequireDefault(require("../../mixins/size"));

var _vXETable = _interopRequireDefault(require("../../v-x-e-table"));

var _utils = require("../../tools/utils");

var _dom = _interopRequireWildcard(require("../../tools/dom"));

var _util = require("./util");

var _render = require("./render");

var _log = require("../../tools/log");

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }

var Rule = /*#__PURE__*/function () {
  function Rule(rule) {
    _classCallCheck(this, Rule);

    Object.assign(this, {
      $options: rule,
      required: rule.required,
      min: rule.min,
      max: rule.min,
      type: rule.type,
      pattern: rule.pattern,
      validator: rule.validator,
      trigger: rule.trigger,
      maxWidth: rule.maxWidth
    });
  }

  _createClass(Rule, [{
    key: "content",
    get: function get() {
      return (0, _utils.getFuncText)(this.$options.content || this.$options.message);
    }
  }, {
    key: "message",
    get: function get() {
      return this.content;
    }
  }]);

  return Rule;
}();

function validErrorRuleValue(rule, val) {
  var type = rule.type,
      min = rule.min,
      max = rule.max,
      pattern = rule.pattern;
  var isNumType = type === 'number';
  var numVal = isNumType ? _xeUtils.default.toNumber(val) : _xeUtils.default.getSize(val); // 判断数值

  if (isNumType && isNaN(val)) {
    return true;
  } // 如果存在 min，判断最小值


  if (!_xeUtils.default.eqNull(min) && numVal < _xeUtils.default.toNumber(min)) {
    return true;
  } // 如果存在 max，判断最大值


  if (!_xeUtils.default.eqNull(max) && numVal > _xeUtils.default.toNumber(max)) {
    return true;
  } // 如果存在 pattern，正则校验


  if (pattern && !(_xeUtils.default.isRegExp(pattern) ? pattern : new RegExp(pattern)).test(val)) {
    return true;
  }

  return false;
}

function getResetValue(value, resetValue) {
  if (_xeUtils.default.isArray(value)) {
    resetValue = [];
  }

  return resetValue;
}

function renderItems(h, _vm, itemList) {
  var _e = _vm._e,
      rules = _vm.rules,
      data = _vm.data,
      collapseAll = _vm.collapseAll,
      validOpts = _vm.validOpts,
      allTitleOverflow = _vm.titleOverflow;
  return itemList.map(function (item) {
    var slots = item.slots,
        title = item.title,
        folding = item.folding,
        visible = item.visible,
        visibleMethod = item.visibleMethod,
        field = item.field,
        collapseNode = item.collapseNode,
        itemRender = item.itemRender,
        showError = item.showError,
        errRule = item.errRule,
        className = item.className,
        titleOverflow = item.titleOverflow,
        children = item.children;
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
      field: field,
      property: field,
      item: item,
      $form: _vm
    };
    var isRequired;

    if (visible === false) {
      return _e();
    } // 如果为项集合


    var isGather = children && children.length > 0;

    if (isGather) {
      var childVNs = renderItems(h, _vm, item.children);
      return childVNs.length ? h('div', {
        class: ['vxe-form--gather vxe-row', item.id, span ? "vxe-col--".concat(span, " is--span") : '', className ? _xeUtils.default.isFunction(className) ? className(params) : className : '']
      }, childVNs) : _e();
    }

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
        'is--hidden': folding && collapseAll,
        'is--active': !itemVisibleMethod || itemVisibleMethod(params),
        'is--error': showError
      }],
      key: item.id
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
    }, errRule.content) : null]))])]);
  });
}

var _default2 = {
  name: 'VxeForm',
  mixins: [_size.default],
  props: {
    collapseStatus: {
      type: Boolean,
      default: true
    },
    loading: Boolean,
    data: Object,
    size: {
      type: String,
      default: function _default() {
        return _conf.default.form.size || _conf.default.size;
      }
    },
    span: {
      type: [String, Number],
      default: function _default() {
        return _conf.default.form.span;
      }
    },
    align: {
      type: String,
      default: function _default() {
        return _conf.default.form.align;
      }
    },
    titleAlign: {
      type: String,
      default: function _default() {
        return _conf.default.form.titleAlign;
      }
    },
    titleWidth: {
      type: [String, Number],
      default: function _default() {
        return _conf.default.form.titleWidth;
      }
    },
    titleColon: {
      type: Boolean,
      default: function _default() {
        return _conf.default.form.titleColon;
      }
    },
    titleAsterisk: {
      type: Boolean,
      default: function _default() {
        return _conf.default.form.titleAsterisk;
      }
    },
    titleOverflow: {
      type: [Boolean, String],
      default: null
    },
    className: [String, Function],
    items: Array,
    rules: Object,
    preventSubmit: {
      type: Boolean,
      default: function _default() {
        return _conf.default.form.preventSubmit;
      }
    },
    validConfig: Object,
    tooltipConfig: Object,
    customLayout: {
      type: Boolean,
      default: function _default() {
        return _conf.default.form.customLayout;
      }
    }
  },
  data: function data() {
    return {
      collapseAll: this.collapseStatus,
      staticItems: [],
      formItems: [],
      tooltipTimeout: null,
      tooltipStore: {
        item: null,
        visible: false
      }
    };
  },
  provide: function provide() {
    return {
      $xeform: this
    };
  },
  computed: {
    validOpts: function validOpts() {
      return Object.assign({}, _conf.default.form.validConfig, this.validConfig);
    },
    tooltipOpts: function tooltipOpts() {
      return Object.assign({}, _conf.default.tooltip, _conf.default.form.tooltipConfig, this.tooltipConfig);
    }
  },
  watch: {
    staticItems: function staticItems(value) {
      this.formItems = value;
    },
    items: function items(value) {
      this.loadItem(value);
    },
    collapseStatus: function collapseStatus(value) {
      this.collapseAll = !!value;
    }
  },
  created: function created() {
    var _this = this;

    this.$nextTick(function () {
      var items = _this.items;

      if (process.env.NODE_ENV === 'development') {
        if (_this.customLayout && _this.items) {
          (0, _log.errLog)('vxe.error.errConflicts', ['custom-layout', 'items']);
        }
      }

      if (items) {
        _this.loadItem(items);
      }
    });
  },
  render: function render(h) {
    var _ref;

    var _e = this._e,
        loading = this.loading,
        className = this.className,
        data = this.data,
        vSize = this.vSize,
        tooltipOpts = this.tooltipOpts,
        formItems = this.formItems,
        customLayout = this.customLayout;
    var hasUseTooltip = _vXETable.default._tooltip;
    return h('form', {
      class: ['vxe-form', className ? _xeUtils.default.isFunction(className) ? className({
        items: formItems,
        data: data,
        $form: this
      }) : className : '', (_ref = {}, _defineProperty(_ref, "size--".concat(vSize), vSize), _defineProperty(_ref, 'is--colon', this.titleColon), _defineProperty(_ref, 'is--asterisk', this.titleAsterisk), _defineProperty(_ref, 'is--loading', loading), _ref)],
      on: {
        submit: this.submitEvent,
        reset: this.resetEvent
      }
    }, [h('div', {
      class: 'vxe-form--wrapper vxe-row'
    }, customLayout ? this.$slots.default : renderItems(h, this, formItems)), h('div', {
      class: 'vxe-form-slots',
      ref: 'hideItem'
    }, customLayout ? [] : this.$slots.default), h('div', {
      class: ['vxe-loading', {
        'is--visible': loading
      }]
    }, [h('div', {
      class: 'vxe-loading--spinner'
    })]),
    /**
     * 工具提示
     */
    hasUseTooltip ? h('vxe-tooltip', {
      ref: 'tooltip',
      props: tooltipOpts
    }) : _e()]);
  },
  methods: {
    callSlot: function callSlot(slotFunc, params, h) {
      if (slotFunc) {
        var $scopedSlots = this.$scopedSlots;

        if (_xeUtils.default.isString(slotFunc)) {
          slotFunc = $scopedSlots[slotFunc] || null;
        }

        if (_xeUtils.default.isFunction(slotFunc)) {
          return slotFunc.call(this, params, h);
        }
      }

      return [];
    },
    loadItem: function loadItem(list) {
      var _this2 = this;

      if (process.env.NODE_ENV === 'development') {
        var $scopedSlots = this.$scopedSlots;
        list.forEach(function (item) {
          if (item.slots) {
            _xeUtils.default.each(item.slots, function (func) {
              if (!_xeUtils.default.isFunction(func)) {
                if (!$scopedSlots[func]) {
                  (0, _log.errLog)('vxe.error.notSlot', [func]);
                }
              }
            });
          }
        });
      }

      this.staticItems = _xeUtils.default.mapTree(list, function (item) {
        return (0, _util.createItem)(_this2, item);
      }, {
        children: 'children'
      });
      return this.$nextTick();
    },
    getItems: function getItems() {
      var itemList = [];

      _xeUtils.default.eachTree(this.formItems, function (item) {
        itemList.push(item);
      }, {
        children: 'children'
      });

      return itemList;
    },
    getItemByField: function getItemByField(field) {
      var rest = _xeUtils.default.findTree(this.formItems, function (item) {
        return item.field === field;
      }, {
        children: 'children'
      });

      return rest ? rest.item : null;
    },
    toggleCollapse: function toggleCollapse() {
      var status = !this.collapseAll;
      this.collapseAll = status;
      this.$emit('update:collapseStatus', status);
      return this.$nextTick();
    },
    toggleCollapseEvent: function toggleCollapseEvent(evnt) {
      this.toggleCollapse();
      var status = this.collapseAll;
      this.$emit('toggle-collapse', {
        status: status,
        collapse: status,
        data: this.data,
        $form: this,
        $event: evnt
      }, evnt);
      this.$emit('collapse', {
        status: status,
        collapse: status,
        data: this.data,
        $form: this,
        $event: evnt
      }, evnt);
    },
    submitEvent: function submitEvent(evnt) {
      var _this3 = this;

      evnt.preventDefault();

      if (!this.preventSubmit) {
        this.clearValidate();
        this.beginValidate(this.getItems()).then(function () {
          _this3.$emit('submit', {
            data: _this3.data,
            $form: _this3,
            $event: evnt
          });
        }).catch(function (errMap) {
          _this3.$emit('submit-invalid', {
            data: _this3.data,
            errMap: errMap,
            $form: _this3,
            $event: evnt
          });
        });
      }
    },
    reset: function reset() {
      var _this4 = this;

      var data = this.data;

      if (data) {
        var itemList = this.getItems();
        itemList.forEach(function (item) {
          var field = item.field,
              resetValue = item.resetValue,
              itemRender = item.itemRender;

          if ((0, _utils.isEnableConf)(itemRender)) {
            var compConf = _vXETable.default.renderer.get(itemRender.name);

            if (compConf && compConf.itemResetMethod) {
              compConf.itemResetMethod({
                data: data,
                field: field,
                property: field,
                item: item,
                $form: _this4
              });
            } else if (field) {
              _xeUtils.default.set(data, field, resetValue === null ? getResetValue(_xeUtils.default.get(data, field), undefined) : resetValue);
            }
          }
        });
      }

      return this.clearValidate();
    },
    resetEvent: function resetEvent(evnt) {
      evnt.preventDefault();
      this.reset();
      this.$emit('reset', {
        data: this.data,
        $form: this,
        $event: evnt
      });
    },
    closeTooltip: function closeTooltip() {
      var tooltipStore = this.tooltipStore;
      var $tooltip = this.$refs.tooltip;

      if (tooltipStore.visible) {
        Object.assign(tooltipStore, {
          item: null,
          visible: false
        });

        if ($tooltip) {
          $tooltip.close();
        }
      }

      return this.$nextTick();
    },
    triggerTitleTipEvent: function triggerTitleTipEvent(evnt, params) {
      var item = params.item;
      var tooltipStore = this.tooltipStore;
      var $tooltip = this.$refs.tooltip;
      var overflowElem = evnt.currentTarget.children[0];
      var content = (overflowElem.textContent || '').trim();
      var isCellOverflow = overflowElem.scrollWidth > overflowElem.clientWidth;
      clearTimeout(this.tooltipTimeout);

      if (tooltipStore.item !== item) {
        this.closeTooltip();
      }

      if (content && isCellOverflow) {
        Object.assign(tooltipStore, {
          item: item,
          visible: true
        });

        if ($tooltip) {
          $tooltip.open(overflowElem, content);
        }
      }
    },
    handleTitleTipLeaveEvent: function handleTitleTipLeaveEvent() {
      var _this5 = this;

      var tooltipOpts = this.tooltipOpts;
      var $tooltip = this.$refs.tooltip;

      if ($tooltip) {
        $tooltip.setActived(false);
      }

      if (tooltipOpts.enterable) {
        this.tooltipTimeout = setTimeout(function () {
          $tooltip = _this5.$refs.tooltip;

          if ($tooltip && !$tooltip.isActived()) {
            _this5.closeTooltip();
          }
        }, tooltipOpts.leaveDelay);
      } else {
        this.closeTooltip();
      }
    },
    clearValidate: function clearValidate(fieldOrItem) {
      if (fieldOrItem) {
        var item = (0, _util.handleFieldOrItem)(this, fieldOrItem);

        if (item) {
          item.showError = false;
        }
      } else {
        this.getItems().forEach(function (item) {
          item.showError = false;
        });
      }

      return this.$nextTick();
    },
    validate: function validate(callback) {
      this.clearValidate();
      return this.beginValidate(this.getItems(), '', callback);
    },
    validateField: function validateField(fieldOrItem, callback) {
      var item = (0, _util.handleFieldOrItem)(this, fieldOrItem);
      return this.beginValidate(item ? [item] : [], '', callback);
    },
    beginValidate: function beginValidate(itemList, type, callback) {
      var _this6 = this;

      var data = this.data,
          formRules = this.rules,
          validOpts = this.validOpts;
      var validRest = {};
      var validFields = [];
      var itemValids = [];
      clearTimeout(this.showErrTime);

      if (data && formRules) {
        itemList.forEach(function (item) {
          var field = item.field;

          if (field) {
            itemValids.push(_this6.validItemRules(type || 'all', field).then(function () {
              item.errRule = null;
            }).catch(function (_ref2) {
              var rule = _ref2.rule,
                  rules = _ref2.rules;
              var rest = {
                rule: rule,
                rules: rules,
                data: data,
                field: field,
                property: field,
                $form: _this6
              };

              if (!validRest[field]) {
                validRest[field] = [];
              }

              validRest[field].push(rest);
              validFields.push(field);
              item.errRule = rule;
              return Promise.reject(rest);
            }));
          }
        });
        return Promise.all(itemValids).then(function () {
          if (callback) {
            callback();
          }
        }).catch(function () {
          return new Promise(function (resolve) {
            _this6.showErrTime = setTimeout(function () {
              itemList.forEach(function (item) {
                if (item.errRule) {
                  item.showError = true;
                }
              });
            }, 20);

            if (validOpts.autoPos) {
              _this6.$nextTick(function () {
                _this6.handleFocus(validFields);
              });
            }

            if (callback) {
              callback(validRest);
              resolve();
            } else {
              resolve(validRest);
            }
          });
        });
      }

      if (callback) {
        callback();
      }

      return Promise.resolve();
    },

    /**
     * 校验数据
     * 按表格行、列顺序依次校验（同步或异步）
     * 校验规则根据索引顺序依次校验，如果是异步则会等待校验完成才会继续校验下一列
     * 如果校验失败则，触发回调或者 Promise<(ErrMap 校验不通过列的信息)>
     * 如果是传回调方式这返回一个 (ErrMap 校验不通过列的信息)
     *
     * rule 配置：
     *  required=Boolean 是否必填
     *  min=Number 最小长度
     *  max=Number 最大长度
     *  validator=Function({ itemValue, rule, rules, data, property }) 自定义校验，接收一个 Promise
     *  trigger=change 触发方式
     */
    validItemRules: function validItemRules(validType, property, val) {
      var _this7 = this;

      var data = this.data,
          formRules = this.rules;
      var errorRules = [];
      var syncVailds = [];

      if (property && formRules) {
        var rules = _xeUtils.default.get(formRules, property);

        if (rules) {
          var itemValue = _xeUtils.default.isUndefined(val) ? _xeUtils.default.get(data, property) : val;
          rules.forEach(function (rule) {
            var type = rule.type,
                trigger = rule.trigger,
                required = rule.required;

            if (validType === 'all' || !trigger || validType === rule.trigger) {
              if (_xeUtils.default.isFunction(rule.validator)) {
                var customValid = rule.validator({
                  itemValue: itemValue,
                  rule: rule,
                  rules: rules,
                  data: data,
                  field: property,
                  property: property,
                  $form: _this7
                });

                if (customValid) {
                  if (_xeUtils.default.isError(customValid)) {
                    errorRules.push(new Rule({
                      type: 'custom',
                      trigger: trigger,
                      content: customValid.message,
                      rule: new Rule(rule)
                    }));
                  } else if (customValid.catch) {
                    // 如果为异步校验（注：异步校验是并发无序的）
                    syncVailds.push(customValid.catch(function (e) {
                      errorRules.push(new Rule({
                        type: 'custom',
                        trigger: trigger,
                        content: e ? e.message : rule.content || rule.message,
                        rule: new Rule(rule)
                      }));
                    }));
                  }
                }
              } else {
                var isArrType = type === 'array';
                var hasEmpty = isArrType ? !_xeUtils.default.isArray(itemValue) || !itemValue.length : (0, _utils.eqEmptyValue)(itemValue);

                if (required ? hasEmpty || validErrorRuleValue(rule, itemValue) : !hasEmpty && validErrorRuleValue(rule, itemValue)) {
                  errorRules.push(new Rule(rule));
                }
              }
            }
          });
        }
      }

      return Promise.all(syncVailds).then(function () {
        if (errorRules.length) {
          var rest = {
            rules: errorRules,
            rule: errorRules[0]
          };
          return Promise.reject(rest);
        }
      });
    },
    handleFocus: function handleFocus(fields) {
      var _this8 = this;

      var $el = this.$el;
      fields.some(function (property, index) {
        var item = _this8.getItemByField(property);

        if (item && (0, _utils.isEnableConf)(item.itemRender)) {
          var itemRender = item.itemRender;

          var compConf = _vXETable.default.renderer.get(itemRender.name);

          var inputElem; // 定位到第一个

          if (!index) {
            _dom.default.scrollToView($el.querySelector(".".concat(item.id)));
          } // 如果指定了聚焦 class


          if (itemRender.autofocus) {
            inputElem = $el.querySelector(".".concat(item.id, " ").concat(itemRender.autofocus));
          } // 渲染器的聚焦处理


          if (!inputElem && compConf && compConf.autofocus) {
            inputElem = $el.querySelector(".".concat(item.id, " ").concat(compConf.autofocus));
          }

          if (inputElem) {
            inputElem.focus(); // 保持一致行为，光标移到末端

            if (_dom.browse.msie) {
              var textRange = inputElem.createTextRange();
              textRange.collapse(false);
              textRange.select();
            }

            return true;
          }
        }
      });
    },

    /**
     * 更新项状态
     * 如果组件值 v-model 发生 change 时，调用改函数用于更新某一项编辑状态
     * 如果单元格配置了校验规则，则会进行校验
     */
    updateStatus: function updateStatus(scope, itemValue) {
      var _this9 = this;

      var property = scope.property;

      if (property) {
        this.validItemRules('change', property, itemValue).then(function () {
          _this9.clearValidate(property);
        }).catch(function (_ref3) {
          var rule = _ref3.rule;

          var item = _this9.getItemByField(property);

          if (item) {
            item.showError = true;
            item.errRule = rule;
          }
        });
      }
    }
  }
};
exports.default = _default2;