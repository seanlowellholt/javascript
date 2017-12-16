var db = require('../db');
var bcrypt = require('bcryptjs'),
  Q = require('q');

exports.localReg = function(username, password) {
  var deferred = Q.defer();


  var collection = db.get().collection('localusers')
  
  //var user = ObjectID(username);
  collection.findOne({'username': username})
    .then(function(result) {
      if(null != result) {
        console.log('USERNAME ALREADY EXIST:', result.username);
        deferred.resolve(false);
      } else {
        var hash = bcrypt.hashSync(password, 8);
        var user = {
          "username": username,
          "password": hash
        }
        console.log("CREATING USER:", username)

        collection.insert(user)
          .then(function() {
            //db.close();
            deferred.resolve(user);
          })
        }
      
    })
    return deferred.promise;
  }

exports.localAuth = function(username, password) {
  var deferred = Q.defer();

  var collection = db.get().collection('localusers')
  console.log(collection)
  collection.findOne({'username' : username})
  .then(function (result) {
    if (null == result) {
      console.log("USERNAME NOT FOUND:", username);

      deferred.resolve(false);
    }
    else {
      var hash = result.password;

      console.log("FOUND USER: " + result.username);

      if (bcrypt.compareSync(password, hash)) {
        deferred.resolve(result);
      } else {
        console.log("AUTHENTICATION FAILED");
        deferred.resolve(false);
      }
    }

    
  });


 return deferred.promise;
}

