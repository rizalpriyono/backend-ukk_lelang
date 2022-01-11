const express = require("express")
const app = express()
const { response } = require('../helper/wrapper')
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
const { history_lelang } = require('../models/index')

app.get("/", auth("admin", "petugas", "masyarakat"), async(req, res) => {
    await history_lelang.findAll()
        .then(result => {
            return response(res, 'success', result, 'Success get data history lelang', 200)
        })
        .catch(err => {
            return response(res, 'fail', err, 'Failed get data history lelang', 400)
        })
})

app.get("/:id", auth("admin", "petugas", "masyarakat"), async(req, res) => {
    const param = {
        id: req.params.id
    }
    await history_lelang.findOne({ where: param })
        .then(result => {
            return response(res, 'success', result, 'Success get data history lelang', 200)
        }).catch(err => {
            return response(res, 'fail', err, 'Failed get data history lelang', 400)
        })
})

module.exports = app