var express = require('express');
var router = express.Router();
var db = require('../db');
var multer = require('multer');
var im = require('imagemagick');
var path = require('path');
var fs = require('fs');
var ObjectId = require('mongodb').ObjectId;
var passport = require('../models/passports');
var LocalStrategy = require('passport-local').Strategy;
var url = require('url');

/* GET home page. */
router.get('/', ensureAuthenticated, function(req, res, next) {
  console.log("hello " + req.user.username)
  res.render('index', { user: req.user.username});
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

router.post('/login', passport.authenticate('local-signin'), function(req, res) {
  console.log("Username" + req.user.username),
  res.send({
    result: 'redirect',
    url: '/cms', 
    user: req.user.username
    })
  })



 router.get('/register', function(req, res) {
  res.render('register')
})

router.post('/register', passport.authenticate('local-signup'), function (req, res) {
    res.redirect('/login')
  });

router.get('/logout', function(req,res) {
  var name = req.user.username;
  req.logout();
  res.redirect('/login');
  req.session.notice = "You have successfully logged out: " + name;
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

router.get('/uploads', ensureAuthenticated, function(req, res) {
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
    var pathname = url.parse(req.file.originalname).pathname;
    console.log(pathname)
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

router.get('/cms', ensureAuthenticated, function(req, res, next) {
  var collection = db.get().collection('images')
  var users = req.user.username;
  collection.find({}).toArray(function(err, docs) {
    res.render('cms', {
      cms: docs, 
      user: users
      });
    });
  });

router.get('/login', function(req, res) {
  res.render('login')
})

router.get('/controller', ensureAuthenticated, function(req, res) {
  res.render('controller')
})

router.get('/:id', function(req, res, next) {
  var collection = db.get().collection('images');
  //console.log(req.params.id)
  var pathname = url.parse(req.url).query;
  console.log("This is the id path " + pathname)
  var r = req.url;
  console.log("another " + r)
  var numId = r.split('=').pop()
  var uId = ObjectId(numId);
  var ele = collection.findOne({"_id": uId }, function(err, doc) {
    res.json(doc)
    res.end();
  })
})



function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) { return next(); }
  
  res.redirect('/login');
}


module.exports = router;
