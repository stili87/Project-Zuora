'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     */
    await queryInterface.bulkInsert('Questions', [{
      title: "Where do I get the hover boots?",
      content: "I just finished the Water Temple. I have been bouncing around the map trying to find out where to get the hover boots. I think the only place I haven't been yet is the Spirit Temple. Is it safe to assume that's where I'll find them?",
      tagId: 1,
      userId: 1,
      media: "https://static.wikia.nocookie.net/zelda_gamepedia_en/images/7/7e/OoT3D_Hover_Boots_Render.png/revision/latest/scale-to-width-down/320?cb=20171119231202",
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      title: "Who is Link's father?",
      content: "We know Link isn't actually from the forest. Just a vagrant stealing someone's house, no clue how he even pays for it with such a small wallet and no weapons. I have a weird conspiracy theory that Link is actually the son of Dampe. What do you guys think?",
      tagId: 2,
      userId: 2,
      media: "https://www.zeldadungeon.net/wp-content/uploads/2019/01/DD-Links-Mother.jpg",
      createdAt: new Date(),
      updatedAt: new Date()
    },
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
    }], {});
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     */
    await queryInterface.bulkDelete('Questions', null, {});
  }
};
