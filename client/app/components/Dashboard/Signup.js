import React, { Component } from 'react';
import ReCAPTCHA from 'react-google-recaptcha';
import Header from './Header';
import Footer from './Footer';

import '../../styles/dashboard/register.css';
import { setInStorage } from '../../utils/storage';

class Signup extends Component {
    constructor(props) {
        super(props)
        this.state = {
            signUpUsername: '',
            signUpEmail: '',
            signUpPassword: '',
            signUpError: '',
            signUpConfirmError: '',
            signUpAccept: false,
            captcha: false,
            is_password: true
        }

        this.onChangeConfirm = this.onChangeConfirm.bind(this);
        this.onChangeUsername = this.onChangeUsername.bind(this);
        this.onChangeEmail = this.onChangeEmail.bind(this);
        this.onChangePassword = this.onChangePassword.bind(this);
        this.onSignUp = this.onSignUp.bind(this);
        this.onChangeAccept = this.onChangeAccept.bind(this);
        this.onClickCaptcha = this.onClickCaptcha.bind(this);
        this.onClickViewPassword = this.onClickViewPassword.bind(this);
    }

    onClickViewPassword() {
        this.setState({
            is_password: !this.state.is_password,
        });
    }

    onClickCaptcha() {
        this.setState({
            captcha: !(this.state.captcha)
        })
    }

    onChangeEmail(event) {
        this.setState({
            signUpEmail: event.target.value,
        });
    }

    onChangePassword(event) {
        this.setState({
            signUpPassword: event.target.value
        });
    }

    onChangeUsername(event) {
        this.setState({
            signUpUsername: event.target.value,
        });
    }

    onChangeConfirm(event) {
        if(this.state.signUpPassword != event.target.value) {
            this.setState({
                signUpConfirmError: 'Password not matched',
            });
        }
        else {
            this.setState({
                signUpConfirmError: ''
            });
        }
        console.log(this.state.signUpConfirmError)
    }

    onChangeAccept(event) {
        this.setState({
            signUpAccept: event.target.checked
        })
    }

    onSignUp()
    {
        const {
            signUpEmail,
            signUpPassword,
            signUpConfirmError,
            signUpUsername,
            signUpAccept,
            captcha
          } = this.state;
        
        this.setState({
            isLoading: true,
            signUpError: ""
        });

        //if(signUpConfirmError == "" && signUpAccept==true && captcha) {
        if(signUpConfirmError == "" && signUpAccept==true) {
      
          fetch('/api/account/signup', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: signUpUsername,
                email: signUpEmail,
                password: signUpPassword,
            }),
          }).then(res => res.json())
          .then(json => {
            if(json.success) {
              this.setState({
                signUpError: '',
                signUpEmail: '',
                signUpPassword: '',
                signUpUsername: '',
              });
              setInStorage("code", {code: json.code})
              setInStorage("code_in", {begin: Date.now()})
              setInStorage("username", {username: signUpUsername})
              setInStorage("address", {address: json.address})
              setInStorage("privateKey", {address: json.privateKey})
              window.location.assign('/verify')
            } else {
              this.setState({
                signUpError: json.message,
                isLoading: false,
              });
            }
          });
        }
    }

    render() {
        const {signUpConfirmError} = this.state;
        return (
            <div>  
                <Header />
            
            <div className="bgimg-1 w3-display-container" style={{ padding: "32px 16px 16px 16px", minHeight: "85%" }}>
                <div className="p-t-64 p-b-64">
                    <div className="container-login100" >
                        <div className="wrap-login100 p-l-85 p-r-85 p-t-55 p-b-55" >
                            <span className="login100-form-title p-b-16" >
                                    Register
          </span>
          {
              (this.state.signUpError != "") ? (
                <div className="alert alert-success">{this.state.signUpError}</div>
              ) : (null)
          }
                                <span className="txt1 p-b-11">
                                    Username
          </span>
                                <div className="wrap-input100 validate-input m-b-12" data-validate="Username is required">
                                    <input className="input100" type="text" name="username"  onChange={this.onChangeUsername}/>
                                    <span className="focus-input100"></span>
                                </div>

                                <span className="txt1 p-b-11">
                                    Email
          </span>
                                <div className="wrap-input100 validate-input m-b-12" data-validate="Username is required">
                                    <input className="input100" type="text" name="email" onChange={this.onChangeEmail}/>
                                    <span className="focus-input100"></span>
                                </div>

                                <span className="txt1 p-b-11">
                                    Password
          </span>
                                <div className="wrap-input100 validate-input m-b-12" data-validate="Password is required">
                                    <span className="btn-show-pass"  onClick={this.onClickViewPassword}>
                                        <i className="fa fa-eye"></i>
                                    </span>
                                    <input className="input100" type={(this.state.is_password)?('password'):('text')} name="pass" onChange={this.onChangePassword}/>
                                    <span className="focus-input100"></span>
                                </div>

                                <span className="txt1 p-b-11">
                                    Re-enter Password
          </span>
                                <div className="wrap-input100 validate-input m-b-12" data-validate="Password is required">
                                    <span className="btn-show-pass"  onClick={this.onClickViewPassword}>
                                        <i className="fa fa-eye"></i>
                                    </span>
                                    <input className="input100" type={(this.state.is_password)?('password'):('text')} name="pass" onChange={this.onChangeConfirm}/>
                                    <span className="focus-input100" style={{borderColor: (signUpConfirmError!="")? (
                                        "red"
                                    ):("#57b846")}}></span>
                                </div>


                                <span className="txt1 p-b-11">
                                    Captcha
                                </span>
                                <div className="wrap-input100 validate-input m-b-12" data-validate="Password is required">
                                    <ReCAPTCHA
                                        sitekey="6LcuVncUAAAAAG4TWqswK93Gzytl31ILFpKpNXSY"
                                        onChange={this.onClickCaptcha}
                                    />
                                </div>

                                <div className="flex-sb-m w-full p-b-24">

                                    <div>
                                        <input type="checkbox" name="termsConditions" value="yes" onChange={this.onChangeAccept}/> I accept terms and conditions.
                                    </div>
                                </div>

                                <div className="container-login100-form-btn" style={{textAlign:"center"}}>
                                    <button className="login100-form-btn" style={{margin: "0 auto"}} onClick={this.onSignUp}>
                                        Register
                                    </button>
                                </div>

                        </div>
                    </div>
                </div>

                <div id="dropDownSelect1"></div>
            </div>
                <Footer />
            </div>
        )
    }
}

export default Signup