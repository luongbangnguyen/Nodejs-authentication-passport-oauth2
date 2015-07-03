exports.redirectAuthenticated = function(req, res){
	if(!req.isAuthenticated()){
		return res.redirect('/login');
	}

	if(!req.user.role || req.user.role != 'admin'){
		return res.redirect('/login');
	}
}

exports.jsonAuthenticated = function(req, res){
	if(!req.isAuthenticated()){
		return res.status(401).send("Unauthorized");
	}

	if(!req.user.role || req.user.role != 'admin'){
		return res.status(401).send("Unauthorized");
	}
}