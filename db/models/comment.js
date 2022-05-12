'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Comment extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Comment.belongsTo(models.User, {foreignKey: 'userId'})
      Comment.belongsTo(models.Answer, {foreignKey: 'answerId', onDelete: 'CASCADE'})
    }
  }
  Comment.init({
    content: {
      allowNull: false,
      type: DataTypes.STRING(500)
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    answerId: {
      allowNull: false,
      type: DataTypes.INTEGER,
      references: {
        model: 'Answer',
        key: 'id'
      }
    }
  }, {
    sequelize,
    modelName: 'Comment',
  });
  return Comment;
};
