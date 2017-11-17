var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var path = require('path');
var fileUpload = require('express-fileupload');
var app = express();
//var upload = multer()

// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({extended: true}))
// app.use(upload.single());

//app.use(multer({dest: "./upload"}))

// var storage = multer.diskStorage({
//   destination: function(req, file, callback) {
//     callback(null, './upload');
//   },
//   filename: function(req, file, callback) {
//     console.log(req.file)
//     callback(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
//
//   }
// });


router.use(bodyParser.urlencoded({extended: true}))
var db = require('./db');

router.post('/find', function(req, res) {
  db.create(req.body, function(err, comment) {
    if(err) return res.status(500).send("Problem adding name");
    res.redirect('/')
  })
  console.log(req.body)
  //res.redirect('/')
})

router.get('/find', function(req, res) {
  db.find({}, function(err, comment) {
    if(err) return res.status(500).send("Problem finding name");
    res.status(200).send(comment)
    console.log(comment);
    res.send(req.body)
  })
});

router.delete('/:id', function(req, res) {
  db.findByIdAndRemove(req.params.id, function(err, comment) {
    if (err) return res.status(500).send("There was a problem deleting the user.");
    res.status(200).send("User was deleted.");
  })
})

// router.post('/', function(req, res) {
//   console.log(req.body);
//   res.send("recieved your request");
// })

// router.post('/', function(req, res) {
//   console.log(req.body);
//   if(!req.file) {
//     console.log(req.body);
//     return res.send({
//       success: false
//     })
//   } else {
//   var upload = multer({
//     storage: storage
//   }).single('userFile');
//   upload(req, res, function(err) {
//     res.end('File is uploaded')
//     console.log(req.file);
//     });
//   }
// })

module.exports = router;
