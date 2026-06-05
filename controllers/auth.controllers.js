const Validator = require('fastest-validator')
const v = new Validator()
const { users } = require('../models')
const { response } = require('../helpers/response.formatter')
const passwordHash = require('password-hash')
const jwt = require('jsonwebtoken')
const { auth_secret } = require('../config/base.config')

module.exports = {
    login: async (req, res) => {
        try {
            const { email, password } = req.body
            const schema = {
                email: { type: 'email' },
                password: { type: 'string' }
            }
            const data = {
                email: email,
                password: password
            }
            const validate = v.validate(data, schema)
            if (validate.length > 0) {
                return res.status(400).json(response(400, 'Validasi Error', validate))
            }

            const user = await users.findOne({ where: { email: data.email } })
            if (!user) {
                return res.status(400).json(response(400, 'Email tidak terdaftar'))
            }

            const checkPassword = passwordHash.verify(data.password, user.password)
            if (!checkPassword) {
                return res.status(400).json(response(400, 'Password salah'))
            }

            const token = jwt.sign({ id: user.id, nama: user.nama, email: user.email, role: user.role}, auth_secret, {
                expiresIn: '1h' })

            const formatOutput = {
                user: { id: user.id, nama: user.nama, email: user.email, role: user.role},
                token: token
            }

            return res.status(200).json(response(200, 'Login berhasil', formatOutput))
        } catch (error) {
            return res.status(500).json(response(500, 'Server Error', error.message))
        }
    }
}