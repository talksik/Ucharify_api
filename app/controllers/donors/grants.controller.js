const db = require('../../config/db.config.js'),
	errorMaker = require('../../helpers/error.maker');

const { Grants, Causes, Regions, Organizations } = db;

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
		donor_id,
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
				grants_causes_rows,
				grants_regions_rows,
				grants_organizations_rows
			])
				.then(results => {
					Causes.bulkCreate(results[0], { raw: true }).then(causes => {
						grant.addCauses(causes);
						// console.log(causes);
					});
					console.log(results[1]);
					Regions.bulkCreate(results[1], { raw: true }).then(regions => {
						grant.addCauses(regions);
						// console.log(regions);
					});
					Organizations.bulkCreate(results[2], { raw: true }).then(
						organizations => {
							grant.addCauses(organizations);
							// console.log(organizations);
						}
					);
				})
				.catch(error => next(error));
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
				const causes = grant.getCauses().then(causes => causes),
					regions = grant.getRegions().then(regions => regions),
					organizations = grant
						.getOrganizations()
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
