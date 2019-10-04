import React, { Component } from 'react';

class Header extends Component {
    constructor(props) {
        super(props)
    }

    render() {
        return (
            <div>
                <div className="w3-top">
                    <div className="w3-bar w3-white w3-card" id="myNavbar">
                        <a href="/wallet" className="w3-button w3-wide" style={{ padding: "16px" }}>OUTLINE WALLET</a>

                        <div className="w3-right w3-hide-small">

                            <div className="w3-dropdown-hover w3-hide-small w3-right">
                                <button className="w3-button" title="More" style={{ padding: "16px" }}><i className="fa fa-user" style={{ padding: "3px" }}></i> {this.props.username} <i className="fa fa-caret-down"></i></button>
                                <div className="w3-dropdown-content w3-bar-block w3-card-4">
                                    <a className="w3-bar-item w3-button" onClick={this.props.onProfile}>Profile</a>
                                    <a className="w3-bar-item w3-button" onClick={this.props.onSecurity}>Security</a>
                                    <a className="w3-bar-item w3-button" onClick={this.props.onEther}>My ETH Address</a>
                                    <a className="w3-bar-item w3-button" onClick={this.props.onPass}>Pass Phrase</a>
                                    <a className="w3-bar-item w3-button" onClick={this.props.onLogout}>Log out</a>
                                </div>
                            </div>
                        </div>
                        <a href="javascript:void(0)" className="w3-bar-item w3-button w3-right w3-hide-large w3-hide-medium">
                            <i className="fa fa-bars"></i>
                        </a>
                    </div>
                </div>

                <nav className="w3-sidebar w3-bar-block w3-black w3-card w3-animate-left w3-hide-medium w3-hide-large" style={{ display: "none" }} id="mySidebar">
                    <a href="javascript:void(0)" className="w3-bar-item w3-button w3-large w3-padding-16">Close ×</a>

                </nav>
            </div>
        )
    }
}

export default Header;