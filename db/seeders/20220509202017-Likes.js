'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     */
      await queryInterface.bulkInsert('Likes', [
        {
          questionId: '1',
          userId: '1',
          answerId: '1',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          questionId: '2',
          userId: '2',
          answerId: '2',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          questionId: '3',
          userId: '3',
          answerId: '3',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          questionId: '4',
          userId: '4',
          answerId: '4',
          createdAt: new Date(),
          updatedAt: new Date()
        },
      ], {});
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     */
    await queryInterface.bulkDelete('Likes', null, {});
  }
};


//     npx sequelize seed:generate --name Questions
//     npx sequelize seed:generate --name Likes
