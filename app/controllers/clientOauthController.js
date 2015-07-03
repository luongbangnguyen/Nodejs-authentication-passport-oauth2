var oauthModels = require('../models/oauth2Models');
exports.postClient = function(req, res){
	var clientId = req.body.clientId;
	var clientSecret = req.body.clientSecret;

	var client = new oauthModels.OAuthClientsModel({
		clientId : clientId,
		clientSecret : clientSecret
	});

	createClient(clientId,clientSecret, function(err,clientCreated){
		if(err){
			return res.status(500).send("Can not create client oauth2");
		}
		res.json(clientCreated);
	})
};
function createClient(clientId, clientSecret, callback){
	var client = new oauthModels.OAuthClientsModel({
		clientId : clientId,
		clientSecret : clientSecret
	});

	client.save(function(err, clientSaved){
		if(err){
			return callback(err);
		}
		callback(null,clientSaved);
	});
}
exports.createClient = createClient;
