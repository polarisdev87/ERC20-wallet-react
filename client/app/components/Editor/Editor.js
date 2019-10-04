import React, { Component } from 'react';
import { AppBreadcrumb } from '@coreui/react';
import { Badge, Button, ButtonGroup, Col, Card, CardHeader, CardBody, Modal, ModalHeader, ModalBody, ModalFooter, Table, Pagination, PaginationItem, PaginationLink, Nav, NavItem, NavLink, TabContent, TabPane, Container } from 'reactstrap';
import classnames from 'classnames';
import {
    getFromStorage
} from '../../utils/storage';
import AccountTable from './Datatable';
import DetailTable from './Detailtable';
const apikey = "M7JA5HWZHCTBN8JMYE5YBQVE3TWZRA6VIE";
const uri = "https://api-ropsten.etherscan.io/";

import utils from 'ethereumjs-util';


class Editor extends Component {
    constructor(props) {
        super(props);
        this.toggle = this.toggle.bind(this);
        this.state = {
            activeTab: '1',
            accounts: [],
            address_buf: '',
            privKey_buf: '',
            modalCreate: false,
            modalLoad: false,
            modalSend: false,
            modalPriv: false,
            privateKey_buf: '',
            ethprice: 0,
            mode_account: true,
            contractAddress: '',
        };

        this.createAccount = this.createAccount.bind(this);
        this.privToAddress = this.privToAddress.bind(this);
        this.getAccounts = this.getAccounts.bind(this);
        this.toggleCreate = this.toggleCreate.bind(this);
        this.toggleSend = this.toggleSend.bind(this);
        this.toggleLoad = this.toggleLoad.bind(this);
        this.togglePriv = this.togglePriv.bind(this);
        this.onClickAccount = this.onClickAccount.bind(this);
        this.onChangePrivateKey = this.onChangePrivateKey.bind(this);
        this.onChangeToAddress = this.onChangeToAddress.bind(this);
        this.onChangeEtherAmount = this.onChangeEtherAmount.bind(this);
        this.sendEther = this.sendEther.bind(this);
        this.send = this.send.bind(this);
    }

    toggleCreate() {
        console.log("OK button pressed")
        this.setState({
            modalCreate: (!this.state.modalCreate)
        });
    }

    toggleLoad() {
        this.setState({
            modalLoad: (!this.state.modalLoad),
        });
    }

    toggleSend() {
        this.setState({
            modalSend: (!this.state.modalSend)
        });
    }

    toggle(tab) {
        if (this.state.activeTab !== tab) {
            this.setState({
                activeTab: tab,
            });
        }
    }

    togglePriv() {
        this.setState({
            modalSend: false,
            modalPriv: (!this.state.modalPriv),
        });
    }
    
    onClickAccount(account) {
        const address = account.address;
        this.setState({
            mode_account: (!this.state.mode_account),
            address_buf: address,
        });
    }

    componentWillMount(){

        const email_buf = getFromStorage('email');
        if(email_buf) {
            this.setState({
                email: email_buf.email,
            });
        }
    }

    componentDidMount() {
        const email_buf = getFromStorage('email');
        if(email_buf) {
            this.setState({
                email: email_buf.email,
            });
        }
        console.log(this.state.email);
        fetch(uri + "api?module=stats&action=ethprice&apikey=" + apikey)
            .then(res => res.json())
            .then(json => {
                console.log(json.result);
                this.setState({
                    ethprice: parseFloat(json.result.ethusd),
                });
            });
        this.getAccounts();
    }

