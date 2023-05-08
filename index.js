const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const app = express();
app.use(cors());
app.use(express.json());

const port = process.env.PORT || 5000;

// var uri =
//     "mongodb://test1:5Yw1F4V3xB38rRPm@ac-ne4tufh-shard-00-00.ofkrvlo.mongodb.net:27017,ac-ne4tufh-shard-00-01.ofkrvlo.mongodb.net:27017,ac-ne4tufh-shard-00-02.ofkrvlo.mongodb.net:27017/?ssl=true&replicaSet=atlas-b40t0a-shard-0&authSource=admin&retryWrites=true&w=majority";

const uri =
  "mongodb+srv://mydb1:yourpassword@cluster0.ofkrvlo.mongodb.net/?retryWrites=true&w=majority";

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    //   await client.db("services").command({ ping: 1 });
    const serviceCollection = client.db("services").collection("service");
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );

    app.post("/addServices", async (req, res) => {
      const body = req.body;
      const result = await serviceCollection.insertOne(body);
      res.send(result);
      console.log(result);
    });

    app.get("/allServices", async (req, res) => {
      const result = await serviceCollection.find().toArray();
      res.send(result);
    });

    app.delete("/remove/:id", async (req, res) => {
      const result = await serviceCollection.deleteOne({
        _id: new ObjectId(req.params.id),
      });
      console.log(result);
      res.send(result);
    });

    app.get("/singleServices/:id", async (req, res) => {
      const result = await serviceCollection.findOne({
        _id: new ObjectId(req.params.id),
      });
      res.send(result);
    });

    app.put("/updateService/:id", async (req, res) => {
      const id = req.params.id;
      const body = req.body;

      const option = {
        upsert: true,
      };
      const query = { _id: new ObjectId(id) };

      const serviceData = {
        $set: {
          name: body.name,
          email: body.email,
          message: body.message,
        },
      };

      const result = await serviceCollection.updateOne(
        query,
        serviceData,
        option
      );
      console.log(result);
      res.send(result);
    });
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.listen(port, () => {
  console.log("Server is running on port " + port);
});
