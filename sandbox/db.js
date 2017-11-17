// db.js
var mongoose = require('mongoose');

var comment = new mongoose.Schema({
  name: String,
  email: String
});

//mongoose.model('User', comment);
var uri = 'mongodb://seanlholt:rexam12oz@ds141454.mlab.com:41454/seanlholt'
mongoose.connect(uri, {
  useMongoClient: true
});

mongoose.model('User', comment);
module.exports = mongoose.model('User');
