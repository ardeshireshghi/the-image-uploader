'use strict';

(function(root, factory) {
  if (typeof exports === 'object') {
    // CommonJS
    root.imageUploader = module.exports = factory(
      require('jquery'),
      require('./uploadView'),
      require('./util/dataURItoBlob'),
      require('./util/logger')
    );

  } else if (typeof define === 'function' && define.amd) {
      // AMD (require JS)
      define(['jquery', './uploadView'], factory);

  } else {
    // Global Variables
    root.imageUploader = factory(root.jQuery);
  }

})(this, function ($, uploadView, dataURItoBlob, Logger) {

  function ImageUploader(btnEl, params) {
    this.btnEl = btnEl;
    this.settings = $.extend(true, {}, ImageUploader.defaults, params);
    this.logger = Logger('uploader.js');
    this.init();
  }

  ImageUploader.defaults = {
    fileInputName: 'the-uploader-image',
    dragDrop: true,
    upload: true,
    url: ''
  };

  ImageUploader.prototype = {
    init: function() {
      this._setUploadView();
    },

    _setUploadView: function() {
      var _this = this;

      this.view = uploadView($.extend({}, this.settings, {
        containerEl: $('body'),
        modalId: _this._getModalId()
      }));

      this.view.initialise().on('uploadImageReady', function(fileName, imageDataURI) {
        // Crop finished callback
        if (typeof _this.settings.cropFinished === 'function') {
          _this.settings.cropFinished.call(null, fileName, imageDataURI, dataURItoBlob(imageDataURI));
        }

        if (_this.settings.upload) {
          _this._doUploadImage(fileName, imageDataURI);
        } else {
          _this.hide();
        }
      });
    },

    _getModalId: function() {
      if (!this._modalId) {
        var modalId = this.btnEl.data('target') || this.btnEl.attr('href');
        this._modalId = modalId.replace(/^#?/, '');
        this.btnEl.attr('data-remodal-target', this._modalId);
      }
      return this._modalId;
    },

    _doUploadImage: function(fileName, imageDataURI) {
      var _this = this;

      this.uploadImage(fileName, imageDataURI)
      .then(function(response) {
        _this.logger.log('Uploading Service response', response);
        _this.hide();
        _this.settings.uploadDone && _this.settings.uploadDone.call(null, imageDataURI, response);
      }, function(xhr, textStatus, err) {
        _this.logger.log('Error', xhr, textStatus, err);
        _this.settings.uploadError && _this.settings.uploadError.apply(null, arguments);
        _this.hide();
      });
    },

    hide: function() {
      this.view.hideModal();
    },

    uploadImage: function(fileName, imageDataURI) {
      var imageBlob = dataURItoBlob(imageDataURI);
      var data = new FormData();
      var _this = this;

      data.append(this.settings.fileInputName, imageBlob, fileName);

      return $.ajax({
        url: _this.settings.url,
        data: data,
        method: 'POST',
        cache: false,
        contentType: false,
        processData: false
      });
    }
  };

  function imageUploaderFactory(btnEl, params) {
    btnEl = (btnEl instanceof jQuery) ? btnEl : $(btnEl);
    return new ImageUploader(btnEl, params);
  }

  return imageUploaderFactory;
});
