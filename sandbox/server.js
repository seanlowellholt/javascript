var express = require('express');
var app = express();
var path = require('path');
//var mongoose = require('mongoose');
var router = require('./router');
//var multer = require('multer')
var ext = require('./upload');
//var bodyParser = require('body-parser');
//var fileupload = require('express-fileupload');

app.use(ext);
app.use(router);
app.use(express.static('sandbox'));
app.use(express.static('js'));
app.use(express.static('css'));
app.use(express.static('views'));
//app.use(multer);
app.get('/', function(req, res) {
  res.sendFile(__dirname + '/index.html');
});

// app.get('/views', function(req, res) {
//   res.sendFile('/')
// })


app.listen(3001, function(){
  console.log("Success listening on port 3001 ");
});
// VAr server = function() {
//   console.log();
// }
