var fs = require('fs');
var path = require('path');
var sha1 = require('sha1');
var express = require('express');
var router = express.Router();

var UserModel = require('../models/users');
var checkNotLogIn = require('../middlewares/check').checkNotLogIn;

// Sign Up Page: `GET /signup`
router.get('/', checkNotLogIn, function(req, res, next) {
	res.render('signup');
});

// Sign Up: `POST /signup`
router.post('/', checkNotLogIn, function(req, res, next) {
	var name = req.fields.name;
	var gender = req.fields.gender;
	var introduction = req.fields.introduction;
	var avatar = req.files.avatar.path.split(path.sep).pop();
	var password = req.fields.password;
	var repassword = req.fields.repassword;

	try {
		if (!(name.length >= 1 && introduction.length <= 10)) {
			throw new Error('name: 1-10 words');
		}
		if (['male', 'female', 'transgender'].indexOf(gender) === -1) {
			console.log('test')
			throw new Error('gender: male, female, transgender');
		}
		if (password.length < 6) {
			throw new Error('password: >= 6');
		}
		if (password !== repassword) {
			throw new Error('password is not same the repassword');
		}
	} catch (e) {
		fs.unlink(req.files.avatar.path);
		req.flash('error', e.message);
		return res.redirect('/signup');
	}

	password = sha1(password);

	var user = {
		name: name,
		password: password,
		gender: gender,
		introduction: introduction,
		avatar: avatar
	};
	UserModel.create(user)
		.then(function(result) {
			user = result.ops[0];
			delete user.password;
			req.session.user = user;
			req.flash('success', 'sign up success');
			res.redirect('/');
		})
		.catch(function(e) {
			fs.unlink(req.files.avatar.path);
			if (e.message.match('E11000 duplicate key')) {
				req.flash('error', 'duplicate name');
				return res.redirect('/signup');
			}
			next(e);
		});
});

module.exports = router;