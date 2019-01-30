const db = require('../../config/db.config.js'),
	errorMaker = require('../../helpers/error.maker');

const { Grant, Cause, Region, Organization, sequelize } = db;

// Create a grant for certain donor
exports.create = (req, res, next) => {
	const donor_id = req.user.id;
	const { name, amount, monthly, causes, regions, organizations } = req.body;

	return sequelize
		.transaction(function(t) {
			return Grant.create(
				{
					donor_id,
					name,
					amount,
					monthly,
					num_causes: causes.length,
					num_regions: regions.length
				},
				{ transaction: t }
			).then(grant => {
				return Promise.all([
					grant.addCauses(causes, { transaction: t }),
					grant.addRegions(regions, { transaction: t }),
					grant.addOrganizations(organizations, { transaction: t })
				]).then(result => grant);
			});
		})
		.then(function(grant) {
			// transaction committed
			res.status(201).json({
				grant,
				message: 'Grant Created'
			});
		})
		.catch(function(error) {
			// transaction rollback
			next(error);
		});
};

// Find grants with causes, regions, and organizations by donor_id
exports.findByDonorId = (req, res, next) => {
	const donor_id = req.user.id;

	Grant.findAll({
		where: {
			donor_id: donor_id
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
