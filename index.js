require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');
var admin = require("firebase-admin");
const decoded = Buffer.from(process.env.FB_SERVICE_KEY, 'base64').toString('utf-8')
var serviceAccount = JSON.parse(decoded)
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});
app.use(cors(
  {
    origin: ["http://localhost:5173", "https://travel-mania-nayeem129.netlify.app"], 
    credentials: true,
  }
));
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




const verifyFireBaseToken = async (req, res, next) => {
  const authHeader = req.headers?.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).send({ message: 'unauthorized access' })
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = await admin.auth().verifyIdToken(token);
    console.log('decoded token', decoded);
    req.decoded = decoded;
    next();
  }
  catch (error) {
    return res.status(401).send({ message: 'unauthorized access' })
  }
}



async function run() {
  try {
    const database = client.db('travel_mania')
    const packageCollection = database.collection('package')
    const bookingCollection = database.collection('booking')


    app.get('/package', async(req, res) => {
      const {searchParams} = req.query;

    let query = {}

    if(searchParams){
      query= {tour_name: {$regex: searchParams, $options: "i"   }}
    }

      const allPackage = await packageCollection.find(query).toArray()
      res.send(allPackage)
    })

    app.get('/my-package/:email', verifyFireBaseToken ,async (req, res) => {
      const email = req.params.email;
      
      const filter = { email }
      const package = await packageCollection.find(filter).toArray()
      res.send(package)
    })

     app.get("/feature", async (req, res) => {
      const latest = await packageCollection.find()
        .sort({ _id: -1 })
        .limit(8)
        .toArray();
      res.send(latest);
    });
      

    app.get('/my-booking/:email', verifyFireBaseToken ,async (req, res) => {
      const email = req.params.email;

      const filter = { email }
      const booking = await bookingCollection.find(filter).toArray()
      res.send(booking)
    })


    app.get('/package/:id',verifyFireBaseToken ,async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await packageCollection.findOne(query);
            res.send(result);
        })

        app.post('/bookNow',verifyFireBaseToken ,async(req, res) => {
      const bookingData = req.body;
      const packageId = bookingData.packageId;
      const result = await bookingCollection.insertOne(bookingData)
      const updateResult = await packageCollection.updateOne(
      { _id: new ObjectId(String(packageId)) },
      { $inc: { booking_Count: +1 } }
    );

     res.send({
      success: true,
      bookingId: result.insertedId,
      bookingCountUpdated: updateResult.modifiedCount === +1
    });
    })


    app.post('/addPackage',verifyFireBaseToken ,async(req, res) => {
      const packageData = req.body;
      const result = await packageCollection.insertOne(packageData)
      res.send(result)
    })

    app.put('/updatePackage/:id',verifyFireBaseToken ,async (req, res) => {
            const id = req.params.id;
            const filter = { _id: new ObjectId(id) }
            const options = { upsert: true };
            const updatedPackage = req.body;
            const updatedInfo = {
                $set: updatedPackage
            }

            
              const result = await packageCollection.updateOne(filter, updatedInfo, options);

            res.send(result);
        })

         app.delete('/package/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await packageCollection.deleteOne(query);
            res.send(result);
        })


        app.patch('/my-booking/:id/confirm', async (req, res) => {
           const { id } = req.params;
             const updateBook = await bookingCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: { status: "Confirmed" } }
    );

    if (updateBook.modifiedCount > 0) {
    res.send({ success: true});
  } else {
    res.send({ success: false });
  }

        })
   
    // await client.connect();
   

    // await client.db("admin").command({ ping: 1 });
    // console.log("Pinged your deployment. You successfully connected to MongoDB!");
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