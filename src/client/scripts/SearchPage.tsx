import * as React from "react";
import * as ReactDOM from "react-dom";
import {Button, Form, FormControl} from "react-bootstrap";
import * as Routes from "./Routes";

const containerStyle : React.CSSProperties = {
    display: "flex",
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center"
}

interface RouteParams {
    term: string;
}

interface Props {
    params: RouteParams;
}

export class SearchPage extends React.Component<Props, void>
{
    componentDidMount()
    {
        console.log("SearchPage opened", this.props);
    }
    
    render() {
        const term = this.props.params.term;
        return <div style={containerStyle}>
            <div>
                <h1>Searching for "{term}"..</h1>
            </div>
        </div>;
    }
}