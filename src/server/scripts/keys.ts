import * as fs from "fs";
import * as path from "path";

// Example config structure
var keys = {
  "DIGITAL_NZ_API_KEY": "CHANGEME",
  "FLICKR_API_KEY": "CHANGEME",
  "FLICKR_SECRET": "CHANGEME",
  "AWS_ACCESS_KEY_ID": "CHANGEME",
  "AWS_SECRET_ACCESS_KEY": "CHANGEME"
}

// Check the config is actually there
var keysFile = __dirname + "/keys.json";
console.log("Loading keys.json from: "+keysFile);
if (!fs.existsSync(keysFile))
    throw new Error("You must define a keys.json file in /resources/, see keys.ts for an example of its contents");

// Load its values
keys = JSON.parse(fs.readFileSync(keysFile, "utf8"));
console.log("Config loaded!");

// Allow the rest of the app to use
export default keys;