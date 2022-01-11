const express = require("express")
const app = express()
const cors = require('cors')
const petugas = require('./router/petugas')
const masyarakat = require('./router/masyarakat')
const barang = require('./router/barang')
const lelang = require('./router/lelang')
const historyLelang = require('./router/historyLelang')
const login = require('./router/login')
require('dotenv').config()
const api = process.env.API
const port = process.env.PORT

app.use(cors())
app.use(`${api}/petugas`, petugas)
app.use(`${api}/masyarakat`, masyarakat)
app.use(`${api}/barang`, barang)
app.use(`${api}/lelang`, lelang)
app.use(`${api}/historyLelang`, historyLelang)
app.use(`${api}/login`, login)

app.listen(port, () => {
    console.log(`server run on port ${port}`);
})