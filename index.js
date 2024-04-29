const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;



// middleware 
app.use(cors());
app.use(express.json());

 



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.a1brhlt.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;


// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    // addcraftitme 
    const database = client.db('craftItemDB');
    const itemCollection = database.collection('item');
    // addmylistitem
    const databased = client.db('myListItems');
    const myCraftListCollection = databased.collection('myArtList');

    app.get('/addItem', async(req, res) => {
      const cursor = itemCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    })
  


    app.post('/addItem', async(req, res) => {
      const newItem = req.body;
      console.log(newItem);
      const result = await itemCollection.insertOne(newItem);
      res.send(result);
    })

    app.get('/myListItem', async(req, res) => {
      const cursor = myCraftListCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    })

    app.post('/myListItem', async(req, res) => {
      const newMyList = req.body;
      console.log(newMyList);
      const result = await myCraftListCollection.insertOne(newMyList);
      res.send(result);
    })





    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);



app.get('/', (req, res) => {
    res.send('Art And Craft Server is Running')
})

app.listen(port, () => {
    console.log(`Arth Craft Server is running on port: ${port}`)
})  