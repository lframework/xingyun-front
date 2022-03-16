"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _xeUtils = _interopRequireDefault(require("xe-utils"));

var _conf = _interopRequireDefault(require("../../v-x-e-table/src/conf"));

var _modal = _interopRequireDefault(require("../../modal/src/modal"));

var _radio = _interopRequireDefault(require("../../radio/src/radio"));

var _utils = _interopRequireDefault(require("../../tools/utils"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _default = {
  name: 'VxeImportPanel',
  props: {
    defaultOptions: Object,
    storeData: Object
  },
  components: {
    VxeModal: _modal.default,
    VxeRadio: _radio.default
  },
  data: function data() {
    return {
      loading: false
    };
  },
  computed: {
    vSize: function vSize() {
      return this.size || this.$parent.size || this.$parent.vSize;
    },
    selectName: function selectName() {
      return "".concat(this.storeData.filename, ".").concat(this.storeData.type);
    },
    hasFile: function hasFile() {
      return this.storeData.file && this.storeData.type;
    },
    parseTypeLabel: function parseTypeLabel() {
      var storeData = this.storeData;
      var type = storeData.type,
          typeList = storeData.typeList;

      if (type) {
        var selectItem = _xeUtils.default.find(typeList, function (item) {
          return type === item.value;
        });

        return selectItem ? _conf.default.i18n(selectItem.label) : '*.*';
      }

      return "*.".concat(typeList.map(function (item) {
        return item.value;
      }).join(', *.'));
    }
  },
  render: function render(h) {
    var hasFile = this.hasFile,
        parseTypeLabel = this.parseTypeLabel,
        defaultOptions = this.defaultOptions,
        storeData = this.storeData,
        selectName = this.selectName;
    return h('vxe-modal', {
      res: 'modal',
      props: {
        value: storeData.visible,
        title: _conf.default.i18n('vxe.import.impTitle'),
        width: 440,
        mask: true,
        lockView: true,
        showFooter: false,
        escClosable: true,
        maskClosable: true,
        loading: this.loading
      },
      on: {
        input: function input(value) {
          storeData.visible = value;
        },
        show: this.showEvent
      }
    }, [h('div', {
      class: 'vxe-export--panel'
    }, [h('table', {
      attrs: {
        cellspacing: 0,
        cellpadding: 0,
        border: 0
      }
    }, [h('tbody', [h('tr', [h('td', _conf.default.i18n('vxe.import.impFile')), h('td', [hasFile ? h('div', {
      class: 'vxe-import-selected--file',
      attrs: {
        title: selectName
      }
    }, [h('span', selectName), h('i', {
      class: _conf.default.icon.INPUT_CLEAR,
      on: {
        click: this.clearFileEvent
      }
    })]) : h('button', {
      ref: 'fileBtn',
      class: 'vxe-import-select--file',
      attrs: {
        type: 'button'
      },
      on: {
        click: this.selectFileEvent
      }
    }, _conf.default.i18n('vxe.import.impSelect'))])]), h('tr', [h('td', _conf.default.i18n('vxe.import.impType')), h('td', parseTypeLabel)]), h('tr', [h('td', _conf.default.i18n('vxe.import.impOpts')), h('td', [h('vxe-radio-group', {
      props: {
        value: defaultOptions.mode
      },
      on: {
        input: function input(value) {
          defaultOptions.mode = value;
        }
      }
    }, storeData.modeList.map(function (item) {
      return h('vxe-radio', {
        props: {
          label: item.value
        }
      }, _conf.default.i18n(item.label));
    }))])])])]), h('div', {
      class: 'vxe-export--panel-btns'
    }, [h('vxe-button', {
      on: {
        click: this.cancelEvent
      }
    }, _conf.default.i18n('vxe.import.impCancel')), h('vxe-button', {
      props: {
        status: 'primary',
        disabled: !hasFile
      },
      on: {
        click: this.importEvent
      }
    }, _conf.default.i18n('vxe.import.impConfirm'))])])]);
  },
  methods: {
    clearFileEvent: function clearFileEvent() {
      Object.assign(this.storeData, {
        filename: '',
        sheetName: '',
        type: ''
      });
    },
    selectFileEvent: function selectFileEvent() {
      var _this = this;

      var $xetable = this.$parent;
      $xetable.readFile(this.defaultOptions).then(function (params) {
        var file = params.file;
        Object.assign(_this.storeData, _utils.default.parseFile(file), {
          file: file
        });
      }).catch(function (e) {
        return e;
      });
    },
    showEvent: function showEvent() {
      var _this2 = this;

      this.$nextTick(function () {
        var $refs = _this2.$refs;
        var targetElem = $refs.fileBtn;

        if (targetElem) {
          targetElem.focus();
        }
      });
    },
    cancelEvent: function cancelEvent() {
      this.storeData.visible = false;
    },
    importEvent: function importEvent() {
      var _this3 = this;

      var $xetable = this.$parent;
      this.loading = true;
      $xetable.importByFile(this.storeData.file, Object.assign({}, $xetable.importOpts, this.defaultOptions)).then(function () {
        _this3.loading = false;
        _this3.storeData.visible = false;
      }).catch(function () {
        _this3.loading = false;
      });
    }
  }
};
exports.default = _default;