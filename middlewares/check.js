module.exports = {
	checkLogIn: function checkLogIn(req, res, next) {
		if (!req.session.user) {
			req.flash('error', 'Please Log In');
			return res.redirect('/signin');
		}
		next();
	},
	checkNotLogIn: function checkNotLogIn(req, res, next) {
		if (req.session.user) {
			req.flash('error', 'Logged In');
			return res.redirect('back');
		}
		next();
	}
};