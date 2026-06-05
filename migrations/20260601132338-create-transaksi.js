"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("transaksi", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      total_harga: { 
        type: Sequelize.INTEGER 
      },
      uang_bayar: { 
        type: Sequelize.INTEGER 
      },
      kembalian: { 
        type: Sequelize.INTEGER 
      },
      id_users: { 
        type: Sequelize.INTEGER 
      },
      createdAt: { 
        allowNull: false, 
        type: Sequelize.DATE 
      },
      updatedAt: { 
        allowNull: false, 
        type: Sequelize.DATE 
      },
    });

    await queryInterface.addConstraint("transaksi", {
      fields: ["id_users"],
      type: "foreign key",
      name: "fk_transaksi_id_users",
      references: { table: "users", field: "id" },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("transaksi");
  },
};
