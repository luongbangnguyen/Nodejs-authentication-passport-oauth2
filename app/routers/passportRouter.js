var passport = require('passport');
var passportController = require('../controllers/passportController');

module.exports = function (app) {

  app.get('/', function (req, res) {
      if(!req.isAuthenticated()){
        return res.redirect('/login');
      }

      if(!req.user.role || req.user.role != 'admin'){
        return res.redirect('/login');
      }
      res.render('index', { user : req.user });
  });

  app.get('/register', function(req, res) {
      res.render('register', { });
  });

  app.post('/register',passportController.register);

  app.get('/login', function(req, res) {
      res.render('login', { user : req.user });
  });

  app.get('/logout', function(req, res) {
      req.logout();
      res.redirect('/');
  });

};
