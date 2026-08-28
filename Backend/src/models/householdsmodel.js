const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const household = sequelize.define(
    "household",
     {
    householdCode:{
        type:DataTypes.STRING,
        allowNull:false,
    },
    state:{
        type:DataTypes.STRING,
        allowNull: false,
    },
    district:{
        type:DataTypes.STRING,
        allowNull: false,
    },
    allowedpoints:{
        type:DataTypes.STRING,
        allowNull: false,
    },
    maxallowedpoints:{
        type:DataTypes.STRING,
        allowNull: false,
    },
    createdAt:{
        type:DataTypes.DATE,
        allowNull: true,
    },
    updatedAt:{
        type:DataTypes.DATE,
        allowNull: true,
    }
  } ,
  {
    tableName:"household",
    timestamps: true, 
  }

)

module.exports = household;

