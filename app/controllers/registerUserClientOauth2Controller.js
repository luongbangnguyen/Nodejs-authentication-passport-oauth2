var clientOauthController = require('../controllers/clientOauthController');
var userOauthController = require('../controllers/userOauthController');
var common = require('../common/authenticationCommon');
var async = require('async');
var controller = {};
controller.getUserAndClientOauth = function(req, res){
	common.redirectAuthenticated(req,res);
	var data = {};
	if(req.query.error && req.query.error == 1){
		data.err = true;
	}else{
		data.err = null;
	}
	res.render('createUserClientOauth2',data);
}

controller.postUserAndClientOauth = function(req, res){
	common.redirectAuthenticated(req,res);
	createUserAndClient(req, res, function(err,result){
		if(err){
			return res.redirect('/register-user-client-oauth2?error=1');
		}
		res.redirect('/');
	});
}

function createUserAndClient(req, res, callback){
	var username = req.body.username;
	var password = req.body.password;
	var firstname = req.body.firstname;
	var lastname = req.body.lastname;
	var email = req.body.email;

	var clientId = req.body.clientId;
	var clientSecret = req.body.clientSecret;

	var response = {};
	response.data = {};

	async.parallel([
		function(next){
			userOauthController.createUser(username, password, 
				firstname, lastname, email,function(err, result){
					if(err){
						response.err = err;
					}else{
						response.data.user = result;
					}
					next();
				});
		},
		function(next){
			clientOauthController.createClient(clientId, clientSecret, 
				function(err, result){
					if(err){
						response.err = err;
					}else{
						response.data.client = result;	
					}
					next();
				});
		}
	],function(){
		if(response.err){
			return callback(response.err);
		}
		callback(null,response.data);
	});
}
module.exports = controller;