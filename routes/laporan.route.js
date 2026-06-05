const express = require('express')
const router = express.Router()
const laporanController = require('../controllers/laporan.controllers')
const { verifyAdmin } = require('../middlewares/auth')

// hanya admin yang bisa export laporan
router.get('/export-excel', verifyAdmin, laporanController.exportExcel)

module.exports = router