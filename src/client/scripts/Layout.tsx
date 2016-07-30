import * as React from "react";
import * as ReactDOM from "react-dom";
import { Input, Button, Tabs, Tab, Alert, ButtonToolbar } from 'react-bootstrap';

interface Props extends React.Props<any> {
}

interface State extends React.Props<any> {
}

export class Layout extends React.Component<Props, State> {

    constructor(props: Props, context) {
        super(props, context);
        this.state = {
        };
    }
    
    render() {
        
        return <div>
            {/*<Header />*/}            
            <div>
                { this.props.children }
            </div>                        
        </div>;
    }
}