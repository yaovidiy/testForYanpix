import React from 'react';
import axios from 'axios';

export class Exchange extends React.Component{

    constructor(props){
        super(props);
        this.state = {
            pair:[
                {
                    from: 'EUR',
                    to: 'UAH',
                    bid:'',
                    ask:''
                }
            ]
        }
        this.updateTime = 1000;
        this.key = 0;
        this.interval;
        this.newRates = false;
    }

    /**
     * Method to add new pair to Result part
     *
     * @param {str} to - currency label
     * @memberof Exchange
     */
    addToResults(to){
        let state = this.state;

        if ( to != 'list' ){
            state.pair.push({ from:'EUR', to:to, bid:'', ask:''});
        }
        else{
            state.pair.push({ from:'EUR', to:this.refs.to.value, bid:'', ask:''});            
        }
        this.newRates = true;
        this.setState(state);
        this.updateRates();
    }

    /**
     * update time and bids if needed
     *
     * @memberof Exchange
     */
    updateTimstamp(){

        this.interval = setInterval(() => {
            let date = new Date();
            let year,month,day,hour,minute,seconds;
            month = "0"+(date.getMonth() + 1);
            year = date.getFullYear();
            day = date.getDate();
            hour =  ( date.getHours() > 9 ) ? date.getHours() : "0"+date.getHours();
            minute =  ( date.getMinutes() > 9 ) ? date.getMinutes() : "0"+date.getMinutes();
            seconds =  ( date.getSeconds() > 9 ) ? date.getSeconds() : "0"+date.getSeconds();
            this.refs.time.innerHTML = day+"."+month+"."+year+" "+hour+":"+minute+":"+seconds;
            this.updateRates();            
        }, this.updateTime);

    }

    /**
     * remove from Result part
     *
     * @param {int} id
     * @memberof Exchange
     */
    removeResult(id){
        let state = this.state;
        let temp = [];
        state.pair.forEach( (item,i)=>{
            if ( i != id ){
                temp.push(item);
            }
        });
        state.pair = JSON.parse(JSON.stringify(temp));

        this.setState(state);
    }

    /**
     * sets new time for interval
     *
     * @memberof Exchange
     */
    setNewinterval(){
        this.updateTime = this.refs.timer.value;
        console.log(this.updateTime);
        let state = this.state;
        this.setState(state);
    }

    componentWillUpdate(){
        clearInterval(this.interval);
        this.updateTimstamp();
    }

    componentWillMount(){
        this.updateRates();
    }

    /**
     * Generate new key for map in react
     *
     * @returns
     * @memberof Exchange
     */
    genNewKey(){
        this.key++;
        return this.key;
    }

    /**
     * Updating Rates by fixer.io api
     *
     * @memberof Exchange
     */
    updateRates(){
        axios.get("http://data.fixer.io/api/latest?access_key=79d1974895107911a189b117a5bbd2a7")
        .then( res =>{
            let state = this.state;
            let temp = [];

            state.pair.forEach( (item,i)=>{//busting an state array
                if ( ( item.bid != res.data.rates[item.to] || this.newRates ) ){//if bids change changing results
                    temp.push({ from:item.from, to:item.to, bid:res.data.rates[item.to], ask:res.data.rates[item.to] });
                }
            });
            if ( temp.length == 0 ){//if no update exiting from method
                return;
            }
            state = JSON.parse(JSON.stringify({pair:temp}));
            this.newRates = false;
            this.setState(state);
        })
        .catch( res=>{
            alert("API error!");
            console.log(res);
        } )
    }

