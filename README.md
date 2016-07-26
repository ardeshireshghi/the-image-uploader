# the-image-uploader
Easy to use and stylish Ajax image uploader

## Usage
Below example shows how the uploader can be used:

```
var imageUploader = require('the-image-uploader');
var uploadPostActionUrl = '/uploads';

// Note: Specify this if you have the image
var initialImageSrc = 'http://some-image-url';

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
