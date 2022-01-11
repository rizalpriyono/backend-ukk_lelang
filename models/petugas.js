"use strict"
const { Model } = require("sequelize")
module.exports = (sequelize, DataTypes) => {
    class petugas extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {

        }
    }
    petugas.init({
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        nama: DataTypes.STRING,
        username: DataTypes.STRING,
        password: DataTypes.STRING,
        level: DataTypes.ENUM("admin", "petugas"),
    }, {
        sequelize,
        modelName: "petugas",
        tableName: "petugas",
    })
    return petugas
}