const express = require('express')
const app = express()
const port = 3000

app.use(express.static('src/public'))
app.use(express.static('src/node_modules'))
app.use(express.static('public'))
app.use(require('./routes.js'))

app.listen(port, () => console.log(`Example app listening on port ${port}!`))