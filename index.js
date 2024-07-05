const express = require('express')
const cors = require('cors')
const { MongoClient, ObjectId } = require('mongodb')
const app = express()


app.use(cors({
  origin: 'http://localhost:3000'
}))

const dbURL = 'mongodb+srv://admin:gmEmuTz9i8T0vCYR@cluster0.scztp2d.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0'
const dbName = 'ocean-jornada-backend'

const client = new MongoClient(dbURL)


async function main() {
  console.log('Conectando ao banco de dados...')
  await client.connect()
  console.log('Banco de dados conectado com sucesso!')


  app.get('/', function (req, res) {
    res.send('Hello World')
  })

  const db = client.db(dbName)
  const collection = db.collection('item')


  // consulta da lista
  app.get('/item', async function (req, res) {
    const documentos = await collection.find().toArray()
    res.send(documentos)
  })

  // Sinalizamos para o Express que vamos usar JSON no Body
  app.use(express.json())


  // Create - [POST] /item
  app.post('/item', async function (req, res) {
    // obtemos o nome da request
    const item = req.body
    //inserimos o item na collection
    await collection.insertOne(item)
    // Enviado uma mensagem com sucesso
    res.send(item)
  })


  // Read By id - [GET] /item/:id
  app.get('/item/:id', async function (req, res) {
    // acesso ao parametros da rota id
    const id = req.params.id
    //acessar o id, através da rota
    const item = await collection.findOne({_id: new ObjectId(id)})
    res.send(item)
  })


  // Update - PUT
  app.put('/item/:id', async function (req, res) {
    const id = req.params.id
    const novoItem = req.body

    await collection.updateOne(
      {_id: new ObjectId(id)},
      {$set: novoItem}
    )
    res.send(`Valor atualizado: ${id}`)
  })

  //Delete - [DELETE] /item/:id
  app.delete('/item/:id', async function(req, res){
    // acessando o parametro ID
    const id = req.params.id

    // Remove o item da collection pelo ObjectID
    await collection.deleteOne(
      {_id: new ObjectId(id)}
    )
    
    // Enviamos o item da collection pelo ObjectID
    res.send(`Item ${id}, foi removido com sucesso!`)
  })

  app.listen(5152)
}


main()