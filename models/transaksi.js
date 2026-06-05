'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class transaksi extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      transaksi.belongsTo(models.users, { 
        foreignKey: 'id_users',
        as: 'user' 
      });
      transaksi.hasMany(models.detail_transaksi, { 
        foreignKey: 'id_transaksi',
        as: 'details' 
      });
    }
  }
  transaksi.init({
    total_harga: DataTypes.INTEGER,
    uang_bayar: DataTypes.INTEGER,
    kembalian: DataTypes.INTEGER,
    id_users: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'transaksi',
    tableName: 'transaksi'
  });
  return transaksi;
};