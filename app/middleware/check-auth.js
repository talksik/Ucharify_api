const jwt = require('jsonwebtoken'),
	errorMaker = require('../helpers/error.maker');

module.exports = role => (req, res, next) => {
	try {
		const token = req.headers.authorization.split(' ')[1];
		const decoded = jwt.verify(token, process.env.JWT_KEY);

		// user info till end of request
		req.user = decoded; 

		// verify role of the call
		if (role != req.user.role) {
			throw new Error();
		}

		next();
	} catch (error) {
		error.message = 'Check Auth Error';
		error.status = 403;
		return next(error);
	}
};
