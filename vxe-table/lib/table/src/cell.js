"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.Cell = void 0;

var _xeUtils = _interopRequireDefault(require("xe-utils"));

var _conf = _interopRequireDefault(require("../../v-x-e-table/src/conf"));

var _vXETable = _interopRequireDefault(require("../../v-x-e-table"));

var _dom = _interopRequireDefault(require("../../tools/dom"));

var _utils = _interopRequireWildcard(require("../../tools/utils"));

var _util = require("./util");

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function renderHelpIcon(h, params) {
  var $table = params.$table,
      column = params.column;
  var titlePrefix = column.titlePrefix || column.titleHelp;
  return titlePrefix ? [h('i', {
    class: ['vxe-cell-help-icon', titlePrefix.icon || _conf.default.icon.TABLE_HELP],
    on: {
      mouseenter: function mouseenter(evnt) {
        $table.triggerHeaderHelpEvent(evnt, params);
      },
      mouseleave: function mouseleave(evnt) {
        $table.handleTargetLeaveEvent(evnt);
      }
    }
  })] : [];
}

function renderTitleContent(h, params, content) {
  var $table = params.$table,
      column = params.column;
  var type = column.type,
      showHeaderOverflow = column.showHeaderOverflow;
  var allColumnHeaderOverflow = $table.showHeaderOverflow,
      tooltipOpts = $table.tooltipOpts;
  var showAllTip = tooltipOpts.showAll || tooltipOpts.enabled;
  var headOverflow = _xeUtils.default.isUndefined(showHeaderOverflow) || _xeUtils.default.isNull(showHeaderOverflow) ? allColumnHeaderOverflow : showHeaderOverflow;
  var showTitle = headOverflow === 'title';
  var showTooltip = headOverflow === true || headOverflow === 'tooltip';
  var ons = {};

  if (showTitle || showTooltip || showAllTip) {
    ons.mouseenter = function (evnt) {
      if ($table._isResize) {
        return;
      }

      if (showTitle) {
        _dom.default.updateCellTitle(evnt.currentTarget, column);
      } else if (showTooltip || showAllTip) {
        $table.triggerHeaderTooltipEvent(evnt, params);
      }
    };
  }

  if (showTooltip || showAllTip) {
    ons.mouseleave = function (evnt) {
      if ($table._isResize) {
        return;
      }

      if (showTooltip || showAllTip) {
        $table.handleTargetLeaveEvent(evnt);
      }
    };
  }

  return [type === 'html' && _xeUtils.default.isString(content) ? h('span', {
    class: 'vxe-cell--title',
    domProps: {
      innerHTML: content
    },
    on: ons
  }) : h('span', {
    class: 'vxe-cell--title',
    on: ons
  }, content)];
}

function getFooterContent(h, params) {
  var $table = params.$table,
      column = params.column,
      _columnIndex = params._columnIndex,
      items = params.items;
  var slots = column.slots,
      editRender = column.editRender,
      cellRender = column.cellRender;
  var renderOpts = editRender || cellRender;

  if (slots && slots.footer) {
    return $table.callSlot(slots.footer, params, h);
  }

  if (renderOpts) {
    var compConf = _vXETable.default.renderer.get(renderOpts.name);

    if (compConf && compConf.renderFooter) {
      return compConf.renderFooter.call($table, h, renderOpts, params);
    }
  }

  return [_utils.default.formatText(items[_columnIndex], 1)];
}

function getDefaultCellLabel(params) {
  var $table = params.$table,
      row = params.row,
      column = params.column;
  return _utils.default.formatText($table.getCellLabel(row, column), 1);
}

