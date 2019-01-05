module.exports = (sequelize, DataTypes) => {
    const Campaigns = sequelize.define('campaigns', {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
            first_name: DataTypes.STRING,
            middle_name: DataTypes.STRING,
            last_name: DataTypes.STRING,
            email: DataTypes.STRING,
            phone: DataTypes.STRING,
            address: DataTypes.STRING,
            city: DataTypes.STRING,
            state: DataTypes.STRING,
            country: DataTypes.STRING,
        },
        {
        freezeTableName: true,
        }
    );
    return Campaigns;
}