import React from 'react';

export class Auth extends React.Component{

    constructor(props){
        super(props);
        this.state = {
            show:this.props.show
        };
        this.callback = this.props.callback;
    }

    /**
     * Method to confirm that password entered corectly
     */
    confirmPassword(){
        let firstPassword = this.refs.password.value;
        let secondPassword = this.refs.confirm.value;
        let errorMsg = document.querySelector("#configHelp");

        if ( firstPassword != secondPassword ){
            this.refs.confirm.classList.add("border-danger");
            errorMsg.innerHTML = "Passwords doesn't mutch.";
        }
        else{
            this.refs.confirm.classList.remove("border-danger");
            this.refs.confirm.classList.add("border-success");            
            this.refs.password.classList.add("border-success");
            errorMsg.innerHTML = "";
        }
    }

    /**
     * Method to check password length and if it has at least one capital letter
     */
    checkPassword(){
        let password = this.refs.password.value;
        let errorMsg = document.querySelector("#passHelp");
        if ( password.length < 8 ){
            this.refs.password.classList.add("border-danger");
            errorMsg.innerHTML = "Weak password, password must contain not less then 8 symbols and at least one capital symbol";
        }
        else if ( password.match(/[A-Z]/g) != null ){
            this.refs.password.classList.remove("border-danger");
            this.refs.password.classList.add("border-success");
            errorMsg.innerHTML = "";
        }
        else if ( password ){

        }
    }

    /**
     * Method to validate email
     */
    checkEmail(){
        let email = this.refs.email.value;
        let emailHelp =  document.querySelector("#emailHelp");
        if ( (email.match(/.+?\@.+/g) || []).length === 1 ){//email type has @ and text between it
            if ( this.refs.email.classList.contains("border-danger") ){//if red border has been installed
                this.refs.email.classList.remove("border-danger");                
                this.refs.email.classList.add("border-success");
                emailHelp.innerHTML = "";
            }
            else{
                this.refs.email.classList.add("border-success");
                emailHelp.innerHTML = "";
            }
        }
        else{
            if ( this.refs.email.classList.contains("border-success") ){//if green border has been installed
                this.refs.email.classList.remove("border-success");                
                this.refs.email.classList.add("border-danger");
                emailHelp.innerHTML = "Wrong email, please enter right email address";
            }
            else{
                this.refs.email.classList.add("border-danger");
                emailHelp.innerHTML = "Wrong email, please enter right email address";
            }
        }
    }

    changeShow(show){
        event.preventDefault();
        let state = this.state;
        state.show = show;
        this.setState(state);
    }

    login(){
        event.preventDefault();
        let register = JSON.parse(localStorage.getItem("register"));
        let logData = {
            email: this.refs.email.value,
            password: this.refs.password.value,
            autologin: document.querySelector("#rememberMe").checked,
            name:''
        }
        let state = this.state;
        let loginFlag = false;
        let registerIndex;//index in registered array

        if ( register == null ){//if there is no data if register array
            alert("No registered users, please register your email");
        }

        register.forEach( (item, i)=>{
            if ( (item.email == logData.email) && (item.password == logData.password) ){//if there entered data equals to registered data
                loginFlag = true;
                registerIndex = i;
            }
        });

        if ( !loginFlag ){
            alert("Wrong email or password.");
            return;
        }
        else{
            logData.name = register[registerIndex].name;
            logData = JSON.stringify(logData);
            localStorage.setItem("auth",logData);
            alert("Your user name is "+ register[registerIndex].name);
            this.callback("login");
            console.log(logData);
        }
    }

    register(){
        event.preventDefault();
        let register = {
            email: this.refs.email.value,
            name: this.refs.userName.value,
            password: this.refs.password.value
        }
        let state = this.state;
        let localstorage = JSON.parse(localStorage.getItem("register"));
        let hasEmail = false;// flag to check if email has been registred
        if ( localstorage != null ){
            localstorage.forEach( (item,i)=>{
                if ( item.email == register.email ){
                    alert("This email has been registered already, please login or enter another email.");
                    hasEmail = true;
                }
            });
            if ( !hasEmail ){
                localstorage.push(register);
            }
            else{
                return;
            }
        }
        else{
            localstorage = [];
            localstorage.push(register);
        }
        localstorage = JSON.stringify(localstorage);
        localStorage.setItem("register",localstorage);
        state.show = "login";
        this.setState(state);
    }

    render(){
        let self = this;
        if ( self.state.show == 'register' ){
            return(
                <div className="row justify-content-center align-items-center">
                    <form className="col-4">
                        <div className="form-group">
                            <label htmlFor="UserName">User Name</label>
                            <input required ref="userName" type="text" className="shadow-none form-control" id="UserName" placeholder="User Name" />
                        </div>
                        <div className="form-group">
                            <label htmlFor="email">Email address</label>
                            <input required ref="email" onBlur={self.checkEmail.bind(self)} type="email" className="shadow-none form-control" id="email" aria-describedby="emailHelp" placeholder="Enter email" />
                            <small id="emailHelp" className="form-text text-danger"></small>
                        </div>
                        <div className="form-group">
                            <label htmlFor="password">Password</label>
                            <input required onKeyUp={self.checkPassword.bind(self)} ref="password" type="password" className="shadow-none form-control" id="password" placeholder="Password" />
                            <small id="passHelp" className="form-text text-danger"></small>                    
                        </div>
                        <div className="form-group">
                            <label htmlFor="confirmPassword">Confirm password</label>
                            <input required onKeyUp={self.confirmPassword.bind(self)} ref="confirm" type="password" className="shadow-none form-control" id="confirmPassword" placeholder="Confirm password" />
                            <small id="configHelp" className="form-text text-danger"></small>
                        </div>
                        <div className="row justify-content-center">
                            <button onClick={ self.register.bind(self) } type="submit" className="btn btn-primary">Register</button>
                        </div>
                        <div className="row justify-content-start align-items-start">
                            <a onClick={ self.changeShow.bind(self, "login") } href="#">Go to login</a>
                        </div>
                    </form>
                </div>
            );
        }
        else if ( self.state.show == 'login' ){
            return(
                <div className="row justify-content-center align-items-center">
                    <form className="col-4">
                        <div className="form-group">
                            <label htmlFor="email">Email address</label>
                            <input required ref="email" onBlur={self.checkEmail.bind(self)} type="email" className="shadow-none form-control" id="email" aria-describedby="emailHelp" placeholder="Enter email" />
                            <small id="emailHelp" className="form-text text-danger"></small>
                        </div>
                        <div className="form-group">
                            <label htmlFor="password">Password</label>
                            <input required ref="password" type="password" className="shadow-none form-control" id="password" placeholder="Password" />                 
                        </div>
                        <div className="form-group form-check">
                            <input type="checkbox" className="form-check-input" id="rememberMe" />
                            <label className="form-check-label" htmlFor="rememberMe">Remember me</label>
                        </div>
                        <div className="row justify-content-center">
                            <button onClick={self.login.bind(self)} type="submit" className="btn btn-primary">Login</button>
                        </div>
                        <div className="row justify-content-start align-items-start">
                            <a onClick={ self.changeShow.bind(self, "register") } href="#">Go to register</a>
                        </div>
                    </form>
                </div>
            );
        } 


    }

}