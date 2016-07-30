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
            showDataSources: false,
            selectedDataSources: dataSources.map(ds => ds.code)
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

    toggleDataSource(ds_code)
    {
        var indx = this.state.selectedDataSources.indexOf(ds_code);
        var isChecked = indx != -1;
        if (isChecked)
            this.state.selectedDataSources.splice(indx, 1);
        else
            this.state.selectedDataSources.push(ds_code);
            
        this.forceUpdate();
    }

    render() {
        return <div style={containerStyle}>
            <div>
                <h1 className="welcome">Colourful Past</h1>
                <h4>See yesterday like you captured it today</h4>
                <div className="explanation">What part of history would you like to see?</div>

                <form className="form-inline" onSubmit={e => this.onSubmit(e)}>
                    <div className="homepage-search">
                        <input ref={_ => this.inputEl = _} type="text" className="form-control" style={{width: 300}} 
                            placeholder="e.g. anzac day" />
                        <button type="submit" disabled={this.state.selectedDataSources.length==0} className="btn btn-default">Search...</button>
                    </div>
                    <div className={ this.state.showDataSources ? "show-sources" : "show-sources open" }>
                        <a href="#" onClick={() => this.state.showDataSources ? this.setState({ showDataSources: false }) : this.setState({ showDataSources: true })}>
                            <i className="glyphicon glyphicon-triangle-bottom"></i> Show sources
                        </a>
                    </div>
                    <div className={ this.state.showDataSources ? "source-selector open" : "source-selector"}>
                        {dataSources.map(ds => this.renderDataSourceCheck(ds))}
                    </div>                   
                </form>

                <div className="attribution">
                    based on <a href="http://richzhang.github.io/colorization/">Colorful Image Colorization</a> by Zhang, et. al
                </div>
            </div>
        </div>;
    }

    renderDataSourceCheck(ds)
    {
        var isChecked = this.state.selectedDataSources.indexOf(ds.code) != -1;
        return <div className="source-checkbox">
            <label>
                <input type="checkbox" checked={isChecked} onChange={() => this.toggleDataSource(ds.code)} /> { ds.name }
            </label>
        </div>;
    }
}