const express = require('express')
const router = express.Router()
const upload = require('../middlewares/upload')
const { verifyAdmin } = require('../middlewares/auth')
const categoriesController = require('../controllers/categories.controllers')

router.get('/', categoriesController.getCategories)
router.post('/', verifyAdmin, upload.none(), categoriesController.createCategory)
router.put('/:id', verifyAdmin, upload.none(), categoriesController.updateCategory)
router.delete('/:id', verifyAdmin, categoriesController.deleteCategory)

module.exports = router