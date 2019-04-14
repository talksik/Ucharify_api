const Organization = require('./Organization'),
	Grant = require('./Grant');

module.exports = (sequelize, DataTypes) => {
	const GrantOrganization = sequelize.define(
		'GrantOrganization',
		{
			id: {
				type: DataTypes.INTEGER,
				primaryKey: true,
				autoIncrement: true
			},
			grant_id: {
				type: DataTypes.INTEGER,
				allowNull: false,
				references: {
					model: Grant(sequelize, DataTypes),
					key: 'id'
				}
			},
			organization_id: {
				type: DataTypes.UUID,
				allowNull: false,
				references: {
					model: Organization(sequelize, DataTypes),
					key: 'id'
				}
			},
			amount: {
				type: DataTypes.INTEGER,
				allowNull: false
			}
		},
		{
			freezeTableName: true,

			// define the table's name
			tableName: 'grants_organizations'
		}
	);
	return GrantOrganization;
};
