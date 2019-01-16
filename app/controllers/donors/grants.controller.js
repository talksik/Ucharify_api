const db = require('../../config/db.config.js'),
	errorMaker = require('../../helpers/error.maker');

const Grants = db.Grants;

// Create a grant for certain donor
exports.create = (req, res, next) => {
	const donor_id = req.params.donor_id;
	const { name, amount, causes, regions, organizations } = req.body;

	Grants.create({
		name,
		amount
	});
};

// Find grants with cause and region and charity details by Id
exports.findByDonorId = (req, res, next) => {
	Grants.findAll({
		where: {
			donor_id: req.params.donor_id
		}
	})
		.then(grants => {
			res.status(200).json({
				grants,
				number_grants: grants.length
			});
		})
		.catch(error => next(error));
};
