'use strict';

(function(root, factory) {
  if (typeof exports === 'object') {
    // CommonJS
    factory(
        require('./lib/uploader')
    );

  } else if (typeof define === 'function' && define.amd) {
      // AMD (require JS)
      require(['./lib/uploader'], factory);

  } else {
    // Global Variables
    factory(root.imageUploader);
  }

})(this, function (imageUploader) {

  function createAnchorTag(text, href) {
    var el = document.createElement('a');
    el.href = href;
    el.textContent = text;

    return el;
  }

  var uploadBtnFirstEl = $(createAnchorTag('Upload image no initial image', '#test-uploader-1'));
  var uploadBtnSecondEl = $(createAnchorTag('Upload image initial image', '#test-uploader-2'));
  uploadBtnFirstEl.addClass('upload__btn');
  uploadBtnSecondEl.addClass('upload__btn');

  $('body, html').addClass('test__page');
  $('body').append(uploadBtnFirstEl)
           .append(uploadBtnSecondEl);

  var myUploaderFirst = imageUploader(uploadBtnFirstEl, {
    fileInputName: 'testfile1',
    url: 'http://localhost:9301/upload',
    uploadDone: function(response) {
      console.log('myUploaderFirst, Upload finished', response);
    },
    uploadError: function(xhr, textStatus, err) {
      console.log('myUploaderFirst, Error', xhr, textStatus, err);
    }
  });

  var myUploaderSecond = imageUploader(uploadBtnSecondEl, {
    fileInputName: 'testfile2',
    url: 'http://localhost:9301/upload',
    imageSrc: '/img/test-image.jpg',
    uploadDone: function(imageDataURI, response) {
      console.log('myUploaderSecond, Upload finished', imageDataURI, response);

      var uploadedImage = document.createElement('img');
      uploadedImage.src = imageDataURI;
      document.body.appendChild(uploadedImage);
    },
    uploadError: function(xhr, textStatus, err) {
      console.log('myUploaderSecond, Error', xhr, textStatus, err);
    }
  });
});
