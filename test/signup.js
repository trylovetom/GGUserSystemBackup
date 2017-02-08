var path = require('path');
var assert = require('assert');
var request = require('supertest');
var app = require('../main.js');
var User = require('../lib/mongo').User;

var testName1 = 'testName1';
var testName2 = 'TomTom';

describe('signup', function() {
	describe('POST /signup', function() {
		var agent = request.agent(app); // persist cookie when redirect

		beforeEach(function(done) {
			User.create({
					name: testName1,
					password: '123456',
					avatar: '',
					gender: 'male',
					introduction: ''
				})
				.exec()
				.then(function() {
					done();
				})
				.catch(done);
		});

		afterEach(function(done) {
			User.remove({
					name: {
						$in: [testName1, testName2]
					}
				})
				.exec()
				.then(function() {
					done();
				})
				.catch(done);
		});

		it('wrong name', function(done) {
			agent
				.post('/signup')
				.type('form')
				.attach('avatar', path.join(__dirname, 'avatar.jpg'))
				.field({
					name: ''
				})
				.redirects()
				.end(function(err, res) {
					if (err) return done(err);
					assert(res.text.match(/name: 1-10 words/));
					done();
				});
		});

		it('wrong gender', function(done) {
			agent
				.post('/signup')
				.type('form')
				.attach('avatar', path.join(__dirname, 'avatar.jpg'))
				.field({
					name: testName2,
					gender: 'aaaaa',
					introduction: 'noder',
					password: '123456',
					repassword: '123456'
				})
				.redirects()
				.end(function(err, res) {
					if (err) return done(err);
					assert(res.text.match(/gender: male, female, transgender/));
					done();
				});
		});

		it('duplicate name', function(done) {
			agent
				.post('/signup')
				.type('form')
				.attach('avatar', path.join(__dirname, 'avatar.jpg'))
				.field({
					name: testName1,
					gender: 'male',
					introduction: 'noder',
					password: '123456',
					repassword: '123456'
				})
				.redirects()
				.end(function(err, res) {
					if (err) return done(err);
					assert(res.text.match(/duplicate name/));
					done();
				});
		});

		it('success', function(done) {
			agent
				.post('/signup')
				.type('form')
				.attach('avatar', path.join(__dirname, 'avatar.jpg'))
				.field({
					name: testName2,
					gender: 'male',
					introduction: 'noder',
					password: '123456',
					repassword: '123456'
				})
				.redirects()
				.end(function(err, res) {
					if (err) return done(err);
					assert(res.text.match(/success/));
					done();
				});
		});
	})
})