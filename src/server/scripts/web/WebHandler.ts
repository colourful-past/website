import * as express from "express";
import { Server, createServer } from "http";
import { ILogger } from "extension-services";
import { spawn } from "child_process";
import {ISearchResult, ISearchItem, IColouriseResult, dataSources} from "../../../common/Models";
import * as axios from "axios";
import * as _ from "underscore";

export class WebServer {
    httpServer: Server;
    app: express.Express;

    constructor() {
        this.app = express();
        this.httpServer = createServer(this.app);

        this.app.use(express.static(__dirname + '/public'));


        this.app.get("/api/search", (req, res) => {

            var term : string = req.query.term;
            var sources : string[] = req.query.sources;
            console.log("beginning search", {term, sources});

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

            var promises = sources.map(s => this.loadItems(term, s));
            Promise.all(promises)
                .then(sourceItems => {
                    console.log("got all source's items", {sourceItems});
                    sourceItems = sourceItems.map(items => items.slice(0, 5));
                    var allItems = _.flatten(sourceItems);
                    console.log("flattened items", {allItems});
                    allItems = _.shuffle(allItems);
                    console.log("shuffled items", {allItems});
                    res.json({ items: allItems });
                })

        });

         this.app.get("/api/colourise", (req, res) => {

            var url = req.query.url;

            console.log("attempting to colourise", {url});
            

            if (process.env.NODE_ENV === 'production') { 
                axios.get("http://localhost:8000/colour", { params: { url }})
                    .then(resp =>  res.json({ url: resp.data }));
            }
            else
            {
                // THIS IS OBVIOUSLY FOR DEBUG / LOCAL TESTING!!
                setTimeout(() => {
                    var result : IColouriseResult = { url: "http://www.mikecann.co.uk/wp-content/uploads/2016/07/colour01.jpg" };
                    res.json(result);   
                }, 1000);
             }
        });

        this.app.get("*", (req, res) => {
            res.sendFile(__dirname + '/public/index.html');
        });
    }

    loadItems(searchTerm:string, source:string) : Promise<ISearchItem[]>
    {
        return new Promise<ISearchItem[]>((resolve, reject) => {
            var path = source+'.py';
            var python_command = 'python';

            if (process.env.NODE_ENV === 'production') {
                python_command = '/usr/bin/python';
                path = `/home/ubuntu/information-acquisition/${source}.py`;
            }

            console.log("searching source for items..", {searchTerm, source});            
            const child = spawn(python_command, [path, searchTerm]);
            var output_string = '';
            child.stdout.on('data', (data) => {
                output_string += data;
            });
            child.on('close', (code) => {
                console.log(source, " =====> ", output_string)
                var items : ISearchItem[] = JSON.parse(output_string);
                console.log(`Found ${items.length} items for source ${source}`);
                resolve(items);                
            });
        });
    }

    connect(port: number) {
        this.httpServer.listen(port, () => {
            console.log(`webserverr listening on *:${port}`);
        });
    }
}