var passport = require('passport');
var Account = require('../models/account');
exports.register = function(req, res){
	Account.register(new Account({ username : req.body.username, role : "admin"}),
      req.body.password, function(err, account) {
        if (err) {
            console.log(err);
            return res.render('register', { account : account });
        }

        passport.authenticate('local')(req, res, function () {
          res.redirect('/');
        });
    });
}