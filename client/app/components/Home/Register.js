import React, { Component } from 'react';
import { Alert, Button, Card, CardBody, CardFooter, Col, Container, Form, Input, InputGroup, InputGroupAddon, InputGroupText, Row } from 'reactstrap';


class Register extends Component {
    constructor(props) {
        super(props);

        this.state = {
            signUpUsername: '',
            signUpEmail: '',
            signUpPassword: '',
            signUpError: '',
            signUpConfirmError: ''
        }

        this.onChangeConfirm = this.onChangeConfirm.bind(this);
        this.onChangeUsername = this.onChangeUsername.bind(this);
        this.onChangeEmail = this.onChangeEmail.bind(this);
        this.onChangePassword = this.onChangePassword.bind(this);
        this.onSignUp = this.onSignUp.bind(this);
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
    }

    onSignUp()
    {
        const {
            signUpEmail,
            signUpPassword,
            signUpConfirmError,
            signUpUsername
          } = this.state;
      
        this.setState({
            isLoading: true,
        });

        if(signUpConfirmError == "") {
      
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
            console.log('json', json);
            if(json.success) {
              this.setState({
                signUpError: json.message,
                signUpEmail: '',
                signUpPassword: '',
                signUpUsername: '',
              });
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
        const {
            signUpConfirmError,
            signUpEmail,
            signUpPassword,
            signUpError
        } = this.state;
        if(signUpError != "Signed up"){
            return(
                <div className="app flex-row align-items-center">
                    <Container>
                    <Row className="justify-content-center">
                        <Col md="6">
                        <Card className="mx-4">
                            <CardBody className="p-4">
                            <Form>
                                <h1>Register</h1>
                                <p className="text-muted">Create your account</p>
                                <InputGroup className="mb-3">
                                {
                                    (signUpError) ? (
                                        <Alert color="danger">
                                            {signUpError}
                                        </Alert>
                                    ) : (null)
                                }
                                </InputGroup>
                                <InputGroup className="mb-3">
                                    <InputGroupText>
                                    <i className="icon-lock"></i>
                                    </InputGroupText>
                                    <Input type="text" placeholder="Username" autoComplete="username" onChange={this.onChangeUsername}/>
                                </InputGroup>
                                <InputGroup className="mb-3">
                                <InputGroupAddon addonType="prepend">
                                    <InputGroupText>
                                    <i className="icon-lock"></i>
                                    </InputGroupText>
                                </InputGroupAddon>
                                <Input type="text" placeholder="Email" autoComplete="email" onChange={this.onChangeEmail}/>
                                </InputGroup>
                                <InputGroup className="mb-3">
                                <InputGroupAddon addonType="prepend">
                                    <InputGroupText>
                                    <i className="icon-lock"></i>
                                    </InputGroupText>
                                </InputGroupAddon>
                                <Input type="password" name="password" placeholder="Password" autoComplete="new-password" onChange={this.onChangePassword} />
                                </InputGroup>
                                <InputGroup className="mb-4">
                                <InputGroupAddon addonType="prepend">
                                    <InputGroupText>
                                    <i className="icon-lock"></i>
                                    </InputGroupText>
                                </InputGroupAddon>
                                    <Input type="password" name="confirm" placeholder="Repeat password" autoComplete="new-password" onBlur={this.onChangeConfirm}/>
                                    
                                    { (signUpConfirmError) ? (
                                        <Alert color="danger" className="register-alert">
                                            {signUpConfirmError}
                                        </Alert>
                                        ) : (null)
                                    }
                                </InputGroup>
                                <Button color="success" onClick={this.onSignUp}>Create Account</Button>
                            </Form>
                            </CardBody>
                        </Card>
                        </Col>
                    </Row>
                    </Container>
                </div>
            );
        }
        else {
            window.location.assign('/');
        }
    }
}

export default Register;