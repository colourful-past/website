import * as React from "react";
import * as ReactDOM from "react-dom";
import {Button, Form, FormControl, Glyphicon} from "react-bootstrap";
import * as Routes from "./Routes";
import * as axios from "axios";
import {ISearchResult, ISearchItem, IColouriseResult} from "../../common/Models";
import {PhotoSwipe} from "react-photoswipe";

const containerStyle : React.CSSProperties = {
    display: "flex",
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center"
}

const imgStyle : React.CSSProperties = {
    maxWidth: 600,
    maxHeight: 500, 
    padding: 5, 
    borderRadius: 6,
    cursor: "pointer",
    border: "1px solid grey"
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
    isPhotoswipeOpen?: boolean;
}

const colourisingMessages = [
    "Sending Machine Learning robots back in time..",
    "Sciencing the hell out of it..",
    "Applying clever things to make pretty things..",
    "Firing up Skynet..",
    "Machine Learning doing its thing.."
]

export class SearchPage extends React.Component<Props, State>
{
    constructor(props:Props, context?:any)
    {
        super(props, context);
        this.state = {
            isPhotoswipeOpen: false,
            currentItemIndex: 0,
            items: null
        }
    }

    componentDidMount()
    {
        console.log("Opening search page with props..", this.props);        
        const term = this.props.params.term;
        console.log("Searching the api...", { term });
        axios.get<ISearchResult>("/api/search", { params: { term } })
            .then(resp => {
                this.setState({items: resp.data.items, currentItemIndex: 0});
                console.log("Search result returned", resp.data)
            });        
    }

    resetToOriginal()
    {
        var item = this.state.items[this.state.currentItemIndex];
        item.showColourised = false;
        this.forceUpdate();
    }

    colourise()
    {
        var item = this.state.items[this.state.currentItemIndex];
        item.isColourising = true;
        this.forceUpdate();
        axios.get<IColouriseResult>("/api/colourise", { params: { url: item.originalImageUrl } })
            .then(resp => {
                console.log("Image colourised, new URL: ", resp.data.url);  
                item.colourisedImageUrl = resp.data.url;      
                return this.preloadImage(resp.data.url)
            })
            .then(() => {
                item.showColourised = true;
                item.isColourising = false;
                this.forceUpdate();
            });
    }

    private preloadImage(url:string) : Promise<void>
    {
        console.log("preloading image..");        
        return new Promise<void>((resolve, reject) => {
            var img=new Image();
            img.onload = ()=> resolve();          
            img.src=url;
        });        
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
        const {items, isPhotoswipeOpen} = this.state;
        const indx = this.state.currentItemIndex;        
        const term = this.props.params.term;

        if (items.length==0)
            return this.renderNoItems();

        const item = items[indx];

        var photoswipeImages = [
        {
            src: item.showColourised ? item.colourisedImageUrl : item.originalImageUrl,
            w: 1200,
            h: 900,
            title: item.title
        }];

        return <div>
            <div style={{ position: "absolute", top: 0, left: 0, width: "100%" }}>
                <div style={{ height: 10 }} />
                <div>Showing "{term}" - {indx+1} of {items.length}</div>
                <div><a href="/">Try Again</a></div>
            </div>
            { indx !=0 ? this.renderPrevious() : null }
            { indx !=items.length-1 ? this.renderNext() : null }
            <PhotoSwipe isOpen={isPhotoswipeOpen} items={photoswipeImages} options={{ }} 
                onClose={()=> this.setState({ isPhotoswipeOpen: false })} />
            <div style={containerStyle}>
                {this.renderItem(items[indx], indx)}
            </div>
        </div>
    }

    renderPrevious()
    {
         const indx = this.state.currentItemIndex;
        return <div style={{ position: "absolute", top: 0, left: 20, height: "100%", justifyContent:"center", 
                display: "flex", alignItems:"center" }}>
                <Button onClick={() => this.setState({currentItemIndex: indx-1})}><i className="glyphicon glyphicon-triangle-left" /> Previous</Button>
            </div>;
    }

    renderNext()
    {
         const indx = this.state.currentItemIndex;
        return <div style={{ position: "absolute", top: 0, right: 20, height: "100%", justifyContent:"center", 
                display: "flex", alignItems:"center" }}>
                <Button onClick={() => this.setState({currentItemIndex: indx+1})}>Next <i className="glyphicon glyphicon-triangle-right" /></Button>
            </div>;
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
        const isColourised = item.showColourised;
        console.log(item);
        
        return <div key={index} style={{marginTop: 60}}>
            <h1>{item.title}</h1>
            <div>
                <img style={imgStyle} src={isColourised ? item.colourisedImageUrl : item.originalImageUrl}
                    onClick={() => this.setState({isPhotoswipeOpen: true})} />
            </div>
            <div style={{ height: 10 }} />
            <div>
                { item.isColourising ? 
                    colourisingMessages[Math.floor(Math.random()*colourisingMessages.length)] :
                    <Button onClick={() => isColourised ? this.resetToOriginal() : this.colourise() }>
                        { isColourised ? "Reset" : "Colourise" }
                    </Button>
                }                
            </div>
            <div style={{ height: 20 }} />
            <p style={{ width: 400 }}>{item.description}</p>
            <div style={{ height: 20 }} />
            <p style={{ fontStyle: "italic" }}>Source: {item.source}</p>
        </div>
    }
}