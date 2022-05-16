'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Tags', [{
      name: 'Legend of Zelda',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      name: 'Metal Gear Solid',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      name: 'Mario',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      name: 'Tetris',
      createdAt: new Date(),
      updatedAt: new Date()
    }], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Tags', null, {});
  }
};
