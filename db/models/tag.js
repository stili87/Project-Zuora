'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Tag extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Tag.hasMany(models.Question, {as: 'tag', foreignKey: 'tagId'})
    }
  }
  Tag.init({
    name: {
      allowNull: false,
      type: DataTypes.STRING(50)
    }
  }, {
    sequelize,
    modelName: 'Tag',
  });
  return Tag;
};
