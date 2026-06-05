"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("products", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      nama: { 
        type: Sequelize.STRING 
      },
      harga: { 
        type: Sequelize.INTEGER 
      },
      stok: { 
        type: Sequelize.INTEGER 
      },
      foto: { 
        type: Sequelize.STRING 
      },
      id_categories: { 
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

    await queryInterface.addConstraint("products", {
      fields: ["id_categories"],
      type: "foreign key",
      name: "fk_products_id_categories",
      references: { table: "categories", field: "id" },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("products");
  },
};
