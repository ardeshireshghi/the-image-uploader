var multiparty = require('multiparty');
var http       = require('http');
var util       = require('util');
var fs         = require('fs');
var path       = require('path');

var PORT = process.env.PORT || 9301;

function isUploadRequest(req) {
  return ((req.url.indexOf('/upload') === 0) && req.method === 'POST');
}

function getResponseHeaders() {
  return {
    'content-type': 'application/json',
    'allow-access-control-origin': '*'
  };
}

function saveUploadedFile(uploadedFile, callback) {
  var uploadedFile = uploadedFile[0];
  var readStream = fs.createReadStream(uploadedFile.path);
  var writeStream = fs.createWriteStream(path.join(__dirname, '..', 'uploads', uploadedFile.originalFilename));

  writeStream.on('error', callback);
  writeStream.on('finish', function() {
    callback(null, uploadedFile)
  });

  readStream.pipe(writeStream);
}

http.createServer(function(req, res) {

  if (isUploadRequest(req)) {

    // parse a file upload
    var form = new multiparty.Form();

    form.parse(req, function(err, fields, files) {

      if (files.testfile && files.testfile.length) {
        saveUploadedFile(files.testfile, function fileSaved(err, uploadedFile) {
          if (!err) {
            res.writeHead(200, getResponseHeaders());
            res.end(util.inspect({
              success: true,
              status: 200,
              data: {
                uploadPath: 'uploads/'.concat(uploadedFile.originalFilename)
              }
            }));
          } else {
            res.writeHead(500, getResponseHeaders());
            res.end(util.inspect({
              errorCode: 100,
              errorMessage: err.message,
              errorType: err.type,
              status: 500
            }));
          }

        });
      }

    });

    return;
  }

  // show a file upload form
  res.writeHead(200, {'content-type': 'text/html'});
  res.end(
    '<form action="/upload" enctype="multipart/form-data" method="post">'+
    '<input type="text" name="title"><br>'+
    '<input type="file" name="testfile"><br>'+
    '<input type="submit" value="Upload">'+
    '</form>'
  );

}).listen(PORT, '0.0.0.0', function() {
  console.log('Started server on port %s', PORT);
});
