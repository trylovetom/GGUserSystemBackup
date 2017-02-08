module.exports = function(app) {
	app.get('/', function(req, res, next) {
		res.render('home');
	});
	app.use('/signup', require('./signup'));
	app.use('/login', require('./login'));
	app.use('/logout', require('./logout'));
	app.use(function(req, res) {
		if (!res.headersSent) {
			res.render('404');
		}
	});
};