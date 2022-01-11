"use strict"
module.exports = {
    up: async(queryInterface, Sequelize) => {
        await queryInterface.createTable("history_lelang", {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER,
            },
            idLelang: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: "lelang",
                    key: "id",
                },
            },
            idMasyarakat: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: "masyarakat",
                    key: "id",
                },
            },
            
            penawaranHarga: {
                type: Sequelize.INTEGER,
                allowNull: false
            },
            createdAt: {
                allowNull: false,
                type: Sequelize.DATE,
            },
            updatedAt: {
                allowNull: false,
                type: Sequelize.DATE,
            },
        })
    },
    down: async(queryInterface, Sequelize) => {
        await queryInterface.dropTable("history_lelang")
    },
}