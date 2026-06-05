const express = require('express')
const router = express.Router()
const upload = require('../middlewares/upload')
const { verifyAdmin } = require('../middlewares/auth')
const productsController = require('../controllers/products.controllers')

router.get('/', productsController.getProducts)
router.get('/:id', productsController.detailProduct)
router.post('/', verifyAdmin, upload.single('foto'), productsController.createProduct)
router.put('/:id', verifyAdmin, upload.single('foto'), productsController.updateProduct)
router.delete('/:id', verifyAdmin, productsController.deleteProduct)

module.exports = router