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
      User.hasMany(models.Like, {  foreignKey: 'userId' })
      User.hasMany(models.Answer, {  foreignKey: 'userId' })
      User.hasMany(models.Comment, {  foreignKey: 'userId' })
      User.hasMany(models.Question, {   foreignKey: 'userId' })
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
