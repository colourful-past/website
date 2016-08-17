import * as express from "express";
import { Server, createServer } from "http";
import { ILogger } from "extension-services";
import { spawn } from "child_process";
import {ISearchResult, ISearchItem, IColouriseResult} from "../../../common/Models";
import * as axios from "axios";
import * as _ from "underscore";
import * as fs from "fs";
import * as os from "os";
import * as path from "path";
import * as crypto from "crypto";

import { default as keys } from "../keys";
//const env = JSON.parse(fs.readFileSync(path.join(os.homedir(), 'keys.json'), { encoding: 'utf8' }));


// server resilience hack: we can't afford GPU boxes anymore, so at
// server startup, list our S3 bucket and generate a map in which
// to look up what search results have been colourised already
var alreadyProcessedFiles = {}
if (process.env.NODE_ENV === 'production') {
    var text = '';
    const child = spawn('/usr/local/bin/aws', ['s3', 'ls', 's3://colourful-past/', '--recursive'], { env: keys });

    child.stdout.on('data', (data) => {
      text += data;
    });
    child.stderr.on('data', (data) => {});

    child.on('close', (code) => {
      var lines = text.split('\n');
      lines.forEach((line) => {
        if (!line) { return; }
        alreadyProcessedFiles[line.substr(31)] = true;
      });
  });
}


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

            console.log("KEYS..", keys);
            

            var promises = sources.map(s => this.loadItems(term, s));
            Promise.all(promises)
                .then(sourceItems => {
                    console.log("got all source's items", {sourceItems});
                    // sourceItems = sourceItems.map(items => items.slice(0, 5));
                    var candidateItems = _.flatten(sourceItems);

                    // take all the items returned by Python, check each to see if it's been
                    // colourised already, build a new array (to return to user) with those
                    var allItems = [];
                    candidateItems.forEach(item => {
                        const hash = crypto.createHash('md5');
                        hash.update(item.originalImageUrl);
                        const outputFile = hash.digest('hex') + '.jpg';

                        if (alreadyProcessedFiles[outputFile]) {
                            allItems.push(item);
                        }
                    });

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
                // don't run the backend colouriser anymore, just point straight to the MD5-ified filename in S3
                const hash = crypto.createHash('md5');
                hash.update(url);
                const outputFile = hash.digest('hex') + '.jpg';
                res.json({ url: "https://s3-us-west-2.amazonaws.com/colourful-past/" + outputFile });

                // axios.get("http://localhost:8000/colour", { params: { url }})
                //     .then(resp =>  res.json({ url: resp.data }));
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
            const child = spawn(python_command, [path, searchTerm], { env: keys });
            var stdoutStr = '';
            var stderrStr = '';
            child.stdout.on('data', (data) => {
                stdoutStr += data;
            });
            child.stderr.on('data', (data) => {
                stderrStr += data;
            });
            child.on('close', (code) => {
                if (stderrStr)
                {
                     console.log(source, "stderr", stderrStr);
                }
                // if (stderrStr)
                // {
                //     console.error(source, "ERROR", stderrStr);
                //     resolve([]);
                // }
                // else
                // {
                try
                {
                    console.log(source, "stdout", stdoutStr)
                    var items : ISearchItem[] = JSON.parse(stdoutStr);
                    console.log(`Found ${items.length} items for source ${source}`);
                    resolve(items);   
                }
                catch(err)
                {
                        resolve([]);   
                }
                //}
            });
        });
    }

    connect(port: number) {
        this.httpServer.listen(port, () => {
            console.log(`webserverr listening on *:${port}`);
        });
    }
}