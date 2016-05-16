var $ = require('jquery');
var $ = require("jquery-easing");
var remodal = require('remodal');
var uploaderHtmlTemplate = require("./upload_template.hbs");

function ImageUploader(btnEl, params) {
  this.btnEl = btnEl;
  this.settings = $.extend(true, {}, ImageUploader.defaults, params);

  this.setUploadModal();
  this.initEvents();
}

ImageUploader.defaults = {
  fileInputName: 'the-image-uploader',
  dragDrop: true,
  url: ''
};

ImageUploader.prototype = {
  initEvents: function() {
    // this.btnEl.on('click', $.proxy(this.showUploadModal, this));
  },

  setUploadModal: function() {

    // Add to DOM and Initialise modal
    $('body').append(this._getModalMarkup());
    $('[data-remodal-id=' + this._getModalId() + ']').remodal();
  },

  _getModalMarkup: function() {
    var _this = this;

    var modalHtml = uploaderHtmlTemplate({
      modalId: _this._getModalId(),
      fileInputName: _this.settings.fileInputName
    });

    return modalHtml;
  },
  _getModalId: function() {
    if (!this._modalId) {
      var modalId = this.btnEl.attr('href') || this.btnEl.data('target');
      this._modalId = modalId.replace('#', '');
    }
    return this._modalId;
  }
};


module.exports = window.imageUploader = function(btnEl, params) {
  btnEl = (btnEl instanceof jQuery) ? btnEl : $(btnEl);
  return new ImageUploader(btnEl, params);
};



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
