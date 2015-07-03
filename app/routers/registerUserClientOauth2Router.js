var controller = require('../controllers/registerUserClientOauth2Controller');
module.exports = function(app){
	app.get('/register-user-client-oauth2',controller.getUserAndClientOauth);
	app.post('/register-user-client-oauth2',controller.postUserAndClientOauth);
} 