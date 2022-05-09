'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      User.hasMany(models.Like, {as: 'likes', foreignKey: 'userId'})
      User.hasMany(models.Answer, {as: 'answers', foreignKey: 'userId'})
      User.hasMany(models.Comment, {as: 'comments', foreignKey: 'userId'})
      User.hasMany(models.Question, {as: 'question', foreignKey: 'userId'})
    }
  }
  User.init({
    email: {
      allowNull: false,
      type: DataTypes.STRING(50)
    },
    hashedPassword: {
      allowNull: false,
      type: DataTypes.STRING.BINARY
    },
    fullName: {
      allowNull: false,
      type: DataTypes.STRING(100)
    },
    bio: {
      type: DataTypes.STRING(300)
    },
    credentials: {
      type: DataTypes.STRING(100)
    },
    picSrc: {
      type: DataTypes.STRING(300)
    },
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};
