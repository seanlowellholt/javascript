var express = require('express');
var router = express.Router();
var db = require('../db');
var multer = require('multer');
var im = require('imagemagick');
var path = require('path');
var fs = require('fs');
var ObjectId = require('mongodb').ObjectId;
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

var funct = require('../models/account')

passport.use('local-signin', new LocalStrategy({
  usernameField: 'username',
  passwordField: 'password',
  passReqToCallback: true},
  function(req, username, password, done) {
    funct.localAuth(username, password)
      .then(function(user) {
        if(user) {
          console.log("LOGGED IN AS: " + user.username );
          req.session.success = 'You are successfully logged in ' + user.username + '!';
          
          return done(null, user);
        }
      })
      .fail(function(err) {
        console.log(err.body);
      })
  }
));

passport.use('local-signup', new LocalStrategy({
    usernameField: 'username',
    passwordField: 'password',
    passReqToCallback : true}, //allows us to pass back the request to the callback
  function(req, username, password, done) {
    funct.localReg(username, password)
    .then(function (user) {
      if (user) {
        console.log("REGISTERED: " + user.username);
        req.session.success = 'You are successfully registered and logged in ' + user.username + '!';
        done(null, user);
      }
      if (!user) {
        console.log("COULD NOT REGISTER");
        req.session.error = 'That username is already in use, please try a different one.'; //inform user could not log them in
        done(null, user);
      }
    })
    .fail(function (err){
      console.log(err.body);
    });
  }
));
passport.serializeUser(function(user, done) {
  console.log("serializing " + user.username);
  done(null, user);
});

passport.deserializeUser(function(obj, done) {
  console.log("deserialing " + obj);
  done(null, obj);
});


/* GET home page. */
router.get('/', function(req, res, next) {
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
  res.send({result: 'redirect', url: '/cms', user: req.user.username})
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


router.get('/:id', function(req, res, next) {
  var collection = db.get().collection('images');
  console.log(req.params.id)
  var r = req.url;
  var numId = r.split('=').pop()
  var uId = ObjectId(numId);
  var ele = collection.findOne({"_id": uId }, function(err, doc) {
    res.json(doc)
    res.end();
  })
})

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) { return next(); }
  req.session.error = 'Please sign in!';
  res.redirect('/login');
}


module.exports = router;
