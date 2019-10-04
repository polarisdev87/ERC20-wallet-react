import React, { Component } from 'react'

class Header extends Component {
    constructor(props) {
        super(props)
    }

    render() {
        return (
            <div className="header">
                <div className="w3-top">
                    <div className="w3-bar w3-white w3-card" id="myNavbar">
                        <a href="/" className="w3-bar-item w3-button w3-wide">OUTLINE WALLET</a>

                        <div className="w3-right w3-hide-small">
                            <a href="/login" className="w3-bar-item w3-button">LOGIN</a>
                            <a href="/register" className="w3-bar-item w3-button">REGISTER</a>
                        </div>
                        <a href="javascript:void(0)" className="w3-bar-item w3-button w3-right w3-hide-large w3-hide-medium" >
                            <i className="fa fa-bars"></i>
                        </a>
                    </div>
                </div>

                <nav className="w3-sidebar w3-bar-block w3-black w3-card w3-animate-left w3-hide-medium w3-hide-large" style={{display:"none"}} id="mySidebar">
                    <a href="javascript:void(0)" className="w3-bar-item w3-button w3-large w3-padding-16">Close ×</a>
                    <a href="/login" className="w3-bar-item w3-button w3-large w3-padding-16">Login</a>

                </nav>

            </div>
        )
    }
}

export default Header