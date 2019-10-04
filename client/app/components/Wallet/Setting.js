import React, { Component } from 'react';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import Header from './Header';
import Footer from './Footer';
import '../../styles/dashboard/settings.css'
import { getFromStorage, removeStorage } from '../../utils/storage';
import { getPassphrase } from '../../utils/passphrase';

class Setting extends Component {
    constructor(props) {
        super(props)

        this.state = {
            tab: 'profile',
            username: '',
            email: '',
            address: '',
            passPhase: '',
            old_password: '',
            reset_password: '',
            pass_confirm: '',
            new_email: '',
            code: '',
            confirm_code: '',
            confirm_error: ''
        }

        this.onLogout = this.onLogout.bind(this)
        this.onProfile = this.onProfile.bind(this)
        this.onSecurity = this.onSecurity.bind(this)
        this.onEther = this.onEther.bind(this)
        this.onPass = this.onPass.bind(this)
        this.onChangeOld = this.onChangeOld.bind(this)
        this.onChangeReset = this.onChangeReset.bind(this)
        this.onChangeConfirm = this.onChangeConfirm.bind(this)
        this.changePassword = this.changePassword.bind(this)
        this.onChangeEmail = this.onChangeEmail.bind(this)
        this.changeEmail = this.changeEmail.bind(this)
        this.confirmEmail = this.confirmEmail.bind(this)
        this.onChangeCode = this.onChangeCode.bind(this)
        this.showConfirmCode = this.showConfirmCode.bind(this)
    }

