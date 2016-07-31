import { WebServer } from "./web/WebHandler";
import { MongoClient, ObjectID } from "mongodb";

var web = new WebServer();
web.connect(process.env.PORT || 3000);