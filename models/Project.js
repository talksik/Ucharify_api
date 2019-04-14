'use strict';

const Organization = require('./Organization'),
	Cause = require('./Cause'),
	Region = require('./Region');

module.exports = (sequelize, DataTypes) => {
	const Project = sequelize.define(
		'Project',
		{
			id: {
				type: DataTypes.INTEGER,
				primaryKey: true,
				autoIncrement: true
			},
			total_received: {
				type: DataTypes.INTEGER,
				defaultValue: 0
			},
			total_donors: {
				type: DataTypes.INTEGER,
				defaultValue: 0
			},

			title: {
				type: DataTypes.STRING(1000),
				allowNull: false
			},
			description: DataTypes.STRING,
			isComplete: {
				type: DataTypes.BOOLEAN,
				defaultValue: false
			},

			// cause: {
			// 	type: DataTypes.STRING,
			// 	allowNull: false,
			// 	references: {
			// 		model: Cause(sequelize, DataTypes),
			// 		key: 'name'
			// 	}
			// },
			// region: {
			// 	type: DataTypes.STRING,
			// 	allowNull: false,
			// 	references: {
			// 		model: Region(sequelize, DataTypes),
			// 		key: 'name'
			// 	}
			// },
			organization_id: {
				type: DataTypes.UUID,
				allowNull: false,
				references: {
					model: Organization(sequelize, DataTypes),
					key: 'id'
				}
			},
			number_people_impacted: {
				type: DataTypes.INTEGER,
				defaultValue: 0
			}
		},
		{
			freezeTableName: true,

			// define the table's name
			tableName: 'projects'
		}
	);

	return Project;
};
