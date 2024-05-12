const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;

//middleware
app.use(cors());
app.use(express.json());



const uri = `mongodb+srv://${process.env.USER_NAME}:${process.env.USER_PASS}@cluster0.zzqeakj.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
console.log(uri);

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


    const fitnessCollection = client.db("fitnessServiceDB").collection("fitness");
    const bookingCollection = client.db("fitnessServiceDB").collection("bookings");


    app.get('/fitness', async (req, res) => {
      const cursor = fitnessCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    })


    app.get('/fitness/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await fitnessCollection.findOne(query);
      res.send(result);
    })


    app.post('/fitness', async (req, res) => {
      const newFitness = req.body;
      const result = await fitnessCollection.insertOne(newFitness);
      res.send(result);
    })

    app.get('/fitnesses/:email', async (req, res) => {
      const email = req.params.email;
      const query = { 'providerEmail': email };
      const result = await fitnessCollection.find(query).toArray();
      res.send(result);
    })



    // update operation
    app.put('/fitnessUpdate/:id', async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) }
      const options = { upsert: true };
      const updatedFit = req.body;

      const fitTherapy = {
        $set: {
          service_name: updatedFit.service_name,
          service_image: updatedFit.service_image,
          service_price: updatedFit.service_price,
          service_area: updatedFit.service_area,
          service_description: updatedFit.service_description
        }
      }
      const result = await fitnessCollection.updateOne(filter, fitTherapy, options);
      res.send(result);
    })

    app.delete('/delete/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await fitnessCollection.deleteOne(query);
      res.send(result);
    })

    //booking
    app.get('/booked-service/:email', async (req, res) => {
      const email = req.params.email;
      const query = { 'user_email': email };
      const result = await bookingCollection.find(query).toArray();
      res.send(result);
    })


    app.get('/serveToDo/:email', async (req, res) => {
      const email = req.params.email;
      const query = { 'providerEmail': email };
      const result = await bookingCollection.find(query).toArray();
      res.send(result);
    })



    app.post('/bookings', async (req, res) => {
      const newBooking = req.body;
      const result = await bookingCollection.insertOne(newBooking);
      res.send(result);
    })

app.patch('/workingStatus/:id', async(req,res)=>{
  const id = req.params.id;
  const status = req.body;
  const query = { _id: new ObjectId(id) };
  const updateDoc = {
    $set: status,
  }
  const result = await bookingCollection.updateOne(query, updateDoc);
  res.send(result)
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
  res.send('Fitness IS RUNNING');
})

app.listen(port, () => {
  console.log(`Fitness is running on port, ${port}`);
})
