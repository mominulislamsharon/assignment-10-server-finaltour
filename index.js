const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
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
    

    app.get('/addItem', async(req, res) => {
      const cursor = itemCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    })
  


    app.post('/addItem', async(req, res) => {
      const newItem = req.body;
      // console.log(newItem);
      const result = await itemCollection.insertOne(newItem);
      res.send(result);
    })

    app.get('/myArtList/:email', async(req, res) => {
      // console.log(req.params.email);
      const result = await itemCollection.find({email:req.params.email}).toArray();
      res.send(result);
    })

    app.get('/updateProduct/:id', async(req, res) =>{
      // console.log(req.params.id)
      const result = await itemCollection.findOne({_id: new ObjectId(req.params.id)})
      // console.log(result);
      res.send(result)
    })

    app.put("/update/:id", async(req, res) => {
      const id = req.params.id;
      const filter = {_id: new ObjectId(id)}
      const options = {upsert: true};
      const upadeteItem = req.body;
      console.log(id,upadeteItem);
      const updatedsItem = {
        $set: {
          name: upadeteItem.name,
          price: upadeteItem.price,
          rating: upadeteItem.rating,
          time: upadeteItem.time,
          item: upadeteItem.item,
          category: upadeteItem.category,
          customization: upadeteItem.customization,
          stock: upadeteItem.stock,
          // email: upadeteItem.email,
          message: upadeteItem.message,
        }
      }
      const result = await itemCollection.updateOne(filter, updatedsItem, options);
      res.send(result)
    })

    app.delete('/delete/:id', async(req,res) => {
      const result = await itemCollection.deleteOne(
        {_id: new ObjectId(req.params.id)})
        // console.log(result);
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