import React, { Component } from 'react'

import Header from './Header'
import Footer from './Footer'

import '../../styles/dashboard/login.css'
import { getFromStorage, removeStorage, setInStorage } from '../../utils/storage'
import {checkPassphrase} from '../../utils/passphrase'

class Login2 extends Component {
    constructor(props) {
        super(props)

        this.state = {
            begin: '',
            code: '',
            phrase: '',
            phrase_array: '',
            resend_notification: false,
            confirm_error: '',
            expire_error: '',
        }
        
        this.confirm = this.confirm.bind(this)
        this.check_verify_time = this.check_verify_time.bind(this)
        this.onChangeCode = this.onChangeCode.bind(this)
        this.onChangePass = this.onChangePass.bind(this)
    }

    componentWillMount(){
        var username = getFromStorage("username")
        this.setState({
            username: username.username
        })
        var begin = getFromStorage("code_in")
        if(begin){
            this.setState({
                begin: begin.begin
            })
            setInterval(this.check_verify_time, 1000)
        }
        fetch('/api/account/get_passphrases', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: username.username
            }),
        }).then(res => res.json())
        .then(json => {
            if(json.success) {
                this.setState({
                    phrase_array: json.passphrases
                })
                console.log(json.passphrases)
            }
        });
    }

    onChangePass(event) {
        this.setState({
            phrase: event.target.value
        })
    }

    check_verify_time() {
        var now = Date.now();
        if(now -  this.state.begin > 300000){
            removeStorage("code")
            removeStorage("code_in")
            this.setState({
                resend_notification: true,
            });
        }
    }

    onChangeCode(event) {
        this.setState({
            code: event.target.value
        })
    }

    confirm() {
        const {code} = this.state
        console.log(this.state.phrase);
        console.log(this.state.phrase_array);
        if(code == "") {
            console.log("code is blank")
        }
        else if(this.state.resend_notification == false ){
            var verify_code = getFromStorage("code");
            if(verify_code.code == code){
                console.log("success");
                if(checkPassphrase(this.state.phrase, this.state.phrase_array)){
                    fetch('/api/account/generateToken', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            username: this.state.username
                        }),
                    }).then(res => res.json())
                    .then(json => {
                        if(json.success) {
                            removeStorage("code");
                            removeStorage("code_in");
                            console.log(json.token);
                            setInStorage('token', { token: json.token});
                            window.location.assign("/wallet")
                        }
                        else{
                            console.log("Token Generation Error")
                        }
                    });
                }
                else {
                    this.setState({
                        confirm_error: 'error'
                    })
                }
            }
            else {
                this.setState({
                    confirm_error: 'error',
                })
            }
        }
        else {
            this.setState({
                expire_error: 'error'
            })
        }
    }

    render() {
        return (
            <div>
                <Header />
                <div className="bgimg-1 w3-display-container" style={{ padding: "32px 16px 16px 16px", minHeight: "85%" }}>
                    <div className="container-login100 p-t-35" >
                        <div className="wrap-login100 p-l-85 p-r-85 p-t-55 p-b-55" >
                            <span className="login100-form-title p-b-16" >
                                Verify
          </span>
                            <span className="txt1 p-b-11">
                                Enter your Verification Code:
          </span>
                            <div className="wrap-input100 validate-input m-b-12" data-validate="Verification Code is required">
                                <input className="input100" type="text" name="verificationCode" onChange={this.onChangeCode}/>
                            </div>

                            <span className="txt1 p-b-11">
                                Pass Phase : P***, U***, G***
          </span>
                            <div className="wrap-input100 validate-input m-b-12" data-validate="Pass Phase is required">
                                <input className="input100" type="text" name="passphase" placeholder="P***, U***, G***" onChange={this.onChangePass} />
                            </div>

{
    (this.state.expire_error!='')?(
    <div className="alert alert-warning">
        Code is expired!
    </div>
    ):(null)
}
{
    (this.state.confirm_error!='')?(
    <div className="alert alert-warning">
        Code or Pass Phrase is not valid!
    </div>
    ):(null)
}
                            <div className="container-login100-form-btn " style={{ textAlign: "center", paddingTop: "24px" }}>
                                <button className="verifyEmail-form-btn" style={{ margin: "0 auto" }} onClick={this.confirm}>
                                    Continue
            </button>
                            </div>

                        </div>
                    </div>
                </div>
                <Footer />
            </div>
        )
    }
}

export default Login2;