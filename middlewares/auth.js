const jwt = require('jsonwebtoken')
const { response } = require('../helpers/response.formatter')
const { auth_secret } = require('../config/base.config')

module.exports = {
    verifyToken: async (req, res, next) => {
        const token = req.header('Authorization')
        if (!token) {
            return res.status(401).json(response(401, "Unauthorized"));
        }
        try {
            const checkToken = jwt.verify(token, auth_secret);
            req.user = checkToken;
            next();
        } catch (error) {
            return res.status(500).json(response(500, "Server Error", error.message));
        }
    },

    verifyAdmin: (req, res, next) => {
        if (req.user.role !== 'admin') {
            return res.status(403).json(response(403, 'Akses ditolak, Hanya Admin'));
        }
        next()
    },

    verifyKasir: (req, res, next) => {
        if (req.user.role !== 'kasir') {
            return res.status(403).json(response(403, 'Akses ditolak, Hanya Kasir'))
        }
        next()
}

}