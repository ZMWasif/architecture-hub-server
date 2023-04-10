const express = require("express");
const cors = require("cors");

require("dotenv").config();
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const app = express();
/* middleware */
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.oaavx56.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});
async function run() {
  try {
    await client.connect();
    const demosCollection = client.db("archub").collection("demos");

    app.get("/demos", async (req, res) => {
      const query = {};
      const cursor = demosCollection.find(query);
      const demos = await cursor.toArray();
      res.send(demos);
    });

    app.get("/demos/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const demo = await demosCollection.findOne(query);
      res.send(demo);
    });

    /* POST */

    app.post("/demos", async (req, res) => {
      const newDemo = req.body;
      const result = await demosCollection.insertOne(newDemo);
      res.send(result);
    });

    /* Delete */
    app.delete("/demos/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await demosCollection.deleteOne(query);
      res.send(result);
    });
  } finally {
  }
}

run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Running my node CRUD server");
});

app.listen(port, () => {
  console.log("CRUD Server is running", port);
});
