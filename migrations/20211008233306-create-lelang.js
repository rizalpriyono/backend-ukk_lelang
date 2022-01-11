"use strict";
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("lelang", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      idBarang: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "barang",
          key: "id",
        },
      },
      tglLelang: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      hargaAkhir: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      idMasyarakat: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: "masyarakat",
          key: "id",
        },
      },
      idPetugas: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "petugas",
          key: "id",
        },
      },
      status: {
        type: Sequelize.ENUM("Dibuka", "Ditutup"),
        defaultValue: "Ditutup",
      },
      endTime: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("lelang");
  },
};
