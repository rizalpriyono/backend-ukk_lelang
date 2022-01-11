"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class lelang extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.barang, {
        foreignKey: "idBarang",
        as: "barang",
      });
      this.belongsTo(models.masyarakat, {
        foreignKey: "id",
        as: "masyarakat",
      });
      this.belongsTo(models.petugas, {
        foreignKey: "id",
        as: "petugas",
      });
    }
  }
  lelang.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      idBarang: DataTypes.INTEGER,
      tglLelang: DataTypes.DATE,
      hargaAkhir: DataTypes.INTEGER,
      idMasyarakat: DataTypes.INTEGER,
      idPetugas: DataTypes.INTEGER,
      status: DataTypes.ENUM("Dibuka", "Ditutup"),
      endTime: DataTypes.DATE,
    },
    {
      sequelize,
      modelName: "lelang",
      tableName: "lelang",
    }
  );
  return lelang;
};
