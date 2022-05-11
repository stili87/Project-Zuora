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
      Answer.belongsTo(models.Question, {foreignKey: 'questionId'})
      Answer.belongsTo(models.User, {foreignKey: 'userId'})
      Answer.hasMany(models.Comment, { foreignKey: 'answerId'})
      Answer.hasMany(models.Like, {foreignKey: 'answerId'})
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
