'use strict';
const passwordHash = require('password-hash')

/** @type {import('sequelize-cli').Migration} */

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('users', [
      {
        nama: 'Admin Kantin',
        email: 'admin@kantinqu.com',
        password: passwordHash.generate('admin123'),
        role: 'admin',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        nama: 'Kasir1',
        email: 'kasir@kantinqu.com',
        password: passwordHash.generate('kasir123'),
        role: 'kasir',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};
