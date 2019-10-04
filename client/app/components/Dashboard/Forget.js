import React, { Component } from 'react'

import Header from './Header'
import Footer from './Footer'

import '../../styles/dashboard/login.css'
import { getFromStorage, removeStorage, setInStorage } from '../../utils/storage'
import {checkPassphrase} from '../../utils/passphrase'

class Forget extends Component {
    constructor(props) {
        super(props)

        this.state = {
            email: '',
            confirm_error: '',
        }
        
        this.confirm = this.confirm.bind(this)
        this.onChangeCode = this.onChangeCode.bind(this)
    }

    onChangeCode(event) {
        this.setState({
            email: event.target.value,
        })
    }

    confirm() {
        fetch('/api/account/check_email', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: this.state.email,
            }),
        }).then(res => res.json())
        .then(json => {
            if(json.success) {
                this.setState({
                    confirm_error: '',
                });
                setInStorage('email', {email: this.state.email});
                setInStorage("code", {code: json.code})
                setInStorage("code_in", {begin: Date.now()})
                window.location.assign('/forget_verify');
            }
            else {
                this.setState({
                    confirm_error: 'error',
                });
            }
        });
    }

    render() {
        return (
            <div>
                <Header />
                <div className="bgimg-1 w3-display-container" style={{ padding: "32px 16px 16px 16px", minHeight: "85%" }}>
                    <div className="container-login100 p-t-35" >
                        <div className="wrap-login100 p-l-85 p-r-85 p-t-55 p-b-55" >
                            <span className="login100-form-title p-b-16" >
                                Forget Password
          </span>
                            <span className="txt1 p-b-11">
                                Enter email address of your account:
          </span>
                            <div className="wrap-input100 validate-input m-b-12" data-validate="Verification Code is required">
                                <input className="input100" type="email" name="email" onChange={this.onChangeCode}/>
                            </div>


{
    (this.state.confirm_error!='')?(
    <div className="alert alert-warning">
        Email Address is invalid!
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

export default Forget;