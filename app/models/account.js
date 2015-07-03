var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    passportLocalMongoose = require('passport-local-mongoose');

var Account = new Schema({
    username: { type: String , unique : true, required: true},
  	role:{type : String}
});

Account.plugin(passportLocalMongoose);

module.exports = mongoose.model('Account', Account);
