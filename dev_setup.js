#!/usr/bin/env node
var fs = require('fs');
var PACKAGE_FILE = './package.json';
var package = require(PACKAGE_FILE);

package['browserify-shim'] = {
     jquery: "$",
     remodal: "remodal"
};

package["browser"] = {		
   jquery: "./node_modules/jquery/dist/jquery.js",		
   remodal: "./node_modules/remodal/dist/remodal.js"		
};

var newContent = JSON.stringify(package, null, 4);
fs.writeFile(PACKAGE_FILE, newContent, function(err) {
  if (err) {
    process.exit(1);
  };
});
