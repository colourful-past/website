import * as React from "react";
import * as ReactDOM from "react-dom";
import {Button, Form, FormControl} from "react-bootstrap";
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
        this.setState({items: resp.data.items});
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
        return <div><h1>Searching for "{term}"..</h1></div>;
    }

    renderResults() {
        const items = this.state.items;
        return <div>
            {items.map((item, i) => this.renderItem(item, i))}
        </div>;
    }

    renderItem(item:ISearchItem, index: number) {
        const isColourised = this.state.isColourised;
        console.log(item);
        
        return <div key={index}>
            <h1>{item.title}</h1>
            <div style={{ padding: 5, borderRadius: 6, border: "1px solid grey"}}>
                <img width={400} src={isColourised ? item.colourisedImageUrl : item.orginalImageUrl} />
            </div>
            <div style={{ height: 10 }} />
            <div>
                <Button onClick={() => this.setState({ isColourised: !isColourised })}>
                    { isColourised ? "Reset" : "Colourise" }
                </Button>
            </div>
            <div style={{ height: 20 }} />
            <p style={{ width: 400 }}>{item.description}</p>
        </div>
    }
}