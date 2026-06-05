const Validator = require('fastest-validator')
const v = new Validator()
const { transaksi, detail_transaksi, products, users } = require('../models')
const { response } = require('../helpers/response.formatter')
const { sequelize } = require('../models')

module.exports = {

    createTransaksi: async (req, res) => {
        const t = await sequelize.transaction()
        try {
            const { items, uang_bayar } = req.body
            const id_users = req.user.id

            const schema = {
                items: { type: 'array', items: { type: 'object' } }
            }
            const data = {
                items: items
            }
            const validate = v.validate(data, schema)
            if (validate.length > 0) {
                await t.rollback()
                return res.status(400).json(response(400, 'Validasi Error', validate))
            }

            let total_harga = 0
            const detailItems = []

            for (const item of items) {
                const product = await products.findByPk(item.id_products)
                if (!product) {
                    await t.rollback()
                    return res.status(404).json(response(404, `Product id ${item.id_products} tidak ditemukan`))
                }
                if (product.stok < item.jumlah) {
                    await t.rollback()
                    return res.status(400).json(response(400, `Stok ${product.nama} tidak cukup`))
                }
                const subtotal = product.harga * item.jumlah
                total_harga += subtotal
                detailItems.push({
                    id_products: item.id_products,
                    jumlah: item.jumlah,
                    subtotal: subtotal
                })
            }

            if (Number(uang_bayar) < total_harga) {
                await t.rollback()
                return res.status(400).json(response(400, 'Uang bayar kurang'))
            }

            const kembalian = Number(uang_bayar) - total_harga

            const newTransaksi = await transaksi.create({
                id_users: id_users,
                total_harga: total_harga,
                uang_bayar: Number(uang_bayar),
                kembalian: kembalian
            }, { transaction: t })

            for (const item of detailItems) {
                await detail_transaksi.create({
                    id_transaksi: newTransaksi.id,
                    id_products: item.id_products,
                    jumlah: item.jumlah,
                    subtotal: item.subtotal
                }, { transaction: t })

                await products.decrement('stok', {
                    by: item.jumlah,
                    where: { id: item.id_products },
                    transaction: t
                })
            }

            await t.commit()

            return res.status(201).json(response(201, 'Transaksi berhasil', {
                id_transaksi: newTransaksi.id,
                total_harga: total_harga,
                uang_bayar: Number(uang_bayar),
                kembalian: kembalian,
                items: detailItems
            }))
        } catch (error) {
            await t.rollback()
            return res.status(500).json(response(500, 'Server Error', error.message))
        }
    },

    getTransaksi: async (req, res) => {
        try {
            const data = await transaksi.findAll({
                include: [
                    { model: users, as: 'user' },
                    { model: detail_transaksi, as: 'details',
                        include: [{ model: products, as: 'product' }]
                    }
                ],
                order: [['createdAt', 'DESC']]
            })
            return res.status(200).json(response(200, 'Berhasil mengambil data transaksi', data))
        } catch (error) {
            return res.status(500).json(response(500, 'Server Error', error.message))
        }
    },

    detailTransaksi: async (req, res) => {
        try {
            const { id } = req.params
            const data = await transaksi.findByPk(id, {
                include: [
                    { model: users, as: 'user' },
                    { model: detail_transaksi, as: 'details',
                        include: [{ model: products, as: 'product' }]
                    }
                ]
            })
            if (!data) {
                return res.status(404).json(response(404, 'Transaksi tidak ditemukan'))
            }
            return res.status(200).json(response(200, 'Berhasil mengambil detail transaksi', data))
        } catch (error) {
            return res.status(500).json(response(500, 'Server Error', error.message))
        }
    }
}