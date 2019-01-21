const jwt = require('jsonwebtoken'),
	errorMaker = require('../helpers/error.maker');

module.exports = (req, res, next) => {
	try {
		const token = req.headers.authorization.split(' ')[1];
		const decoded = jwt.verify(token, process.env.JWT_KEY);
		req.user_data = decoded; //for use till end of request

		next();
	} catch (error) {
		error.message = 'Check Auth Error';
		error.status = 401;
		return next(error);
	}
};
