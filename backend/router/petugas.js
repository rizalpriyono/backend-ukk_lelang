const express = require("express")
const app = express()
const { response } = require('../helper/wrapper')
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
const { petugas } = require('../models/index')
const { masyarakat } = require('../models/index')
const md5 = require("md5")
const auth = require('../auth')

app.get("/", auth("admin", "petugas"),async (req, res) => {
    await petugas.findAll()
        .then(result => {
            return response(res, 'success', result, 'Success get data petugas', 200)
        })
        .catch(err => {
            return response(res, 'fail', err, 'Failed get data petugas', 400)
        })
})

app.get("/:id", auth("admin", "petugas"),async (req, res) => {
    const param = {
        id: req.params.id
    }
    await petugas.findOne({ where: param })
        .then(result => {
            return response(res, 'success', result, 'Success get data petugas', 200)
        }).catch(err => {
            return response(res, 'fail', err, 'Failed get data petugas', 400)
        })
})

app.post("/", auth("admin"),async (req, res) => {
    const data = {
        nama: req.body.nama,
        password: md5(req.body.password),
        level: req.body.level
    }
    const param = {
        username: req.body.username
    }
    const resultMasyarakat = await masyarakat.findOne({ where: param })
    const resultPetugas = await petugas.findOne({ where: param })
    if (resultMasyarakat || resultPetugas) {
        return response(res, 'fail', '', 'Username Already exist', 400)
    } else {
        data.username = param.username
        await petugas.create(data)
            .then(result => {
                return response(res, 'success', result, 'Success create data petugas', 201)
            })
            .catch(err => {
                return response(res, 'fail', err, 'Failed create data petugas', 400)
            })
    }
})

app.put("/", auth("admin", "petugas"),async (req, res) => {
    const param = {
        id: req.body.id
    }
    const payload = {
        nama: req.body.nama,
        level: req.body.level
    }
    const data = {}
    if (req.body.password) {
        payload.password = md5(req.body.password)
    }
    if (req.body.username) {
        data.username = req.body.username
        const resultMasyarakat = await masyarakat.findOne({ where: data })
        const resultPetugas = await petugas.findOne({ where: data })
        if (resultMasyarakat || resultPetugas) {
            return response(res, 'fail', '', 'Username Already exist', 400)
        } else {
            payload.username = data.username
            await petugas.update(payload, { where: param })
                .then(result => {
                    return response(res, 'fail', result, 'Success update data petugas', 200)
                })
                .catch(err => {
                    return response(res, 'fail', err, 'Failed update data petugas', 400)
                })
        }
    } else {
        payload.username = data.username
        await petugas.update(payload, { where: param })
            .then(result => {
                return response(res, 'fail', result, 'Success update data petugas', 200)
            })
            .catch(err => {
                return response(res, 'fail', err, 'Failed update data petugas', 400)
            })
    }
})

app.delete("/:id", auth("admin"),async (req, res) => {
    const param = {
        id: req.params.id
    }
    petugas.destroy({ where: param })
        .then(result => {
            return response(res, 'success', result, 'Success delete data petugas', 200)
        })
        .catch(err => {
            return response(res, 'fail', err, 'Failed update data petugas', 400)
        })
})

module.exports = app