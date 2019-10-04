import React, { Component } from 'react'
import {CopyToClipboard} from 'react-copy-to-clipboard'
import Header from './Header'
import Footer from './Footer'

import '../../styles/dashboard/mainpage_base.css'
import '../../styles/dashboard/mainpage_base01.css'
const apikey = "M7JA5HWZHCTBN8JMYE5YBQVE3TWZRA6VIE";
const uri = "https://api.etherscan.io/";

import { getFromStorage, setInStorage, removeStorage } from '../../utils/storage'

class Wallet extends Component {
    constructor(props) {
        super(props)

        this.state = {
            token: '',
            username: '',
            ether_address: '',
            privateKey: '',
            ether_balance: '',
            contract_address_buf: '',
            token_symbol_buf: '',
            token_decimal_buf: '',
            tokens: [],
            receiver_address: '',
            send_amount: '',
            selected_token_symbol: 'ETH',
            avail_amount: '',
            histories: []
        }

        this.onContractAddress = this.onContractAddress.bind(this)
        this.onTokenDecimal = this.onTokenDecimal.bind(this)
        this.onTokenSymbol = this.onTokenSymbol.bind(this)
        this.addToken = this.addToken.bind(this)
        this.onReceiverAddress = this.onReceiverAddress.bind(this)
        this.onSendAmount = this.onSendAmount.bind(this)
        this.onSelectToken = this.onSelectToken.bind(this)
        this.sendToken = this.sendToken.bind(this)
        this.getHistory = this.getHistory.bind(this)

        this.onProfile = this.onProfile.bind(this)
        this.onSecurity = this.onSecurity.bind(this)
        this.onEther = this.onEther.bind(this)
        this.onPass = this.onPass.bind(this)
        this.onLogout = this.onLogout.bind(this)
    }

    onProfile() {
        setInStorage("setting", {setting: "profile"})
        window.location.assign('/setting')
    }

    onSecurity() {
        setInStorage("setting", {setting: 'security'})
        window.location.assign('/setting')
    }

    onEther() {
        setInStorage("setting", {setting: 'ether'})
        window.location.assign('/setting')
    }

    onPass() {
        setInStorage("setting", {setting: 'pass'})
        window.location.assign('/setting')
    }

    onLogout() {
        removeStorage('token')
        removeStorage('username')
        removeStorage('address')
        removeStorage('setting')
        removeStorage('privateKey')
        window.location.assign('/')
    }

    getHistory() {
        this.setState({
            histories: []
        })
        const {ether_address} = this.state
        fetch('/api/web3/getTransactionHistory', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                address: ether_address,
            }),
        }).then(res => res.json())
        .then(json => {
            if(json.success) {
                var histories = json.history;
                histories.map((history, index) => {
                    var url = uri + 'api?module=proxy&action=eth_getTransactionByHash&txhash=' + history.hash;
                    url += '&apikey=' + apikey;
                    fetch(url).then(res => res.json())
                    .then(json => {
                        var buf = this.state.histories
                        var result = json.result
                        result.time = history.time
                        buf.push(json.result)
                        this.setState({
                            histories: buf
                        })
                    })
                })
            }
        });
    }

    onReceiverAddress(event) {
        this.setState({
            receiver_address: event.target.value
        })
    }

    onSendAmount(event) {
        this.setState({
            send_amount: event.target.value
        })
    }

    onSelectToken(event) {
        this.setState({
            selected_token_symbol: event.target.value
        })
        if(event.target.value == "ETH"){
            this.setState({
                avail_amount: this.state.ether_balance
            })
        }
        else {
            const {tokens} = this.state
            tokens.map((token, index) => {
                if(token.symbol == event.target.value){
                    this.setState({
                        avail_amount: token.balance
                    })
                }
            })
        }
    }

    sendToken() {
        const {selected_token_symbol, receiver_address, send_amount, ether_address, privateKey} = this.state
        if(selected_token_symbol=="ETH"){
            fetch('/api/web3/sendEther', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    from_address: ether_address,
                    to_address: receiver_address,
                    amount: send_amount,
                    private_key: privateKey,
                }),
            }).then(res => res.json())
            .then(json => {
                window.location.assign('/wallet')
            });
        }
        else {
            const {tokens} = this.state
            tokens.map((token, index) => {
                if(token.symbol == selected_token_symbol){
                    fetch('/api/web3/sendToken', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            from_address: ether_address,
                            to_address: receiver_address,
                            contractAddress: token.contract_address,
                            amount: send_amount,
                            private_key: privateKey,
                        }),
                    }).then(res => res.json())
                    .then(json => {
                        if(json.success){
                            window.location.assign('/wallet')
                        }
                    });
                }
            })
        }
    }

    onContractAddress(event) {
        this.setState({
            contract_address_buf: event.target.value
        })
    }

    onTokenDecimal(event) {
        this.setState({
            token_decimal_buf: event.target.value
        })
    }

    onTokenSymbol(event) {
        this.setState({
            token_symbol_buf: event.target.value
        })
    }

    addToken() {
        const { contract_address_buf, token_symbol_buf, token_decimal_buf } = this.state
        if (contract_address_buf != "") {
            fetch('/api/account/addToken', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    address: this.state.ether_address,
                    contractAddress: contract_address_buf,
                    symbol: token_symbol_buf,
                    decimal: token_decimal_buf,
                }),
            }).then(res => res.json())
                .then(json => {
                    if (json.success) {
                        var buf_tokens = json.token;
                        var tokens = this.state.tokens;
                        tokens.push(buf_tokens);
                        this.setState({
                            tokens: tokens,
                        });
                    }
                });
        }
    }

