require('dotenv').config()

var mongoose = require('mongoose')
, Schema = mongoose.Schema
, ObjectId = Schema.ObjectId;

var crypto = require('crypto');
var jwt = require('jsonwebtoken');

var Schema = mongoose.Schema

var userSchema = new Schema({
    email: {
        type: String,
        unique: true,
        required: true
    },
    role: {
        type: [String],
        required: true
    },
    hash: String,
    salt: String,
    recoveryToken: String,
    tokens: [String]
}, { timestamps: true })

userSchema.methods.setPassword = function(password){
    // Create the salt
    this.salt = crypto.randomBytes(16).toString('hex');
    // Calculate hash
    this.hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64, 'sha512').toString('hex');
};

userSchema.methods.validPassword = function(password) {
    // Calculate the hash
    var hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64, 'sha512').toString('hex');
    // Compare to calculated hash with stored hash
    return this.hash === hash;
  };
  
userSchema.methods.setRecoveryToken = function(){
    // Create a random token
    this.recoveryToken = crypto.randomBytes(16).toString('hex');
    // Set expiration date
    var today = new Date();
    var numberOfDaysToAdd = 2;
    today.setDate(today.getDate() + numberOfDaysToAdd);
    this.tokenExpirationDate = Date.now();
  
    return this.recoveryToken;
};
  
userSchema.methods.generateJwt = function() {
    var expiry = new Date();
    expiry.setDate(expiry.getDate() + 720);
  
    return jwt.sign({
      _id: this._id,
      email: this.email,
      role: this.role,
      exp: parseInt(expiry.getTime() / 1000),
    }, process.env.APP_SECRET);
};

exports.User = mongoose.model("User", userSchema);