const { transaksi, detail_transaksi, products, users } = require('../models')
const { response } = require('../helpers/response.formatter')
const ExcelJS = require('exceljs')

module.exports = {

    exportExcel: async (req, res) => {
        try {
            // ambil semua data transaksi beserta relasi nya
            const data = await transaksi.findAll({
                include: [
                    { model: users, as: 'user' },
                    { model: detail_transaksi, as: 'details',
                        include: [{ model: products, as: 'product' }]
                    }
                ],
                order: [['createdAt', 'DESC']]
            })

            // buat file excel baru
            const workbook = new ExcelJS.Workbook()
            // buat sheet baru di dalam file excel
            const sheet = workbook.addWorksheet('Laporan Transaksi')

            // definisikan kolom kolom excel
            sheet.columns = [
                { header: 'ID Transaksi', key: 'id', width: 15 },
                { header: 'Kasir', key: 'kasir', width: 20 },
                { header: 'Produk', key: 'produk', width: 25 },
                { header: 'Jumlah', key: 'jumlah', width: 10 },
                { header: 'Subtotal', key: 'subtotal', width: 15 },
                { header: 'Total Harga', key: 'total_harga', width: 15 },
                { header: 'Uang Bayar', key: 'uang_bayar', width: 15 },
                { header: 'Kembalian', key: 'kembalian', width: 15 },
                { header: 'Tanggal', key: 'tanggal', width: 25 }
            ]

            // loop setiap transaksi
            data.forEach(trx => {
                // loop setiap detail item di dalam transaksi
                // 1 transaksi dengan 2 item = 2 baris di excel
                trx.details.forEach(detail => {
                    sheet.addRow({
                        id: trx.id,
                        kasir: trx.user ? trx.user.nama : '-',
                        produk: detail.product ? detail.product.nama : '-',
                        jumlah: detail.jumlah,
                        subtotal: detail.subtotal,
                        total_harga: trx.total_harga,
                        uang_bayar: trx.uang_bayar,
                        kembalian: trx.kembalian,
                        tanggal: new Date(trx.createdAt).toLocaleString('id-ID')
                    })
                })
            })

            // set header response agar browser tahu ini file excel
            res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
            // attachment: agar browser harus download, bukan buka di tab baru
            res.setHeader('Content-Disposition', 'attachment; filename=laporan-transaksi.xlsx')

            // tulis file excel langsung ke response
            await workbook.xlsx.write(res)
            // tutup response setelah selesai
            res.end()
        } catch (error) {
            return res.status(500).json(response(500, 'Server Error', error.message))
        }
    }
}