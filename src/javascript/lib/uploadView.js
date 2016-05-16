'use strict';

(function(root, factory) {
  if (typeof exports === 'object') {
    // CommonJS
    module.exports = factory(
        require('jquery'),
        require('remodal'),
        require('./template/upload_template.hbs'),
        require('jquery-easing')
    );

  } else if (typeof define === 'function' && define.amd) {
      // AMD (require JS)
      define(['jquery',
              'remodal',
              './template/upload_template.hbs',
              'jquery-easing'], factory);

  } else {
    // Global Variables
    root.uploadView = factory(root.jQuery);
  }

})(this, function ($, remodal, uploaderHtmlTemplate) {

  function UploaderView(el, params) {
    this.settings = $.extend({}, UploaderView.defaults, params);
    this.containerEl = (typeof el !== 'undefined') ? $(el) : this.settings.el;
    this._modalId = this.settings.modalId;
    this._initialised = false;
  }

  UploaderView.defaults = {
    containerEl: $('body'),
    fileInputName: 'the-image-uploader',
    dragDrop: true
  };

  UploaderView.prototype = {
    render: function() {
      if (!this._initialised) {
        this._setUploadModal();
        this._initEvents();
        this._initialised = true;
      }
    },

    _initEvents: function() {
      // this.btnEl.on('click', $.proxy(this.showUploadModal, this));
    },

    _setUploadModal: function() {

      // Add to DOM and Initialise modal
      if (!this._modalInDOM()) {
        this._renderModal();
      }

      // Start remodal
      this._getModalEl().remodal();
    },

    _modalInDOM: function() {
      return (this._getModalEl().length > 0);
    },

    _getModalEl: function() {
      return $('[data-remodal-id=' + this._getModalId() + ']');
    },

    _renderModal: function() {
      this.containerEl.append(this._getModalHtml());
    },

    _getModalHtml: function() {
      var _this = this;

      var modalHtml = uploaderHtmlTemplate({
        modalId: _this._getModalId(),
        fileInputName: _this.settings.fileInputName
      });

      return modalHtml;
    },
    _getModalId: function() {
      return this._modalId;
    }
  };

  return function uploadView(options) {
    return new UploaderView(options.containerEl, options);
  };
});



