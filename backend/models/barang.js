"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class barang extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here

      this.hasMany(models.lelang, {
        foreignKey: "idBarang",
      });
    }
  }
  barang.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      nama: DataTypes.STRING,
      tgl: DataTypes.DATE,
      hargaAwal: DataTypes.INTEGER,
      deskripsi: DataTypes.STRING,
      image: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "barang",
      tableName: "barang",
    }
  );
  return barang;
};
