module.exports = (sequelize, DataTypes) => {
	const Donors = sequelize.define('donors', {
		id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true
		},
		first_name: {
			type: DataTypes.STRING,
			allowNull: false
		},
		middle_name: DataTypes.STRING,
		last_name: {
			type: DataTypes.STRING,
			allowNull: false
		},
		email: {
			type: DataTypes.STRING,
			isEmail: true,
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
	return Donors;
};
