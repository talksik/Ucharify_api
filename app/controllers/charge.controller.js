const db = require('../../models'),
	errorMaker = require('../helpers/error.maker');

const { Charge, sequelize } = db;

// Find grants with causes, regions, and organizations by donor_id
exports.getAllChargesbyDonor = async (req, res, next) => {
	const donor_id = req.user.id;

	try {
		const charges = await db.sequelize.query(
			`	
      SELECT 
        g.name,
        g.monthly,
        c.description,
        c.amount,
        c.payment_status,
        c.created_at
        FROM grants as g
        INNER JOIN charges as c on c.grant_id = g.id
				WHERE g.donor_id = :donor_id
				ORDER BY c.created_at DESC;
		`,
			{ type: db.sequelize.QueryTypes.SELECT, replacements: { donor_id } }
		);

		return res.status(200).json({
			charges
		});
	} catch (error) {
		next(error);
	}
};
