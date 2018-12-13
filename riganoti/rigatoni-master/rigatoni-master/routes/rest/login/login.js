//
var redis = require("../../redis/redis_processing");
var cookie_name = 'login_cookie';
exports.login = function(req, res){
	//req.session.idKey = req.body.id;
	//req.session.pwKey = req.body.password;
	//console.log('login req.session: ', req.session);

	redis.set(function(err, result){
		if (err)	res.status(500).json({"err": err});
		else
		{
			res.cookie(cookie_name, result.key);
			res.status(200).json({"result": result});
		}
	}, req.body.id);
}
exports.logout = function(req, res){
	//console.log('logout req.session: ', req.session);
	//req.session.destroy();
	//console.log('logout req.session.destroy: ', req.session);
	
	redis.set(function(err, result){
		if (err)	res.status(500).json({"err": err});
		else
		{
			res.clearCookie(cookie_name);
			res.status(200).json({"result": result});
		}		

	}, req.cookies[cookie_name]);
}
