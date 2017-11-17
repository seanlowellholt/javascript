var express = require('express');
var router = express.Router();
var db = require('../db');
var multer = require('multer');
var im = require('imagemagick');
var path = require('path');
var fs = require('fs');
var ObjectId = require('mongodb').ObjectId;

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/newuser', function(req, res) {
  res.render('newuser', { title: 'Add New User' })
});

router.post('/adduser', function(req, res) {
  //Get our form values
  var username = req.body.username;
  var useremail = req.body.useremail;
 
  db.create({
    name : username,
    email : useremail
  }, function (err, doc) {
    if (err) {
      res.send("Theres was a problem adding the information to the database ");
    } else {
      res.redirect("userlist");
    }
  });
});

router.post('/save', function(req, res, next) {
  var collection = db.get().collection('images');
  var numId = req.body.id;
  var uId = ObjectId(numId);
  collection.update(
    {'_id': uId},
    {$set: { "description": req.body.value}
    }
  )
})

router.post('/delete', function(req, res) {
  var collection = db.get().collection('images');
  var numId = req.body.id;
  var uId = ObjectId(numId)
  collection.remove({'_id': uId})
  res.send('Deleted')
})

var storage = multer.diskStorage({
  destination: function(req, file, callback) {
    callback(null, './public/uploads');
  },
  filename: function(req, file, callback) {
   
    callback(null, file.originalname);
  }
});

router.get('/uploads', function(req, res) {
  res.render('uploads');
})

// Multer object for uploading images.
var Jimp = require('jimp');
var upload = multer({storage: storage}).single('thumb');

router.post('/images', upload, function(req, res, next) {
  
  that = req.body.msg;
  upload(req, res, function(error) {
    
    var imageName = req.file.originalname;
    var srcfile = './public/uploads/' + imageName;
    var destfile = './public/uploads/thumbs/' + 'small ' + '-' + imageName;
    var readFile = destfile.split("/").pop();

    // Convert uploaded image to thumbnail
    Jimp.read( srcfile, function(err, img) {
      img.scaleToFit(250, Jimp.AUTO, Jimp.RESIZE_BEZIER)
      .write(destfile)
      })
      
      var collection = db.get().collection('images')
        collection.insert({
          imageName: req.file.originalname,
          imageThumb: readFile,
          description: that
        });

        res.json({status: 'success', redirect: '/uploads'})
    });
  });

router.get('/cms', function(req, res, next) {
  var collection = db.get().collection('images')
  collection.find({}).toArray(function(err, docs) {
    res.render('cms', {"cms" : docs});
    });
  });

router.get('/:id', function(req, res, next) {
  var collection = db.get().collection('images');
  var r = req.url;
  var numId = r.split('=').pop()
  var uId = ObjectId(numId);
  var ele = collection.findOne({"_id": uId}, function(err, doc) {
    res.json(doc)
    res.end();
  })
})

module.exports = router;
