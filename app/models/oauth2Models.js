var mongoose = require('mongoose'),
  bcrypt = require('bcrypt-nodejs'),
  Schema = mongoose.Schema,
  model = module.exports;

//
// Schemas definitions
//
var OAuthAccessTokensSchema = new Schema({
  accessToken: { type: String },
  clientId: { type: String },
  userId: { type: String },
  expires: { type: Date }
});

var OAuthRefreshTokensSchema = new Schema({
  refreshToken: { type: String },
  clientId: { type: String },
  userId: { type: String },
  expires: { type: Date }
});

var OAuthClientsSchema = new Schema({
  clientId: { type: String, unique : true, require : true},
  clientSecret: { type: String, required : true },
  redirectUri: { type: String }
});

var OAuthUsersSchema = new Schema({
  username: { type: String , unique : true, required: true},
  password: { type: String , required : true},
  firstname: { type: String , required : true},
  lastname: { type: String , required : true},
  email: { type: String,unique : true,required : true}
});

mongoose.model('OAuthAccessTokens', OAuthAccessTokensSchema);
mongoose.model('OAuthRefreshTokens', OAuthRefreshTokensSchema);
mongoose.model('OAuthClients', OAuthClientsSchema);
mongoose.model('OAuthUsers', OAuthUsersSchema);

var OAuthAccessTokensModel = mongoose.model('OAuthAccessTokens'),
  OAuthRefreshTokensModel = mongoose.model('OAuthRefreshTokens'),
  OAuthClientsModel = mongoose.model('OAuthClients'),
  OAuthUsersModel = mongoose.model('OAuthUsers');

model.OAuthClientsModel = OAuthClientsModel;
model.OAuthUsersModel = OAuthUsersModel;

//
// oauth2-server callbacks
//
model.getAccessToken = function (bearerToken, callback) {
  console.log('in getAccessToken (bearerToken: ' + bearerToken + ')');

  OAuthAccessTokensModel.findOne({ accessToken: bearerToken }, callback);
};

model.getClient = function (clientId, clientSecret, callback) {
  console.log('in getClient (clientId: ' + clientId + ', clientSecret: ' + clientSecret + ')');
  if (clientSecret === null) {
    return OAuthClientsModel.findOne({ clientId: clientId }, callback);
  }
  OAuthClientsModel.findOne({ clientId: clientId, clientSecret: clientSecret }, callback);
};

// This will very much depend on your setup, I wouldn't advise doing anything exactly like this but
// it gives an example of how to use the method to resrict certain grant types
var authorizedClientIds = ['admin', 'toto'];
model.grantTypeAllowed = function (clientId, grantType, callback) {
  //console.log('in grantTypeAllowed (clientId: ' + clientId + ', grantType: ' + grantType + ')');

  /*if (grantType === 'password') {
    return callback(false, authorizedClientIds.indexOf(clientId) >= 0);
  }*/

  callback(false, true);
};

model.saveAccessToken = function (token, clientId, expires, userId, callback) {
  console.log('in saveAccessToken (token: ' + token + ', clientId: ' + clientId + ', userId: ' + userId + ', expires: ' + expires + ')');

  var accessToken = new OAuthAccessTokensModel({
    accessToken: token,
    clientId: clientId,
    userId: userId,
    expires: expires
  });

  accessToken.save(callback);
};

/*
 * Required to support password grant type
 */
model.getUser = function (username, password, callback) {
  console.log('in getUser (username: ' + username + ', password: ' + password + ')');

  OAuthUsersModel.findOne({ username: username, password: password }, function(err, user) {
    if(err) return callback(err);
    callback(null, user._id);
  });
};

/*
 * Required to support refreshToken grant type
 */
model.saveRefreshToken = function (token, clientId, expires, userId, callback) {
  console.log('in saveRefreshToken (token: ' + token + ', clientId: ' + clientId +', userId: ' + userId + ', expires: ' + expires + ')');

  var refreshToken = new OAuthRefreshTokensModel({
    refreshToken: token,
    clientId: clientId,
    userId: userId,
    expires: expires
  });

  refreshToken.save(callback);
};

model.getRefreshToken = function (refreshToken, callback) {
  console.log('in getRefreshToken (refreshToken: ' + refreshToken + ')');

  OAuthRefreshTokensModel.findOne({ refreshToken: refreshToken }, callback);
};

