module.exports = (sequelize, DataTypes) => {
	const Donor = sequelize.define('donors', {
		id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true
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
			allowNull: false
		},
		password: {
			type: DataTypes.STRING,
			allowNull: false
		},
		age: DataTypes.INTEGER,
		phone: DataTypes.BIGINT,
		address: DataTypes.STRING,
		city: DataTypes.STRING,
		state: DataTypes.STRING,
		country: DataTypes.STRING
	});
	return Donor;
};
