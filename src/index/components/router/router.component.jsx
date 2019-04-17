import React from 'react';
import { Auth } from '../auth/auth.component.jsx';
import { Exchange } from '../exchange/exchange.component.jsx';

export class Router extends React.Component{

    constructor(props){
        super(props);
        this.state = {
            page:"register",
        };
    }

    componentWillMount(){
        this.checkAuth();
    }

    checkAuth(){
        let auth = JSON.parse(localStorage.getItem("auth"));
        let state = this.state;
        if ( (auth != null) && (state.page != 'register') ){

            if ( auth.length > 1 ){
                state.page = "auth";
            }
            else if ( auth.length == 1 ){
                if ( auth.autologin ){
                    state.page = "login";
                    state.auth = 0;
                }
            }
            else {
                state.page = "auth";
            }
            this.setState(state);
        }
    }

    changeState(page){
        let state = this.state;
        state.page = page;

        this.setState(state);
    }


    render(){
        let self = this;


        if ( self.state.page == 'register' ){
            return (
                <div className="container-fluid">
                    <Auth show={self.state.page} callback={self.changeState.bind(self)} />
                </div>
            );
        }
        else if ( self.state.page == 'auth' ){
            return (
                <div className="container-fluid">
                    <Auth show={self.state.page} callback={self.changeState.bind(self)} />
                </div>
            );
        }
        else if ( self.state.page == 'login' ){
            return(
                <div className="container-fluid">
                    <Exchange />
                </div>
            );
        }

    }
}