require('dotenv').config()
const express = require('express')
const app = express()
const cors = require('cors')    
const { sequelize } = require('./models')
const { verifyToken } = require('./middlewares/auth')

const port = 3000

sequelize.authenticate()
    .then(() => console.log('Koneksi database berhasil'))
    .catch((error) => console.error('Koneksi database gagal:', error.message))

app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true,
}))

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use('/uploads', express.static('uploads'))

// routes
const authRoutes = require('./routes/auth.route')
const categoriesRoutes = require('./routes/categories.route')
const productsRoutes = require('./routes/products.route')
const transaksiRoutes = require('./routes/transaksi.route')
const laporanRoutes = require('./routes/laporan.route')

app.use('/auth', authRoutes)
app.use('/categories', verifyToken, categoriesRoutes)
app.use('/products', verifyToken, productsRoutes)
app.use('/transaksi', verifyToken, transaksiRoutes)
app.use('/laporan', verifyToken, laporanRoutes)

app.get('/', (req, res) => {
    res.send('Hallo Dunia')
})

app.listen(port, () => {
    console.log(`aplikasi sedang jalan di port ${port}`)
})