    showConfirmCode() {
        this.setState({
            tab: 'password'
        })
        const {username, email} = this.state
        fetch('/api/account/send_code', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: username,
                email: email
            }),
        }).then(res => res.json())
            .then(json => {
                this.setState({
                    code: json.code,
                    tab: 'password'
                })
            })
    }

    changePassword() {
        const {old_password, reset_password, confirm_code, code, username} = this.state;
        if(code == confirm_code){
            console.log('here')
            fetch('/api/account/changePass', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    username: username,
                    old_password: old_password,
                    reset_password: reset_password,
                }),
            }).then(res => res.json())
                .then(json => {
                    if(json.success){
                        this.setState({
                            tab: 'security'
                        })
                    }
                    else {
                        console.log(json.err)
                    }
                })
        } 
        else {
            this.setState({
                confirm_error: 'err'
            })
        }
    }

    changeEmail() {
        const {new_email, username, email} = this.state
        fetch('/api/account/send_code', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: username,
                email: email
            }),
        }).then(res => res.json())
            .then(json => {
                this.setState({
                    code: json.code,
                    tab: 'email_verify'
                })
            })
    }

    confirmEmail() {
        const {new_email, username, code, confirm_code} = this.state
        if(code==confirm_code){
            fetch('/api/account/change_email', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    username: username,
                    email: new_email
                }),
            }).then(res => res.json())
                .then(json => {
                    this.setState({
                        tab: 'profile',
                        email: new_email,
                        new_email: '',
                        confirm_error: ''
                    })
            })
        }
        else {
            this.setState({
                confirm_error: 'err'
            })
        }
    }

    onChangeCode(event) {
        this.setState({
            confirm_code: event.target.value
        })
    }

    onChangeEmail(event) {
        this.setState({
            new_email: event.target.value
        })
    }

    onChangeOld(event) {
        this.setState({
            old_password: event.target.value
        })
    }

    onChangeReset(event) {
        this.setState({
            reset_password: event.target.value
        })
    }

    onChangeConfirm(event) {
        var buf = ''
        if (this.state.reset_password != event.target.value) {
            buf = "Not Matched"
        }
        this.setState({
            pass_confirm: buf
        })
    }



    onProfile() {
        this.setState({
            tab: 'profile'
        })
    }

    onSecurity() {
        this.setState({
            tab: 'security'
        })
    }

    onEther() {
        this.setState({
            tab: 'ether'
        })
    }

    onPass() {
        this.setState({
            tab: 'pass'
        })
    }

    onLogout() {
        removeStorage('token')
        removeStorage('username')
        removeStorage('address')
        removeStorage('setting')
        window.location.assign('/')
    }

    componentWillMount() {
        var username = getFromStorage('username')
        this.setState({
            username: username.username
        })
        var setting = getFromStorage('setting')
        fetch('/api/account/getUserInfo', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: username.username
            }),
        }).then(res => res.json())
            .then(json => {
                if (json.success) {
                    console.log(json)
                    var user = json.user
                    this.setState({
                        username: user.username,
                        email: user.email,
                        address: user.address,
                        passPhase: getPassphrase(user.passphrase),
                        tab: setting.setting
                    })
                }
            })
    }

    render() {
        return (
            <div>
                <Header username={this.state.username} onLogout={this.onLogout} onProfile={this.onProfile} onSecurity={this.onSecurity} onEther={this.onSecurity} onPass={this.onPass} />
                <div className="bgimg-1 w3-display-container" style={{ padding: "128px 16px 64px 16px", minHeight: "85%" }}>
                    <div className="container">
                        <div className="tab">
                            <button className={(this.state.tab == "profile") ? ("tablinks active") : ("tablinks")} id="tabProfile" onClick={this.onProfile}>Profile</button>
                            <button className={(this.state.tab == "security") ? ("tablinks active") : ("tablinks")} id="tabSecurity" onClick={this.onSecurity}>Security</button>
                            <button className={(this.state.tab == "ether") ? ("tablinks active") : ("tablinks")} id="tabWalletAddress" onClick={this.onEther}>My Wallet Address</button>
                            <button className={(this.state.tab == "pass") ? ("tablinks active") : ("tablinks")} id="tabPassphase" onClick={this.onPass}>Pass Phrase</button>
                        </div>

                        {
                            (this.state.tab == "profile") ? (
                                <div id="profile" className="tabcontent">
                                    <div className="form-horizontal" style={{ paddingTop: "64px" }}>
                                        <div className="form-group">
                                            <label className="control-label col-sm-3" htmlFor="username">{"USERNAME:"}</label>
                                            <div className="col-sm-6">
                                                <input type="text" className="form-control" id="inptUsername" placeholder="UserName" value={this.state.username} readOnly />
                                            </div>
                                        </div>
                                        <div className="form-group">
                                            <label className="control-label col-sm-3" htmlFor="primaryEmail">{"PRIMARY EMAIL:"}</label>
                                            <div className="col-sm-6">
                                                <input type="text" className="form-control" id="inptPrimaryEmail" placeholder={this.state.email} onChange={this.onChangeEmail} />
                                            </div>
                                        </div>
                                        <div className="form-group text-center">
                                            <button className="btn btn-primary" onClick={this.changeEmail} >{"Change Email"}</button>
                                        </div>
                                    </div>
                                </div>
                            ) : (null)
                        }
                        {
                            (this.state.tab == "security") ? (
                                <div id="security" className="tabcontent">
                                    <div className="form-horizontal" style={{ paddingTop: "64px" }}>
                                        <div className="form-group">
                                            <label className="control-label col-sm-3" htmlFor="oldPassword">{"Old Password:"}</label>
                                            <div className="col-sm-9">
                                                <input type="password" className="form-control" id="inptOldPassword" placeholder="Old Password" onChange={this.onChangeOld} />
                                            </div>
                                        </div>
                                        <div className="form-group">
                                            <label className="control-label col-sm-3" htmlFor="newPassword">{"New Password:"}</label>
                                            <div className="col-sm-9">
                                                <input type="password" className="form-control" id="inptNewPassword" placeholder="New Password" onChange={this.onChangeReset} />
                                            </div>
                                        </div>
                                        <div className="form-group">
                                            <label className="control-label col-sm-3" htmlFor="newPassword">{"Re-type New Password:"}</label>
                                            <div className="col-sm-9">
                                                <input type="password" className="form-control" id="inptRetypeNewPassword" placeholder="Re-type New Password" style={{
                                                    borderColor: (this.state.pass_confirm != "") ? (
                                                        "red"
                                                    ) : ("#ccc")
                                                }} onChange={this.onChangeConfirm} />
                                            </div>
                                        </div>

                                        <div className="form-group text-center">
                                            <button className="btn btn-primary" onClick={this.showConfirmCode} >{"Change Password"}</button>
                                        </div>
                                    </div>
                                </div>
                            ) : (null)
                        }

                        {
                            (this.state.tab == "ether") ? (
                                <div id="myWalletAddress" className="tabcontent" style={{ paddingTop: "64px" }}>
                                    <div className="form-horizontal w3-center" style={{ paddingTop: "50px", width: "80%", margin: "auto" }}>
                                        <div className="form-group">
                                            <label className="control-label col-sm-3" htmlFor="walletAddress">{"ETH Wallet Address:"}</label>
                                            <div className="col-sm-9">
                                                <input type="text" className="form-control" id="inptMyWalletAddress" placeholder="My Ether Wallet Address" value={this.state.address} readOnly />
                                            </div>
                                        </div>
                                        <div className="form-group text-center" style={{ paddingTop: "25px" }}>
                                            <CopyToClipboard text={this.state.address}>
                                                <button className="btn btn-primary copy-button" data-clipboard-action="copy" data-clipboard-target="#inptMyWalletAddress" >Copy Address</button>
                                            </CopyToClipboard>
                                        </div>
                                    </div>
                                </div>
                            ) : (null)
                        }
                        {
                            (this.state.tab == "pass") ? (
                                <div id="passPhase" className="tabcontent" style={{ paddingTop: "64px" }}>
                                    <div className="form-horizontal w3-center" style={{ paddingTop: "50px", width: "80%", margin: "auto" }}>
                                        <div className="form-group">
                                            <label className="control-label col-sm-3" htmlFor="walletAddress">{"Pass Phase: "}</label>
                                            <div className="col-sm-9">
                                                <input type="text" className="form-control" id="inptPassphase" value={this.state.passPhase} />
                                            </div>
                                        </div>

                                        <div className="form-group text-center" style={{ paddingTop: "25px" }}>
                                            <CopyToClipboard text={this.state.passPhase}>
                                                <button className="btn btn-info btn-copyPassphase" data-clipboard-action="copy" data-clipboard-target="#inptPassphase">Copy Pass Phase</button>
                                            </CopyToClipboard>
                                        </div>
                                    </div>
                                </div>
                            ) : (null)
                        }

                        {
                            (this.state.tab == "email_verify") ? (
                                <div id="verifyPasswordChange" className="tabcontent">
                                    <h3 className="w3-center" style={{ paddingTop: "25px" }}>{"Enter Verification Code"}</h3>
                                    <p className="w3-center">{"Check your Email for the verification code of Email Change"}</p>
                                    <div className="form-horizontal w3-center" style={{ paddingTop: "50px", width: "80%", margin: "auto" }}>
                                        <div className="form-group">
                                            <label className="control-label col-sm-3" htmlFor="walletAddress">Verification Code:</label>
                                            <div className="col-sm-9">
                                                <input type="text" className="form-control" id="inptVerifyPasswordChange" onChange={this.onChangeCode} placeholder="Enter Verification Code" />
                                            </div>
                                        </div>
                                        {
                                            (this.state.confirm_error!='')?(
                                            <div className="alert alert-warning">
                                                Code is not valid!
                                            </div>
                                            ):(null)
                                        }
                                        <div className="form-group text-center" style={{ width: "80%", margin: "auto" }}>
                                            <button className="btn btn-success" onClick={this.confirmEmail}>{"Verify"}</button>
                                        </div>
                                    </div>
                                </div>
                            ) : (null)
                        }

                        {
                            (this.state.tab == "password") ? (
                                <div id="verifyPassphaseChange" className="tabcontent">
                                    <h3 className="w3-center" style={{ paddingTop: "25px" }}>{"Enter Verification Code"}</h3>
                                    <p className="w3-center">{"Check your Email for the verification code of Pass Phass Change"}</p>
                                    <div className="form-horizontal w3-center" style={{ paddingTop: "50px", width: "80%", margin: "auto" }}>
                                        <div className="form-group">
                                            <label className="control-label col-sm-3" htmlFor="walletAddress">{"Verification Code:"}</label>
                                            <div className="col-sm-9">
                                                <input type="text" className="form-control" id="inptVerifyPassphangeChange" placeholder="Enter Verification Code" onChange={this.onChangeCode}/>
                                            </div>
                                        </div>
                                        {
                                            (this.state.confirm_error!='')?(
                                            <div className="alert alert-warning">
                                                Code is not valid!
                                            </div>
                                            ):(null)
                                        }
                                        <div className="form-group text-center" style={{ paddingTop: "25px" }}>
                                            <button className="btn btn-success" onClick={this.changePassword}>{"Verify"}</button>
                                        </div>
                                    </div>
                                </div>
                            ) : (null)
                        }
                        {
                            (this.state.tab == "aaa") ? (
                                <div id="showNewPassphase" className="tabcontent">
                                    <h3 className="w3-center" style={{ paddingTop: "25px" }}>{"New Pass Phase"}</h3>
                                    <div className="form-horizontal w3-center" style={{ paddingTop: "50px", width: "80%", margin: "auto" }}>
                                        <div className="form-group">
                                            <label className="control-label col-sm-3" htmlFor="walletAddress">{"Passphase:"}</label>
                                            <div className="col-sm-9">
                                                <input type="text" className="form-control" id="inptNewPassphase" readOnly value="Peter Piper Pepper Rabbit Stick" />
                                            </div>
                                        </div>
                                        <div className="form-group text-center" style={{ paddingTop: "25px" }}>
                                            <button className="btn btn-info btn-copyNewPassphase" data-clipboard-action="copy" data-clipboard-target="#inptNewPassphase">Copy Pass Phase</button>
                                        </div>
                                        <p>{"*Note: You won't be able to change it within 30days"}</p>
                                    </div>
                                </div>
                            ) : (null)
                        }


                    </div>
                </div>
                <Footer />

            </div>
        )
    }
}

export default Setting