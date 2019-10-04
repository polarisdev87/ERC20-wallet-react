import React, { Component } from 'react';
import { Table, Card, CardHeader, CardBody, Modal, ModalBody, ModalHeader, ButtonGroup, Button, ModalFooter } from 'reactstrap';

import utils from 'ethereumjs-util';

class DetailTable extends Component {
    constructor(props) {
        super(props);

        this.state = {
            modalSend: false,
            tokens: [],
            contractAddress: '',
            symbol: '',
            decimal: '',
            address: this.props.address,
            modalToken: false,
            modalPriv: false,
            to_address: '',
            amount: '',
            show_address_warning: false,
            show_amount_warning: false,
            private_key: '',
            token_buf: null,
        }

        this.toggleSend = this.toggleSend.bind(this);
        this.onChangeContractAddress = this.onChangeContractAddress.bind(this);
        this.onChangeSymbol = this.onChangeSymbol.bind(this);
        this.onChangeDecimal = this.onChangeDecimal.bind(this);
        this.addToken = this.addToken.bind(this);
        this.openPrivate  = this.openPrivate.bind(this);
        this.onChangeAddress = this.onChangeAddress.bind(this);
        this.onChangeAmount = this.onChangeAmount.bind(this);
        this.sendToken = this.sendToken.bind(this);
        this.onChangePrivKey = this.onChangePrivKey.bind(this);
        this.toggleToken = this.toggleToken.bind(this);
    }

