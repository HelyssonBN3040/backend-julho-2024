const express = require('express')
const app = express()

app.get('/', function (req, res) {
  res.send('Hello World')
})

app.get('/oi', (req, res)  => {
  res.send('Nova rota: oi')
})

app.get('/outra-rota', (req, res)  => {
  res.send('Outra rota: olá')
})

app.listen(3000)