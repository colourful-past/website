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

interface Props {

}

interface State {
}

export class HomePage extends React.Component<Props, State>
{
    private inputEl : HTMLInputElement;

    componentDidMount()
    {
        console.log("HomePage opened");
    }

    onSubmit(e:React.FormEvent)
    {
        e.preventDefault();
        
        var term = this.inputEl.value;
        if (!term)
            return;

        Routes.goto(`search/${term}`)
    }

    render() {
        return <div style={containerStyle}>
            <div>
                <h1>Colourful Past</h1>
                <h4>See yesterday like you captured it today</h4>
                <div style={{ height: 10 }} />

                <form className="form-inline" onSubmit={e => this.onSubmit(e)}>
                    <div className="form-group">
                        <input ref={_ => this.inputEl = _} type="text" className="form-control" style={{width: 300}} 
                            placeholder="e.g. anzac day" />
                    </div>
                    {' '}
                    <button type="submit" className="btn btn-default">Search...</button>
                </form>

            </div>
        </div>;
    }
}