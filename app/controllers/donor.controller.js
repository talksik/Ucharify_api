const db = require('../../models'),
  bcrypt = require('bcrypt-nodejs'),
  errorMaker = require('../helpers/error.maker'),
  uuidv4 = require('uuid/v4');

const Donor = db.Donor;

// Create/post a Donor
exports.createDonor = (req, res, next) => {
  // see if user already in db
  Donor.findAll({
    where: {
      email: req.body.email
    }
  })
    .then(donors => {
      if (donors.length >= 1) {
        return next(errorMaker(409, `Email Exists: ${req.body.email}`));
      } else {
        // hash and store
        bcrypt.hash(req.body.password, null, null, function(error, hash) {
          // Store hash in your password DB.
          if (error) {
            return next(error);
          } else {
            Donor.create({
              id: uuidv4(),
              first_name: req.body.first_name,
              middle_name: req.body.middle_name,
              last_name: req.body.last_name,
              email: req.body.email,
              password: hash, //hashed password
              age: req.body.age,
              phone: req.body.phone,
              address: req.body.address,
              city: req.body.city,
              state: req.body.state,
              country: req.body.country
            })
              .then(donor => {
                // Send created donor to client
                return res.status(201).json({
                  message: 'Donor created',
                  donor
                });
              })
              .catch(error => next(error));
          }
        });
      }
    })
    .catch(error => next(error));
};

// FETCH all Donor
exports.getAllDonors = (req, res, next) => {
  Donor.findAll().then(donors => {
    // Send all donors to Client
    res.status(200).json({
      donors,
      number_donors: donors.length
    });
  });
};

// Find a Donor by Id
exports.findDonorById = (req, res) => {
  Donor.findById(req.params.donor_id).then(donor => {
    res.send(donor);
  });
};

// Delete a Donor by Id
exports.deleteDonor = (req, res) => {
  const id = req.params.donor_id;
  Donor.destroy({
    where: { id: id }
  }).then(() => {
    res.status(200).send('deleted successfully a donor with id = ' + id);
  });
};

// GET the quick stats for the dashboard
exports.getDashboardData = async (req, res, next) => {
  const donor_id = req.user.id;

  const donors = await db.sequelize.query(
    `
			select d.id,
						d.first_name,
						sum(g.amount) as total_contributions
			from donors as d
			left join grants as g on g.donor_id = d.id
			group by d.id
			order by total_contributions DESC
		`,
    {
      type: db.sequelize.QueryTypes.SELECT
    }
  );

  let number_donors = donors.length;

  donors.map((donor, index) => {
    if (donor.id == donor_id) {
      const donor_contributions = donor.total_contributions;

      let percentile =
        donor_contributions > 0 ? (number_donors - index) / number_donors : 0;
      return res.status(200).json({
        message: 'Successfully got the stats',
        percentile
      });
    }
  });
};

// // Update a Donor
// exports.update = (req, res) => {
// 	const id = req.params.donor_id;
// 	Donor.update( { firstname: req.body.firstname, lastname: req.body.lastname, age: req.body.age },
// 					 { where: {id: req.params.donorId} }
// 				   ).then(() => {
// 					 res.status(200).send("updated successfully a donor with id = " + id);
// 				   });
// };
