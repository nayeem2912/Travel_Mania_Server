require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
app.use(cors());
app.use(express.json());

const port = process.env.PORT || 3000;




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.6ww4e81.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;


const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    const database = client.db('travel_mania')
    const packageCollection = database.collection('package')


    app.get('/package', async(req, res) => {
      const {searchParams} = req.query;

    let query = {}

    if(searchParams){
      query= {tour_name: {$regex: searchParams, $options: "i"   }}
    }

      const allPackage = await packageCollection.find(query).toArray()
      res.send(allPackage)
    })

    app.get('/package/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await packageCollection.findOne(query);
            res.send(result);
        })


    app.post('/addPackage', async(req, res) => {
      const packageData = req.body;
      const result = await packageCollection.insertOne(packageData)
      res.send(result)
    })
   
    await client.connect();
   

    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);



app.get('/', (req, res) => {
  res.send('Travel Mania server is getting ready')
})

app.listen(port, () => {
  console.log(`Travel Mania Server is running on port ${port}`)
})