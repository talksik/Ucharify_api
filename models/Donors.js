module.exports = (sequelize, DataTypes) => {
    const Donors = sequelize.define('donors', {
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

    Donors.associate = (models) => {
        Donors.hasMany(models.campaigns);
    };

    return Donors;
}