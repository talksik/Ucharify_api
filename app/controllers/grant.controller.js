const db = require("../../models"),
  errorMaker = require("../helpers/error.maker");

const stripe = require("./stripe.controller");
const sendgrid = require("./sendgrid.controller");

const {
  Grant,
  Cause,
  Region,
  Organization,
  GrantOrganization,
  Project,
  sequelize
} = db;
// Create a grant for certain donor
exports.createGrant = async (req, res, next) => {
  const user = req.user;

  var { name, monthly, organizations, amount, stripeToken } = req.body;

  const causes = organizations.map(org => org.primary_cause);
  const regions = organizations.map(org => org.primary_region);

  actual_total = Math.round(amount * 100) / 100;

  if (!stripeToken) {
    throw errorMaker(400, "No stripe token given");
  }

  let transaction;

  try {
    // get transaction
    transaction = await sequelize.transaction();

    const grant = await Grant.create(
      {
        donor_id: user.id,
        name,
        amount: actual_total,
        monthly,
        num_causes: causes.length,
        num_regions: regions.length
      },
      {
        transaction
      }
    );

    const grantsOrgs = organizations.map(org => {
      return {
        grant_id: grant.id,
        organization_id: org.id,
        amount: org.amount
      };
    });

    // mapping between bundle and orgs
    await GrantOrganization.bulkCreate(grantsOrgs, {
      transaction
    });

    // one time charge
    await stripe.grantCharge({
      grant,
      stripeToken,
      stripeToken,
      organizations,
      monthly,
      amount,
      user
    });

    // send email
    await sendgrid.paymentReceipt({
      organizations,
      total_amount: actual_total,
      receiver: user.email
    });

    // commit
    await transaction.commit();

    return res.status(200).json({
      message: "Successfully charged or subscribed",
      grant
    });
  } catch (error) {
    if (error) await transaction.rollback();
    next(error);
  }
};

// Find grants with causes, regions, and organizations by donor_id
exports.findGrantsByDonorId = async (req, res, next) => {
  const donor_id = req.user.id;

  try {
    const grants = await db.sequelize.query(
      `	
		Select 
			g.id, 
			g.name,
			g.amount,
			g.monthly,
			g.num_causes,
			g.num_regions,
			g.donor_id,
			GROUP_CONCAT(DISTINCT o.id SEPARATOR ',') AS organization_ids,
			GROUP_CONCAT(DISTINCT o.name SEPARATOR ',') AS organization_names
		from grants as g
		inner join GrantOrganizations as go on go.grant_id = g.id
		left join organizations as o on o.id = go.organization_id
		where donor_id = :donor_id
		group by g.id, g.name, g.amount, g.monthly, g.num_causes, g.num_regions, g.donor_id;
		`,
      { type: db.sequelize.QueryTypes.SELECT, replacements: { donor_id } }
    );

    grants.map(grant => {
      grant.organizations = [];

      org_ids = grant.organization_ids.toString().split(",");
      org_names = grant.organization_names.toString().split(",");

      for (var i = 0; i < org_names.length; i++) {
        grant.organizations.push({
          id: org_ids[i],
          name: org_names[i]
        });
      }
    });

    return res.status(200).json({
      grants
    });
  } catch (error) {
    next(error);
  }
};

exports.deleteGrant = (req, res, next) => {
  const { grant_id } = req.body;
  const user = req.user;

  Grant.destroy({ where: { id: grant_id, donor_id: user.id } })
    .then(result => {
      var message = "Already Deleted";
      if (result) {
        message = "Grant Deleted";
      }

      res.status(201).json({
        result,
        message
      });
    })
    .catch(error => next(error));
};
