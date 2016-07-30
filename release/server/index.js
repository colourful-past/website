/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	const WebHandler_1 = __webpack_require__(1);
	const mongodb_1 = __webpack_require__(4);
	const config_1 = __webpack_require__(5);
	mongodb_1.MongoClient.connect(config_1.default.dbURI, (err, db) => {
	    if (err)
	        throw new Error("Error connecting to mongo: " + err);
	    var web = new WebHandler_1.WebServer();
	    web.connect(process.env.PORT || 3000);
	});


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	const express = __webpack_require__(2);
	const http_1 = __webpack_require__(3);
	class WebServer {
	    constructor() {
	        this.app = express();
	        this.httpServer = http_1.createServer(this.app);
	        this.app.use(express.static(__dirname + '/public'));
	        this.app.get("*", (req, res) => {
	            res.sendFile(__dirname + '/public/index.html');
	        });
	    }
	    connect(port) {
	        this.httpServer.listen(port, () => {
	            console.log(`webserverr listening on *:${port}`);
	        });
	    }
	}
	exports.WebServer = WebServer;


/***/ },
/* 2 */
/***/ function(module, exports) {

	module.exports = require("express");

/***/ },
/* 3 */
/***/ function(module, exports) {

	module.exports = require("http");

/***/ },
/* 4 */
/***/ function(module, exports) {

	module.exports = require("mongodb");

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	const fs = __webpack_require__(6);
	// Example config structure
	var config = {
	    dbURI: "CHANGE_ME",
	    jwtSecret: "CHANGE_ME",
	    sendGridKey: "CHANGE_ME"
	};
	// Check the config is actually there
	var configFile = __dirname + "/config.json";
	console.log("Loading config.json from: " + configFile);
	if (!fs.existsSync(configFile))
	    throw new Error("You must define a config.json file in /resources/, see config.ts for an example of its contents");
	// Load its values
	config = JSON.parse(fs.readFileSync(configFile, "utf8"));
	console.log("Config loaded!");
	exports.default = config;


/***/ },
/* 6 */
/***/ function(module, exports) {

	module.exports = require("fs");

/***/ }
/******/ ]);
//# sourceMappingURL=index.js.map