const express = require('express')
const router = express.Router()
const upload = require('../middlewares/upload')
const { login } = require('../controllers/auth.controllers')

router.post('/login', upload.none(), login)

module.exports = router