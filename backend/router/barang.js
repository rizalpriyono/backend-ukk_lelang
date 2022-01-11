const express = require("express")
const app = express()
const { response } = require('../helper/wrapper')
const { toIsoString } = require('../helper/date')
const multer = require('multer')
const fs = require('fs')
const path = require("path")
const auth = require('../auth')
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
const { barang } = require('../models/index')
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "./barangImage")
    },
    filename: (req, file, cb) => {
        cb(null, "img-" + Date.now() + path.extname(file.originalname))
    }
})
let upload = multer({ storage: storage })

app.get("/", auth("admin", "petugas", "masyarakat"),async (req, res) => {
    await barang.findAll()
        .then(result => {
            return response(res, 'success', result, 'Success get data barang', 200)
        })
        .catch(err => {
            return response(res, 'fail', err, 'Failed get data barang', 400)
        })
})

app.get("/:id", auth("admin", "petugas", "masyarakat"), async (req, res) => {
    const param = {
        id: req.params.id
    }
    await barang.findOne({ where: param })
        .then(result => {
            return response(res, 'success', result, 'Success get data masyarakat', 200)
        }).catch(err => {
            return response(res, 'fail', err, 'Failed get data masyarakat', 400)
        })
})

app.post("/", upload.single("image"), auth("admin", "petugas"),async (req, res) => {
    const date = new Date(Date.now())
    if (!req.file) {
        return response(res, 'fail', '', 'Image is required', 400)
    } else {
        const data = {
            nama: req.body.nama,
            hargaAwal: req.body.hargaAwal,
            deskripsi: req.body.deskripsi,
            tgl: toIsoString(date),
            image: req.file.filename
        }
        await barang.create(data)
            .then(result => {
                return response(res, 'success', result, 'Success create data barang', 200)
            }).catch(err => {
                return response(res, 'fail', err, 'Failed create data barang', 400)
            })
    }
})

app.put("/", upload.single("image"), auth("admin", "petugas"), async (req, res) => {
    const date = new Date(Date.now())
    const param = {
        id: req.body.id
    }
    const data = {
        nama: req.body.nama,
        hargaAwal: req.body.hargaAwal,
        deskripsi: req.body.deskripsi,
        tgl: toIsoString(date)
    }
    if (req.file) {
        const result = await barang.findOne({ where: param })
        const oldFileName = result.image

        // delete old file
        const dir = await path.join(__dirname, "../barangImage", oldFileName)
        fs.unlink(dir, err => console.log(err))
        // set new filename
        data.image = req.file.filename
    }
    await barang.update(data, { where: param })
        .then(result => {
            return response(res, 'success', result, 'Success update data barang', 200)
        }).catch(err => {
            return response(res, 'fail', err, 'Failed create data barang', 400)
        })
})

app.delete("/:id", auth("admin", "petugas"), async (req, res) => {
    const param = {
        id: req.params.id
    }
    let result = await barang.findOne({ where: param })
    let oldFileName = result.image

    // delete old file
    let dir = path.join(__dirname, "../barangImage", oldFileName)
    fs.unlink(dir, err => console.log(err))
    await barang.destroy({ where: param })
        .then(result => {
            return response(res, 'success', result, 'Success delete data barang', 200)
        }).catch(err => {
            return response(res, 'fail', err, 'Failed update data barang', 400)
        })
})


module.exports = app