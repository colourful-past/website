import * as express from "express";
import { Server, createServer } from "http";
import { ILogger } from "extension-services";
import { spawn } from "child_process";
import {ISearchResult} from "../../../common/Models";

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

            setTimeout(() => {
                var result : ISearchResult = {
                    items: [
                        {
                            orginalImageUrl: "http://www.mikecann.co.uk/wp-content/uploads/2016/07/desat01.jpg",
                            colourisedImageUrl: "http://www.mikecann.co.uk/wp-content/uploads/2016/07/colour01.jpg",
                            title: "Some blokes walking",
                            description: "Taken 13,000 years ago this historic photo details some blokes walking. Walking was particularly memorable back in that time and people used to love doing it. The magical art of walking has been lost for millenia and only reccently been rediscovered in todays modern world"
                        }
                    ]                    
                }
                res.json(result);   
            }, 2000);

            // const child = spawn('python', ['script.py', term]);
            // var output_string = '';
            // child.stdout.on('data', (data) => {
            //     output_string += data;
            // });
            // child.on('close', (code) => {
            //     console.log(output_string);
            // });

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