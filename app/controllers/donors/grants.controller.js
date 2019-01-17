const db = require('../../config/db.config.js'),
	errorMaker = require('../../helpers/error.maker');

const Grants = db.Grants;

// Create a grant for certain donor
exports.create = (req, res, next) => {
	const donor_id = req.params.donor_id;
	const {
		name,
		amount,
		monthly,
		causes_ids,
		regions_ids,
		organizations_ids
	} = req.body;

	Grants.create({
		name,
		amount,
		monthly,
		num_causes: causes_ids.length,
		num_regions: regions_ids.length
	})
		.then(grant => {
			const grants_causes_rows = causes_ids.map(cause_id => {
				return { cause_id, grant_id: grant.id };
			});
			const grants_regions_rows = regions_ids.map(region_id => {
				return { region_id, grant_id: grant.id };
			});

			const grants_organizations_rows = organizations_ids.map(
				organization_id => {
					return { organization_id, grant_id: grant.id };
				}
			);

			Promise.all([
				grant.addCauses(grants_causes_rows),
				grant.addRegions(grants_regions_rows),
				grant.addOrganizations(grants_organizations_rows)
			]).then(results => {
				res.status(201).json(results);
			});
		})
		.catch(error => next(error));
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
