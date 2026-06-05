const Validator = require('fastest-validator')
const v = new Validator()
const { categories } = require('../models')
const { response } = require('../helpers/response.formatter')

module.exports = {

    getCategories: async (req, res) => {
        try {
            const data = await categories.findAll()
            return res.status(200).json(response(200, 'Success', data))
        } catch (error) {
            return res.status(500).json(response(500, 'Server Error', error.message))
        }
    },

    createCategory: async (req, res) => {
        try {
            const { nama } = req.body
            const schema = {
                nama: { type: 'string' }
            }
            const data = {
                nama: nama
            }
            const validate = v.validate(data, schema)
            if (validate.length > 0) {
                return res.status(400).json(response(400, 'Validasi Error', validate))
            }

            const newCategory = await categories.create(data)
            return res.status(201).json(response(201, 'Berhasil membuat kategori', newCategory))
        } catch (error) {
            return res.status(500).json(response(500, 'Server Error', error.message))
        }
    },

    updateCategory: async (req, res) => {
        try {
            const { nama } = req.body
            const schema = {
                nama: { type: 'string' }
            }
            const data = {
                nama: nama
            }
            const validate = v.validate(data, schema)
            if (validate.length > 0) {
                return res.status(400).json(response(400, 'Validasi Error', validate))
            }

            const category = await categories.findByPk(req.params.id)
            if (!category) {
                return res.status(404).json(response(404, 'Category tidak ditemukan'))
            }

            await category.update(data)
            return res.status(200).json(response(200, 'Berhasil Update kategori', category))
        } catch (error) {
            return res.status(500).json(response(500, 'Server Error', error.message))
        }
    },

    deleteCategory: async (req, res) => {
        try {
            const { id } = req.params
            const category = await categories.findByPk(id)
            if (!category) {
                return res.status(404).json(response(404, 'Category tidak ditemukan'))
            }
            await category.destroy()
            return res.status(200).json(response(200, 'Berhasil menghapus kategori'))
        } catch (error) {
            return res.status(500).json(response(500, 'Server Error', error.message))
        }
    }
}