    render(){
        let self = this;

        return(
            <div className="">
                <div className="row">
                    <div className="col-12 col-sm-12 col-lg-12 col-md-12 text-center">
                        <h5>Online Exchange Rate</h5>
                        <span>Update time </span><span ref="time"></span>
                    </div>
                    <div className="col-12 col-sm-12 col-md-6 col-lg-6">
                        <strong>Settings</strong>
                    </div>
                    <div className="col-12 col-sm-12 col-md-6 col-lg-6">
                        <strong>Rates</strong>
                    </div>
                </div>
                <div className="row">
                    <div className="col-12 col-sm-12 col-md-6 col-lg-6 row">
                        <div className="col-8 col-sm-8 col-md-8 col-lg-8">
                            Refresh
                        </div>
                        <div className="col-4 col-sm-4 col-md-4 col-lg-4">
                            <select defaultValue={this.updateTime} onChange={ self.setNewinterval.bind(self) } name="timer" ref="timer">
                                <option value="1000">1 second</option>
                                <option value="5000">5 second</option>
                                <option value="10000">10 second</option>
                                <option value="20000">20 second</option>
                            </select>
                        </div>
                    </div>
                    <div className="col-6 col-sm-6 col-md-6 col-lg-6 row">
                        <div className="col-3 col-sm-3 col-md-3 col-lg-3">
                            <strong>Pair</strong>
                        </div>
                        <div className="col-3 col-sm-3 col-md-3 col-lg-3">
                            <strong>Bid</strong>
                        </div>
                        <div className="col-3 col-sm-3 col-md-3 col-lg-3">
                            <strong>Ask</strong>
                        </div>
                        <div className="col-3 col-sm-3 col-md-3 col-lg-3">
                            
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-6 col-sm-6 col-md-6 col-lg-6">
                        <strong>Symbols</strong>
                    </div>
                    <div className="col-6 col-sm-6 col-md-6 col-lg-6">
                        <strong>Results</strong>
                    </div>
                </div>
                <div className="row">
                    <div className="col-6 col-sm-6 col-md-6 col-lg-6 row align-items-center">
                        <div className="col-8 col-sm-8 col-md-8 col-lg-8">
                            EUR/USD
                        </div>
                        <div className="col-4 col-sm-4 col-md-4 col-lg-4 mb-3">
                            <button onClick={ self.addToResults.bind(self, "USD") } className="btn btn-success">Add</button>
                        </div>
                        <div className="col-8 col-sm-8 col-md-8 col-lg-8">
                            EUR/GBP
                        </div>
                        <div className="col-4 col-sm-4 col-md-4 col-lg-4 mb-3">
                            <button onClick={ self.addToResults.bind(self, "GBP") } className="btn btn-success">Add</button>                        
                        </div>
                        <div className="col-8 col-sm-8 col-md-8 col-lg-8">
                            EUR/UAH
                        </div>
                        <div className="col-4 col-sm-4 col-md-4 col-lg-4 mb-3">
                            <button onClick={ self.addToResults.bind(self, "UAH") } className="btn btn-success">Add</button>
                        </div>
                        <div className="col-8 col-sm-8 col-md-8 col-lg-8">
                            EUR
                            /
                            <select  name="to" ref="to">
                                <option value="EUR">EUR</option>
                                <option value="EUR">USD</option>
                                <option value="EUR">GBP</option>
                                <option value="EUR">UAH</option>
                            </select>
                        </div>
                        <div className="col-4 col-sm-4 col-md-4 col-lg-4 mb-3">                    
                            <button onClick={ self.addToResults.bind(self, "list") } className="btn btn-success">Add</button>
                        </div>
                    </div>
                    <div className="col-6 col-sm-6 col-md-6 col-lg-6 row">
                        { self.state.pair.map( (item, i)=>{
                            return(
                                <div key={self.genNewKey()} className="row col-12">
                                    <div className="col-3 col-sm-3 col-md-3 col-lg-3">
                                        {item.from+"/"+item.to}
                                    </div>
                                    <div className="col-3 col-sm-3 col-md-3 col-lg-3">
                                        { item.bid }
                                    </div>
                                    <div className="col-3 col-sm-3 col-md-3 col-lg-3">
                                        { item.ask }
                                    </div>
                                    <div className="col-3 col-sm-3 col-md-3 col-lg-3 mb-3">
                                        <button onClick= { self.removeResult.bind(self, i) } className="btn btn-success">Remove</button>
                                    </div>
                                </div>
                            );   

                        }) }


                    </div>
                </div>
            </div>
        );
    }
}