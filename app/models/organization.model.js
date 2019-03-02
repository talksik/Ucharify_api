module.exports = (sequelize, DataTypes) => {
	const Organization = sequelize.define('organizations', {
		id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true
		},
		name: { type: DataTypes.STRING, allowNull: false },
		email: {
			type: DataTypes.STRING,
			validate: {
				isEmail: true
			},
			allowNull: false
		},
		phone: {
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
		country: {
			type: DataTypes.STRING,
			allowNull: false
		},
		zip: {
			type: DataTypes.STRING,
			allowNull: false
		},
		password: {
			type: DataTypes.STRING,
			allowNull: false
		},
		verified: {
			type: DataTypes.BOOLEAN,
			allowNull: false,
			defaultValue: false
		},
		short_description: DataTypes.STRING,
		primary_cause: { type: DataTypes.STRING, allowNull: false },
		primary_region: { type: DataTypes.STRING, allowNull: false },
		rating: { type: DataTypes.INTEGER, defaultValue: 0, allowNull: false },
		ein: {
			type: DataTypes.STRING,
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
