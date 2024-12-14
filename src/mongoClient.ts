import { MongoClient } from "mongodb";
import config from "./config";

const uri = config.db.uri; // Replace with your MongoDB URI
const client = new MongoClient(uri);

async function insertData() {
  try {
    await client.connect();
    const database = client.db("carSearch");
    const collection = database.collection("cars");

    const data = [ /* Paste the JSON array here */ ];

    const result = await collection.insertMany(data);
    console.log(`${result.insertedCount} documents were inserted.`);
  } finally {
    await client.close();
  }
}

insertData().catch(console.error);