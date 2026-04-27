const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");

let mongod;

async function startMongo() {
  mongod = await MongoMemoryServer.create();
  const uri = mongod.getUri();
  await mongoose.connect(uri);
}

async function stopMongo() {
  await mongoose.disconnect();
  if (mongod) await mongod.stop();
}

async function clearMongo() {
  const collections = mongoose.connection.collections;
  // eslint-disable-next-line no-restricted-syntax
  for (const key of Object.keys(collections)) {
    // eslint-disable-next-line no-await-in-loop
    await collections[key].deleteMany({});
  }
}

module.exports = { startMongo, stopMongo, clearMongo };

