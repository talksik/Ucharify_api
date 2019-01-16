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
			const grants_full_info = grants.map(grant => {
				const causes = grant.getCauses({ raw: true }).then(causes => causes),
					regions = grant.getRegions({ raw: true }).then(regions => regions),
					organizations = grant
						.getOrganizations({ raw: true })
						.then(organizations => organizations);
				return { grant, causes, regions, organizations };
			});

			res.status(200).json({
				grants: grants_full_info,
				number_grants: grants_full_info.length
			});
		})
		.catch(error => next(error));
};
