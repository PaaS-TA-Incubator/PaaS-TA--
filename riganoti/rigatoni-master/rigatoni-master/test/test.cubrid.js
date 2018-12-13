var should = require('should'); 
var assert = require('assert');
var request = require('supertest');
//var winston = require('winston'); 
var org_id;
var groups_id;
var data = {
	"org": {
                "label":"mocha cubrid test org",
                "desc":"mocha cubrid test org desc",
                "url":"mocha.cubrid.test.org.home.orl"
        },
	"group": {
		"parent_id":'',
                "label":"mocha cubrid test org",
                "desc":"mocha cubrid test org desc",
		"thumb_img_name":"mocha_cubrid_test_thumb_name",
		"thumb_img_path":"mocha/cubrid/test/thumb/path",
                "url":"mocha.cubrid.test.org.home.orl"
        }

};
describe('Routing', function() {
  var url = 'http://localhost:3000';
  describe('Cubrid db', function() {
    it('create org in cubrid', function(done){
	var body = data.org;
	request(url)
		.post('/orgs/cubrid')
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
    it('index org in cubrid', function(done){
	request(url)
		.get('/orgs/cubrid')
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
    it('show org in cubrid', function(done){
	request(url)
		.get('/orgs/'+org_id+'/cubrid')
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
    it('update org in cubrid', function(done){
	var body = data.org;
	request(url)
		.put('/orgs/'+org_id+'/cubrid')
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
    it('create group in cubrid', function(done){
	var body = data.group;
	body['org_id'] = org_id;
	request(url)
		.post('/orgs/'+org_id+'/groups/cubrid')
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
    it('index group in cubrid', function(done){
	request(url)
		.get('/orgs/'+org_id+'/groups/cubrid')
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
    it('show group in cubrid', function(done){
	request(url)
		.get('/orgs/'+org_id+'/groups/'+groups_id+'/cubrid')
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
    it('update group in cubrid', function(done){
	var body = data.group;
	request(url)
		.put('/orgs/'+org_id+'/groups/'+groups_id+'/cubrid')
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
    it('org-chart in cubrid', function(done){
	request(url)
		.get('/org-chart/'+org_id+'/cubrid')
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
    it('status in cubrid', function(done){
	request(url)
		.get('/org-chart/'+org_id+'/status/cubrid')
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
    it('delete org in cubrid', function(done){
	request(url)
		.delete('/orgs/'+org_id+'/cubrid')
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
    it('delete group in cubrid', function(done){
	request(url)
		.delete('/orgs/'+org_id+'/groups/'+groups_id+'/cubrid')
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
