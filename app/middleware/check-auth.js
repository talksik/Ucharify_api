const jwt = require('jsonwebtoken'),
	errorMaker = require('../helpers/error.maker');

module.exports = role => (req, res, next) => {
	try {
		const token = req.headers.authorization.split(' ')[1];
		const decoded = jwt.verify(token, process.env.JWT_KEY);
		req.user = decoded; //for use till end of request

		if (role != req.user.role) {
			throw new Error();
		}

		next();
	} catch (error) {
		error.message = 'Check Auth Error';
		error.status = 401;
		return next(error);
	}
};
