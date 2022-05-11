'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Question extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Question.belongsTo(models.User, {as: 'user', foreignKey: 'userId'})
      Question.belongsTo(models.Tag, {as: 'tag', foreignKey: 'tagId'})
      Question.hasMany(models.Like, {as: 'likes', foreignKey: 'questionId', onDelete: 'CASCADE', hooks: true})
      Question.hasMany(models.Answer, {as: 'answers', foreignKey: 'questionId'})
    }
  }
  Question.init({
    title: {
      allowNull: false,
      type: DataTypes.STRING(100)
    },
    content: {
      allowNull: false,
      type: DataTypes.STRING(500)
    },
    tagId: {
      allowNull: false,
      type: DataTypes.INTEGER,
    },
    userId: {
      allowNull: false,
      type: DataTypes.INTEGER,
      },
    media: {
      type: DataTypes.STRING
    },
  }, {
    sequelize,
    modelName: 'Question',
  });
  return Question;
};
