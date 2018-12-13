/**
 * http://usejsdoc.org/
 */

var query = require("../../db/cubrid/query_processing");
var queue = require("../../rabbitMQ/rabbitMQ_processing");

var db_type = 'cubrid';
var msg = {
        update: 'ORG_UPDATED',
        destroy: 'ORG_DELETED'
};

exports.index = function(req, res){
	query.searchOrgAllList(function(err, result){
		if( err ) res.status(500).json({"error": err});
		else	  res.status(200).json({"orgs": result});
	});	
}
exports.create = function(req, res){
	query.insertOrg(function(err, result){
		if( err ) res.status(500).json({"error": err});
		else	  res.status(200).json({"result": result});
	}, req.body);	
}
exports.show = function(req, res){
	query.searchOrg(function(err, result){
		if( err ) res.status(500).json({"error": err});
		else if (typeof result[0] === 'undefined') 
                          res.status(400).json({"error": "bad request"});
		else	  res.status(200).json({"org": result[0]});
	}, req.params);	
}
exports.update = function(req, res){
	query.updateOrg(function(err, result){
		if( err ) res.status(500).json({"error": err});
		else
		{
			res.status(200).json({"result": result});
			queue.publish(req.params.org_id+'_'+db_type, msg.update);
		}
	}, req);	
}
exports.destroy = function(req, res){
	query.deleteOrg(function(err, result){
		if( err ) res.status(500).json({"error": err});
		else
		{
			res.status(200).json({"result": result});
			queue.publish(req.params.org_id+'_'+db_type, msg.destroy);
		}

	}, req.params);	
}
