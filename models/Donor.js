module.exports = (sequelize, DataTypes) => {
	const Donor = sequelize.define('Donor', {
		id: {
			type: DataTypes.UUID,
			allowNull: false,
			primaryKey: true
		},
		stripe_id: {
			type: DataTypes.UUID,
			defaultValue: null,
			unique: true
		},
		subscription_id: {
			type: DataTypes.UUID,
			defaultValue: null,
			unique: true
		},
		first_name: {
			type: DataTypes.STRING,
			allowNull: false
		},
		last_name: {
			type: DataTypes.STRING,
			allowNull: false
		},
		email: {
			type: DataTypes.STRING,
			validate: {
				isEmail: true
			},
			allowNull: false,
			unique: true
		},
		password: {
			type: DataTypes.STRING,
			allowNull: false
		},
		age: DataTypes.INTEGER,
		phone: DataTypes.STRING(20),

		address: DataTypes.STRING,
		city: DataTypes.STRING,
		state: DataTypes.STRING,
		zip: DataTypes.STRING(10),
		country: DataTypes.STRING
	});

	Donor.associate = models => {
		Donor.hasMany(models.Grant, {
			foreignKey: 'donor_id'
		});
	};

	return Donor;
};
