'use strict';

const Organization = require('./organization.model'),
	Cause = require('./cause.model'),
	Region = require('./region.model');

module.exports = (sequelize, DataTypes) => {
	const Project = sequelize.define('projects', {
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

		description: DataTypes.STRING,

		cause: {
			type: DataTypes.STRING,
			allowNull: false,
			references: {
				model: Cause(sequelize, DataTypes),
				key: 'name'
			}
		},
		region: {
			type: DataTypes.STRING,
			allowNull: false,
			references: {
				model: Region(sequelize, DataTypes),
				key: 'name'
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
		number_people_impacted: {
			type: DataTypes.STRING,
			defaultValue: 0
		}
	});

	return Project;
};
