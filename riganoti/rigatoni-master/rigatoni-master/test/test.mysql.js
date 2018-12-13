var should = require('should'); 
var assert = require('assert');
var request = require('supertest');
//var winston = require('winston'); 
var org_id;
var groups_id;
var data = {
	"org": {
                "label":"mocha mysql test org",
                "desc":"mocha mysql test org desc",
                "url":"mocha.mysql.test.org.home.orl"
        },
	"group": {
		"parent_id":'',
                "label":"mocha mysql test org",
                "desc":"mocha mysql test org desc",
		"thumb_img_name":"mocha_mysql_test_thumb_name",
		"thumb_img_path":"mocha/mysql/test/thumb/path",
                "url":"mocha.mysql.test.org.home.orl"
        }

};
describe('Routing', function() {
  var url = 'http://localhost:3000';
  describe('Mysql db', function() {
    it('create org in mysql', function(done){
	var body = data.org;
	request(url)
		.post('/orgs/mysql')
		.send(body)
		.expect('Content-Type', /json/)
		.expect(200) //Status code
		.end(function(err,res) {
			if (err) {
				throw err;
			}
			res.body.result.should.have.property('insertId');
			org_id = res.body.result.insertId;
			done();
		});
    });
    it('index org in mysql', function(done){
	request(url)
		.get('/orgs/mysql')
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
    it('show org in mysql', function(done){
	request(url)
		.get('/orgs/'+org_id+'/mysql')
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
    it('update org in mysql', function(done){
	var body = data.org;
	request(url)
		.put('/orgs/'+org_id+'/mysql')
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
    it('create group in mysql', function(done){
	var body = data.group;
	body['org_id'] = org_id;
	request(url)
		.post('/orgs/'+org_id+'/groups/mysql')
		.send(body)
		.expect('Content-Type', /json/)
		.expect(200) //Status code
		.end(function(err,res) {
			if (err) {
				throw err;
			}
			res.body.result.should.have.property('insertId');
			groups_id = res.body.result.insertId;
			done();
		});
    });
    it('index group in mysql', function(done){
	request(url)
		.get('/orgs/'+org_id+'/groups/mysql')
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
    it('show group in mysql', function(done){
	request(url)
		.get('/orgs/'+org_id+'/groups/'+groups_id+'/mysql')
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
    it('update group in mysql', function(done){
	var body = data.group;
	request(url)
		.put('/orgs/'+org_id+'/groups/'+groups_id+'/mysql')
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
    it('org-chart in mysql', function(done){
	request(url)
		.get('/org-chart/'+org_id+'/mysql')
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
    it('status in mysql', function(done){
	request(url)
		.get('/org-chart/'+org_id+'/status/mysql')
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
    it('delete org in mysql', function(done){
	request(url)
		.delete('/orgs/'+org_id+'/mysql')
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
    it('delete group in mysql', function(done){
	request(url)
		.delete('/orgs/'+org_id+'/groups/'+groups_id+'/mysql')
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
