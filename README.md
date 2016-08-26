# Image uploader
Easy to use and stylish Ajax image uploader

## Dependencies
Main dependency is jQuery

## Usage
Below example shows how the uploader can be used:

### Example 1 (Default behaviour uploads the file to url)
```
var imageUploader = require('the-image-uploader');
var uploadPostActionUrl = '/uploads';

// Note: Specify this if you have the image
var initialImageSrc = 'http://some-image-url';

// Some element which opens the uploader modal
var uploaderLinkEl = $('.js-upload-btn');

var uploader = imageUploader(uploaderLinkEl, {
  fileInputName: 'image',
  uploaderTitle: 'Update Profile Picture',
  url: uploadPostActionUrl,
  imageSrc: initialImageSrc,
  uploadDone: function(imageDataURI, response) {
    // Do something

  },
  uploadError: function(xhr, textStatus, err) {
    //Handle upload error
  }
});
```
### Example 2 (Custom behaviour crop only)
```
var imageUploader = require('the-image-uploader');

// Note: Specify this if you have the image
var imageSrc1 = 'http://some-image-url';
var imageSrc2 = 'http://other-image-url';

// Some element which opens the uploader modal
var uploaderLinkEl = $('.js-upload-btn');

var imageFiles = {};

function onCropFinished(fileName, dataURI, fileBlob) {
  // Do something with the cropped image
  imageFiles[fileName] = {
      name: fileName,
      data: fileBlob
  }
}

function handleSubmit(e) {
  e.preventDefault();
  var data = new FormData();
  var formUploadActionUrl = $(this).attr('action');

  $.each(imageFiles, function(fileName, props) {
    data.append('images', props.fileBlob, props.fileName);
  });

  // Make ajax call
  return $.ajax({
    url: formUploadActionUrl,
    data: data,
    method: 'POST',
    cache: false,
    contentType: false,
    processData: false
  })
  .then(function(response) {
    // Good news
  });
}

var imageCropper1 = imageUploader(uploaderLinkEl, {
  upload: false,
  imageSrc: imageSrc1,
  cropFinished: onCropFinished
});

var imageCropper2 = imageUploader(uploaderLinkEl, {
  upload: false,
  imageSrc: imageSrc2,
  cropFinished: onCropFinished
});

var uploadForm = $('.some-form');
uploadForm.on('submit', handleSubmit);
```
