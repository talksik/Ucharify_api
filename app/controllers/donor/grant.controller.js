const db = require('../../config/db.config.js'),
	errorMaker = require('../../helpers/error.maker');

const stripe = require('./stripe.controller');

const { Grant, Cause, Region, Organization, sequelize } = db;

// Create a grant for certain donor
exports.create = (req, res, next) => {
	const donor_id = req.user.id;
	const { name, monthly, causes, regions, organizations } = req.body;

	var total_amount = organizations.map((org) => org.amount).reduce((partial_sum, a) => partial_sum + a);
	var total_amount = total_amount * 100;

	return sequelize
		.transaction(function(t) {
			return Grant.create(
				{
					donor_id,
					name,
					amount: total_amount,
					monthly,
					num_causes: causes.length,
					num_regions: regions.length
				},
				{
					transaction: t
				}
			).then(grant => {
				return Promise.all([
					grant.addCauses(causes, { transaction: t }),
					grant.addRegions(regions, { transaction: t }),
					organizations.map(org => {
						grant.addOrganization(org.id, {
							through: { amount: org.amount },
							transaction: t
						});
					})
				]).then(result => grant);
			});
		})
		.then(function(grants) {
			// transaction committed
			stripe.grantCharge({grant: grants.dataValues, total_amount}, req, res);
			return null;
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
	const { grant_id } = req.body;
	const user = req.user;

	Grant.destroy({ where: { id: grant_id, donor_id: user.id } })
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
