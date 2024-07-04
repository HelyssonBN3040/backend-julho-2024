const express = require('express')
const app = express()

const list = ['Rick Sanchez', 'Morty Smith', 'Summer Smith']

app.get('/', function (req, res) {
  res.send('Hello World')
})


// consulta da lista
app.get('/item', function (req, res) {
  res.send(list)
})

// Sinalizamos para o Express que vamos usar JSON no Body
app.use(express.json())


// Create - [POST] /item
app.post('/item', function (req, res) {
  // obtemos o nome da request
  const item = req.body.nome

  // Inseriu o nome na lista
  list.push(item)

  // Enviado uma mensagem com sucesso
  res.send('Item criado com sucesso!')
})


// Read By id - [GET] /item/:id
app.get('/item/:id', function (req, res) {
  // acesso ao parametros da rota id
  const id = req.params.id
  //acessar o id, através da rota
  const item = list[id - 1]
  res.send(`Olá, ${item}`)
})


// update - PUT
app.put('/item/:id', function (req, res) {
  const id = req.params.id
  const novoItem = req.body.nome
  list[id - 1] = novoItem
  res.send(`Valor atualizado: ${novoItem}`)
})

app.listen(3000)