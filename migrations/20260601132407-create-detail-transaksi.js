"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("detail_transaksi", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      jumlah: { 
        type: Sequelize.INTEGER 
      },
      subtotal: { 
        type: Sequelize.INTEGER 
      },
      id_transaksi: { 
        type: Sequelize.INTEGER 
      },
      id_products: { 
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

    await queryInterface.addConstraint("detail_transaksi", {
      fields: ["id_transaksi"],
      type: "foreign key",
      name: "fk_detail_transaksi_id_transaksi",
      references: { table: "transaksi", field: "id" },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });

    await queryInterface.addConstraint("detail_transaksi", {
      fields: ["id_products"],
      type: "foreign key",
      name: "fk_detail_transaksi_id_products",
      references: { table: "products", field: "id" },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("detail_transaksi");
  },
};
