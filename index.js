const express = require('express')
const { MongoClient, ObjectId } = require('mongodb')
const cors = require('cors') // Importa o pacote cors
const app = express()

const dbURL = 'mongodb+srv://admin:gmEmuTz9i8T0vCYR@cluster0.scztp2d.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0'
const dbName = 'ocean-jornada-backend'

const client = new MongoClient(dbURL)

async function main() {
  console.log('Conectando ao banco de dados...')
  await client.connect()
  console.log('Banco de dados conectado com sucesso!')

  // Configura o CORS para permitir requisições do frontend hospedado no Vercel
  app.use(cors(

  ))

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
    const item = req.body
    await collection.insertOne(item)
    res.send(item)
  })

  // Read By id - [GET] /item/:id
  app.get('/item/:id', async function (req, res) {
    const id = req.params.id
    const item = await collection.findOne({ _id: new ObjectId(id) })
    res.send(item)
  })

  // Update - PUT
  app.put('/item/:id', async function (req, res) {
    const id = req.params.id;
    const novoItem = req.body;

    try {
      // Atualiza o documento com base no _id
      const result = await collection.updateOne(
        { _id: new ObjectId(id) },
        { $set: novoItem }
      );

      // Verifica se algum documento foi modificado
      if (result.modifiedCount === 0) {
        return res.status(404).send('Item não encontrado ou nenhuma alteração feita');
      }

      res.send(`Valor atualizado: ${id}`);
    } catch (error) {
      console.error('Erro ao atualizar item:', error);
      res.status(500).send('Erro ao atualizar item');
    }
  });

  // Delete - [DELETE] /item/:id
  app.delete('/item/:id', async function (req, res) {
    const id = req.params.id;

    // Verifica se o ID tem 24 caracteres e é uma string hexadecimal
    if (!ObjectId.isValid(id)) {
      return res.status(400).send('ID inválido');
    }

    // Remove o item da collection pelo ObjectID
    await collection.deleteOne({ _id: new ObjectId(id) });

    // Enviamos uma mensagem de sucesso
    res.send(`Item ${id} foi removido com sucesso!`);
  });
  app.listen(5152)
}

main()