'use strict';

(function(root, factory) {
  if (typeof exports === 'object') {
    // CommonJS
    module.exports = factory(
        require('jquery'),
        require('remodal'),
        require('./template/upload_template.hbs'),
        require('./util/smartResize'),
        require('jvent'),
        require('jquery-easing'),
        require('cropit')
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

})(this, function ($, remodal, uploaderHtmlTemplate, smartResize, Events) {

  var preventDefault = function(event) {
    if (event.preventDefault) {
      return event.preventDefault();
    } else {
      event.returnValue = false;
    }
  };

  function UploaderView(el, params) {
    Events.apply(this, arguments);
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

  UploaderView.prototype = $.extend({}, Events.prototype, {
    initialise: function() {
      if (!this._initialised) {
        this._setUploadModal();
        this._initEvents();
        this._initialised = true;
      }

      return this;
    },

    resetModal: function() {
      this.hideModal();
      this_updateCropper('');
    },

    showModal: function() {
      this._getModal().open();
    },

    hideModal: function() {
      this._getModal().close();
    },

    _initEvents: function() {
      var _this = this;
      var dragDropBoxEl = $('.image-uploader__drag-box--js');
      var uploadBtnEl = $('.image-uploader__btn--upload--js');
      var rotateCCWEl = $('.image-uploader__btn--rotate-ccw--js');
      var rotateCWEl = $('.image-uploader__btn--rotate-cw--js');

      uploadBtnEl.on('click', $.proxy(this, 'onUploadBtnClicked'));

      smartResize(this.onWindowResized, {
        delay: 200,
        context: _this
      });

      rotateCWEl.click(function() {
        _this._getCropperEl().cropit('rotateCW');
      });

      rotateCCWEl.click(function() {
        _this._getCropperEl().cropit('rotateCCW');
      });

      dragDropBoxEl.on('drag dragstart dragend dragover dragenter dragleave drop', function(e) {
        preventDefault(e);
        e.stopPropagation();
      })
      .on('dragover dragenter', function() {
        $(this).addClass('is-dragover');
      })
      .on('dragleave dragend drop', function() {
        $(this).removeClass('is-dragover');
      })
      .on('drop', function(e) {
        var files = e.originalEvent.dataTransfer.files;
        if (files.length && _this._fileValidImage(files[0])) {
          $(this).addClass('is-dropped');
          _this.fileName = files[0].name;
          _this._getDataUri(files[0], function dataUriReceived(err, dataUri) {
            _this._updateCropper(dataUri);
          });
        }
      });
    },

    _setCropper: function(params) {
      var _this = this;
      var cropperParams = params || {
        onImageError: function(err) {
          console.log('There was an error loading the image to cropper', err);
        },
        onImageLoaded: function() {
          var tempImagePreviewEl = _this._getModalEl().find('.image-uploader__drag-box__image--js');
          tempImagePreviewEl.removeClass('show');

          _this.uploadImageLoaded = true;
        },
        onFileChange: function(e) {
          _this.fileName = e.target.files[0].name;
        },
        smallImage: true,
        imageBackground: true,
        maxZoom: 2,
        imageBackgroundBorderWidth: 20,
        allowDragNDrop: false,
        $fileInput: _this._getModalEl().find('.image-uploader__file-chooser--js')
      };

      this._getCropperEl().cropit(cropperParams);

      // Set the cropper initial image src
      if (_this.uploadImageData) {
        _this._updateCropper(_this.uploadImageData);
      } else if (_this.settings.imageSrc) {
        _this._updateCropper(_this.settings.imageSrc);
      }
    },

    onUploadBtnClicked: function(e) {
      preventDefault(e);
      if (this.uploadImageLoaded) {
        var imageData = this.uploadImageData = this._getCropperEl().cropit('export');
        this.emit('uploadImageReady', this.fileName, imageData);
      }
    },

    onWindowResized: function(e) {
      if (this._getModal().getState !== 'opened') {
        return;
      }

      // Force updating the image size upon resize
      if (this.uploadImageData || this.settings.imageSrc) {
        var tempImagePreviewEl = this._getModalEl().find('.image-uploader__drag-box__image--js');
        var cropperParentEl = this._getCropperEl().parent();
        var cropperClone = this._getCropperEl().clone();
        tempImagePreviewEl.attr('src', this.uploadImageData || this.settings.imageSrc);
        tempImagePreviewEl.addClass('show');

        this._getCropperEl().remove();
        cropperParentEl.append(cropperClone);
        cropperClone.find('.cropit-preview').attr('style', '').empty();

        this._setCropper();
      }
    },

    _fileValidImage: function(file) {
      var validImagePattern = this.settings.validImageTypes || /(gif|jpg|jpeg|tiff|png)$/i;
      return validImagePattern.test(file.type)
    },
    _getBlobUrlFromFile: function(file) {
      return URL.createObjectURL(file);
    },
    _getDataUri: function(file, callback) {
      var reader = new FileReader();
      reader.onload = function(e) {
        callback(null, e.target.result);
      };

      reader.readAsDataURL(file);
    },

    _getCropperEl: function() {
      return this._getModalEl().find('.image-uploader__drag-box__image-cropper--js');
    },
    _updateCropper: function(imageUrl) {
      var cropperEl = this._getCropperEl();
      cropperEl.cropit('imageSrc', imageUrl);
    },

    _setUploadModal: function() {

      var _this = this;
      // Add to DOM and Initialise modal
      if (!this._modalInDOM()) {
        this._renderModal();
      }

      // Start remodal
      this._getModalEl().remodal({hashTracking: false});

      $(document).on('opened', '[data-remodal-id=' + this._getModalId() + ']', function (e) {
        var tempImagePreviewEl = _this._getModalEl().find('.image-uploader__drag-box__image--js');

        if (!_this.initialCropperSet) {
          _this._setCropper(_this.settings.cropperParams);

          // Temporarily show the image
          if (_this.settings.imageSrc) {
            tempImagePreviewEl.attr('src', _this.settings.imageSrc);
            tempImagePreviewEl.addClass('show');
          }
          _this.initialCropperSet = true;
        }
      });
    },

    _modalInDOM: function() {
      return (this._getModalEl().length > 0);
    },

    _getModal: function() {
      return this._getModalEl().remodal();
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
        fileInputName: _this.settings.fileInputName,
        uploaderTitle: _this.settings.uploaderTitle || 'Update Profile Picture'
      });

      return modalHtml;
    },
    _getModalId: function() {
      return this._modalId;
    }
  });

  return function uploadView(options) {
    return new UploaderView(options.containerEl, options);
  };
});



