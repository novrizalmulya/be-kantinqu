'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class products extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      products.belongsTo(models.categories, { 
        foreignKey: 'id_categories',
        as: 'category' 
      });
      products.hasMany(models.detail_transaksi, { 
        foreignKey: 'id_products' 
      });
    }
  }
  products.init({
    nama: DataTypes.STRING,
    harga: DataTypes.INTEGER,
    stok: DataTypes.INTEGER,
    foto: DataTypes.STRING,
    id_categories: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'products',
  });
  return products;
};