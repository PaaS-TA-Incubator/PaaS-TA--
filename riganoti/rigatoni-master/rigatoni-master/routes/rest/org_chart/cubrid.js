/**
 * http://usejsdoc.org/
 */

var query = require("../../db/cubrid/query_processing");
var queue = require("../../rabbitMQ/rabbitMQ_processing");

exports.index = function(req, res){
	//res.send({org_id:req.params.org_id});
	query.searchOrg(function(org_err, org_result){
                if( org_err ) res.status(500).json({"error": org_err});
                else if ( typeof org_result === 'undefined' ||  org_result === null || org_result.length ===0 ) {
                        res.status(400).json({"error": "bad requedst"});
                } else {
                        query.searchGroupList(function(group_err, group_result){
                                if( group_err ) res.status(500).json({"error": group_err});
                                else    res.status(200).json({"org": org_result[0] , "groups": group_result});
                        }, req.params);
                }
        }, req.params);
}

exports.status = function(req, res){
        var q_name = req.params.org_id + "_cubrid";
        queue.subscribe(q_name, function(msg){
                if (msg)        res.status(200).json({"status": msg});
                else            res.status(200).json({"status": "NO_CHANGES"});
        });
}
