'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     */
    await queryInterface.bulkInsert('Questions', [
      {
        title: "Water Temple",
        content: "How do I drain the water from inside the temple",
        tagId: "3",
        userId: "3",
        media: "https://www.giantbomb.com/a/uploads/scale_medium/0/1978/452703-water_temple.jpg",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        title: "Is Link having an affair with Zelda?",
        content: "Isn't Link married to Princess Ruto? Are we not going to talk about this?",
        tagId: "4",
        userId: "4",
        media: "https://i0.wp.com/mynintendonews.com/wp-content/uploads/2014/06/hyrule_warriors_portrait.jpg?fit=1280%2C720&ssl=1",
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
    await queryInterface.bulkDelete('Questions', null, {});
  }
};
