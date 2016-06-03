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
  var btnEl;

  function createAnchorTag(text, href) {
    var el = document.createElement('a');
    el.href = href;
    el.textContent = text;

    return el;
  }

  btnEl = $(createAnchorTag('Upload image', '#test-uploader'));
  btnEl.addClass('upload__btn');

  $('body, html').addClass('test__page')
  $('body').append(btnEl);

  var myUploader = imageUploader(btnEl, {
    fileInputName: 'testfile',
    url: 'http://localhost:9301/upload'
  });
});
