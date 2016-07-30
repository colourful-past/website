import * as React from "react";
import * as ReactDOM from "react-dom";
import {Button, Form, FormControl, Glyphicon} from "react-bootstrap";
import * as Routes from "./Routes";
import * as axios from "axios";
import {ISearchResult, ISearchItem} from "../../common/Models";

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

interface State {
    items? : ISearchItem[];
    currentItemIndex?: number;
    isColourised?: boolean;
}

export class SearchPage extends React.Component<Props, State>
{
    constructor(props:Props, context?:any)
    {
        super(props, context);
        this.state = {
        }
    }

    async componentDidMount()
    {
        const term = this.props.params.term;
        console.log("Searching the api...", { term });
        var resp = await axios.get<ISearchResult>("/api/search", { params: { term } });
        this.setState({items: resp.data.items, currentItemIndex: 0});
        console.log("Search result returned", resp.data)
    }
    
    render() {
        
        const isSearching = this.state.items == null;

        return <div>
            <div style={containerStyle}>
                { isSearching ? this.renderSearching() : this.renderResults() }                
            </div>
        </div>;
    }

    renderSearching() {
        const term = this.props.params.term;
        return <div style={containerStyle}>
                <h1>Searching for "{term}"..</h1>              
            </div>;
            
    }

    renderResults() {
        const items = this.state.items;
        const indx = this.state.currentItemIndex;
        const term = this.props.params.term;

        if (items.length==0)
            return this.renderNoItems();

        return <div>
            <div style={{ position: "absolute", top: 0, left: 0, width: "100%" }}>
                <div style={{ height: 10 }} />
                <div>Showing "{term}" - {indx+1} of {items.length}</div>
                <div><a href="/">Try Again</a></div>
            </div>
            <div style={{ position: "absolute", top: 0, left: 20, height: "100%", justifyContent:"center", 
                display: "flex", alignItems:"center" }}>
                <Button><i className="glyphicon glyphicon-triangle-left" /> Previous</Button>
            </div>
            <div style={{ position: "absolute", top: 0, right: 20, height: "100%", justifyContent:"center", 
                display: "flex", alignItems:"center" }}>
                <Button>Next <i className="glyphicon glyphicon-triangle-right" /></Button>
            </div>
            <div style={containerStyle}>
                {this.renderItem(items[indx], indx)}
            </div>
        </div>
    }

    renderNoItems()
    {
        const term = this.props.params.term;
        return <div style={containerStyle}>
                <div>
                    <h1>Whoops, no items found for "{term}". </h1>
                    <h3><a href="/">Try Again</a></h3>
                </div>                          
            </div>;
    }

    renderItem(item:ISearchItem, index: number) {
        const isColourised = this.state.isColourised;
        console.log(item);
        
        return <div key={index} style={{marginTop: 60}}>
            <h1>{item.title}</h1>
            <div style={{ padding: 5, borderRadius: 6, border: "1px solid grey"}}>
                <img width={400} src={isColourised ? item.colourisedImageUrl : item.originalImageUrl} />
            </div>
            <div style={{ height: 10 }} />
            <div>
                <Button onClick={() => this.setState({ isColourised: !isColourised })}>
                    { isColourised ? "Reset" : "Colourise" }
                </Button>
            </div>
            <div style={{ height: 20 }} />
            <p style={{ width: 400 }}>{item.description}</p>
            <div style={{ height: 20 }} />
            <p style={{ fontStyle: "italic" }}>Source: {item.source}</p>
        </div>
    }
}