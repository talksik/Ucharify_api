const Donor = require('./Donor');

module.exports = (sequelize, DataTypes) => {
	const Grant = sequelize.define('Grant', {
		id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true
		},
		name: {
			type: DataTypes.STRING,
			allowNull: false
		},
		amount: {
			type: DataTypes.INTEGER,
			allowNull: false
		},
		monthly: {
			type: DataTypes.BOOLEAN,
			allowNull: false,
			defaultValue: false
		},
		num_causes: {
			type: DataTypes.INTEGER,
			allowNull: false
		},
		num_regions: {
			type: DataTypes.INTEGER,
			allowNull: false
		},

		donor_id: {
			type: DataTypes.UUID,
			allowNull: false,
			references: {
				model: Donor(sequelize, DataTypes),
				key: 'id'
			}
		}
	});

	Grant.associate = models => {
		Grant.hasMany(models.Charge, { foreignKey: 'grant_id' });
	};

	return Grant;
};
