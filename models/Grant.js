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
		}
	});

	Grant.associate = models => {
		Grant.belongsToMany(models.Organization, {
			through: 'grants_organizations',
			foreignKey: 'grant_id',
			otherKey: 'organization_id'
		});

		Grant.hasMany(models.Charge, { foreignKey: 'grant_id' });
	};

	return Grant;
};
