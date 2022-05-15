'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
   await queryInterface.bulkInsert('Comments', [{
    content: "I've never seen a more false statement in my 23 years of playing this game!",
    userId: '1',
    answerId: '1',
    createdAt: new Date(),
    updatedAt: new Date()
},
{
    content: "Wow, thank you! I would've never found this out on my own. Such a huge help.",
    userId: '2',
    answerId: '2',
    createdAt: new Date(),
    updatedAt: new Date()
},
{
    content: "I am embarrassed to admit how long it took me to beat this game.",
    userId: '3',
    answerId: '3',
    createdAt: new Date(),
    updatedAt: new Date()
},
{
    content: "I couldn't agree more.",
    userId: '4',
    answerId: '4',
    createdAt: new Date(),
    updatedAt: new Date()
}], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Comments', null, {});
  }
};
