'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
    await queryInterface.bulkInsert('Users', [{
      email: 'jeffreykintner@email.com',
      hashedPassword: '$2a$10$GaFWCwlU3/h5LolgocOTluMJ82V7FKA88Rn8qkUr9KdLgAZGwFNJy',
      fullName: 'Jeffrey Kintner',
      bio: 'A literal person of literal ideas, literally.',
      credentials: 'Floats like a butterfly, stings like a bee.',
      picSrc: 'https://laughingsquid.com/wp-content/uploads/2015/10/il_fullxfull.856548802_lnwy.jpg',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      email: 'stili87@gmail.com',
      hashedPassword: '$2a$10$2BBXMN5Me0sVdxh/vsPu5.i0CFwmi0S0C8XoKW0mt16Igj4vxeBva',
      fullName: 'Andrew Stilinovic',
      bio: 'A guy who is soooo silly.',
      credentials: 'Lawyer, Lover, Husband, Wife, Coder, Father, Live, Laugh, Love.',
      picSrc: 'https://klinelawstl.com/wp-content/uploads/2019/05/Andrew1.jpg',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      email: 'walame1994@gmail.com',
      hashedPassword: '$2a$10$1tdWtQ1NzRISUPINIFkgcO6naiZYx3PIHBUFT9.mDysWiHDxqzVai',
      fullName: 'Waseem Alame',
      bio: 'Do NOT copy my NFT it is mine you cannot steal it.',
      credentials: 'Masters in copy/paste.',
      picSrc: 'https://media.discordapp.net/attachments/961320861493780601/961328875776933919/42.png?width=563&height=563',
      createdAt: new Date(),
      updatedAt: new Date()
    },
  {
      email: 'info@johnallanhinds.com',
      hashedPassword: '$2a$10$EiBM2PnrHF8bbYNCjJvBrud6cNSRrXh5FDNm.h4m.dsyM/CKpy59O',
      fullName: 'John Allan Hinds',
      bio: 'I\'m a guy you want to take a gamble on.',
      credentials: 'School of counting cards.',
      picSrc: 'http://2.bp.blogspot.com/-4T8M9ojyCJ8/UKE0A8W70RI/AAAAAAAABFg/zB3lTk9ZC-g/s1600/John+Allen+Hinds.JPG',
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
    await queryInterface.bulkDelete('Users', null, {});
  }
};
