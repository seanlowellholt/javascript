var express = require('express');
var app = express();
var fs = require('fs');
var router = express.Router();
var multer = require('multer')
//var bodyParser = require('body-parser');
var path = require('path');

app.use(router);


var storage = multer.diskStorage({
  destination: function(req, res, callback) {
    callback(null, 'uploads/')
  },

  filename: function(req, file, callback) {
    //console.log(req.file)
    callback(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
  }
});



app.post('/uploads', function(req, res) {
    var upload = multer({
      storage : storage
    }).single('image')
		upload(req, res, function(err) {
      console.log(req.file);
      res.redirect('/')
    })

	});
//});


module.exports = app;
