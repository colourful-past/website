import { WebServer } from "./web/WebHandler";
import { MongoClient, ObjectID } from "mongodb";
import { default as config } from "./config";

MongoClient.connect(config.dbURI, (err, db) => {
    if (err)
        throw new Error("Error connecting to mongo: "+err);

    var web = new WebServer();
    web.connect(process.env.PORT || 3000);
});