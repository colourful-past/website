import * as express from "express";
import { Server, createServer } from "http";
import { ILogger } from "extension-services";
import { spawn } from "child_process";
import {ISearchResult, ISearchItem, IColouriseResult} from "../../../common/Models";

export class WebServer {
    httpServer: Server;
    app: express.Express;

    constructor() {
        this.app = express();
        this.httpServer = createServer(this.app);

        this.app.use(express.static(__dirname + '/public'));


        this.app.get("/api/search", (req, res) => {

            var term = req.query.term;
            console.log("beginning search", {term});

            // THIS IS OBVIOUSLY FOR DEBUG / LOCAL TESTING!!
            // setTimeout(() => {
            //     var result : ISearchResult = {
            //         items: [
            //             {
            //                 originalImageUrl: "http://www.mikecann.co.uk/wp-content/uploads/2016/07/desat01.jpg",
            //                 colourisedImageUrl: "http://www.mikecann.co.uk/wp-content/uploads/2016/07/colour01.jpg",
            //                 title: "Some Blokes Walking",
            //                 description: "Taken 13,000 years ago this historic photo details some blokes walking. Walking was particularly memorable back in that time and people used to love doing it. The magical art of walking has been lost for millenia and only reccently been rediscovered in todays modern world",
            //                 source: "Digital NZ"
            //             }
            //         ]                    
            //     }
            //     res.json(result);   
            // }, 1000);

            console.log("getting data from python..");            
            const child = spawn('py', ['slwa.py', term]);
            var output_string = '';
            child.stdout.on('data', (data) => {
                output_string += data;
            });
            child.on('close', (code) => {
                //console.log(output_string)
                var items : ISearchItem[] = JSON.parse(output_string);
                console.log(items.length+" items, returning 5 of them");
                items = items.slice(0, 5);
                res.json({items});
            });

        });

         this.app.get("/api/colourise", (req, res) => {

            var url = req.query.term;

            // THIS IS OBVIOUSLY FOR DEBUG / LOCAL TESTING!!
            setTimeout(() => {
                var result : IColouriseResult = { url: "http://www.mikecann.co.uk/wp-content/uploads/2016/07/colour01.jpg" };
                res.json(result);   
            }, 1000);

        });

        this.app.get("*", (req, res) => {
            res.sendFile(__dirname + '/public/index.html');
        });
    }

    connect(port: number) {
        this.httpServer.listen(port, () => {
            console.log(`webserverr listening on *:${port}`);
        });
    }
}