const db = require('../../config/db.config.js'),
	errorMaker = require('../../helpers/error.maker');

const { Grant, Cause, Region, Organization } = db;

// Create a grant for certain donor
exports.create = (req, res, next) => {
	const donor_id = req.params.donor_id;
	const { name, amount, monthly, causes, regions, organizations } = req.body;

	Grant.create({
		donor_id,
		name,
		amount,
		monthly,
		num_causes: causes.length,
		num_regions: regions.length
	})
		.then(grant => {
			return Promise.all([
				grant.addCauses(causes),
				grant.addRegions(regions),
				grant.addOrganizations(organizations)
			]).then(result => result);
		})
		.then(result => {
			res.status(201).json({
				result,
				message: 'Grant Created'
			});
		})
		.catch(error => next(error));
};

// Find grants with causes, regions, and organizations by donor_id
exports.findByDonorId = (req, res, next) => {
	Grant.findAll({
		where: {
			donor_id: req.params.donor_id
		},
		include: [Cause, Region, Organization]
	})
		.then(grants => {
			res.status(200).json({
				grants,
				number_items: grants.length
			});
		})
		.catch(error => next(error));
};

exports.delete = (req, res, next) => {
	const grant_id = req.params.grant_id;

	Grant.destroy({ where: { id: grant_id } })
		.then(result => {
			var message = 'Already Deleted';
			if (result) {
				message = 'Grant Deleted';
			}
			res.status(201).json({
				result,
				message
			});
		})
		.catch(error => next(error));
};
