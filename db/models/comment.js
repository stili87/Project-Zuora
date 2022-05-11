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
      Comment.belongsTo(models.User, {as: 'user', foreignKey: 'userId'})
      Comment.belongsTo(models.Answer, {as: 'answer', foreignKey: 'answerId', onDelete: 'CASCADE', hooks: true})
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
