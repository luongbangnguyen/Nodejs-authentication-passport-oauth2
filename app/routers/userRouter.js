var passport = require('passport');
var userController = require('../controllers/userOauthController');
module.exports = function(app){
	app.post('/user',userController.postUser);
	app.get('/user',userController.getUser);
}