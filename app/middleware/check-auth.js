const jwt = require('jsonwebtoken'),
	errorMaker = require('../helpers/error.maker');

module.exports = (req, res, next) => {
	try {
		const token = req.headers.authorization.split(' ')[1];
		const decoded = jwt.verify(token, process.env.JWT_KEY);
		req.userData = decoded; //for use till end of request

		next();
	} catch (error) {
		return next(error);
	}
};
