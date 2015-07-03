var clientController = require('../controllers/clientOauthController.js');
module.exports = function(app){
	app.post('/clients',clientController.postClient);
}
