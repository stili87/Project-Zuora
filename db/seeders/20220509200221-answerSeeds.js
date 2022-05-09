'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     */
   await queryInterface.bulkInsert('Answers', [{
    userId : 1,
    questionId : 1,
    streetCred : '10,000 hours of this game',
    content: "the sword is right around the corner.",
    createdAt: new Date(),
    updatedAt: new Date(),
},
{
    userId : 2,
    questionId : 2,
    streetCred : 'Eat sleep and dream video games',
    content: "To get the heart piece have to jump off the cliff.",
    createdAt: new Date(),
    updatedAt: new Date(),
},
{
    userId : 3,
    questionId : 3,
    streetCred : 'Have never played any games',
    content: "I dont know, just try harder.",
    createdAt: new Date(),
    updatedAt: new Date(),
},
{
    userId : 4,
    questionId : 4,
    streetCred : 'Once saw a video game through a store window',
    content: "See the thing you have to do is stop playing video games, it is bad for you.",
    createdAt: new Date(),
    updatedAt: new Date(),
}], {});
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     */
    await queryInterface.bulkDelete('Answers', null, {});
  }
};
