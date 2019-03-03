module.exports = (sequelize, DataTypes) => {
	const OrgBank = sequelize.define('org_bank', {
		id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true
    },
    
	});
	return OrgBank;
};
