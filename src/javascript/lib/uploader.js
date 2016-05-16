'use strict';

(function(root, factory) {
  if (typeof exports === 'object') {
    // CommonJS
    root.imageUploader = module.exports = factory(
      require('jquery'),
      require('./uploadView')
    );

  } else if (typeof define === 'function' && define.amd) {
      // AMD (require JS)
      define(['jquery', './uploadView'], factory);

  } else {
    // Global Variables
    root.imageUploader = factory(root.jQuery);
  }

})(this, function ($, uploadView) {

  function ImageUploader(btnEl, params) {
    this.btnEl = btnEl;
    this.settings = $.extend(true, {}, ImageUploader.defaults, params);

    this.init();
  }

  ImageUploader.defaults = {
    fileInputName: 'the-uploader-image',
    dragDrop: true,
    url: ''
  };

  ImageUploader.prototype = {
    init: function() {
      this._setUploadView();
      this._initEvents();
    },

    _initEvents: function() {
      // this.btnEl.on('click', $.proxy(this.showUploadModal, this));
    },

    _setUploadView: function() {
      var _this = this;

      this.view = uploadView($.extend({}, this.settings, {
        containerEl: $('body'),
        modalId: _this._getModalId()
      }));

      this.view.render();
    },

    _getModalId: function() {
      if (!this._modalId) {
        var modalId = this.btnEl.attr('href') || this.btnEl.data('target');
        this._modalId = modalId.replace('#', '');
      }
      return this._modalId;
    }
  };

  function imageUploaderFactory(btnEl, params) {
    btnEl = (btnEl instanceof jQuery) ? btnEl : $(btnEl);
    return new ImageUploader(btnEl, params);
  }

  return imageUploaderFactory;
});



// var myFileEl = document.querySelector('[type="file"]');

//     var submitForm = function submitForm(formEl, fileBlob, fileName) {
//         var data = new FormData(formEl);
//         data.append('myfile2', fileBlob, fileName);
//         return $.ajax({
//             url: formEl.action.replace('.com', '.com:8080'),
//             data: data,
//             method: 'POST',
//             cache: false,
//             contentType: false,
//             processData: false
//         });
//     };

//     var getReaderHandler = function getReaderHandler(selectedFile) {
//         var fileType = selectedFile.type;
//         var fileName = selectedFile.name.replace(/(.+)\./, "$1-blob.")

//         return function(e) {
//             console.log(e.target.result);
//             var blob = new Blob([e.target.result], {type : fileType}, fileName);
//             var imageEl = document.querySelector('.js-upload-photo');
//             imageEl.src = URL.createObjectURL(blob);

//             submitForm(document.forms[0], blob, fileName)
//             .then(function(uploadPaths){

//                 uploadPaths.paths.forEach(function(path) {
//                     var img = document.createElement('img');
//                     img.src = path.slice(1);
//                     img.style.width = '800px';
//                     img.style.height = '600px';
//                     document.forms[0].appendChild(img);
//                 });

//             }, function(xhr, textStatus, err) {
//                 console.log('Error', xhr, textStatus, err);
//             });
//         };
//     };

//     myFileEl.addEventListener('change', function() {
//         var selectedFile = this.files[0];
//         var reader = new FileReader();
//         reader.addEventListener('loadend', getReaderHandler(selectedFile), false);
//         reader.readAsArrayBuffer(selectedFile);
//     }, false);
