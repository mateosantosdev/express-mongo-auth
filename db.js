var mongoose = require('mongoose')
//var User = require('./User')
mongoose.Promise = global.Promise
mongoose.connect(process.env.MONGO_DB, {
    user: process.env.MONGO_ADMIN,
    pass: process.env.MONGO_PASS,
    auth: {
        authdb: process.env.MONGO_AUTH_DB
    },
})

mongoose.set('useFindAndModify', false);

var db = mongoose.connection

db.on('error', function(err){
  console.log('connection error', err)
})

db.once('open', function(){
  console.log('Connection to DB successful')
})

var userSchema = require('./models/User');