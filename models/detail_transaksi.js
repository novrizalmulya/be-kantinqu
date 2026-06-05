'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class detail_transaksi extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      detail_transaksi.belongsTo(models.transaksi, { 
        foreignKey: 'id_transaksi' 
      });
      detail_transaksi.belongsTo(models.products, { 
        foreignKey: 'id_products',
        as: 'product' 
      });
    }
  }
  detail_transaksi.init({
    jumlah: DataTypes.INTEGER,
    subtotal: DataTypes.INTEGER,
    id_transaksi: DataTypes.INTEGER,
    id_products: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'detail_transaksi',
    tableName: 'detail_transaksi'
  });
  return detail_transaksi;
};