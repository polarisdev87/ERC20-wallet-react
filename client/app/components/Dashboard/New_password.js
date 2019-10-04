import React, { Component } from 'react';
import ReCAPTCHA from 'react-google-recaptcha';
import Header from './Header';
import Footer from './Footer';

import '../../styles/dashboard/register.css';
import { setInStorage, getFromStorage } from '../../utils/storage';

class New_password extends Component {
    constructor(props) {
        super(props)
        this.state = {
            signUpPassword: '',
            signUpError: '',
            signUpConfirmError: '',
            is_password: true
        }

        this.onChangeConfirm = this.onChangeConfirm.bind(this);
        this.onChangePassword = this.onChangePassword.bind(this);
        this.onPassword = this.onPassword.bind(this);
        this.onClickViewPassword = this.onClickViewPassword.bind(this);
    }

    onClickViewPassword() {
        this.setState({
            is_password: !this.state.is_password,
        });
    }

    onChangePassword(event) {
        this.setState({
            signUpPassword: event.target.value
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

    onPassword()
    {
        const {
            signUpPassword,
            signUpConfirmError,
          } = this.state;
        var email = getFromStorage('email');
        this.setState({
            isLoading: true,
            signUpError: ""
        });

        //if(signUpConfirmError == "" && signUpAccept==true && captcha) {
        if(signUpConfirmError == "") {
      
          fetch('/api/account/change_password', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: email.email,
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
              window.location.assign('/login')
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
                                    Enter New Password
          </span>
          {
              (this.state.signUpError != "") ? (
                <div className="alert alert-success">{this.state.signUpError}</div>
              ) : (null)
          }
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

                                <div className="container-login100-form-btn" style={{textAlign:"center"}}>
                                    <button className="login100-form-btn" style={{margin: "0 auto"}} onClick={this.onPassword}>
                                        Change Password
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

export default New_password