import React, { Component } from 'react';
import {
  getFromStorage,
  setInStorage
} from '../../utils/storage';

class Dashboard extends Component {
    constructor(props) {
        super(props)

        this.onLogo = this.onLogo.bind(this)

    }

    onLogo() {
        var token = getFromStorage('token')
        var username = getFromStorage('username')
        var privateKey = getFromStorage('privateKey')
        if (token) {
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
                    }
                    else {
                        removeStorage('token');
                        removeStorage('username');
                        removeStorage('address')
                        window.location.assign('/login')
                    }
                });
        }
        else {
            window.location.assign('/login')
        }
    }

    render() {
        return (
            <div className="app">
                <div id="fh5co-offcanvass">
                    <ul>
                        <li className="active"><a href="#" data-nav-section="home">Home</a></li>
                        {/* <li><a href="#" data-nav-section="features">Features</a></li>
                        <li><a href="#" data-nav-section="faqs">FAQs</a></li> */}
                        <li><a href="/login" data-nav-section="login">Login</a></li>
                        <li><a href="/register" data-nav-section="signup">Register</a></li>
                    </ul>
                    {/* <h3 className="fh5co-lead">Connect with us</h3>
                    <p className="fh5co-social-icons">
                        <a href="#"><i className="icon-twitter"></i></a>
                        <a href="#"><i className="icon-facebook"></i></a>
                        <a href="#"><i className="icon-instagram"></i></a>
                        <a href="#"><i className="icon-dribbble"></i></a>
                        <a href="#"><i className="icon-youtube"></i></a>
                    </p> */}
                </div>

                <div id="fh5co-menu" className="navbar">
                    <div className="container">
                        <div className="row">
                            <div className="col-md-12">
                                <a href="#" className="js-fh5co-nav-toggle fh5co-nav-toggle" data-toggle="collapse" data-target="#fh5co-navbar" aria-expanded="false" aria-controls="navbar"><span>Menu</span> <i></i></a>
                                <a href="/wallet" className="navbar-brand"><span>Incodium</span></a>
                            </div>
                        </div>
                    </div>
                </div>

                <div id="fh5co-page">
                    <div id="fh5co-wrap">
                        <header id="fh5co-hero" data-section="home" role="banner" style={{background: "url(assets/images/bg_2.jpg) top left", backgroundSize: "cover"}} >
                            <div className="fh5co-overlay"></div>
                            <div className="fh5co-intro">
                                <div className="container">
                                    <div className="row">

                                        <div className="col-md-6 fh5co-text">
                                            <h2 className="to-animate intro-animate-1">Incodium <br /> Web Wallet</h2>
                                            <p className="to-animate intro-animate-2" style={{color: "white"}}>The Incodium Project is on a mission to protect the “everyday” cryptocurrency investor as they participate in the Fintech Revolution happening worldwide. .</p>
                                            <div className="row">
                                                <div className="col-md-6" >
                                                    <p className="to-animate intro-animate-3" >
                                                        <a href="/register" className="btn btn-primary btn-md" ><i className="icon-user"></i> Register</a>
                                                    </p>
                                                </div>
                                                <div className="col-md-6">
                                                    <p className="to-animate intro-animate-3" >
                                                        <a href="/login" className="btn btn-primary btn-md"><i className="icon-user"></i> Login</a></p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-md-6 text-right fh5co-intro-img to-animate intro-animate-4">
                                            {/* <img src="assets/images/iphone_6_3.png" alt="Incodium" /> */}
                                            <img src="assets/dashboard-img/how/slide-1-object-min.png" alt="Incodium" /> 
                                        </div>

                                    </div>
                                </div>
                            </div>
                        </header>

                        <div id="fh5co-main">
                            <div id="fh5co-clients">
                                <div className="container">
                                    <div className="row text-center">
                                        <div className="col-md-4 col-sm-6 col-xs-6 to-animate">
                                            <figure className="fh5co-client"><img src="assets/dashboard-img/Exchange_Logos/latoken.png" alt="LA Token" /></figure>
                                        </div>
                                        <div className="col-md-4 col-sm-6 col-xs-6 col-md-4-offset to-animate" style={{marginLeft:'33.3333%'}}>
                                            <figure className="fh5co-client"><img src="assets/dashboard-img/Exchange_Logos/bitmart.png" alt=""/></figure>
                                        </div>
                                        {/* <div className="col-md-3 col-sm-6 col-xs-6 to-animate">
                                            <figure className="fh5co-client"><img src="assets/images/client_4.png" alt="Free HTML5 Template" /></figure>
                                        </div> */}
                                    </div>
                                </div>
                            </div>

                            {/* <div id="fh5co-features" data-section="features">


                                <div className="container">
                                    <div className="row">
                                        <div className="col-md-8 col-md-offset-2 fh5co-section-heading text-center">
                                            <h2 className="fh5co-lead to-animate">Explore amazing features</h2>
                                            <p className="fh5co-sub to-animate">Far far away, behind the word mountains, far from the countries Vokalia and Consonantia, there live the blind texts. Separated they live in Bookmarksgrove right at the coast of the Semantics, a large language ocean.</p>
                                        </div>
                                        <div className="col-md-3 col-sm-6 col-xs-6 col-xxs-12">
                                            <a href="#" className="fh5co-feature to-animate">
                                                <span className="fh5co-feature-icon"><i className="icon-mustache"></i></span>
                                                <h3 className="fh5co-feature-lead" style={{marginTop: "20px", marginBottom: "10px"}}>100% Free</h3>
                                                <p className="fh5co-feature-text">Far far away behind the word mountains</p>
                                            </a>
                                        </div>
                                        <div className="col-md-3 col-sm-6 col-xs-6 col-xxs-12">
                                            <a href="#" className="fh5co-feature to-animate">
                                                <span className="fh5co-feature-icon"><i className="icon-screen-smartphone"></i></span>
                                                <h3 className="fh5co-feature-lead" style={{marginTop: "20px", marginBottom: "10px"}}>Fully Responsive</h3>
                                                <p className="fh5co-feature-text">Far far away behind the word mountains</p>
                                            </a>
                                        </div>
                                        <div className="clearfix visible-sm-block"></div>
                                        <div className="col-md-3 col-sm-6 col-xs-6 col-xxs-12">
                                            <a href="#" className="fh5co-feature to-animate">
                                                <span className="fh5co-feature-icon"><i className="icon-eye"></i></span>
                                                <h3 className="fh5co-feature-lead" style={{marginTop: "20px", marginBottom: "10px"}}>Retina-ready</h3>
                                                <p className="fh5co-feature-text">Far far away behind the word mountains</p>
                                            </a>
                                        </div>
                                        <div className="col-md-3 col-sm-6 col-xs-6 col-xxs-12">
                                            <a href="#" className="fh5co-feature to-animate">
                                                <span className="fh5co-feature-icon"><i className="icon-cloud-download"></i></span>
                                                <h3 className="fh5co-feature-lead" style={{marginTop: "20px", marginBottom: "10px"}}>Download</h3>
                                                <p className="fh5co-feature-text">Far far away behind the word mountains</p>
                                            </a>
                                        </div>

                                        <div className="clearfix visible-sm-block"></div>

                                        <div className="fh5co-spacer fh5co-spacer-sm"></div>

                                        <div className="col-md-4 col-md-offset-4 text-center to-animate">
                                            <a href="#" className="btn btn-primary">View All Features</a>
                                        </div>
                                    </div>
                                </div>


                            </div>
 */}

                            {/* <div id="fh5co-faqs" data-section="faqs">
                                <div className="container">
                                    <div className="row">
                                        <div className="col-md-8 col-md-offset-2 fh5co-section-heading text-center">
                                            <h2 className="fh5co-lead animate-single faqs-animate-1">Frequently Ask Questions</h2>
                                            <p className="fh5co-sub animate-single faqs-animate-2">Far far away, behind the word mountains, far from the countries Vokalia and Consonantia, there live the blind texts.</p>
                                        </div>
                                    </div>
                                </div>


                                <div className="container">
                                    <div className="faq-accordion active to-animate">
                                        <span className="faq-accordion-icon-toggle active"><i className="icon-arrow-down"></i></span>
                                        <h3>What is Outline?</h3>
                                        <div className="faq-body" style={{display: "block"}}>
                                            <p>Far far away, behind the word mountains, far from the countries Vokalia and Consonantia, there live the blind texts. Separated they live in Bookmarksgrove right at the coast of the Semantics, a large language ocean. A small river named Duden flows by their place and supplies it with the necessary regelialia. It is a paradisematic country, in which roasted parts of sentences fly into your mouth. Even the all-powerful Pointing has no control about the blind texts it is an almost unorthographic life One day however a small line of blind text by the name of Lorem Ipsum decided to leave for the far World of Grammar.</p>
                                        </div>
                                    </div>
                                    <div className="faq-accordion to-animate">
                                        <span className="faq-accordion-icon-toggle"><i className="icon-arrow-down"></i></span>
                                        <h3>Is Outline Free?</h3>
                                        <div className="faq-body">
                                            <p>Far far away, behind the word mountains, far from the countries Vokalia and Consonantia, there live the blind texts. Separated they live in Bookmarksgrove right at the coast of the Semantics, a large language ocean. A small river named Duden flows by their place and supplies it with the necessary regelialia. It is a paradisematic country, in which roasted parts of sentences fly into your mouth. Even the all-powerful Pointing has no control about the blind texts it is an almost unorthographic life One day however a small line of blind text by the name of Lorem Ipsum decided to leave for the far World of Grammar.</p>
                                        </div>
                                    </div>
                                    <div className="faq-accordion to-animate">
                                        <span className="faq-accordion-icon-toggle"><i className="icon-arrow-down"></i></span>
                                        <h3>How do I use Outline Features?</h3>
                                        <div className="faq-body">
                                            <p>Far far away, behind the word mountains, far from the countries Vokalia and Consonantia, there live the blind texts. Separated they live in Bookmarksgrove right at the coast of the Semantics, a large language ocean. A small river named Duden flows by their place and supplies it with the necessary regelialia. It is a paradisematic country, in which roasted parts of sentences fly into your mouth. Even the all-powerful Pointing has no control about the blind texts it is an almost unorthographic life One day however a small line of blind text by the name of Lorem Ipsum decided to leave for the far World of Grammar.</p>
                                        </div>
                                    </div>
                                    <div className="faq-accordion to-animate">
                                        <span className="faq-accordion-icon-toggle"><i className="icon-arrow-down"></i></span>
                                        <h3>Which version of iOS do your apps support?</h3>
                                        <div className="faq-body">
                                            <p>Far far away, behind the word mountains, far from the countries Vokalia and Consonantia, there live the blind texts. Separated they live in Bookmarksgrove right at the coast of the Semantics, a large language ocean. A small river named Duden flows by their place and supplies it with the necessary regelialia. It is a paradisematic country, in which roasted parts of sentences fly into your mouth. Even the all-powerful Pointing has no control about the blind texts it is an almost unorthographic life One day however a small line of blind text by the name of Lorem Ipsum decided to leave for the far World of Grammar.</p>
                                        </div>
                                    </div>
                                    <div className="faq-accordion to-animate">
                                        <span className="faq-accordion-icon-toggle"><i className="icon-arrow-down"></i></span>
                                        <h3>What languages are available?</h3>
                                        <div className="faq-body">
                                            <p>Far far away, behind the word mountains, far from the countries Vokalia and Consonantia, there live the blind texts. Separated they live in Bookmarksgrove right at the coast of the Semantics, a large language ocean. A small river named Duden flows by their place and supplies it with the necessary regelialia. It is a paradisematic country, in which roasted parts of sentences fly into your mouth. Even the all-powerful Pointing has no control about the blind texts it is an almost unorthographic life One day however a small line of blind text by the name of Lorem Ipsum decided to leave for the far World of Grammar.</p>
                                        </div>
                                    </div>
                                    <div className="faq-accordion to-animate">
                                        <span className="faq-accordion-icon-toggle"><i className="icon-arrow-down"></i></span>
                                        <h3>I have technical problem, who do I email?</h3>
                                        <div className="faq-body">
                                            <p>Far far away, behind the word mountains, far from the countries Vokalia and Consonantia, there live the blind texts. Separated they live in Bookmarksgrove right at the coast of the Semantics, a large language ocean. A small river named Duden flows by their place and supplies it with the necessary regelialia. It is a paradisematic country, in which roasted parts of sentences fly into your mouth. Even the all-powerful Pointing has no control about the blind texts it is an almost unorthographic life One day however a small line of blind text by the name of Lorem Ipsum decided to leave for the far World of Grammar.</p>
                                        </div>
                                    </div>
                                </div>
                            </div> */}

                            {/* <div id="fh5co-subscribe">
                                <div className="container">
                                    <div className="row animate-box">
                                        
                                    </div>
                                </div>
                            </div> */}


                        </div>
                    </div>



                    {/* <footer id="fh5co-footer">
                        <div className="fh5co-overlay"></div>
                        <div className="fh5co-footer-content">
                            <div className="container">
                                <div className="row">
                                    <div className="col-md-3 col-sm-4 col-md-push-3">
                                        <h3 className="fh5co-lead">About</h3>
                                        <ul>
                                            <li><a href="#">Tour</a></li>
                                            <li><a href="#">Company</a></li>
                                            <li><a href="#">Jobs</a></li>
                                            <li><a href="#">Blog</a></li>
                                            <li><a href="#">New Features</a></li>
                                            <li><a href="#">Contact Us</a></li>
                                        </ul>
                                    </div>
                                    <div className="col-md-3 col-sm-4 col-md-push-3">
                                        <h3 className="fh5co-lead">Support</h3>
                                        <ul>
                                            <li><a href="#">Help Center</a></li>
                                            <li><a href="#">Terms of Service</a></li>
                                            <li><a href="#">Security</a></li>
                                            <li><a href="#">Privacy Policy</a></li>
                                            <li><a href="#">Careers</a></li>
                                            <li><a href="#">More Apps</a></li>
                                        </ul>
                                    </div>
                                    <div className="col-md-3 col-sm-4 col-md-push-3">
                                        <h3 className="fh5co-lead">More Links</h3>
                                        <ul>
                                            <li><a href="#">Feedback</a></li>
                                            <li><a href="#">Frequently Ask Questions</a></li>
                                            <li><a href="#">Terms of Service</a></li>
                                            <li><a href="#">Privacy Policy</a></li>
                                            <li><a href="#">Careers</a></li>
                                            <li><a href="#">More Apps</a></li>
                                        </ul>
                                    </div>

                                    <div className="col-md-3 col-sm-12 col-md-pull-9">
                                        <div className="fh5co-footer-logo"><a href="index.html">Outline</a></div>
                                        <p className="fh5co-copyright"><small>&copy; 2015. All Rights Reserved. <br />	by <a href="http://freehtml5.co/" target="_blank">FREEHTML5.co</a> assets/images: <a href="http://pexels.com/" target="_blank">Pexels</a></small></p>
                                        <p className="fh5co-social-icons">
                                            <a href="#"><i className="icon-twitter"></i></a>
                                            <a href="#"><i className="icon-facebook"></i></a>
                                            <a href="#"><i className="icon-instagram"></i></a>
                                            <a href="#"><i className="icon-dribbble"></i></a>
                                            <a href="#"><i className="icon-youtube"></i></a>
                                        </p>
                                    </div>

                                </div>
                            </div>
                        </div>
                    </footer>
                */}
               
                </div>
            </div>
        )
    }
}

export default Dashboard