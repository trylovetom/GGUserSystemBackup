module.exports = {
	port: 3000,
	session: {
		secret: 'GGUserSystemSecret',
		key: 'GGUserSystemKey',
		maxAge: 2592000000
	},
	mongodb: 'mongodb://localhost:27017/GGUserSystem'
};