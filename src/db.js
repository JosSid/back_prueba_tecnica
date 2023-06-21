require("dotenv").config();
const MongoClient = require("mongodb").MongoClient;
const URL = process.env.URI;
const databaseName = "develop";
var DbConnection = function () {
  var client = null;

  async function DbConnect() {
    try {
      console.log(`Connected to ${databaseName} DB`);
      var _client = new MongoClient(URL, { useUnifiedTopology: true });
      await _client.connect(URL);
      //let _db = await MongoClient.connect(URL);

      return _client;
    } catch (e) {
      console.log("ERRROR: ", e);

      return null;
    }
  }

  async function Get() {
    try {
      if (client != null) {
        return client.db(databaseName);
      } else {
        client = await DbConnect();

        return client.db(databaseName);
      }
    } catch (e) {
      return e;
    }
  }

  async function GetClient() {
    try {
      if (client != null) {
        return client;
      } else {
        client = await DbConnect();

        return client;
      }
    } catch (e) {
      return e;
    }
  }

  return { GetConection: Get, GetClient: GetClient };
};

module.exports = DbConnection();
