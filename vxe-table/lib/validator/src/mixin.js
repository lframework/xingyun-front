"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _xeUtils = _interopRequireDefault(require("xe-utils"));

var _conf = _interopRequireDefault(require("../../v-x-e-table/src/conf"));

var _utils = require("../../tools/utils");

var _dom = _interopRequireDefault(require("../../tools/dom"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }

/**
 * 校验规则
 */
var Rule = /*#__PURE__*/function () {
  function Rule(rule) {
    _classCallCheck(this, Rule);

    Object.assign(this, {
      $options: rule,
      required: rule.required,
      min: rule.min,
      max: rule.max,
      type: rule.type,
      pattern: rule.pattern,
      validator: rule.validator,
      trigger: rule.trigger,
      maxWidth: rule.maxWidth
    });
  }
  /**
   * 获取校验不通过的消息
   * 支持国际化翻译
   */


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

var _default = {
  methods: {
    /**
     * 完整校验，和 validate 的区别就是会给有效数据中的每一行进行校验
     */
    _fullValidate: function _fullValidate(rows, cb) {
      return this.beginValidate(rows, cb, true);
    },

    /**
     * 快速校验，如果存在记录不通过的记录，则返回不再继续校验（异步校验除外）
     */
    _validate: function _validate(rows, cb) {
      return this.beginValidate(rows, cb);
    },

    /**
     * 聚焦到校验通过的单元格并弹出校验错误提示
     */
    handleValidError: function handleValidError(params) {
      var _this = this;

      return new Promise(function (resolve) {
        if (_this.validOpts.autoPos === false) {
          _this.emitEvent('valid-error', params);

          resolve();
        } else {
          _this.handleActived(params, {
            type: 'valid-error',
            trigger: 'call'
          }).then(function () {
            setTimeout(function () {
              resolve(_this.showValidTooltip(params));
            }, 10);
          });
        }
      });
    },

    /**
     * 对表格数据进行校验
     * 如果不指定数据，则默认只校验临时变动的数据，例如新增或修改
     * 如果传 true 则校验当前表格数据
     * 如果传 row 指定行记录，则只验证传入的行
     * 如果传 rows 为多行记录，则只验证传入的行
     * 如果只传 callback 否则默认验证整个表格数据
     * 返回 Promise 对象，或者使用回调方式
     */
    beginValidate: function beginValidate(rows, cb, isFull) {
      var _this2 = this;

      var validRest = {};
      var editRules = this.editRules,
          afterFullData = this.afterFullData,
          treeConfig = this.treeConfig,
          treeOpts = this.treeOpts;
      var vaildDatas;

      if (rows === true) {
        vaildDatas = afterFullData;
      } else if (rows) {
        if (_xeUtils.default.isFunction(rows)) {
          cb = rows;
        } else {
          vaildDatas = _xeUtils.default.isArray(rows) ? rows : [rows];
        }
      }

      if (!vaildDatas) {
        vaildDatas = this.getInsertRecords().concat(this.getUpdateRecords());
      }

      var rowValids = [];
      this.lastCallTime = Date.now();
      this.validRuleErr = false; // 如果为快速校验，当存在某列校验不通过时将终止执行

      this.clearValidate();

      if (editRules) {
        var columns = this.getColumns();

        var handleVaild = function handleVaild(row) {
          if (isFull || !_this2.validRuleErr) {
            var colVailds = [];
            columns.forEach(function (column) {
              if ((isFull || !_this2.validRuleErr) && _xeUtils.default.has(editRules, column.property)) {
                colVailds.push(_this2.validCellRules('all', row, column).catch(function (_ref) {
                  var rule = _ref.rule,
                      rules = _ref.rules;
                  var rest = {
                    rule: rule,
                    rules: rules,
                    rowIndex: _this2.getRowIndex(row),
                    row: row,
                    columnIndex: _this2.getColumnIndex(column),
                    column: column,
                    field: column.property,
                    $table: _this2
                  };

                  if (!validRest[column.property]) {
                    validRest[column.property] = [];
                  }

                  validRest[column.property].push(rest);

                  if (!isFull) {
                    _this2.validRuleErr = true;
                    return Promise.reject(rest);
                  }
                }));
              }
            });
            rowValids.push(Promise.all(colVailds));
          }
        };

        if (treeConfig) {
          _xeUtils.default.eachTree(vaildDatas, handleVaild, treeOpts);
        } else {
          vaildDatas.forEach(handleVaild);
        }

        return Promise.all(rowValids).then(function () {
          var ruleProps = Object.keys(validRest);
          return _this2.$nextTick().then(function () {
            if (ruleProps.length) {
              return Promise.reject(validRest[ruleProps[0]][0]);
            }

            if (cb) {
              cb();
            }
          });
        }).catch(function (firstErrParams) {
          return new Promise(function (resolve, reject) {
            var finish = function finish() {
              _this2.$nextTick(function () {
                if (cb) {
                  cb(validRest);
                  resolve();
                } else {
                  if (_conf.default.validToReject === 'obsolete') {
                    // 已废弃，校验失败将不会执行catch
                    reject(validRest);
                  } else {
                    resolve(validRest);
                  }
                }
              });
            };

            var posAndFinish = function posAndFinish() {
              firstErrParams.cell = _this2.getCell(firstErrParams.row, firstErrParams.column);

              _dom.default.scrollToView(firstErrParams.cell);

              _this2.handleValidError(firstErrParams).then(finish);
            };
            /**
             * 当校验不通过时
             * 将表格滚动到可视区
             * 由于提示信息至少需要占一行，定位向上偏移一行
             */


            var row = firstErrParams.row;
            var rowIndex = afterFullData.indexOf(row);
            var locatRow = rowIndex > 0 ? afterFullData[rowIndex - 1] : row;

            if (_this2.validOpts.autoPos === false) {
              finish();
            } else {
              if (treeConfig) {
                _this2.scrollToTreeRow(locatRow).then(posAndFinish);
              } else {
                _this2.scrollToRow(locatRow).then(posAndFinish);
              }
            }
          });
        });
      }

      return this.$nextTick().then(function () {
        if (cb) {
          cb();
        }
      });
    },
    hasCellRules: function hasCellRules(type, row, column) {
      var editRules = this.editRules;
      var property = column.property;

      if (property && editRules) {
        var rules = _xeUtils.default.get(editRules, property);

        return rules && _xeUtils.default.find(rules, function (rule) {
          return type === 'all' || !rule.trigger || type === rule.trigger;
        });
      }

      return false;
    },

    /**
     * 校验数据
     * 按表格行、列顺序依次校验（同步或异步）
     * 校验规则根据索引顺序依次校验，如果是异步则会等待校验完成才会继续校验下一列
     * 如果校验失败则，触发回调或者Promise<不通过列的错误消息>
     * 如果是传回调方式这返回一个校验不通过列的错误消息
     *
     * rule 配置：
     *  required=Boolean 是否必填
     *  min=Number 最小长度
     *  max=Number 最大长度
     *  validator=Function({ cellValue, rule, rules, row, column, rowIndex, columnIndex }) 自定义校验，接收一个 Promise
     *  trigger=blur|change 触发方式（除非特殊场景，否则默认为空就行）
     */
    validCellRules: function validCellRules(validType, row, column, val) {
      var _this3 = this;

      var editRules = this.editRules;
      var property = column.property;
      var errorRules = [];
      var syncVailds = [];

      if (property && editRules) {
        var rules = _xeUtils.default.get(editRules, property);

        if (rules) {
          var cellValue = _xeUtils.default.isUndefined(val) ? _xeUtils.default.get(row, property) : val;
          rules.forEach(function (rule) {
            var type = rule.type,
                trigger = rule.trigger,
                required = rule.required;

            if (validType === 'all' || !trigger || validType === trigger) {
              if (_xeUtils.default.isFunction(rule.validator)) {
                var customValid = rule.validator({
                  cellValue: cellValue,
                  rule: rule,
                  rules: rules,
                  row: row,
                  rowIndex: _this3.getRowIndex(row),
                  column: column,
                  columnIndex: _this3.getColumnIndex(column),
                  field: column.property,
                  $table: _this3
                });

                if (customValid) {
                  if (_xeUtils.default.isError(customValid)) {
                    _this3.validRuleErr = true;
                    errorRules.push(new Rule({
                      type: 'custom',
                      trigger: trigger,
                      content: customValid.message,
                      rule: new Rule(rule)
                    }));
                  } else if (customValid.catch) {
                    // 如果为异步校验（注：异步校验是并发无序的）
                    syncVailds.push(customValid.catch(function (e) {
                      _this3.validRuleErr = true;
                      errorRules.push(new Rule({
                        type: 'custom',
                        trigger: trigger,
                        content: e && e.message ? e.message : rule.content || rule.message,
                        rule: new Rule(rule)
                      }));
                    }));
                  }
                }
              } else {
                var isArrType = type === 'array';
                var hasEmpty = isArrType ? !_xeUtils.default.isArray(cellValue) || !cellValue.length : (0, _utils.eqEmptyValue)(cellValue);

                if (required ? hasEmpty || validErrorRuleValue(rule, cellValue) : !hasEmpty && validErrorRuleValue(rule, cellValue)) {
                  _this3.validRuleErr = true;
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
    _clearValidate: function _clearValidate() {
      var validTip = this.$refs.validTip;
      Object.assign(this.validStore, {
        visible: false,
        row: null,
        column: null,
        content: '',
        rule: null
      });

      if (validTip && validTip.visible) {
        validTip.close();
      }

      return this.$nextTick();
    },

    /**
     * 触发校验
     */
    triggerValidate: function triggerValidate(type) {
      var _this4 = this;

      var editConfig = this.editConfig,
          editStore = this.editStore,
          editRules = this.editRules,
          validStore = this.validStore;
      var actived = editStore.actived;

      if (actived.row && editRules) {
        var _actived$args = actived.args,
            row = _actived$args.row,
            column = _actived$args.column,
            cell = _actived$args.cell;

        if (this.hasCellRules(type, row, column)) {
          return this.validCellRules(type, row, column).then(function () {
            if (editConfig.mode === 'row') {
              if (validStore.visible && validStore.row === row && validStore.column === column) {
                _this4.clearValidate();
              }
            }
          }).catch(function (_ref2) {
            var rule = _ref2.rule;

            // 如果校验不通过与触发方式一致，则聚焦提示错误，否则跳过并不作任何处理
            if (!rule.trigger || type === rule.trigger) {
              var rest = {
                rule: rule,
                row: row,
                column: column,
                cell: cell
              };

              _this4.showValidTooltip(rest);

              return Promise.reject(rest);
            }

            return Promise.resolve();
          });
        }
      }

      return Promise.resolve();
    },

    /**
     * 弹出校验错误提示
     */
    showValidTooltip: function showValidTooltip(params) {
      var _this5 = this;

      var $refs = this.$refs,
          height = this.height,
          tableData = this.tableData,
          validOpts = this.validOpts;
      var rule = params.rule,
          row = params.row,
          column = params.column,
          cell = params.cell;
      var validTip = $refs.validTip;
      var content = rule.content;
      return this.$nextTick(function () {
        Object.assign(_this5.validStore, {
          row: row,
          column: column,
          rule: rule,
          content: content,
          visible: true
        });

        _this5.emitEvent('valid-error', params);

        if (validTip && (validOpts.message === 'tooltip' || validOpts.message === 'default' && !height && tableData.length < 2)) {
          return validTip.open(cell, content);
        }
      });
    }
  }
};
exports.default = _default;