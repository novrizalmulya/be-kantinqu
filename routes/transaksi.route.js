const express = require('express')
const router = express.Router()
const upload = require('../middlewares/upload')
const { verifyKasir } = require('../middlewares/auth')
const transaksiController = require('../controllers/transaksi.controllers')

router.post('/', verifyKasir, upload.none(), transaksiController.createTransaksi)
router.get('/', transaksiController.getTransaksi)
router.get('/:id', transaksiController.detailTransaksi)

module.exports = router