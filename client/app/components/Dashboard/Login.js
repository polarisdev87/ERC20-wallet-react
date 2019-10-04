import React, { Component } from 'react'
import ReCAPTCHA from 'react-google-recaptcha'
import Header from './Header'
import Footer from './Footer'
import {
  getFromStorage,
  removeStorage,
  setInStorage
} from '../../utils/storage';
import '../../styles/dashboard/mainpage_base.css'
import '../../styles/dashboard/login.css'
import '../../styles/dashboard/login_util.css'
import '../../styles/dashboard/icomoon.css'
import '../../styles/dashboard/simple-line-icons.css'

class Login extends Component {
    constructor(props) {
        super(props)

        this.state = {
            isLoading: true,
            token: '',
            signUpError: '',
            signInError: '',
            signInEmail: '',
            signInPassword: '',
            verify: false,
            captcha: false,
            remember: false,
        };

        this.onTextboxChangeSignInEmail = this.onTextboxChangeSignInEmail.bind(this);
        this.onTextboxChangeSignInPassword = this.onTextboxChangeSignInPassword.bind(this);
        this.onClickCaptcha = this.onClickCaptcha.bind(this)
        this.onClickViewPassword = this.onClickViewPassword.bind(this);
        this.onClickRemember = this.onClickRemember.bind(this);
        this.onSignIn = this.onSignIn.bind(this);
    }

    onClickViewPassword() {
        this.setState({
            is_password: !this.state.is_password,
        });
    }

    onClickRemember() {
        this.setState({
            remember: !this.state.remember,
        });
    }

    onClickCaptcha() {
        this.setState({
            captcha: !(this.state.captcha)
        })
    }

    onTextboxChangeSignInEmail(event) {
        this.setState({
            signInEmail: event.target.value,
        });
    }

    onTextboxChangeSignInPassword(event) {
        this.setState({
            signInPassword: event.target.value,
        });
    }

    onSignIn() {
        const {
            signInEmail,
            signInPassword,
            captcha
        } = this.state;

        this.setState({
            isLoading: true,
        });

        //if(captcha && signInEmail!="" && signInPassword!=""){
        if(signInEmail!="" && signInPassword!=""){

        fetch('/api/account/signin', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: signInEmail,
                password: signInPassword,
            }),
        }).then(res => res.json())
            .then(json => {
                console.log('json', json);
                if (json.success) {
                    console.log(json)
                    console.log(json.verify_code);
                    setInStorage('code', { code: json.verify_code})
                    setInStorage('code_in', {begin: Date.now()})
                    setInStorage('email', { email: signInEmail });
                    setInStorage('username', { username: json.username });
                    setInStorage('address', {address: json.address})
                    setInStorage('privateKey', {privateKey: json.privateKey})
                    if(this.state.remember){
                        setInStorage('remember', {remember: 1});
                    }
                    this.setState({
                        signInError: json.message,
                        isLoading: false,
                        signInPassword: '',
                        signInEmail: '',
                    });
                    window.location.assign('/login2')
                } else {
                    this.setState({
                        isLoading: false,
                        signInError: json.message,
                    });
                }
            });
        }
    }

    componentWillMount() {
        var token = getFromStorage('token')
        var username = getFromStorage('username')
        var remember = getFromStorage('remember')
        var privateKey = getFromStorage('privateKey')
        removeStorage('remember')
        console.log(remember)
        if (remember) {
            var ether_address = getFromStorage('address')
            var token_buf = token.token;
            var username_buf = username.username;
            var ether_address_buf = ether_address.address;
            var privateKey_buf = privateKey.privateKey
            fetch('/api/account/verify', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    token: token_buf,
                }),
            }).then(res => res.json())
                .then(json => {
                    if (json.success) {
                        this.setState({
                            token: token,
                            username: username_buf,
                            ether_address: ether_address_buf,
                            privateKey: privateKey_buf
                        });
                        window.location.assign('/login2')
                    }
                    else {
                        removeStorage('token');
                        removeStorage('username');
                        removeStorage('address')
                    }
                });
        }
    }

    render() {
        return (
            <div>
                <Header />
                <div className="bgimg-1 w3-display-container" style={{ padding: "32px 16px 16px 16px", minHeight: "85%" }}>
                    <div >
                        <div className="container-login100 p-t-35" >
                            <div className="wrap-login100 p-l-45 p-r-45 p-t-35 p-b-35" >
                                <span className="login100-form-title p-b-16" >
                                    Account Login
          </span>
                                <span className="txt1 p-b-11">
                                    Username
          </span>
                                <div className="wrap-input100 validate-input m-b-12" data-validate="Username is required">
                                    <input className="input100" type="text" name="username" onChange={this.onTextboxChangeSignInEmail}/>
                                    <span className="focus-input100"></span>
                                </div>

                                <span className="txt1 p-b-11">
                                    Password
          </span>
                                <div className="wrap-input100 validate-input m-b-12" data-validate="Password is required">
                                    <span className="btn-show-pass" onClick={this.onClickViewPassword}>
                                        <i className="fa fa-eye"></i>
                                    </span>
                                    <input className="input100" type={(this.state.is_password)?('password'):('text')} name="pass" onChange={this.onTextboxChangeSignInPassword}/>
                                    <span className="focus-input100"></span>
                                </div>


                                <span className="txt1 p-t-24">
                                    Captcha
          </span>
                                <div className="wrap-input100 validate-input m-b-12">
                                    <ReCAPTCHA 
                                        sitekey="6LcuVncUAAAAAG4TWqswK93Gzytl31ILFpKpNXSY"
                                        onChange={this.onClickCaptcha}
                                    />
                                </div>

                                <div className="flex-sb-m w-full p-b-24">
                                    <div className="contact100-form-checkbox">
                                        <input className="input-checkbox100" id="ckb1" type="checkbox" name="remember-me" onClick={this.onClickRemember}/>
                                        <label className="label-checkbox100" htmlFor="ckb1">
                                            Remember me
              </label>
                                    </div>

                                    <div>
                                        <a href="/forget" className="txt3">
                                            Forgot Password?
              </a>
                                    </div>
                                </div>

                {
                    (this.state.signInError!='')?(
                    <div className="alert alert-warning">
                        Username or Password is not valid!
                    </div>
                    ):(null)
                }
                                <div className="container-login100-form-btn" style={{ textAlign: "center" }}>
                                    <button className="login100-form-btn" style={{ margin: "0 auto" }} onClick={this.onSignIn}>
                                        Login
            </button>
                                </div>

                            </div>
                        </div>
                    </div>

                </div>
                <Footer />
            </div>
        )
    }
}

export default Login