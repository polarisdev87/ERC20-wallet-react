import React, { Component } from 'react';

import Header from './Header';
import Footer from './Footer';

import { getFromStorage, removeStorage, setInStorage } from '../../utils/storage';
import {generateRandom} from '../../utils/passphrase';

class Verify extends Component {
    constructor(props) {
        super(props)

        this.state = {
            username: '',
            code: '',
            begin: '',
            expired: false,
            codeError: false,
        }

        this.onChangeCode = this.onChangeCode.bind(this)
        this.verifyEmail = this.verifyEmail.bind(this)
        this.check_expire = this.check_expire.bind(this)
    }

    componentWillMount() {
        var username = getFromStorage("username")
        this.setState({
            username: username.username
        })
        var code = getFromStorage("code_in");
        if(code) {
            this.setState({
                begin: code.begin,
            })
            setInterval(this.check_expire, 1000)
        }
        else {
            this.setState({
                expired: true
            })
        }
    }

    check_expire() {
        if(Date.now() - this.state.begin > 300000){
            removeStorage("code")
            removeStorage("code_in")
            this.setState({
                expired: true
            })
        }
    }

    onChangeCode(event) {
        this.setState({
            code: event.target.value
        })
    }

    verifyEmail() {
        const {code, expired, username}  = this.state
        if(!expired){
            var code_buf = getFromStorage("code")
            if(code == code_buf.code){
                var passphrase_array = generateRandom()
                var buf = ''
                var index = 0
                for(; index<2; index++){
                    buf+= passphrase_array[index] + ' '
                }
                buf += passphrase_array[2]
                fetch('/api/account/verify_email', {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        username: username,
                        passphrase: buf
                    }),
                  })
                .then(res => res.json())
                .then(json => {
                    if(json.success){
                        removeStorage("code")
                        removeStorage("code_in")
                        fetch('/api/account/generateToken', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify({
                                username: username
                            }),
                        }).then(res => res.json())
                        .then(json => {
                            if(json.success) {
                                removeStorage("code");
                                removeStorage("code_in");
                                setInStorage('token', { token: json.token});
                                window.location.assign("/passphrase")
                            }
                            else{
                                console.log("Token Generation Error")
                            }
                        });
                    }
                })
            }
            else {
                this.setState({
                    codeError: true
                })
            }
        }
        else {
            this.setState({
                expired: true
            })
        }
    }

    render() {
        return (
            <div>
                <Header />
                <div className="bgimg-1 w3-display-container" style={{padding:"32px 16px 16px 16px",  minHeight:"85%"}}>
                    <div className="container-login100 p-t-35" >
                        <div className="wrap-login100 p-l-85 p-r-85 p-t-55 p-b-55" >
                            <span className="login100-form-title p-b-16" >
                                Verify Your Email
                            </span>
                            <span className="txt1 p-b-11">
                                Enter your Verification Code
                            </span>
                            <div className="wrap-input100 validate-input m-b-12" data-validate="Verification Code is required">
                                <input className="input100" type="text" name="verificationCode" onChange={this.onChangeCode}/>

                            </div>
{
    (this.state.expired)?(
    <div className="alert alert-warning">
        Code is expired!
    </div>
    ):(null)
}
{
    (this.state.codeError)?(
    <div className="alert alert-warning">
        Code is not valid!
    </div>
    ):(null)
}
                            <div className="container-login100-form-btn" style={{textAlign:"center"}}>
                                <button className="verifyEmail-form-btn" style={{margin: "0 auto"}} onClick={this.verifyEmail}>
                                    Verify Email
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

export default Verify