import React, { Component } from 'react';

import 'whatwg-fetch';
import { Button, Card, CardBody, CardGroup, Col, Container, Form, Input, InputGroup, InputGroupAddon, InputGroupText, Row } from 'reactstrap';

import {
  getFromStorage,
  setInStorage
} from '../../utils/storage';

class Home extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: true,
      token: '',
      signUpError: '',
      signInError: '',
      signInEmail: '',
      signInPassword: '',
      signUpEmail: '',
      signUpPassword: '',
      verify: false,
    };

    this.onTextboxChangeSignInEmail = this.onTextboxChangeSignInEmail.bind(this);
    this.onTextboxChangeSignInPassword = this.onTextboxChangeSignInPassword.bind(this);
    this.onTextboxChangeSignUpEmail = this.onTextboxChangeSignUpEmail.bind(this);
    this.onTextboxChangeSignUpPassword = this.onTextboxChangeSignUpPassword.bind(this);

    this.onSignIn = this.onSignIn.bind(this);
    this.register = this.register.bind(this);
  }

  componentWillMount() {

    const obj = getFromStorage('the_main_app');
    if(obj && obj.token) {
      console.log('entered')
      const {token} = obj;
      fetch('/api/account/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          token: token,
        }),
      })
      .then(res => res.json())
      .then(json => {
        console.log(json)
        if(json.success) {
          console.log(token);
          this.setState({
            token: token,
            isLoading: false
          });
        } else {
          this.setState({
            isLoading: false
          });
        }
      });
    } else {
      this.setState({
        isLoading: false,
      });
    }
  }

  componentDidMount() {
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

  onTextboxChangeSignUpEmail(event) {
    this.setState({
      signUpEmail: event.target.value,
    });
  }

  onTextboxChangeSignUpPassword(event) {
    this.setState({
      signUpPassword: event.target.value,
    });
  }

  register() {
    window.location.assign('/register');
  }

  onSignIn() {
    const {
      signInEmail,
      signInPassword,
    } = this.state;

    this.setState({
      isLoading: true,
    });

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
      if(json.success) {
        console.log(json)
        setInStorage('the_main_app', { token: json.token });
        setInStorage('email', {email: signInEmail});
        setInStorage('username', {username: json.username});
        this.setState({
          signInError: json.message,
          isLoading: false,
          signInPassword: '',
          signInEmail: '',
          token: json.token
        });
        
      } else {
        this.setState({
          isLoading: false,
          signInError: json.message,
        });
      }
    });
  }

  render() {
    const {
      isLoading,
      token,
      signInError,
      signInEmail,
      signInPassword,
      signUpEmail,
      signUpPassword,
      signUpError,
    } = this.state;

    if(token == '') {
      return (
              <div className="app flex-row align-items-center">
                <Container>
                  <Row className="justify-content-center">
                    <Col md="8">
                      <CardGroup>
                        <Card className="p-4">
                          <CardBody>
                            <Form>
                              <h1>Login</h1>
                              <p className="text-muted">Sign In to your account</p>
                              <InputGroup className="mb-3">
                                <InputGroupAddon addonType="prepend">
                                  <InputGroupText>
                                    <i className="icon-user"></i>
                                  </InputGroupText>
                                </InputGroupAddon>
                                <Input type="text" name="email" placeholder="Email" autoComplete="email" onChange={this.onTextboxChangeSignInEmail} />
                              </InputGroup>
                              <InputGroup className="mb-4">
                                <InputGroupAddon addonType="prepend">
                                  <InputGroupText>
                                    <i className="icon-lock"></i>
                                  </InputGroupText>
                                </InputGroupAddon>
                                <Input type="password" placeholder="Password" name="password" onChange={this.onTextboxChangeSignInPassword} autoComplete="current-password" />
                              </InputGroup>
                              <Row>
                                <Col xs="6">
                                  <Button color="primary" className="px-4" onClick={this.onSignIn}>Login</Button>
                                </Col>
                              </Row>
                            </Form>
                          </CardBody>
                        </Card>
                        <Card className="text-white bg-primary py-5 d-md-down-none" style={{ width: 44 + '%' }}>
                          <CardBody className="text-center">
                            <div>
                              <h2>Sign up</h2>
                              <p>If you don't have an account, please sign up by click the button above.</p>
                              <Button color="primary" className="mt-3" active onClick={this.register}>Register Now!</Button>
                            </div>
                          </CardBody>
                        </Card>
                      </CardGroup>
                    </Col>
                  </Row>
                </Container>
              </div>
      );
    }
    else{
      window.location.assign('/dashboard?token='+token);
    }
  }
}

export default Home;
