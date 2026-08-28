const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Payment = sequelize.define(
  "payment",
  {
     payment_code: {
      type: DataTypes.STRING,
        allowNull: false,
    },
    amount: {
      type: DataTypes.FLOAT,
        allowNull: false,
    },
    payment_date: {
      type: DataTypes.DATE,
        allowNull: false,
    },
    payment_method: {
      type: DataTypes.STRING,
        allowNull: false,
    },
  },
    {
        tableName: "payments",
        timestamps: true,
    }
);

module.exports = Payment;