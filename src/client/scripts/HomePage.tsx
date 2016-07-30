import * as React from "react";
import * as ReactDOM from "react-dom";
import {Button, Form, FormControl, Well} from "react-bootstrap";
import * as Routes from "./Routes";
import {dataSources} from "../../common/Models";

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
    selectedDataSources?: string[];
}

export class HomePage extends React.Component<Props, State>
{
    private inputEl : HTMLInputElement;

    constructor(props:Props, context?:any)
    {
        super(props, context);
        this.state = {
            selectedDataSources: dataSources.slice()
        }
    }

    componentDidMount()
    {
        console.log("HomePage opened");
    }

    onSubmit(e:React.FormEvent)
    {
        e.preventDefault();

        var sources = this.state.selectedDataSources;
        
        if (sources.length==0)
            return;
        
        var term = this.inputEl.value;
        if (!term)
            return;

        Routes.goto(`search/${term}?sources=${sources.join(',')}`)
    }

    toggleDataSource(ds:string)
    {
        var indx = this.state.selectedDataSources.indexOf(ds);
        var isChecked = indx != -1;
        if (isChecked)
            this.state.selectedDataSources.splice(indx, 1);
        else
            this.state.selectedDataSources.push(ds);
            
        this.forceUpdate();
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
                    <button type="submit" disabled={this.state.selectedDataSources.length==0} className="btn btn-default">Search...</button>
                    <div style={{ height: 10 }} />
                    <div className="well" style={{display:"flex", maxWidth: 400}}>
                        {dataSources.map(m => this.renderDataSourceCheck(m))}
                    </div>                   
                </form>

            </div>
        </div>;
    }

    renderDataSourceCheck(ds:string)
    {
        var isChecked = this.state.selectedDataSources.indexOf(ds) != -1;
        return <div style={{ width: 150 }}>
            <label>
                <input type="checkbox" checked={isChecked} onChange={() => this.toggleDataSource(ds)} /> { ds }
            </label>
        </div>;
    }
}