var express = require('express');
var app = express();
var fs = require('fs');
var router = express.Router();
var multer = require('multer');
var db = require('./db')
//var bodyParser = require('body-parser');
var path = require('path');
var url = require('url');

app.use(router);


var storage = multer.diskStorage({
  destination: function(req, file, callback) {
    callback(null, __dirname + '/uploads');
  },
  filename: function(req, file, callback) {
    console.log(file.fieldname)
    callback(null, file.originalname)
  }
});

function newEntry(name) {
  var imagePath = "/uploads"

  //var q = url.parse(path).pathname;
  console.log(imagePath);
  //var m = z.split('/').pop(-1)
  //console.log(m)
  db.create({
    imagename: name,
    path: imagePath
  })
}

var Jimp = require('jimp')
var upload = multer({ storage: storage }).single('image');
app.post('/uploads', upload, function(req, res) {

    console.log(req.file);

		upload(req, res, function(err) {
      var atr = req.file.path;
      var atrName = req.file.originalname;
      newEntry(atrName);
      var imageName = req.file.originalname;
      var srcfile = path.join(__dirname + '/uploads/' + imageName);
      var destfile = path.join(__dirname + '/uploads/thumbs/' + 'small ' + '-' + imageName);
      console.log(srcfile)
      Jimp.read( srcfile, function(err, img) {
        img.scaleToFit(250, Jimp.AUTO, Jimp.RESIZE_BEZIER)
        .write(destfile)
      }),
      res.redirect('/')
    })

	});
//});


module.exports = app;
