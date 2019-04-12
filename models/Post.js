const Organization = require('./Organization');

module.exports = (sequelize, DataTypes) => {
	const Post = sequelize.define('Post', {
		id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true
		},
		text: {
			type: DataTypes.STRING(350),
			allowNull: false
		},
		organization_id: {
			type: DataTypes.UUID,
			allowNull: false,
			references: {
				model: Organization(sequelize, DataTypes),
				key: 'id'
			}
		},
		num_ribbons: {
			type: DataTypes.INTEGER,
			defaultValue: 0
		}
	});
	return Post;
};
