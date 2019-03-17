const Cause = require('./Cause'),
	Region = require('./Region');

module.exports = (sequelize, DataTypes) => {
	const Organization = sequelize.define('Organization', {
		id: {
			type: DataTypes.UUID,
			allowNull: false,
			primaryKey: true
		},
		name: { type: DataTypes.STRING, allowNull: false },
		short_description: { type: DataTypes.STRING, allowNull: false },
		total_received: {
			type: DataTypes.INTEGER,
			defaultValue: 0
		},
		total_donors: {
			type: DataTypes.INTEGER,
			defaultValue: 0
		},

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

		primary_cause: {
			type: DataTypes.STRING,
			allowNull: false,
			references: {
				model: Cause(sequelize, DataTypes),
				key: 'name'
			}
		},
		primary_region: {
			type: DataTypes.STRING,
			allowNull: false,
			references: {
				model: Region(sequelize, DataTypes),
				key: 'name'
			}
		},

		total_rating: { type: DataTypes.INTEGER, defaultValue: 0 },

		ein: {
			type: DataTypes.STRING(10),
			allowNull: false
		},
		estimate_asset_value: {
			type: DataTypes.BIGINT,
			defaultValue: 0
		},
		estimate_yearly_operating_cost: {
			type: DataTypes.BIGINT,
			defaultValue: 0
		},

		is_nonprofit: {
			type: DataTypes.BOOLEAN,
			allowNull: false,
			defaultValue: false
		},
		is_verified: {
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