    componentDidMount() {
        const address = this.props.address;
        fetch('/api/account/getTokens', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                address: address
            }),
        }).then(res => res.json())
        .then(json => {
            if(json.success) {
                this.setState({
                    tokens: json.tokens
                });
            }
            else {
                console.log(json.message);
            }
        });
    }

    toggleSend() {
        this.setState({
            modalSend: (!this.state.modalSend),
        });
    }

    toggleToken(token) {
        this.setState({
            token_buf: token,
            modalToken: (!this.state.modalToken),
            contractAddress: token.contract_address,
        });
    }

    openPrivate() {
        this.setState({
            modalPriv: (!this.state.modalPriv),
        });
    }

    onChangeAddress(event) {
        var address = event.target.value;
        if(utils.isValidAddress(address)){
            this.setState({
                to_address: address,
            });
        }
        else{
            this.setState({
                show_address_warning: true,
            });
        }
    }

    onChangeContractAddress(event){
        this.setState({
            contractAddress: event.target.value,
        });
        console.log(this.state.contractAddress);
    }

    onChangeSymbol(event) {
        this.setState({
            symbol: event.target.value
        });
    }

    onChangeDecimal(event) {
        this.setState({
            decimal: event.target.value
        });
    }
    
    onChangePrivKey(event) {
        this.setState({
            private_key: event.target.value,
        });
    }

    onChangeAmount(event) {
        var amount = parseFloat(event.target.value);
        if(amount > this.state.token_buf.balance){
            this.setState({
                show_amount_warning: true,
            });
        }
        else {
            this.setState({
                amount: amount,
            })
        }
    }

    addToken() {
        console.log('addToken');
        fetch('/api/account/addToken', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                address: this.props.address,
                contractAddress: this.state.contractAddress,
                symbol: this.state.symbol,
                decimal: this.state.decimal,
            }),
        }).then(res => res.json())
        .then(json => {
            if(json.success) {
                console.log(json);
                var buf_tokens = json.token;
                var tokens = this.state.tokens;
                tokens.push(buf_tokens);
                this.setState({
                    tokens: tokens,
                });
                this.toggleSend();
            }
            else {
                console.log("error");
            }
        });
    }

    sendToken() {
        this.openPrivate();
        this.setState({
            modalToken: false,
        });
        console.log(this.state.amount);
        fetch('/api/web3/sendToken', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                from_address: this.props.address,
                to_address: this.state.to_address,
                contractAddress: this.state.contractAddress,
                amount: this.state.amount,
                private_key: this.state.private_key,
            }),
        }).then(res => res.json())
        .then(json => {
            console.log(json);
            if(json.success){
                if(json.kind == 'hash'){
                    console.log("Transctionhash successfully created");
                }
                if(json.kind == 'end'){
                    console.log("Transaction finished successfully");
                }
            }
            else {
                console.log(json.err);
                console.log("Sending Token Failed!");
            }
        });
    }

    render() {
        return (
            <Card>
                <CardHeader>
                    <i className="fa fa-align-justify"></i> Tokens
                <ButtonGroup style={{ paddingLeft: "65vw" }}>
                    <Button onClick={this.props.onClickAccount} color="primary" style={{ display: "inline", float: 'right' }}>Back</Button>
                    <Button onClick={this.toggleSend} color="danger" style={{ display: "inline", float: 'right' }}>Add Token</Button>
                </ButtonGroup>
                </CardHeader>
                <CardBody>
                    <Modal isOpen={this.state.modalSend} toggle={this.toggleSend} className={this.props.className}>
                        <ModalHeader toggle={this.toggleSend}>Add Token</ModalHeader>
                        <ModalBody>
                            <p>Please Enter the Contract Address of Token which you want to add:</p>
                            <input type="text" style={{width: '100%',}} onChange={this.onChangeContractAddress} placeholder="Enter Token Address"></input>
                            <p style={{marginTop: '10px',}}>Please Enter the Symbol of your Token</p>
                            <input type="text" style={{width: '100%'}} onChange={this.onChangeSymbol} placeholder="Enter Symbol of your Token"></input>
                            <p style={{marginTop: '10px',}}>Please Input the Decimal of your Token</p>
                            <input type="text" style={{width: '100%'}} onChange={this.onChangeDecimal} placeholder="Enter Decimal of your Token"></input>
                        </ModalBody>
                        <ModalFooter>
                            <Button color="primary" onClick={this.addToken}>OK</Button>
                        </ModalFooter>
                    </Modal>
                    <Modal isOpen={this.state.modalToken} toggle={this.toggleToken} className={this.props.className}>
                        <ModalHeader toggle={this.toggleToken}>Send Token</ModalHeader>
                        <ModalBody>
                            <p>Please Enter Address which you are going to send tokens:</p>
                            <input type="text" style={{width: '100%',}} onChange={this.onChangeAddress} placeholder="Enter Ethereum Address which you are going to Send Token"></input>
                            {
                                (this.state.show_address_warning) ? (
                                    <span className="danger" style={{color: 'red',}}>Invalid Ethereum Address</span>
                                ) : (null)
                            }
                            <p style={{marginTop: '10px',}}>Please Enter Amount of Token</p>
                            <input type="text" style={{width: '100%'}} onChange={this.onChangeAmount} placeholder="Enter Amount of token"></input>
                            {
                                (this.state.show_address_warning) ? (
                                    <span className="danger" style={{color: 'red',}}>Amount can not be larger than Token Balance</span>
                                ) : (null)
                            }
                        </ModalBody>
                        <ModalFooter>
                            <Button color="primary" onClick={this.openPrivate}>OK</Button>
                        </ModalFooter>
                    </Modal>
                    <Modal isOpen={this.state.modalPriv} toggle={this.openPrivate} className={this.props.className}>
                        <ModalHeader toggle={this.openPrivate}>Send Token</ModalHeader>
                        <ModalBody>
                            <p style={{marginTop: '10px',}}>Please Enter Your Private Key</p>
                            <input type="text" style={{width: '100%'}} onChange={this.onChangePrivKey} placeholder="Enter Symbol of your Token"></input>
                        </ModalBody>
                        <ModalFooter>
                            <Button color="primary" onClick={this.sendToken}>OK</Button>
                        </ModalFooter>
                    </Modal>
                    <Table responsive>
                        <thead>
                            <tr>
                                <th>No</th>
                                <th>Token Name</th>
                                <th>Decimal</th>
                                <th>Balance</th>
                                <th>Send</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                this.state.tokens.map((token, index) => (
                                    <tr key={index}>
                                        <td>{index + 1 }</td>
                                        <td>{token.symbol}</td>
                                        <td>{token.contract_address}</td>
                                        <td>{token.balance}</td>
                                        <td><button onClick={() => this.toggleToken(token)}>Send Token</button></td>
                                    </tr>
                                ))
                            }
                        </tbody>
                    </Table>
                </CardBody>
            </Card>
        );
    }
}

export default DetailTable;