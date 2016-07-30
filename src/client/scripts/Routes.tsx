import { Router, Route, Link, IndexRoute, browserHistory  } from 'react-router';
import * as React from "react";
import * as ReactDOM from "react-dom";
import { Layout } from "./Layout"
import { HomePage } from "./HomePage";
import { SearchPage } from "./SearchPage";

export function goto(route:string) {
    console.debug("Navigating to route: " + route);
    browserHistory.push(route); 
}

export function back()
{
    console.debug("Going back a page");
    browserHistory.goBack();
}

export const routes = <Router history={browserHistory}>

    <Route path="/" component={Layout}>
        <Route path="search/:term" component={SearchPage} />
        <IndexRoute component={HomePage} />
    </Route>
    
</Router>;

