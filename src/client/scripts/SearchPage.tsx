import * as React from "react";
import * as ReactDOM from "react-dom";
import {Button, Form, FormControl, Glyphicon} from "react-bootstrap";
import * as Routes from "./Routes";
import * as axios from "axios";
import {ISearchResult, ISearchItem, IColouriseResult} from "../../common/Models";
import {PhotoSwipe} from "react-photoswipe";
import * as helpers from "./helpers";

const containerStyle : React.CSSProperties = {
    display: "flex",
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center"
}

const imgStyle : React.CSSProperties = {
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
    location: { query: { sources:string } };
}

interface State {
    items? : ISearchItem[];
    currentItemIndex?: number;
    isPhotoswipeOpen?: boolean;
}

const colourisingMessages = [
    "Sending Machine Learning robots back in time...",
    "Sciencing the hell out of it...",
    "Applying clever things to make pretty things...",
    "Firing up Skynet...",
    "Machine Learning doing its thing...",
    "Powered by microservices!",
    "The cake is a lie.",
    "Powered by determination and croissants..",
    "Colour all the things..",
    "Rewriting everything in Malbolge..",
    "Gotta colour 'em all!"
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
        const sources = this.props.location.query.sources.split(",");
        console.log("Searching the api...", { term });
        axios.get<ISearchResult>("/api/search", { params: { term, sources } })
            .then(resp => {
                console.log("Search result returned", resp.data);
                this.setState({items: resp.data.items});
                this.setCurrentItemIndex(0);
            });        
    }

    setCurrentItemIndex(indx:number)
    {
        var item = this.state.items[indx];
        console.log("Current item index set", {indx, item});
        this.setState({currentItemIndex: indx});
        if (!item.colourisedImageUrl && !item.colourisePromise)
            item.colourisePromise = this.precolouriseAndPreload(item);
    }

    resetToOriginal()
    {
        console.log("resetting to original");        
        var item = this.state.items[this.state.currentItemIndex];
        item.showColourised = false;
        this.forceUpdate();
    }

    colourise()
    {
        console.log("colourising..");        
        var item = this.state.items[this.state.currentItemIndex];
        item.isColourising = true;
        this.forceUpdate();
        helpers.wait(1500)
            .then(() => item.colourisePromise)
            .then(() => {                
                item.isColourising = false;
                item.showColourised = true;
                this.forceUpdate();
            });
    }

    private precolouriseAndPreload(item:ISearchItem) : Promise<void>
    {
        console.log("precolouriseAndPreload", {item});
         return axios.get<IColouriseResult>("/api/colourise", { params: { url: item.originalImageUrl } })
            .then(resp => {
                console.log("Image colourised, new URL: ", resp.data.url);  
                item.colourisedImageUrl = resp.data.url;      
                return this.preloadImage(resp.data.url)
            })
            .then(() => {
                item.isPreloaded = true;
            });
    }

    private preloadImage(url:string) : Promise<void>
    {
        console.log("preloading image..", {url});        
        return new Promise<void>((resolve, reject) => {
            var img=new Image();
            img.onload = ()=> {
                console.log("image preloaded");
                resolve();          
            }
            img.src=url;
        });        
    }
    
    render() {
        const isSearching = this.state.items == null;
        return <div>
            <div className="result-body" style={containerStyle}>
                { isSearching ? this.renderSearching() : this.renderResults() }            
            </div>
        </div>;
    }

    renderSearching() {
        const term = this.props.params.term;
        setTimeout(() => {
            document.querySelector('.result-body').classList.add('search-animation')
            document.querySelector('h1.searching img.arrow').classList.add('spinner-animation')
        }, 600)
        return <h1 className="searching">
            <div className="spinner-image-block">
                <img src="/colour-arrow.png" className="arrow" />
                <img src="/colour-hands.png" className="hands" />
            </div>
            Searching for “{term}”
        </h1>;            
    }

    renderResults() {
        const {items, isPhotoswipeOpen} = this.state;
        const indx = this.state.currentItemIndex;    

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
            {this.renderItem(items[indx], indx)}
        </div>
    }

    renderPrevious()
    {
         const indx = this.state.currentItemIndex;
        return <div className="item-button" style={{ left: 0 }} onClick={() => this.setCurrentItemIndex(indx-1)}>
                <div className="button"><i className="glyphicon glyphicon-triangle-left" /></div>
            </div>;
    }

    renderNext()
    {
         const indx = this.state.currentItemIndex;
        return <div className="item-button" style={{ right: 0 }} onClick={() => this.setCurrentItemIndex(indx+1)}>
                <div className="button"><i className="glyphicon glyphicon-triangle-right" /></div>
            </div>;
    }

    renderNoItems()
    {
        const term = this.props.params.term;
        return <div style={containerStyle}>
                <div>
                    <h1>Whoops, no items found for “{term}”. </h1>
                    <h3><a href="/">Try Again</a></h3>
                </div>                          
            </div>;
    }

    renderItem(item:ISearchItem, index: number) {
        const {items, isPhotoswipeOpen} = this.state;
        const isColourised = item.showColourised;
        const colourUrl = item.colourisedImageUrl ? item.colourisedImageUrl : '';
        const indx = this.state.currentItemIndex;       
        const term = this.props.params.term;     
        
        return <div key={index} className="searchItem">
            <div className="image-cover" ref="original" style={{ backgroundImage: 'url(' + item.originalImageUrl + ')', opacity: (isColourised ? 0 : 1) }}></div>
            <div className="image-cover" ref="colour" style={{ backgroundImage: 'url(' + colourUrl + ')', opacity: (isColourised ? 1 : 0) }}></div>
            <div className="item-new-search">
                <div className="search-results-description">
                    <p>Searched for "{term}"</p>
                    <p>{indx+1} of {items.length}</p>
                </div>
                <a className="big-button" href="/">New search</a>
            </div>
            <div className="colourise">
                { item.isColourising ? 
                    helpers.randomOne(colourisingMessages) :
                    <a href="#" className="big-button" onClick={() => isColourised ? this.resetToOriginal() : this.colourise() }>
                        { isColourised ? "Reset" : "Bring to life!" }
                    </a>
                }
            </div>
            <div className="item-bottom-block">
                <h1 className="item-title">
                    <a href={item.source_url} className="item-title-background">{item.title}</a>
                </h1>
                <p className="item-description">{item.description}</p>
                <p className="item-source">
                    <a href={item.source_url}>Source: {item.source}</a>
                </p>
            </div>
            { indx !=0 ? this.renderPrevious() : null }
            { indx !=items.length-1 ? this.renderNext() : null }
        </div>
    }
}