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
    maxWidth: 400,
    maxHeight: 400, 
    padding: 5, 
    borderRadius: 6, 
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

 var testPhotoswipeImages = [
      {
        src: 'http://lorempixel.com/1200/900/sports/1',
        w: 1200,
        h: 900,
        title: 'Image 1'
      },
      {
        src: 'http://lorempixel.com/1200/900/sports/2',
        w: 1200,
        h: 900,
        title: 'Image 2'
      },
      {
        src: 'http://lorempixel.com/1200/900/sports/3',
        w: 1200,
        h: 900,
        title: 'Image 3'
      }
    ];
 var photoswipeOptions = {
    closeOnScroll: false
};

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

    resetToOriginal()
    {

    }

    async colourise()
    {
        var item = this.state.items[this.state.currentItemIndex];
        var resp = await axios.get<IColouriseResult>("/api/colourise", { params: { url: item.originalImageUrl } });
        console.log("Image colourised, new URL: ", resp.data.url);        
        await this.preloadImage(resp.data.url);
        item.colourisedImageUrl = resp.data.url;
        item.showColourised = true;
        this.forceUpdate();
    }

    private async preloadImage(url:string) : Promise<void>
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

        return <div>
            <div style={{ position: "absolute", top: 0, left: 0, width: "100%" }}>
                <div style={{ height: 10 }} />
                <div>Showing "{term}" - {indx+1} of {items.length}</div>
                <div><a href="/">Try Again</a></div>
            </div>
            { indx !=0 ? this.renderPrevious() : null }
            { indx !=items.length-1 ? this.renderNext() : null }
            <PhotoSwipe isOpen={isPhotoswipeOpen} items={testPhotoswipeImages} options={photoswipeOptions} />
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
                <Button onClick={() => isColourised ? this.resetToOriginal() : this.colourise() }>
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