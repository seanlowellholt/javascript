var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

var funct = require('./account')

// passport.use('local-signin', new LocalStrategy({
//   usernameField: 'username',
//   passwordField: 'password',
//   passReqToCallback: true},
//   function(req, username, password, done) {
//     funct.localAuth(username, password)
//       .then(function(err, user) {
//         if(err)
//           return done(err)
//         if(!user)
//           return done(null, false, req.flash('loginMessage', 'No such user'));
//         if(!user.validPassword(password));
//           return done(null, false, req.flash('loginMessage', 'Wrond Password'));
//         if(user) {
//           console.log("LOGGED IN AS: " + user.username );
//           req.session.success = 'You are successfully logged in ' + user.username + '!';
//           return done(null, user);
//         }

//         if(user.password !== password) {
//           req.session.failure = "Please retry your password" + user.username + '!';
//           return done(null, user)
//         }
//       })
//       .fail(function(err) {
//         console.log(err.body);
//       })
//   }
// ));

passport.use('local-signin', new LocalStrategy(
  {passReqToCallback : true}, //allows us to pass back the request to the callback
  function(req, username, password, done) {
    funct.localAuth(username, password)
    .then(function (user) {
      if (user) {
        console.log("LOGGED IN AS: " + user.username);
        req.session.success = 'You are successfully logged in ' + user.username + '!';
        done(null, user);
      }
      if (!user) {
        console.log("COULD NOT LOG IN");
        req.session.error = 'Could not log user in. Please try again.'; //inform user could not log them in
        done(null, user);
      }
    })
    .fail(function (err){
      console.log(err.body);
    });
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


module.exports = passport;