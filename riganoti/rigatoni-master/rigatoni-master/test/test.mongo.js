var should = require('should'); 
var assert = require('assert');
var request = require('supertest');
var ObjectId = require("mongodb").ObjectID;

var org_id;
var groups_id;
var data = {
	"org": {
                "label":"mocha mongo test org",
                "desc":"mocha mongo test org desc",
                "url":"mocha.mongo.test.org.home.orl"
        },
	"group": {
		"parent_id":'',
                "label":"mocha mongo test org",
                "desc":"mocha mongo test org desc",
		"thumb_img_name":"mocha_mongo_test_thumb_name",
		"thumb_img_path":"mocha/mongo/test/thumb/path",
                "url":"mocha.mongo.test.org.home.orl"
        }

};

describe('Routing', function() {
  var url = 'http://localhost:3000';
  describe('Mongo db', function() {
    it('create org in mongo', function(done){
	var body = data.org;
	request(url)
		.post('/orgs/mongo')
		.send(body)
		.expect('Content-Type', /json/)
		.expect(200) //Status code
		.end(function(err,res) {
			if (err) {
				throw err;
			}
			done();
		});
    });
    it('index org in mongo', function(done){
	request(url)
		.get('/orgs/mongo')
		.send()
		.expect('Content-Type', /json/)
		.expect(200) //Status code
		.end(function(err,res) {
			if (err) {
				throw err;
			}
			org_id = res.body.orgs[res.body.orgs.length-1].id;
			done();
		});
    });
    it('show org in mongo', function(done){
	request(url)
		.get('/orgs/'+org_id+'/mongo')
		.send()
		.expect('Content-Type', /json/)
		.expect(200) //Status code
		.end(function(err,res) {
			if (err) {
				throw err;
			}
			done();
		});
    });
    it('update org in mongo', function(done){
	var body = data.org;
	request(url)
		.put('/orgs/'+org_id+'/mongo')
		.send(body)
		.expect('Content-Type', /json/)
		.expect(200) //Status code
		.end(function(err,res) {
			if (err) {
				throw err;
			}
			done();
		});
    });
    it('create group in mongo', function(done){
	var body = data.group;
	body['org_id'] = org_id;
	request(url)
		.post('/orgs/'+org_id+'/groups/mongo')
		.send(body)
		.expect('Content-Type', /json/)
		.expect(200) //Status code
		.end(function(err,res) {
			if (err) {
				throw err;
			}
			done();
		});
    });
    it('index group in mongo', function(done){
	request(url)
		.get('/orgs/'+org_id+'/groups/mongo')
		.send()
		.expect('Content-Type', /json/)
		.expect(200) //Status code
		.end(function(err,res) {
			if (err) {
				throw err;
			}
			groups_id = res.body.groups[res.body.groups.length-1].id;
			done();
		});
    });
    it('show group in mongo', function(done){
	request(url)
		.get('/orgs/'+org_id+'/groups/'+groups_id+'/mongo')
		.send()
		.expect('Content-Type', /json/)
		.expect(200) //Status code
		.end(function(err,res) {
			if (err) {
				throw err;
			}
			done();
		});
    });
    it('update group in mongo', function(done){
	var body = data.group;
	request(url)
		.put('/orgs/'+org_id+'/groups/'+groups_id+'/mongo')
		.send(body)
		.expect('Content-Type', /json/)
		.expect(200) //Status code
		.end(function(err,res) {
			if (err) {
				throw err;
			}
			done();
		});
    });
    it('org-chart in mongo', function(done){
	request(url)
		.get('/org-chart/'+org_id+'/mongo')
		.send()
		.expect('Content-Type', /json/)
		.expect(200) //Status code
		.end(function(err,res) {
			if (err) {
				throw err;
			}
			done();
		});
    });
    it('status in mongo', function(done){
	request(url)
		.get('/org-chart/'+org_id+'/status/mongo')
		.send()
		.expect('Content-Type', /json/)
		.expect(200) //Status code
		.end(function(err,res) {
			if (err) {
				throw err;
			}
			done();
		});
    });
    it('delete org in mongo', function(done){
	request(url)
		.delete('/orgs/'+org_id+'/mongo')
		.send()
		.expect('Content-Type', /json/)
		.expect(200) //Status code
		.end(function(err,res) {
			if (err) {
				throw err;
			}
			done();
		});
    });
    it('delete group in mongo', function(done){
	request(url)
		.delete('/orgs/'+org_id+'/groups/'+groups_id+'/mongo')
		.send()
		.expect('Content-Type', /json/)
		.expect(200) //Status code
		.end(function(err,res) {
			if (err) {
				throw err;
			}
			done();
		});
    });

  });
});
