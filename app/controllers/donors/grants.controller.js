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

// Find grants with cause and region and charity details by donor_id
exports.findByDonorId = (req, res, next) => {
	Grants.findAll({
		where: {
			donor_id: req.params.donor_id
		}
	}).then(grants => {
		Promise.all(
			grants.map(grant => {
				const causes = grant.getCauses({ raw: true }).then(causes => causes),
					regions = grant.getRegions({ raw: true }).then(regions => regions),
					organizations = grant
						.getOrganizations({ raw: true })
						.then(organizations => organizations);
				return Promise.all([causes, regions, organizations]).then(data => {
					return {
						grant,
						causes: data[0],
						regions: data[1],
						organizations: data[2]
					};
				});
			})
		)
			.then(list_grants => {
				res.status(200).json({
					grants: list_grants,
					number_grants: list_grants.length
				});
			})
			.catch(error => next(error));
	});
};
