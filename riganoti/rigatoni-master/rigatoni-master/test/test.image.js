var should = require('should'); 
var assert = require('assert');
var request = require('supertest');

describe('Routing', function() {
  var url = 'http://localhost:3000';
  it('image upload', function(done){
	request(url)
		.post('/upload')
		.field('Content-Type', 'multipart/form-data')
		.attach('file', './public/assets/images/images.png')
		.expect('Content-Type', /json/)
		.expect(200) //Status code
		.end(function(err, res) {
			if (err) {
				throw err;
			}
			done();
		});
  });
});
