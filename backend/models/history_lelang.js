"use strict"
const { Model } = require("sequelize")
module.exports = (sequelize, DataTypes) => {
    class history_lelang extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            this.belongsTo(models.lelang, {
                foreignKey: "id",
                as: "lelang",
            })
            this.belongsTo(models.masyarakat, {
                foreignKey: "id",
                as: "masyarakat",
            })
        }
    }
    history_lelang.init({
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        idLelang: DataTypes.INTEGER,
        idMasyarakat: DataTypes.INTEGER,
        penawaranHarga: DataTypes.INTEGER,
    }, {
        sequelize,
        modelName: "history_lelang",
        tableName: "history_lelang",
    })
    return history_lelang
}