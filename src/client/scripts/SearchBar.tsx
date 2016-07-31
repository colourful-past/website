import * as React from "react";
import * as ReactDOM from "react-dom";
import {Button, Form, FormControl, Well} from "react-bootstrap";
import * as helpers from "./helpers";

const examples = [
    "Anzac Day",
    "Nature", 
    "History", 
    "Cloaks",
    "Women",
    "Bush", 
    "River", 
    "Farm",
    "Men"
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
    private isUnmounted: boolean;
    private intervalTimeMsMax : number = 80;
    private intervalTimeMsMin : number = 120;
    private timeCountMs : number = 0;
    private incrementState : string = "incrementchars"

    constructor(props:Props, context?:any)
    {
        super(props, context);
        this.state = {
            currentExample: helpers.randomOne(examples),
            currentExampleCharIndex: 0
        }
    }

    componentDidMount()
    {
        var deltaMs = helpers.getRandomDouble(this.intervalTimeMsMin, this.intervalTimeMsMax);
        setTimeout(() => this.onTick(deltaMs), deltaMs);
    }

    onTick(deltaMs:number)
    {
        if (this.isUnmounted)
            return;

        var word = this.state.currentExample;
        var charIndex = this.state.currentExampleCharIndex;
        var char = word[charIndex];
        if (this.incrementState=="incrementchars")
        {
            charIndex++;
            this.setState({ currentExampleCharIndex: charIndex });
            if (charIndex==word.length)
                this.incrementState = "waitingfornextword"
        }
        else if (this.incrementState=="waitingfornextword")
        {
            this.timeCountMs += deltaMs;
            if (this.timeCountMs>=2000)
            {
                this.setState({ currentExample: this.getNextRandomExample(), currentExampleCharIndex: 0 });
                this.incrementState = "incrementchars";
                this.timeCountMs = 0;
            }
        }

        var deltaMs = helpers.getRandomDouble(this.intervalTimeMsMin, this.intervalTimeMsMax);
        setTimeout(() => this.onTick(deltaMs), deltaMs);
    }

    getNextRandomExample() : string
    {
        var current = this.state.currentExample;
        var next = helpers.randomOne(examples);
        while(current == next)
            next = helpers.randomOne(examples);

        return next;
    }

    componentWillUnmount()
    {
        this.isUnmounted = true;
    }

    onValueChange(e:any)
    {
        var term = e.target.value;
        console.log("search term changed", {term});
        this.props.onSearchTermChanged(term);
    }

    render() {
        var {currentExample, currentExampleCharIndex} = this.state;
        var placeholder = currentExample.slice(0, currentExampleCharIndex);
        return <input onChange={e => this.onValueChange(e)} type="text" className="form-control" style={{width: 300}} 
                            placeholder={`e.g. ${placeholder}`} />;
    }
}