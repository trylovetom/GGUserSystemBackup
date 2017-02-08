var sha1 = require('sha1');
var express = require('express');
var router = express.Router();

var UserModel = require('../models/users');
var checkNotLogIn = require('../middlewares/check').checkNotLogIn;

// Log In Page: `GET /login`
router.get('/', checkNotLogIn, function(req, res, next) {
	res.render('login');
});

// Log In: `POST /login`
router.post('/', checkNotLogIn, function(req, res, next) {
	var name = req.fields.name;
	var password = req.fields.password;

	UserModel.getUserByName(name)
		.then(function(user) {
			if (!user) {
				req.flash('error', 'not exist');
				return res.redirect('back');
			}
			if (sha1(password) !== user.password) {
				req.flash('error', 'password error');
				return res.redirect('back');
			}
			req.flash('success', 'success');
			delete user.password;
			req.session.user = user;
			res.redirect('/');
		})
		.catch(next);
});

module.exports = router;