const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

// middle wares
app.use(cors());
app.use(express.json());

console.log(process.env.DB_USER);
console.log(process.env.DB_PASSWORD);

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.jt8oxuk.mongodb.net/?retryWrites=true&w=majority`;
// console.log(uri);
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run(){
  try{
    const serviceCollection = client.db('geniusCar').collection('services');
    const orderCollection = client.db('geniusCar').collection('orders');

    // services api
    app.get('/services', async(req, res) =>{
      const query = {};
      const cursor = serviceCollection.find(query);
      const services = await cursor.toArray();
      res.send(services);
    })

    app.get('/services/:id', async(req, res) =>{
      const id = req.params.id;
      const query = {_id: ObjectId(id)};
      const services = await serviceCollection.findOne(query);
      res.send(services);
    })

    // orders api
    app.post('/orders', async(req, res) =>{
      const order = req.body;
      const result = await orderCollection.insertOne(order);
      res.send(result);
    })
  }
  finally{

  }
}
run().catch(err => console.log(err));


app.get('/', (req, res) =>{
  res.send('Genious car server is runngin');
});

app.listen(port, () =>{
  console.log('Genius Car server running on port: ', port);
})