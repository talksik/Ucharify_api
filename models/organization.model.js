const uuidv4 = require('uuid/v4');

module.exports = (sequelize, DataTypes) => {
	const Organization = sequelize.define('organizations', {
		id: {
			type: DataTypes.UUID,
			primaryKey: true,
			defaultValue: uuidv4()
		},
		name: { type: DataTypes.STRING, allowNull: false },
		short_description: { type: DataTypes.STRING, allowNull: false },

		primary_contact_email: {
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

		address: {
			type: DataTypes.STRING,
			allowNull: false
		},
		city: {
			type: DataTypes.STRING,
			allowNull: false
		},
		state: {
			type: DataTypes.STRING(5),
			allowNull: false
		},
		country: {
			type: DataTypes.STRING,
			defaultValue: 'USA',
			allowNull: false
		},
		zip: {
			type: DataTypes.STRING(10),
			allowNull: false
		},

		primary_cause: { type: DataTypes.STRING, allowNull: false },
		primary_region: { type: DataTypes.STRING, allowNull: false },

		total_rating: { type: DataTypes.INTEGER, defaultValue: 0 },

		ein: {
			type: DataTypes.INTEGER,
			allowNull: false
		},
		estimate_assets: {
			type: DataTypes.BIGINT,
			defaultValue: 0
		},
		estimate_year_operating_cost: {
			type: DataTypes.INTEGER,
			defaultValue: 0
		},

		isNonprofit: {
			type: DataTypes.BOOLEAN,
			allowNull: false,
			defaultValue: false
		},
		isVerified: {
			type: DataTypes.BOOLEAN,
			allowNull: false,
			defaultValue: false
		},

		primary_contact_phone: {
			type: DataTypes.STRING(20),
			allowNull: false
		},
		primary_contact_first_name: {
			type: DataTypes.STRING,
			allowNull: false
		},
		primary_contact_last_name: {
			type: DataTypes.STRING,
			allowNull: false
		}
	});
	return Organization;
};