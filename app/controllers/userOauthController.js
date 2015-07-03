var oauthModels = require('../models/oauth2Models');
var common = require('../common/authenticationCommon');
exports.postUser = function(req, res){
	common.jsonAuthenticated(req,res);
	var username = req.body.username;
	var password = req.body.password;
	var firstname = req.body.firstname;
	var lastname = req.body.lastname;
	var email = req.body.email;

	createUserOauth2(username, password, firstname, lastname, email,
	 function(err, userCreated){
	 	if(err){
	 		return res.status(500).send("can not create user");
	 	}
	 	res.json(userCreated);
	})
};

function createUserOauth2(username, password, firstname, lastname, email,callback){
	var user = new oauthModels.OAuthUsersModel({
		username : username,
		password : password,
		firstname : firstname,
		lastname : lastname,
		email : email
	});

	user.save(function(err, userSaved){
		if(err){
			return callback(err);
		}
		callback(null,userSaved);
	});
}
exports.createUser = createUserOauth2;

exports.getUser = function(req, res){
	common.jsonAuthenticated(req,res);
	var user = req.user;
	res.json(user);
}
