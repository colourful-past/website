import * as React from "react";
import * as ReactDOM from "react-dom";
import {Button, Form, FormControl, Well} from "react-bootstrap";

const examples = [
    "anzac day",
    "mikes birthday",
    "that day the blokes walked"
]

interface Props {
    onSearchTermChanged: (term:string)=> void;
}

interface State {
    currentExample?: string;
    currentExampleCharIndex?: number;
}

export class SearchBar extends React.Component<Props, State>
{
    constructor(props:Props, context?:any)
    {
        super(props, context);
        var index = Math.floor(Math.random()*examples.length);
        this.state = {
            currentExample: examples[index],
            currentExampleCharIndex: 0
        }
    }

    onValueChange(e:any)
    {
        var term = e.target.value;
        console.log("search term changed", {term});
        this.props.onSearchTermChanged(term);
    }

    render() {

        var placeholder = this.state.currentExample;
        return <input onChange={e => this.onValueChange(e)} type="text" className="form-control" style={{width: 300}} 
                            placeholder={`e.g. ${placeholder}`} />;
    }
}