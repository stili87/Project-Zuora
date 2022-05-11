'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Like extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Like.belongsTo(models.Question, {foreignKey: 'questionId'})
      Like.belongsTo(models.Answer, {foreignKey: 'answerId'})
      Like.belongsTo(models.User, {foreignKey: 'userId'})
    }
  }
  Like.init({
    questionId: DataTypes.INTEGER,
    userId: {type: DataTypes.INTEGER, allowNull: false},
    answerId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Like',
  });
  return Like;
};