var Cell = {
  createColumn: function createColumn($xetable, _vm) {
    var type = _vm.type,
        sortable = _vm.sortable,
        remoteSort = _vm.remoteSort,
        filters = _vm.filters,
        editRender = _vm.editRender,
        treeNode = _vm.treeNode;
    var editConfig = $xetable.editConfig,
        editOpts = $xetable.editOpts,
        checkboxOpts = $xetable.checkboxOpts;
    var renMaps = {
      renderHeader: this.renderDefaultHeader,
      renderCell: treeNode ? this.renderTreeCell : this.renderDefaultCell,
      renderFooter: this.renderDefaultFooter
    };

    switch (type) {
      case 'seq':
        renMaps.renderHeader = this.renderSeqHeader;
        renMaps.renderCell = treeNode ? this.renderTreeIndexCell : this.renderSeqCell;
        break;

      case 'radio':
        renMaps.renderHeader = this.renderRadioHeader;
        renMaps.renderCell = treeNode ? this.renderTreeRadioCell : this.renderRadioCell;
        break;

      case 'checkbox':
        renMaps.renderHeader = this.renderCheckboxHeader;
        renMaps.renderCell = checkboxOpts.checkField ? treeNode ? this.renderTreeSelectionCellByProp : this.renderCheckboxCellByProp : treeNode ? this.renderTreeSelectionCell : this.renderCheckboxCell;
        break;

      case 'expand':
        renMaps.renderCell = this.renderExpandCell;
        renMaps.renderData = this.renderExpandData;
        break;

      case 'html':
        renMaps.renderCell = treeNode ? this.renderTreeHTMLCell : this.renderHTMLCell;

        if (filters && (sortable || remoteSort)) {
          renMaps.renderHeader = this.renderSortAndFilterHeader;
        } else if (sortable || remoteSort) {
          renMaps.renderHeader = this.renderSortHeader;
        } else if (filters) {
          renMaps.renderHeader = this.renderFilterHeader;
        }

        break;

      default:
        if (editConfig && editRender) {
          renMaps.renderHeader = this.renderEditHeader;
          renMaps.renderCell = editOpts.mode === 'cell' ? treeNode ? this.renderTreeCellEdit : this.renderCellEdit : treeNode ? this.renderTreeRowEdit : this.renderRowEdit;
        } else if (filters && (sortable || remoteSort)) {
          renMaps.renderHeader = this.renderSortAndFilterHeader;
        } else if (sortable || remoteSort) {
          renMaps.renderHeader = this.renderSortHeader;
        } else if (filters) {
          renMaps.renderHeader = this.renderFilterHeader;
        }

    }

    return (0, _util.getColumnConfig)($xetable, _vm, renMaps);
  },

  /**
   * 单元格
   */
  renderHeaderTitle: function renderHeaderTitle(h, params) {
    var $table = params.$table,
        column = params.column;
    var slots = column.slots,
        editRender = column.editRender,
        cellRender = column.cellRender;
    var renderOpts = editRender || cellRender;

    if (slots && slots.header) {
      return renderTitleContent(h, params, $table.callSlot(slots.header, params, h));
    }

    if (renderOpts) {
      var compConf = _vXETable.default.renderer.get(renderOpts.name);

      if (compConf && compConf.renderHeader) {
        return renderTitleContent(h, params, compConf.renderHeader.call($table, h, renderOpts, params));
      }
    }

    return renderTitleContent(h, params, _utils.default.formatText(column.getTitle(), 1));
  },
  renderDefaultHeader: function renderDefaultHeader(h, params) {
    return renderHelpIcon(h, params).concat(Cell.renderHeaderTitle(h, params));
  },
  renderDefaultCell: function renderDefaultCell(h, params) {
    var $table = params.$table,
        row = params.row,
        column = params.column;
    var slots = column.slots,
        editRender = column.editRender,
        cellRender = column.cellRender;
    var renderOpts = editRender || cellRender;

    if (slots && slots.default) {
      return $table.callSlot(slots.default, params, h);
    }

    if (renderOpts) {
      var funName = editRender ? 'renderCell' : 'renderDefault';

      var compConf = _vXETable.default.renderer.get(renderOpts.name);

      if (compConf && compConf[funName]) {
        return compConf[funName].call($table, h, renderOpts, Object.assign({
          $type: editRender ? 'edit' : 'cell'
        }, params));
      }
    }

    var cellValue = $table.getCellLabel(row, column);
    var cellPlaceholder = editRender ? editRender.placeholder : '';
    return [h('span', {
      class: 'vxe-cell--label'
    }, editRender && (0, _utils.eqEmptyValue)(cellValue) ? [// 如果设置占位符
    h('span', {
      class: 'vxe-cell--placeholder'
    }, _utils.default.formatText((0, _utils.getFuncText)(cellPlaceholder), 1))] : _utils.default.formatText(cellValue, 1))];
  },
  renderTreeCell: function renderTreeCell(h, params) {
    return Cell.renderTreeIcon(h, params, Cell.renderDefaultCell.call(this, h, params));
  },
  renderDefaultFooter: function renderDefaultFooter(h, params) {
    return [h('span', {
      class: 'vxe-cell--item'
    }, getFooterContent(h, params))];
  },

  /**
   * 树节点
   */
  renderTreeIcon: function renderTreeIcon(h, params, cellVNodes) {
    var $table = params.$table,
        isHidden = params.isHidden;
    var treeOpts = $table.treeOpts,
        treeExpandeds = $table.treeExpandeds,
        treeLazyLoadeds = $table.treeLazyLoadeds;
    var row = params.row,
        column = params.column,
        level = params.level;
    var slots = column.slots;
    var children = treeOpts.children,
        hasChild = treeOpts.hasChild,
        indent = treeOpts.indent,
        lazy = treeOpts.lazy,
        trigger = treeOpts.trigger,
        iconLoaded = treeOpts.iconLoaded,
        showIcon = treeOpts.showIcon,
        iconOpen = treeOpts.iconOpen,
        iconClose = treeOpts.iconClose;
    var rowChilds = row[children];
    var hasLazyChilds = false;
    var isAceived = false;
    var isLazyLoaded = false;
    var on = {};

    if (slots && slots.icon) {
      return $table.callSlot(slots.icon, params, h, cellVNodes);
    }

    if (!isHidden) {
      isAceived = treeExpandeds.indexOf(row) > -1;

      if (lazy) {
        isLazyLoaded = treeLazyLoadeds.indexOf(row) > -1;
        hasLazyChilds = row[hasChild];
      }
    }

    if (!trigger || trigger === 'default') {
      on.click = function (evnt) {
        return $table.triggerTreeExpandEvent(evnt, params);
      };
    }

    return [h('div', {
      class: ['vxe-cell--tree-node', {
        'is--active': isAceived
      }],
      style: {
        paddingLeft: "".concat(level * indent, "px")
      }
    }, [showIcon && (rowChilds && rowChilds.length || hasLazyChilds) ? [h('div', {
      class: 'vxe-tree--btn-wrapper',
      on: on
    }, [h('i', {
      class: ['vxe-tree--node-btn', isLazyLoaded ? iconLoaded || _conf.default.icon.TABLE_TREE_LOADED : isAceived ? iconOpen || _conf.default.icon.TABLE_TREE_OPEN : iconClose || _conf.default.icon.TABLE_TREE_CLOSE]
    })])] : null, h('div', {
      class: 'vxe-tree-cell'
    }, cellVNodes)])];
  },

  /**
   * 索引
   */
  renderSeqHeader: function renderSeqHeader(h, params) {
    var $table = params.$table,
        column = params.column;
    var slots = column.slots;
    return renderTitleContent(h, params, slots && slots.header ? $table.callSlot(slots.header, params, h) : _utils.default.formatText(column.getTitle(), 1));
  },
  renderSeqCell: function renderSeqCell(h, params) {
    var $table = params.$table,
        column = params.column;
    var treeConfig = $table.treeConfig,
        seqOpts = $table.seqOpts;
    var slots = column.slots;

    if (slots && slots.default) {
      return $table.callSlot(slots.default, params, h);
    }

    var seq = params.seq;
    var seqMethod = seqOpts.seqMethod;
    return [_utils.default.formatText(seqMethod ? seqMethod(params) : treeConfig ? seq : (seqOpts.startIndex || 0) + seq, 1)];
  },
  renderTreeIndexCell: function renderTreeIndexCell(h, params) {
    return Cell.renderTreeIcon(h, params, Cell.renderSeqCell(h, params));
  },

  /**
   * 单选
   */
  renderRadioHeader: function renderRadioHeader(h, params) {
    var $table = params.$table,
        column = params.column;
    var slots = column.slots;
    var headerSlot = slots ? slots.header : null;
    var titleSlot = slots ? slots.title : null;
    return renderTitleContent(h, params, headerSlot ? $table.callSlot(headerSlot, params, h) : [h('span', {
      class: 'vxe-radio--label'
    }, titleSlot ? $table.callSlot(titleSlot, params, h) : _utils.default.formatText(column.getTitle(), 1))]);
  },
  renderRadioCell: function renderRadioCell(h, params) {
    var $table = params.$table,
        column = params.column,
        isHidden = params.isHidden;
    var radioOpts = $table.radioOpts,
        selectRow = $table.selectRow;
    var slots = column.slots;
    var labelField = radioOpts.labelField,
        checkMethod = radioOpts.checkMethod,
        visibleMethod = radioOpts.visibleMethod;
    var row = params.row;
    var defaultSlot = slots ? slots.default : null;
    var radioSlot = slots ? slots.radio : null;
    var isChecked = row === selectRow;
    var isVisible = !visibleMethod || visibleMethod({
      row: row
    });
    var isDisabled = !!checkMethod;
    var on;

    if (!isHidden) {
      on = {
        click: function click(evnt) {
          if (!isDisabled && isVisible) {
            $table.triggerRadioRowEvent(evnt, params);
          }
        }
      };

      if (checkMethod) {
        isDisabled = !checkMethod({
          row: row
        });
      }
    }

    var radioParams = _objectSpread(_objectSpread({}, params), {}, {
      checked: isChecked,
      disabled: isDisabled,
      visible: isVisible
    });

    if (radioSlot) {
      return $table.callSlot(radioSlot, radioParams, h);
    }

    var radioVNs = [];

    if (isVisible) {
      radioVNs.push(h('span', {
        class: 'vxe-radio--icon vxe-radio--checked-icon'
      }), h('span', {
        class: 'vxe-radio--icon vxe-radio--unchecked-icon'
      }));
    }

    if (defaultSlot || labelField) {
      radioVNs.push(h('span', {
        class: 'vxe-radio--label'
      }, defaultSlot ? $table.callSlot(defaultSlot, radioParams, h) : _xeUtils.default.get(row, labelField)));
    }

    return [h('span', {
      class: ['vxe-cell--radio', {
        'is--checked': isChecked,
        'is--disabled': isDisabled
      }],
      on: on
    }, radioVNs)];
  },
  renderTreeRadioCell: function renderTreeRadioCell(h, params) {
    return Cell.renderTreeIcon(h, params, Cell.renderRadioCell(h, params));
  },

  /**
   * 多选
   */
  renderCheckboxHeader: function renderCheckboxHeader(h, params) {
    var $table = params.$table,
        column = params.column,
        isHidden = params.isHidden;
    var isAllCheckboxSelected = $table.isAllSelected,
        isAllCheckboxIndeterminate = $table.isIndeterminate,
        isAllCheckboxDisabled = $table.isAllCheckboxDisabled;
    var slots = column.slots;
    var headerSlot = slots ? slots.header : null;
    var titleSlot = slots ? slots.title : null;
    var checkboxOpts = $table.checkboxOpts;
    var headerTitle = column.getTitle();
    var on;

    if (!isHidden) {
      on = {
        click: function click(evnt) {
          if (!isAllCheckboxDisabled) {
            $table.triggerCheckAllEvent(evnt, !isAllCheckboxSelected);
          }
        }
      };
    }

    var checkboxParams = _objectSpread(_objectSpread({}, params), {}, {
      checked: isAllCheckboxSelected,
      disabled: isAllCheckboxDisabled,
      indeterminate: isAllCheckboxIndeterminate
    });

    if (headerSlot) {
      return renderTitleContent(h, checkboxParams, $table.callSlot(headerSlot, checkboxParams, h));
    }

    if (checkboxOpts.checkStrictly ? !checkboxOpts.showHeader : checkboxOpts.showHeader === false) {
      return renderTitleContent(h, checkboxParams, [h('span', {
        class: 'vxe-checkbox--label'
      }, titleSlot ? $table.callSlot(titleSlot, checkboxParams, h) : headerTitle)]);
    }

    return renderTitleContent(h, checkboxParams, [h('span', {
      class: ['vxe-cell--checkbox', {
        'is--checked': isAllCheckboxSelected,
        'is--disabled': isAllCheckboxDisabled,
        'is--indeterminate': isAllCheckboxIndeterminate
      }],
      attrs: {
        title: _conf.default.i18n('vxe.table.allTitle')
      },
      on: on
    }, [h('span', {
      class: 'vxe-checkbox--icon vxe-checkbox--checked-icon'
    }), h('span', {
      class: 'vxe-checkbox--icon vxe-checkbox--unchecked-icon'
    }), h('span', {
      class: 'vxe-checkbox--icon vxe-checkbox--indeterminate-icon'
    })].concat(titleSlot || headerTitle ? [h('span', {
      class: 'vxe-checkbox--label'
    }, titleSlot ? $table.callSlot(titleSlot, checkboxParams, h) : headerTitle)] : []))]);
  },
  renderCheckboxCell: function renderCheckboxCell(h, params) {
    var $table = params.$table,
        row = params.row,
        column = params.column,
        isHidden = params.isHidden;
    var treeConfig = $table.treeConfig,
        treeIndeterminates = $table.treeIndeterminates;
    var _$table$checkboxOpts = $table.checkboxOpts,
        labelField = _$table$checkboxOpts.labelField,
        checkMethod = _$table$checkboxOpts.checkMethod,
        visibleMethod = _$table$checkboxOpts.visibleMethod;
    var slots = column.slots;
    var defaultSlot = slots ? slots.default : null;
    var checkboxSlot = slots ? slots.checkbox : null;
    var indeterminate = false;
    var isChecked = false;
    var isVisible = !visibleMethod || visibleMethod({
      row: row
    });
    var isDisabled = !!checkMethod;
    var on;

    if (!isHidden) {
      isChecked = $table.selection.indexOf(row) > -1;
      on = {
        click: function click(evnt) {
          if (!isDisabled && isVisible) {
            $table.triggerCheckRowEvent(evnt, params, !isChecked);
          }
        }
      };

      if (checkMethod) {
        isDisabled = !checkMethod({
          row: row
        });
      }

      if (treeConfig) {
        indeterminate = treeIndeterminates.indexOf(row) > -1;
      }
    }

    var checkboxParams = _objectSpread(_objectSpread({}, params), {}, {
      checked: isChecked,
      disabled: isDisabled,
      visible: isVisible,
      indeterminate: indeterminate
    });

    if (checkboxSlot) {
      return $table.callSlot(checkboxSlot, checkboxParams, h);
    }

    var checkVNs = [];

    if (isVisible) {
      checkVNs.push(h('span', {
        class: 'vxe-checkbox--icon vxe-checkbox--checked-icon'
      }), h('span', {
        class: 'vxe-checkbox--icon vxe-checkbox--unchecked-icon'
      }), h('span', {
        class: 'vxe-checkbox--icon vxe-checkbox--indeterminate-icon'
      }));
    }

    if (defaultSlot || labelField) {
      checkVNs.push(h('span', {
        class: 'vxe-checkbox--label'
      }, defaultSlot ? $table.callSlot(defaultSlot, checkboxParams, h) : _xeUtils.default.get(row, labelField)));
    }

    return [h('span', {
      class: ['vxe-cell--checkbox', {
        'is--checked': isChecked,
        'is--disabled': isDisabled,
        'is--indeterminate': indeterminate
      }],
      on: on
    }, checkVNs)];
  },
  renderTreeSelectionCell: function renderTreeSelectionCell(h, params) {
    return Cell.renderTreeIcon(h, params, Cell.renderCheckboxCell(h, params));
  },
  renderCheckboxCellByProp: function renderCheckboxCellByProp(h, params) {
    var $table = params.$table,
        row = params.row,
        column = params.column,
        isHidden = params.isHidden;
    var treeConfig = $table.treeConfig,
        treeIndeterminates = $table.treeIndeterminates;
    var _$table$checkboxOpts2 = $table.checkboxOpts,
        labelField = _$table$checkboxOpts2.labelField,
        property = _$table$checkboxOpts2.checkField,
        halfField = _$table$checkboxOpts2.halfField,
        checkMethod = _$table$checkboxOpts2.checkMethod,
        visibleMethod = _$table$checkboxOpts2.visibleMethod;
    var slots = column.slots;
    var defaultSlot = slots ? slots.default : null;
    var checkboxSlot = slots ? slots.checkbox : null;
    var indeterminate = false;
    var isChecked = false;
    var isVisible = !visibleMethod || visibleMethod({
      row: row
    });
    var isDisabled = !!checkMethod;
    var on;

    if (!isHidden) {
      isChecked = _xeUtils.default.get(row, property);
      on = {
        click: function click(evnt) {
          if (!isDisabled && isVisible) {
            $table.triggerCheckRowEvent(evnt, params, !isChecked);
          }
        }
      };

      if (checkMethod) {
        isDisabled = !checkMethod({
          row: row
        });
      }

      if (treeConfig) {
        indeterminate = treeIndeterminates.indexOf(row) > -1;
      }
    }

    var checkboxParams = _objectSpread(_objectSpread({}, params), {}, {
      checked: isChecked,
      disabled: isDisabled,
      visible: isVisible,
      indeterminate: indeterminate
    });

    if (checkboxSlot) {
      return $table.callSlot(checkboxSlot, checkboxParams, h);
    }

    var checkVNs = [];

    if (isVisible) {
      checkVNs.push(h('span', {
        class: 'vxe-checkbox--icon vxe-checkbox--checked-icon'
      }), h('span', {
        class: 'vxe-checkbox--icon vxe-checkbox--unchecked-icon'
      }), h('span', {
        class: 'vxe-checkbox--icon vxe-checkbox--indeterminate-icon'
      }));
    }

    if (defaultSlot || labelField) {
      checkVNs.push(h('span', {
        class: 'vxe-checkbox--label'
      }, defaultSlot ? $table.callSlot(defaultSlot, checkboxParams, h) : _xeUtils.default.get(row, labelField)));
    }

    return [h('span', {
      class: ['vxe-cell--checkbox', {
        'is--checked': isChecked,
        'is--disabled': isDisabled,
        'is--indeterminate': halfField && !isChecked ? row[halfField] : indeterminate
      }],
      on: on
    }, checkVNs)];
  },
  renderTreeSelectionCellByProp: function renderTreeSelectionCellByProp(h, params) {
    return Cell.renderTreeIcon(h, params, Cell.renderCheckboxCellByProp(h, params));
  },

  /**
   * 展开行
   */
  renderExpandCell: function renderExpandCell(h, params) {
    var $table = params.$table,
        isHidden = params.isHidden,
        row = params.row,
        column = params.column;
    var expandOpts = $table.expandOpts,
        rowExpandeds = $table.rowExpandeds,
        expandLazyLoadeds = $table.expandLazyLoadeds;
    var lazy = expandOpts.lazy,
        labelField = expandOpts.labelField,
        iconLoaded = expandOpts.iconLoaded,
        showIcon = expandOpts.showIcon,
        iconOpen = expandOpts.iconOpen,
        iconClose = expandOpts.iconClose,
        visibleMethod = expandOpts.visibleMethod;
    var slots = column.slots;
    var defaultSlot = slots ? slots.default : null;
    var isAceived = false;
    var isLazyLoaded = false;

    if (slots && slots.icon) {
      return $table.callSlot(slots.icon, params, h);
    }

    if (!isHidden) {
      isAceived = rowExpandeds.indexOf(params.row) > -1;

      if (lazy) {
        isLazyLoaded = expandLazyLoadeds.indexOf(row) > -1;
      }
    }

    return [showIcon && (!visibleMethod || visibleMethod(params)) ? h('span', {
      class: ['vxe-table--expanded', {
        'is--active': isAceived
      }],
      on: {
        click: function click(evnt) {
          $table.triggerRowExpandEvent(evnt, params);
        }
      }
    }, [h('i', {
      class: ['vxe-table--expand-btn', isLazyLoaded ? iconLoaded || _conf.default.icon.TABLE_EXPAND_LOADED : isAceived ? iconOpen || _conf.default.icon.TABLE_EXPAND_OPEN : iconClose || _conf.default.icon.TABLE_EXPAND_CLOSE]
    })]) : null, defaultSlot || labelField ? h('span', {
      class: 'vxe-table--expand-label'
    }, defaultSlot ? $table.callSlot(defaultSlot, params, h) : _xeUtils.default.get(row, labelField)) : null];
  },
  renderExpandData: function renderExpandData(h, params) {
    var $table = params.$table,
        column = params.column;
    var slots = column.slots,
        contentRender = column.contentRender;

    if (slots && slots.content) {
      return $table.callSlot(slots.content, params, h);
    }

    if (contentRender) {
      var compConf = _vXETable.default.renderer.get(contentRender.name);

      if (compConf && compConf.renderExpand) {
        return compConf.renderExpand.call($table, h, contentRender, params);
      }
    }

    return [];
  },

  /**
   * HTML 标签
   */
  renderHTMLCell: function renderHTMLCell(h, params) {
    var $table = params.$table,
        column = params.column;
    var slots = column.slots;

    if (slots && slots.default) {
      return $table.callSlot(slots.default, params, h);
    }

    return [h('span', {
      class: 'vxe-cell--html',
      domProps: {
        innerHTML: getDefaultCellLabel(params)
      }
    })];
  },
  renderTreeHTMLCell: function renderTreeHTMLCell(h, params) {
    return Cell.renderTreeIcon(h, params, Cell.renderHTMLCell(h, params));
  },

  /**
   * 排序和筛选
   */
  renderSortAndFilterHeader: function renderSortAndFilterHeader(h, params) {
    return Cell.renderDefaultHeader(h, params).concat(Cell.renderSortIcon(h, params)).concat(Cell.renderFilterIcon(h, params));
  },

  /**
   * 排序
   */
  renderSortHeader: function renderSortHeader(h, params) {
    return Cell.renderDefaultHeader(h, params).concat(Cell.renderSortIcon(h, params));
  },
  renderSortIcon: function renderSortIcon(h, params) {
    var $table = params.$table,
        column = params.column;
    var _$table$sortOpts = $table.sortOpts,
        showIcon = _$table$sortOpts.showIcon,
        iconAsc = _$table$sortOpts.iconAsc,
        iconDesc = _$table$sortOpts.iconDesc;
    return showIcon ? [h('span', {
      class: 'vxe-cell--sort'
    }, [h('i', {
      class: ['vxe-sort--asc-btn', iconAsc || _conf.default.icon.TABLE_SORT_ASC, {
        'sort--active': column.order === 'asc'
      }],
      attrs: {
        title: _conf.default.i18n('vxe.table.sortAsc')
      },
      on: {
        click: function click(evnt) {
          $table.triggerSortEvent(evnt, column, 'asc');
        }
      }
    }), h('i', {
      class: ['vxe-sort--desc-btn', iconDesc || _conf.default.icon.TABLE_SORT_DESC, {
        'sort--active': column.order === 'desc'
      }],
      attrs: {
        title: _conf.default.i18n('vxe.table.sortDesc')
      },
      on: {
        click: function click(evnt) {
          $table.triggerSortEvent(evnt, column, 'desc');
        }
      }
    })])] : [];
  },

  /**
   * 筛选
   */
  renderFilterHeader: function renderFilterHeader(h, params) {
    return Cell.renderDefaultHeader(h, params).concat(Cell.renderFilterIcon(h, params));
  },
  renderFilterIcon: function renderFilterIcon(h, params) {
    var $table = params.$table,
        column = params.column,
        hasFilter = params.hasFilter;
    var filterStore = $table.filterStore,
        filterOpts = $table.filterOpts;
    var showIcon = filterOpts.showIcon,
        iconNone = filterOpts.iconNone,
        iconMatch = filterOpts.iconMatch;
    return showIcon ? [h('span', {
      class: ['vxe-cell--filter', {
        'is--active': filterStore.visible && filterStore.column === column
      }]
    }, [h('i', {
      class: ['vxe-filter--btn', hasFilter ? iconMatch || _conf.default.icon.TABLE_FILTER_MATCH : iconNone || _conf.default.icon.TABLE_FILTER_NONE],
      attrs: {
        title: _conf.default.i18n('vxe.table.filter')
      },
      on: {
        click: function click(evnt) {
          $table.triggerFilterEvent(evnt, params.column, params);
        }
      }
    })])] : [];
  },

  /**
   * 可编辑
   */
  renderEditHeader: function renderEditHeader(h, params) {
    var $table = params.$table,
        column = params.column;
    var editConfig = $table.editConfig,
        editRules = $table.editRules,
        editOpts = $table.editOpts;
    var sortable = column.sortable,
        remoteSort = column.remoteSort,
        filters = column.filters,
        editRender = column.editRender;
    var isRequired = false;

    if (editRules) {
      var columnRules = _xeUtils.default.get(editRules, params.column.property);

      if (columnRules) {
        isRequired = columnRules.some(function (rule) {
          return rule.required;
        });
      }
    }

    return ((0, _utils.isEnableConf)(editConfig) ? [isRequired && editOpts.showAsterisk ? h('i', {
      class: 'vxe-cell--required-icon'
    }) : null, (0, _utils.isEnableConf)(editRender) && editOpts.showIcon ? h('i', {
      class: ['vxe-cell--edit-icon', editOpts.icon || _conf.default.icon.TABLE_EDIT]
    }) : null] : []).concat(Cell.renderDefaultHeader(h, params)).concat(sortable || remoteSort ? Cell.renderSortIcon(h, params) : []).concat(filters ? Cell.renderFilterIcon(h, params) : []);
  },
  // 行格编辑模式
  renderRowEdit: function renderRowEdit(h, params) {
    var $table = params.$table,
        column = params.column;
    var editRender = column.editRender;
    var actived = $table.editStore.actived;
    return Cell.runRenderer(h, params, this, (0, _utils.isEnableConf)(editRender) && actived && actived.row === params.row);
  },
  renderTreeRowEdit: function renderTreeRowEdit(h, params) {
    return Cell.renderTreeIcon(h, params, Cell.renderRowEdit(h, params));
  },
  // 单元格编辑模式
  renderCellEdit: function renderCellEdit(h, params) {
    var $table = params.$table,
        column = params.column;
    var editRender = column.editRender;
    var actived = $table.editStore.actived;
    return Cell.runRenderer(h, params, this, (0, _utils.isEnableConf)(editRender) && actived && actived.row === params.row && actived.column === params.column);
  },
  renderTreeCellEdit: function renderTreeCellEdit(h, params) {
    return Cell.renderTreeIcon(h, params, Cell.renderCellEdit(h, params));
  },
  runRenderer: function runRenderer(h, params, _vm, isEdit) {
    var $table = params.$table,
        column = params.column;
    var slots = column.slots,
        editRender = column.editRender,
        formatter = column.formatter;

    var compConf = _vXETable.default.renderer.get(editRender.name);

    if (isEdit) {
      if (slots && slots.edit) {
        return $table.callSlot(slots.edit, params, h);
      }

      return compConf && compConf.renderEdit ? compConf.renderEdit.call($table, h, editRender, Object.assign({
        $type: 'edit'
      }, params)) : [];
    }

    if (slots && slots.default) {
      return $table.callSlot(slots.default, params, h);
    }

    if (formatter) {
      return [h('span', {
        class: 'vxe-cell--label'
      }, [getDefaultCellLabel(params)])];
    }

    return Cell.renderDefaultCell.call(_vm, h, params);
  }
};
exports.Cell = Cell;
var _default = Cell;
exports.default = _default;