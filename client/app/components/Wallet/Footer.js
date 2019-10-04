import React, { Component } from 'react';

class Footer extends Component {
    constructor(props) {
        super(props)
    }

    render() {
        return (
                <footer className="w3-center w3-black" style={{bottom: "0px", left: "0px", paddingTop:"2%", paddingBottom:"2%",minHeight:"15%"}}>
                    <div className="w3-xlarge w3-section">
                        <i className="fa fa-facebook-official w3-hover-opacity"></i>
                        <i className="fa fa-instagram w3-hover-opacity"></i>
                        <i className="fa fa-snapchat w3-hover-opacity"></i>
                        <i className="fa fa-pinterest-p w3-hover-opacity"></i>
                        <i className="fa fa-twitter w3-hover-opacity"></i>
                        <i className="fa fa-linkedin w3-hover-opacity"></i>
                    </div>
                    <p> OUTLINE 2018</p>
                </footer>
        )
    }
}

export default Footer;