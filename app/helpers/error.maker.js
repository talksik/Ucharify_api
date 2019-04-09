module.exports = (status = 400, message = '') => {
	const error = new Error(message);
	error.status = status;
	return error;
};
