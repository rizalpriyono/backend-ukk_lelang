const express = require("express")
const app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
require('dotenv').config()
const SECRET_KEY = process.env.SECRET_KEY
const { masyarakat } = require('../models/index')
const { petugas } = require('../models/index')
const md5 = require("md5")
const jwt = require("jsonwebtoken")
const {logged} = require('../helper/wrapper')

app.post("/", async(req, res) => {
    const param = {
        username: req.body.username,
        password: md5(req.body.password)
    }
    const resultMasyarakat = await masyarakat.findOne({ where: param })
    const resultPetugas = await petugas.findOne({ where: param })
    if(resultMasyarakat){
        resultMasyarakat.dataValues.level = "masyarakat"
        let payload = JSON.stringify(resultMasyarakat)
        let token = jwt.sign(payload, SECRET_KEY)
        return logged(res, 'success', resultMasyarakat, token, 'Success login masyarakat', 200)
    }else if(resultPetugas){
        let payload = JSON.stringify(resultPetugas)
        let token = jwt.sign(payload, SECRET_KEY)
        return logged(res, 'success', resultPetugas, token, 'Success login masyarakat', 200)
    }else {
        return logged(res, 'fail', '', '', 'Invalid Username or Password', 200)
    }
})

module.exports = app