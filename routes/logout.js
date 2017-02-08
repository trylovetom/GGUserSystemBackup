var express = require('express');
var router = express.Router();

var checkLogIn = require('../middlewares/check').checkLogIn;

// Get /logout: Log Out
router.get('/', checkLogIn, function(req, res, next) {
	req.session.user = null;
	req.flash('success', 'success');
	res.redirect('/');
});

module.exports = router;