componentWillMount() {
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
                console.log(json);
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
        window.location.assign('/')
    }

    var url = uri + "api?module=account&action=balancemulti&address=" + ether_address_buf;
    url += "&tag=latest&apikey=" + apikey;
    console.log(url);
    fetch(url).then(res => res.json())
        .then(json => {
            var balance = parseFloat(json.result[0].balance)/(10**18);
            console.log(balance);
            this.setState({
                ether_balance: balance,
                avail_amount: balance,
            })
        });

    fetch('/api/account/getTokens', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            address: ether_address_buf
        }),
    }).then(res => res.json())
        .then(json => {
            if (json.success) {
                this.setState({
                    tokens: json.tokens
                });
            }
        });

}

render() {
    const {tokens} = this.state
    return (
        <div>
            <Header username={this.state.username} onLogout={this.onLogout} onProfile={this.onProfile} onSecurity={this.onSecurity} onEther={this.onSecurity} onPass={this.onPass}/>
            <div className="bgimg-1 w3-display-container" style={{ padding: "128px 16px 64px 16px", minHeight: "85%" }}>
                <div className="container" style={{ padding: "60px", background: "white" }}>
                    <ul className="nav nav-tabs nav-justified">
                        <li className="active"><a data-toggle="tab" href="#tabAccounts">Accounts</a></li>
                        <li ><a data-toggle="tab" href="#tabTransHistory" onClick={this.getHistory}>Transaction History</a></li>
                        <li><a data-toggle="tab" href="#tabMessages">Messages</a></li>
                        <li><a data-toggle="tab" href="#tabComingSoon">Coming Soon</a></li>
                    </ul>

                    <div className="tab-content">
                        <div id="tabAccounts" className="tab-pane fade in active" style={{ paddingTop: "30px" }}>
                            <div className="form-horizontal">
                                <div className="form-group">
                                    <div className="col-sm-offset-9 col-sm-3">
                                        <button type="button" className="btn btn-warning pull-right" data-toggle="modal" data-target="#modalAddToken" style={{
                                            borderRadius: "4px",
                                            height: "34px",
                                            width: "95px",
                                            letterSpacing: '0',
                                            paddingTop: "8px",
                                            textTransform: "none",
                                            paddingLeft: "12px",
                                            fontSize: "14px",
                                        }}>Add Token</button>
                                    </div>
                                </div>

                                <div className="form-group">
                                    <label className="control-label col-sm-3" htmlFor="ethAmount">ETH AMOUNT:</label>
                                    <div className="col-sm-9">
                                        <input type="number" className="form-control" id="inptEthAmount" placeholder="ETH AMOUNT" value={this.state.ether_balance} disabled />
                                    </div>
                                </div>
                                {
                                    tokens.map((token, index) => (
                                    <div className="form-group" key={index}>
                                        <label className="control-label col-sm-3" htmlFor="token101">{token.symbol + " AMOUNT:"}</label>
                                        <div className="col-sm-9">
                                            <input type="number" className="form-control" id="inptToken101" placeholder="TOKEN101 AMOUNT" value={token.balance} disabled />
                                        </div>
                                    </div>))
                                }
                                <div className="form-group text-center" style={{ paddingTop: "25px" }}>
                                    <a data-toggle="tab" href="#tabSendCoin" className="btn btn-primary" style={{
                                        minWidth: "80px", borderRadius: "4px",
                                        height: "34px",
                                        width: "95px",
                                        letterSpacing: '0',
                                        paddingTop: "6px",
                                        textTransform: "none",
                                        paddingLeft: "11px",
                                        fontSize: "14px",
                                        paddingTop: "8px"
                                    }}>Send Coin</a> &nbsp;&nbsp;
                                        <a data-toggle="tab" href="#tabReceiveCoin" className="btn btn-info" style={{
                                        minWidth: "80px", borderRadius: "4px",
                                        height: "34px",
                                        width: "95px",
                                        letterSpacing: '0',
                                        paddingTop: "6px",
                                        textTransform: "none",
                                        paddingLeft: "20px",
                                        fontSize: "14px",
                                        paddingTop: "8px"
                                    }}>Receive</a>
                                </div>
                            </div>
                        </div>
                        <div id="tabTransHistory" className="tab-pane fade " style={{ paddingTop: "30px" }}>
                            <div className="table-responsive">
                                <table className="table table-condensed w3-center" style={{ tableLayout: "fixed" }}>
                                    <thead>
                                        <tr style={{ background: "grey" }}>
                                            <th className="col-md-2" style={{ textAlign: "center" }}>TxHash</th>
                                            <th className="col-md-2" style={{ textAlign: "center" }}>Block</th>
                                            <th className="col-md-3" style={{ textAlign: "center" }}>To</th>
                                            <th className="col-md-1" style={{ textAlign: "center" }}>Status</th>
                                            <th className="col-md-1" style={{ textAlign: "center" }}>Time</th>
                                            <th className="col-md-2" style={{ textAlign: "center" }}>Value</th>
                                            <th className="col-md-1" style={{ textAlign: "center" }}>TxFee</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            this.state.histories.map((history, index) => (
                                                <tr>
                                                    <td>{history.hash}</td>
                                                    <td>{parseInt(history.blockNumber)}</td>
                                                    <td>{history.to}</td>
                                                    <td>{"OUT"}</td>
                                                    <td>{history.time}</td>
                                                    <td>{parseInt(history.value)}</td>
                                                    <td>{parseInt(history.s)}</td>
                                                </tr>
                                            ))
                                        }
                                    </tbody>
                                </table>
                            </div>

                        </div>
                        <div id="tabMessages" className="tab-pane fade" style={{ paddingTop: "30px" }}>
                            <h3>Menu 2</h3>
                            <p>Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam.</p>
                        </div>
                        <div id="tabComingSoon" className="tab-pane fade" style={{ paddingTop: "30px" }}>
                            <h3>Menu 3</h3>
                            <p>Eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.</p>
                        </div>

                        <div id="tabSendCoin" className="tab-pane fade" style={{ paddingTop: "30px" }}>
                            <a data-toggle="tab" href="#tabAccounts" className="btn btn-primary" style={{ minWidth: "80px" }}> {"<< Go Back"}</a>
                            <h3 className="w3-center" style={{ padding: "30px" }}>Send Coin</h3>
                            <div className="form-horizontal">
                                <div className="form-group">
                                    <label className="control-label col-sm-3" htmlFor="ethAmount">COIN TO SEND:</label>
                                    <div className="col-sm-9">
                                        <select name="coin" className="form-control" id="coinToSend" onChange={this.onSelectToken}>
                                            <option value="ETH">ETH</option>
                                            {
                                                tokens.map((token, index) => (
                                                    <option value={token.symbol} key={index}>{token.symbol}</option>
                                                ))
                                            }
                                        </select>
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label className="control-label col-sm-3" htmlFor="ethAmount">AVAIL BALANCE:</label>
                                    <div className="col-sm-9">
                                        <input type="number" className="form-control" id="inptEthBalance" placeholder="AVAIL AMOUNT" value={this.state.avail_amount} disabled />
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label className="control-label col-sm-3" htmlFor="token101">RECIPIENT ADDRESS:</label>
                                    <div className="col-sm-9">
                                        <input type="text" className="form-control" id="inptReceiverAddress" placeholder="Receiver Address" onChange={this.onReceiverAddress}/>
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label className="control-label col-sm-3" htmlFor="token101">AMOUNT TO SEND:</label>
                                    <div className="col-sm-9">
                                        <input type="number" className="form-control" id="inptQtyToSend" placeholder="Amount to Send" onChange={this.onSendAmount}/>
                                    </div>
                                </div>
                                <div className="form-group text-center" style={{ paddingTop: "25px" }}>
                                    <button type="button" className="btn btn-success" style={{ minWidth: "80px" }} onClick={this.sendToken}>Send</button>
                                </div>
                            </div>
                        </div>
                        <div id="tabReceiveCoin" className="tab-pane fade" style={{ paddingTop: "30px" }}>
                            <a data-toggle="tab" href="#tabAccounts" className="btn btn-primary" style={{ minWidth: "80px" }}> {"<< Go Back"}</a>

                            <h3 className="w3-center" style={{ padding: "30px" }}>Receive Coin</h3>
                            <div className="form-horizontal">
                                <div className="form-group">
                                    <label className="control-label col-sm-3" htmlFor="walletAddress">ETH Wallet Address:</label>
                                    <div className="col-sm-9">
                                        <input type="text" className="form-control" id="inptMyWalletAddress" placeholder="My Ether Wallet Address" value={this.state.ether_address} readOnly="readOnly" />
                                    </div>
                                </div>
                                <div className="form-group text-center" style={{ paddingTop: "25px" }}>
                                    <CopyToClipboard text={this.state.ether_address}>
                                        <button className="btn btn-primary copy-button" data-clipboard-action="copy" data-clipboard-target="#inptMyWalletAddress" >Click me</button>
                                    </CopyToClipboard>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="modal fade" id="modalAddToken" role="dialog">
                <div className="modal-dialog">

                    <div className="modal-content">
                        <div className="modal-header">
                            <button type="button" className="close" data-dismiss="modal">&times;</button>
                            <h4 className="modal-title">Add Token</h4>
                        </div>
                        <div className="modal-body">
                            <form action="/wallet">
                                <div className="form-group">
                                    <label htmlFor="contractAddress">Please Enter the Contract Address of Token which you want to add:</label>
                                    <input type="text" className="form-control" id="inptContractAddress" onChange={this.onContractAddress} />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="tokenSymbol">Please Enter the Symbol of your Token:</label>
                                    <input type="text" className="form-control" id="inptTokenSymbol" onChange={this.onTokenSymbol} />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="tokenDecimal">Please Input the Decimal of your Token:</label>
                                    <input type="text" className="form-control" id="inptTokenDecimal" onChange={this.onTokenDecimal} />
                                </div>
                                <div className="form-group" style={{ paddingBottom: "15px" }}>
                                    <button type="submit" className="btn btn-default w3-right" onClick={this.addToken} style={{
                                        width: "40px",
                                        height: "20px",
                                        borderRadius: "4px",
                                        paddingLeft: "11px",
                                        paddingTop: "5px",
                                        letterSpacing: "0",
                                        fontSize: "14px"
                                    }}>OK</button>
                                </div>
                            </form>
                        </div>
                    </div>

                </div>
            </div>
            <Footer />
        </div>
    )
}
}

export default Wallet;