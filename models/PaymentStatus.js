"use strict";
module.exports = (sequelize, DataTypes) => {
  const PaymentStatus = sequelize.define("PaymentStatus", {
    name: {
      type: DataTypes.STRING,
      primaryKey: true,
      allowNull: false
    }
  });

  return PaymentStatus;
};