    createAccount() {
        const { email } = this.state;
        console.log(email);
        fetch('/api/web3/createAccount', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: email,
            }),
        }).then(res => res.json())
            .then(json => {
                if (json.success) {
                    console.log(json.register_date);
                    this.setState({
                        address_buf: json.address,
                        privKey_buf: json.privateKey,
                    });
                    const account = {
                        email: email,
                        address: json.address,
                        register_date: json.register_date
                    }
                    this.state.accounts.push(account);
                    this.toggleCreate();
                }
                else {
                    console.log("Error");
                }
            });
    }

    privToAddress() {
        const { privKey_buf } = this.state;
        const { email } = this.state;
        fetch('/api/web3/privToAddress', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                privKey: privKey_buf,
                email: email,
            }),
        }).then(res => res.json())
            .then(json => {
                if (json.success) {
                    var account = {
                        address: json.address,
                        email: email,
                        register_date: json.register_date
                    };
                    this.state.accounts.push(account);
                    this.setState({
                        address_buf: json.address
                    })
                    this.toggleLoad();
                    this.toggleCreate();
                    console.log(json.address);
                }
                else {
                    console.log("error");
                }
            })
    }

    getAccounts() {
        const { email } = this.state;
        console.log(email);
        fetch('/api/account/getAccounts', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: email,
            }),
        }).then(res => res.json())
            .then(json => {
                if (json.success) {
                    var result = json.accounts;
                    var url = uri + "api?module=account&action=balancemulti&address=";
                    var index = 0;
                    for (; index < result.length; index++) {
                        if (index == result.length - 1) {
                            url += result[index].address;
                        }
                        else {
                            url += result[index].address + ',';
                        }
                    }
                    url += "&tag=latest&apikey=" + apikey;
                    fetch(url).then(res => res.json())
                        .then(json => {
                            console.log(json);
                            for (index = 0; index < result.length; index++) {
                                result[index].balance = parseFloat(json.result[index].balance)/(10**18);
                                result[index].price = this.state.ethprice * result[index].balance;
                            }
                            this.setState({
                                accounts: result
                            });
                        });
                }
                else {
                    console.log('server error');
                }
            });
    }

    sendEther(account) {
        this.setState({
            account_buf: account,
        });
        this.toggleSend();
    }

    sendToken(contract) {
        this.setState({
            contractAddress: contract.address,
        });
        this.toggleSend();
    }

    onChangePrivateKey(event) {
        this.setState({
            privKey_buf: event.target.value,
        })
    }

    onChangeEtherAmount(event) {
        var ether_amount = parseFloat(event.target.value);
        const {account_buf} = this.state;
        var balance  = parseFloat(account_buf.balance);
        if(balance < ether_amount) {
            this.setState({
                show_warning: true,
                warning_message: "Amount can not larger than Balance!",
            });
        }
        else {
            this.setState({
                show_warning: false,
                ether_amount: event.target.value,
            });
        }
    }

    onChangeToAddress(event) {
        if(utils.isValidAddress(event.target.value)){
            this.setState({
                show_address_warning: false,
                to_address: event.target.value
            });
        }
        else {
            this.setState({
                show_address_warning: true,
                address_warning_message: "Invalid Address"
            })
        }
    }

    send() {
        const {account_buf} = this.state;
        const {ether_amount, to_address} = this.state;
        const from_address = account_buf.address;
        const balance  = parseFloat(account_buf.balance);
        var amount = parseFloat(ether_amount);

        fetch('/api/web3/sendEther', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                from_address: from_address,
                to_address: to_address,
                amount: amount,
                private_key: this.state.privKey_buf,
            }),
        }).then(res => res.json())
        .then(json => {
            if(json.success) {
                console.log("Sending Ether successful!");
            }
            else {
                console.log("Sending Ether failed!");
            }
        });
        this.togglePriv();
        
    }

    render() {
        return (
            <main className="main">
                <AppBreadcrumb />
                <Container fluid>
                    <Col xs="12" md="12" className="mb-12">
                        <Nav tabs>
                            <NavItem>
                                <NavLink
                                    className={classnames({ active: this.state.activeTab === '1' })}
                                    onClick={() => { this.toggle('1'); }}
                                >
                                    Accounts
                                </NavLink>
                            </NavItem>
                            <NavItem>
                                <NavLink
                                    className={classnames({ active: this.state.activeTab === '2' })}
                                    onClick={() => { this.toggle('2'); }}
                                >
                                    Transaction History
                                </NavLink>
                            </NavItem>
                            <NavItem>
                                <NavLink
                                    className={classnames({ active: this.state.activeTab === '3' })}
                                    onClick={() => { this.toggle('3'); }}
                                >
                                    Messages
                                </NavLink>
                            </NavItem>
                        </Nav>
                        <TabContent activeTab={this.state.activeTab}>
                            <TabPane tabId="1">
                                <Col xs="12" lg="12">
                                    {(this.state.mode_account) ? (
                                        <AccountTable toggleCreate={this.toggleCreate}
                                            modalCreate={this.state.modalCreate}
                                            onChangePrivateKey={this.onChangePrivateKey}
                                            accounts={this.state.accounts}
                                            toggleLoad={this.toggleLoad}
                                            createAccount={this.createAccount}
                                            address_buf={this.state.address_buf}
                                            privKey_buf={this.state.privKey_buf}
                                            sendEther={this.sendEther}
                                            onClickAccount={this.onClickAccount} />
                                    ) : (
                                            <DetailTable 
                                                address={this.state.address_buf}
                                                onClickAccount={this.onClickAccount} />
                                        )
                                    }
                                        <Modal isOpen={this.state.modalLoad} toggle={this.toggleLoad} className={this.props.className}>
                                            <ModalHeader toggle={this.toggleLoad}>Load Account</ModalHeader>
                                            <ModalBody>
                                                <p>Please Enter Private Key Of Your Account</p>
                                                <input type="text" onChange={this.onChangePrivateKey} placeholder="Enter Private Key" />
                                            </ModalBody>
                                            <ModalFooter>
                                                <Button color="primary" onClick={this.privToAddress}>OK</Button>
                                            </ModalFooter>
                                        </Modal>
                                        <Modal isOpen={this.state.modalPriv} toggle={this.togglePriv} className={this.props.className}>
                                            <ModalHeader toggle={this.togglePriv}>Input Private Key</ModalHeader>
                                            <ModalBody>
                                                <p>Please Enter Private Key Of Your Account</p>
                                                <input type="text" onChange={this.onChangePrivateKey} placeholder="Enter Private Key" />
                                            </ModalBody>
                                            <ModalFooter>
                                                <Button color="primary" onClick={this.send}>OK</Button>
                                            </ModalFooter>
                                        </Modal>
                                        <Modal isOpen={this.state.modalSend} toggle={this.toggleSend} className={this.props.className}>
                                            <ModalHeader toggle={this.toggleSend}>Input Information of Sending</ModalHeader>
                                            <ModalBody>
                                                <p>Please Enter Ethereum Address which you are going to send ether</p>
                                                <input type="text" style={{width: '100%'}} onBlur={this.onChangeToAddress} placeholder="Enter Ethereum Address" />
                                                {
                                                    (this.state.show_address_warning) ? (
                                                        <span style={{color: 'red'}} className="warning">{this.state.address_warning_message}</span>
                                                    ) : (null)
                                                }
                                                <p>Please Enter Amount of Ether</p>
                                                <input type="text" style={{width: '100%'}} onChange={this.onChangeEtherAmount} placeholder="Enter Ether Amount"></input>
                                                {
                                                    (this.state.show_warning) ? (
                                                        <span style={{color: 'red'}} className="warning">{this.state.warning_message}</span>
                                                    ) : (null)
                                                }
                                            </ModalBody>
                                            <ModalFooter>
                                                <Button color="primary" onClick={this.togglePriv}>OK</Button>
                                            </ModalFooter>
                                        </Modal>

                                </Col>
                            </TabPane>
                        </TabContent>
                    </Col>
                </Container>
            </main>
        );
    }
}

export default Editor;