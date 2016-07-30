import * as React from "react";
import * as ReactDOM from "react-dom";
import {routes} from "./Routes";

import '../../../node_modules/photoswipe/dist/photoswipe.css';
import '../../../node_modules/photoswipe/dist/default-skin/default-skin.css';
import "../resources/index.css";

ReactDOM.render(routes, document.getElementById('root')); 