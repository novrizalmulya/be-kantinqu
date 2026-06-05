const Validator = require('fastest-validator')
const v = new Validator()
const { products, categories } = require('../models')
const { response } = require('../helpers/response.formatter')
const { Op } = require('sequelize')
const path = require('path')
const fs = require('fs')

module.exports = {

    getProducts: async (req, res) => {
        try {
            const { nama, sortBy, order } = req.query
            const data = await products.findAll({
                include: [{ model: categories, as: 'category' }],
                where: nama ? {
                    nama: { [Op.like]: `%${nama}%` }
                } : {},
                order: sortBy && order ? [[sortBy, order]] : []
            })
            return res.status(200).json(response(200, 'Berhasil mengambil data products', data))
        } catch (error) {
            return res.status(500).json(response(500, 'Server Error', error.message))
        }
    },

    detailProduct: async (req, res) => {
        try {
            const { id } = req.params
            const data = await products.findByPk(id, {
                include: [{ model: categories, as: 'category' }]
            })
            if (!data) {
                return res.status(404).json(response(404, 'Product tidak ditemukan'))
            }
            return res.status(200).json(response(200, 'Berhasil mengambil detail product', data))
        } catch (error) {
            return res.status(500).json(response(500, 'Server Error', error.message))
        }
    },

    createProduct: async (req, res) => {
        try {
            const { nama, harga, stok, id_categories } = req.body
            const schema = {
                nama: { type: 'string', min: 3 },
                harga: { type: 'number', positive: true, integer: true },
                stok: { type: 'number', positive: true, integer: true },
                id_categories: { type: 'number', positive: true, integer: true }
            }
            const data = {
                nama: nama,
                harga: Number(harga),
                stok: Number(stok),
                id_categories: Number(id_categories)
            }
            const validate = v.validate(data, schema)
            if (validate.length > 0) {
                return res.status(400).json(response(400, 'Validasi Error', validate))
            }
            if (!req.file) {
                return res.status(400).json(response(400, 'Foto harus diupload'))
            }

            const newProduct = await products.create({
                ...data,
                foto: req.file.filename
            })
            const result = await products.findByPk(newProduct.id, {
                include: [{ model: categories, as: 'category' }]
            })
            return res.status(201).json(response(201, 'Berhasil membuat product', result))
        } catch (error) {
            return res.status(500).json(response(500, 'Server Error', error.message))
        }
    },

    updateProduct: async (req, res) => {
        try {
            const { nama, harga, stok, id_categories } = req.body
            const schema = {
                nama: { type: 'string', min: 3 },
                harga: { type: 'number', positive: true, integer: true },
                stok: { type: 'number', positive: true, integer: true },
                id_categories: { type: 'number', positive: true, integer: true }
            }
            const data = {
                nama: nama,
                harga: Number(harga),
                stok: Number(stok),
                id_categories: Number(id_categories)
            }
            const validate = v.validate(data, schema)
            if (validate.length > 0) {
                return res.status(400).json(response(400, 'Validasi Error', validate))
            }

            const { id } = req.params
            const productBefore = await products.findByPk(id)
            if (!productBefore) {
                return res.status(404).json(response(404, 'Product tidak ditemukan'))
            }

            if (req.file) {
                const fotoLama = productBefore.getDataValue('foto')
                const filePosition = path.join(__dirname, '../uploads', fotoLama)
                if (fs.existsSync(filePosition)) {
                    fs.unlinkSync(filePosition)
                }
            }

            await products.update({
                ...data,
                foto: req.file ? req.file.filename : productBefore.foto
            }, {
                where: { id: id }
            })

            const newProduct = await products.findByPk(id, {
                include: [{ model: categories, as: 'category' }]
            })
            return res.status(200).json(response(200, 'Berhasil mengupdate product', newProduct))
        } catch (error) {
            return res.status(500).json(response(500, 'Server Error', error.message))
        }
    },

    deleteProduct: async (req, res) => {
        try {
            const { id } = req.params
            const product = await products.findByPk(id)
            if (!product) {
                return res.status(404).json(response(404, 'Product tidak ditemukan'))
            }

            const fotoLama = product.getDataValue('foto')
            const filePosition = path.join(__dirname, '../uploads', fotoLama)
            if (fs.existsSync(filePosition)) {
                fs.unlinkSync(filePosition)
            }

            await product.destroy()
            return res.status(200).json(response(200, 'Berhasil menghapus product'))
        } catch (error) {
            return res.status(500).json(response(500, 'Server Error', error.message))
        }
    }
}