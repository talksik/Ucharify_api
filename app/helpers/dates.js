const toJsDate = date => {
	// Split timestamp into [ Y, M, D, h, m, s ]
	var dateParts = date.split('-');
	var utcDate = new Date(
		dateParts[0],
		dateParts[1] - 1,
		dateParts[2].substr(0, 2)
	);

	var newDate = new Date(
		utcDate.getTime() + utcDate.getTimezoneOffset() * 60 * 1000
	);

	var offset = utcDate.getTimezoneOffset() / 60;
	var hours = utcDate.getHours();

	newDate.setHours(hours - offset);

	return newDate;
};

module.exports = {
	toJsDate
};
