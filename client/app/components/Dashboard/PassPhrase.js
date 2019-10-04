import React, { Component } from 'react';
import {CopyToClipboard} from 'react-copy-to-clipboard';

import Header from './Header';
import Footer from './Footer';

import { getFromStorage, removeStorage } from '../../utils/storage';
import {getPassphrase} from '../../utils/passphrase';

class PassPhrase extends Component {
    constructor(props) {
        super(props)

        this.state = {
            username: '',
            passphrases: ''
        }
    }

    componentWillMount() {
        var username = getFromStorage("username")
        this.setState({
            username: username.username
        })
        fetch('/api/account/get_passphrases', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: username.username,
            }),
        }).then(res => res.json())
        .then(json => {
            if(json.success){
                console.log(json)
                var passphrases = getPassphrase(json.passphrases)
                this.setState({
                    passphrases: passphrases
                })
                console.log(passphrases)
            }
        })
    }

    render() {
        return (
            <div>
                <Header />
                <div className="bgimg-1 w3-display-container" style={{padding:"32px 16px 16px 16px", minHeight:"85%"}}>
                    <div style={{paddingTop:"100px"}}>
                        <div id="verifyPassphaseChange" className="firstPassPhase" style={{
                             paddingLeft:"24px",
                             paddingRight:"24px",
                             border: "1px solid #ccc",
                             width: "75%",
                             borderLeft: "none",
                             background: "white",
                             margin:"auto",
                           
                        }}>
                            <h3 className="w3-center" style={{paddingTop:"25px"}}>Pass Phase : This is needed to login</h3>
                            <p className="w3-center">Put this in a safe place</p>
                            <div className="form-horizontal w3-center" style={{paddingTop:"50px", width:"80%", margin:"auto"}}>
                                <div className="form-group">
                                    <div className="col-sm-12">
                                        <textarea className="txtareaPassphase w3-center" style={{
                                            border: "1px solid #ccc !important",
                                            color: "#555555",
                                            lineHeight: "1.2",
                                            fontSize: "18px",
                                            display: "block",
                                            width: "100%",
                                            background: "transparent",
                                            height: "55px",
                                            padding: "0 25px 0 25px",
                                            border: "1px solid #ccc",
                                            }} name="firstPassphase" id="txtFirstPassphase" readOnly value={this.state.passphrases}></textarea>
                                    </div>
                                </div>
                                <div className="form-group text-center" style={{paddingTop:"25px"}}>
                                    <CopyToClipboard text={this.state.passphrases}>
                                        <button className="login100-form-btn btn-copyPassphase" data-clipboard-action="copy" data-clipboard-target="#txtFirstPassphase" style={{margin: "0 auto"}}>
                                            Copy Pass Phase
                                        </button>
                                    </CopyToClipboard>
                                </div>
                            </div>


                        </div>
                        <div style={{textAlign:"center", marginTop:"24px", paddingBottom:"24px"}}>
                            <a href="/wallet" className="btn btn-success" style={{width:"100px", borderRadius: "4px", height: "34px", paddingTop: "10px"}}> OK </a>
                            
                        </div>
                    </div>

                </div>
                <Footer />
            </div>
        )
    }
}

export default PassPhrase