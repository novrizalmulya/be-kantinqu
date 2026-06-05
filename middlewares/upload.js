const multer = require('multer')
const path = require('path')

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '../uploads'))
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        const extFile = path.extname(file.originalname)
        // gabungkan nama unik dan ekstensi file
        const name = uniqueSuffix + extFile
        cb(null, name)
    }
})

const upload = multer({ storage })

module.exports = upload