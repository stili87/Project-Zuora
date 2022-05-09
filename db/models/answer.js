'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Answer extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Answer.belongsTo(models.Question, {as: 'question', foreignKey: 'questionId'})
      Answer.belongsTo(models.User, {as: 'user', foreignKey: 'userId'})
      Answer.hasMany(models.Comment, {as: 'comments', foreignKey: 'answerId'})
      Answer.hasMany(models.Like, {as: 'likes', foreignKey: 'answerId'})
    }
  }
  Answer.init({
    questionId: DataTypes.INTEGER,
    userId: DataTypes.INTEGER,
    streetCred: DataTypes.STRING,
    content: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Answer',
  });
  return Answer;
};
