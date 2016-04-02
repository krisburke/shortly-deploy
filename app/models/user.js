var db = require('../config');
var bcrypt = require('bcrypt-nodejs');
var Promise = require('bluebird');
var mongoose = require('mongoose');

var userSchema = mongoose.Schema({
  username: {
    type: String,
    required: true,
    index: {
      unique: true
    }
  }, 
  password: {
    type: String,
    required: true
  }
});

User.comparePassword = function (candidatePassword, savedPassword, callback) {
    bcrypt.compare(candidatePassword, savedPassword, function (err, isMatch) {
      if (err) {
        return callback(err);
      }
      callback(null, isMatch);
    });
  };

userSchema.pre('save', function (next) {
    var cipher = Promise.promisify(bcrypt.hash);
    return cipher(this.password, null, null).bind(this)
      .then(function (hash) {
        this.password = hash;
        next();
      });
});

module.exports = mongoose.model("User", userSchema);
