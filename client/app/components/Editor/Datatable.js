import React, { Component } from 'react';
import { Table,Card, CardHeader, CardBody, ButtonGroup, Button, Modal, ModalBody, ModalHeader, ModalFooter } from 'reactstrap';

class AccountTable extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <Card>
            <CardHeader>
                <i className="fa fa-align-justify"></i> Account Table
                                            <ButtonGroup style={{ paddingLeft: "65vw" }}>
                    <Button onClick={this.props.createAccount} color="primary" style={{ display: "inline", float: 'right' }}>Create New Account</Button>
                    <Button onClick={this.props.toggleLoad} color="danger" style={{ display: "inline", float: 'right' }}>Load Account</Button>
                </ButtonGroup>
            </CardHeader>
            <CardBody>
                <Modal isOpen={this.props.modalCreate} toggle={this.props.toggleCreate} className={this.props.className}>
                    <ModalHeader toggle={this.props.toggleCreate}>Modal title</ModalHeader>
                    <ModalBody>
                        <p>Your account address is {this.props.address_buf}</p>
                        <p style={{ wordWrap: 'break-word' }}>The Private key of your account is {this.props.privKey_buf}</p>
                    </ModalBody>
                    <ModalFooter>
                        <Button color="primary" onClick={this.props.toggleCreate}>OK</Button>
                    </ModalFooter>
                </Modal>
                <Table responsive>
                    <thead>
                        <tr>
                            <th>No</th>
                            <th>Email</th>
                            <th>Date registered</th>
                            <th>Address</th>
                            <th>Ether Balance</th>
                            <th>Ether Price</th>
                            <th>Send Ether</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.props.accounts.map((account, index) => (
                            <tr key={index} >
                                <td onClick={() => this.props.onClickAccount(account)}>{index + 1}</td>
                                <td onClick={() => this.props.onClickAccount(account)}>{account.email}</td>
                                <td onClick={() => this.props.onClickAccount(account)}>{account.register_date}</td>
                                <td onClick={() => this.props.onClickAccount(account)}>{account.address}</td>
                                <td onClick={() => this.props.onClickAccount(account)}>{account.balance}</td>
                                <td onClick={() => this.props.onClickAccount(account)}>${account.price}</td>
                                <td><button onClick={() => this.props.sendEther(account)}>Send Ether</button></td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </CardBody>
            </Card>
        );
    }
}

export default AccountTable;