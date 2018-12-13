/**
 * http://usejsdoc.org/
 */
var query = require("../../db/cubrid/query_processing");
var queue = require("../../rabbitMQ/rabbitMQ_processing");

var db_type = 'cubrid';
var msg = {
        create: 'GROUP_ADDED',
        update: 'GROUP_UPDATED',
        destroy: 'GROUP_DELETED'
};

exports.index = function(req, res){
//	res.send({method:'get'
//		  , org_id:req.params.org_id});
	query.searchGroupList(function(err, result){
		if( err ) res.status(500).json({"error": err});
		else	  res.status(200).json({"groups": result});
	}, req.params);
}
exports.create = function(req, res){
//	res.send({method:'post'
//		  , org_id:req.params.org_id});
	query.insertGroup(function(err, result){
		if( err ) res.status(500).json({"error": err});
		else
                {
                        res.status(200).json({"result": result});
                        queue.publish(req.params.org_id+'_'+db_type, msg.create);
                }
	}, req.body);
}
exports.show = function(req, res){
//	res.send({method:'get'
//		  , org_id:req.params.org_id
//		  , group_id:req.params.group_id});
//	console.log("show");
	query.searchGroup(function(err, result){
		if( err ) res.status(500).json({"error": err});
		else if (typeof result[0] === 'undefined') 
                          res.status(400).json({"error": "bad request"});
		else	  res.status(200).json({"group": result[0]});
	}, req.params);
}
exports.update = function(req, res){
//	res.send({method:'put'
//		  , org_id:req.params.org_id
//		  , group_id:req.params.group_id});
	query.updateGroup(function(err, result){
		if( err ) res.status(500).json({"error": err});
		else
                {
                        res.status(200).json({"result": result});
                        queue.publish(req.params.org_id+'_'+db_type, msg.update);
                }
	}, req);

}
exports.destroy = function(req, res){
//	res.send({method:'delete'
//		  , org_id:req.params.org_id
//		  , group_id:req.params.group_id});
	query.deleteGroup(function(err, result){
		if( err ) res.status(500).json({"error": err});
		else
                {
                        res.status(200).json({"result": result});
                        queue.publish(req.params.org_id+'_'+db_type, msg.destroy);
                }
	}, req.params);
}
