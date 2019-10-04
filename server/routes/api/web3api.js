var Web3 = require('web3')
var web3 = new Web3(new Web3.providers.HttpProvider('https://mainnet.infura.io/v3/d92bb372bbe0423a89aabbf883491237'));
var util = require('ethereumjs-util');
const Account = require('../../models/Account');
const Token = require('../../models/Token');
const History = require('../../models/History');
var Tx = require('ethereumjs-tx');
var Request = require('request');
const apikey = "M7JA5HWZHCTBN8JMYE5YBQVE3TWZRA6VIE";
const uri = "https://api.etherscan.io/";
const abi = require('../abi.json');
var BigNumber = require('bignumber.js');
const stripHexPrefix = require('strip-hex-prefix');

var gasPriceGlobal = new BigNumber(450000);

var contractObj = [];

var contract_address = [];


Token.find({}, (error, tokens) => {
    if(error) throw error;
    else{
        tokens.map((token, index) => {
            contract_address[index] = token.contract_address;
            console.log(token.contract_address);
        });
        contract_address.map((address, index) => {
            var contract = new web3.eth.Contract(abi, address);

            var item = {
                obj: contract,
                address: address
            }
            contractObj.push(item);
        })
    }
});


module.exports = (app) => {
    app.post('/api/web3/createAccount', (req, res, next) => {
        const { body } = req;
        const { email } = body;
        var account = web3.eth.accounts.create();
        var new_account = new Account();
        new_account.email = email;
        new_account.address = account.address;
        new_account.save((err, user) => {
            console.log(user);
            if (err) {
                console.log(err)
                return res.send({
                    success: false,
                    message: "Error: fail to create user"
                });
            }
            else {
                return res.send({
                    success: true,
                    address: account.address,
                    privateKey: account.privateKey,
                    register_date: user.register_date
                });
            }
        });
    });

    app.post('/api/web3/privToAddress', (req, res, next) => {
        const { body } = req;
        const { privKey } = body;
        const { email } = body;
        const privateKey = util.toBuffer(privKey)
        var address = util.privateToAddress(privateKey);
        var new_account = new Account();
        new_account.email = email;
        new_account.address = util.bufferToHex(address);
        new_account.save((err, user) => {
            if (err) {
                return res.send({
                    success: false,
                    message: "Server Error",
                });
            }
            else {
                return res.send({
                    success: true,
                    address: new_account.address,
                    register_date: user.register_date
                });
            }
        });
    });

    app.post('/api/account/getAccounts', (req, res, next) => {
        
        const { body } = req;
        const { email } = body;

        Account.find({ email: email }, (err, result) => {
            if (err) {
                return res.send({
                    success: false,
                    message: "server Error"
                });
            }
            else {
                return res.send({
                    success: true,
                    accounts: result
                });
            }
        });
    });

    app.post("/api/account/getBalance", (req, res, next) => {
        const { body } = req;
        const { address } = body;
        
        return res.send({
            success: true,
            balance: web3.eth.getBalance(address),
        });
    });

    app.post("/api/account/getTokens", (req, res, next) => {
        const { body } = req;
        const { address } = body;
        var tokens_buf = [];
        Token.find({address: address}, (err, tokens) => {
            if(err){
                return res.send({
                    success: false,
                })
            } else {
                console.log(tokens);
                var contract_buf;
                tokens_buf = tokens;
                tokens.map(async function(token, index){
                    contractObj.map((contract, index1) =>{
                        if(contract.contract_address == token.contract_address){
                            contract_buf = contract.obj;
                        }
                    });

                    if(contract_buf == null){
                        contract_buf = new web3.eth.Contract(abi, token.contract_address);
                        contractObj.push({
                                address: token.contract_address,
                                obj: contract_buf,
                        });
                    }
                    await contract_buf.methods.balanceOf(address).call()
                    .then(function(result){
                        var amount = new BigNumber(result);
                        var balance = parseFloat(amount) / (10**token.decimal);
                        tokens_buf[index].balance = balance;
                    })
                    if(index == tokens.length - 1){
                        console.log(tokens_buf)
                        return res.send({
                            success: true,
                            tokens: tokens_buf
                        })
                    }
                    else {
                        return res.send({
                            success: false,
                            message: "No tokens"
                        })
                    }
                })
            }
        });
    })

    app.post('/api/account/addToken', (req, res, next) => {
        const { body } = req;
        const { address, contractAddress, symbol, decimal } = body;
        var token = new Token();
        token.address = address;
        token.contract_address = contractAddress;
        token.symbol = symbol;
        token.decimal = decimal;

        var contract_buf;

        contractObj.map((contract, index) =>{
            if(contract.contract_address == contractAddress){
                contract_buf = contract.obj;
            }
        });

        if(contract_buf == null){
            contract_buf = new web3.eth.Contract(abi, contractAddress);
            contractObj.push({
                    address: contractAddress,
                    obj: contract_buf,
            });
        }

        if(contract_buf){
            contract_buf.methods
            .balanceOf(address).call().then(function(result){
                var amount = new BigNumber(result);
                var balance = amount / (10**decimal);
                token.balance = balance;
                console.log(balance.toString());

                token.save((err, tokens) => {
                    if (err) {
                        return res.send({
                            success: false,
                            message: "Server Error",
                        });
                    }
                    else {
                        return res.send({
                            success: true,
                            token: tokens,
                        });
                    }
                });
            })
        }

    });

    app.post("/api/web3/sendEther", async function(req, res, next) {
        const { body } = req;
        const { from_address, to_address, amount, private_key } = body;
        console.log(body);


        var privateKeyStr = stripHexPrefix(private_key);
        //privateKey = new Buffer(privateKey, 'hex');
        const privateKey = Buffer.from(privateKeyStr, 'hex');

        var nonce = await web3.eth
        .getTransactionCount(from_address)
        .catch(error =>
          res.send({
            status: false,
            msg: 'Error occurred in getting transaction count!'
          })
        );
        var gasPriceWeb3 = await web3.eth.getGasPrice();
        var gasPrice = new BigNumber(gasPriceGlobal);

        if (gasPrice.isLessThan(gasPriceWeb3)) gasPrice = gasPriceWeb3;

        console.log('nonce - ' + nonce);
        var txParams = {
            nonce: web3.utils.toHex(nonce),
            from: from_address,
            to: to_address,
            gasPrice: web3.utils.toHex(gasPrice),
            gasLimit: web3.utils.toHex(450000),
            value: web3.utils.toHex(amount*(10**18)),
        };

        console.log(txParams);

        var tx = new Tx(txParams);
        tx.sign(util.toBuffer(privateKey));

        var serializedTx = tx.serialize();

        var sent = false;
        web3.eth
            .sendSignedTransaction(`0x${serializedTx.toString('hex')}`)
            .on('transactionHash', hash => {
                console.log(hash);
                var history = new History();
                history.address = from_address;
                history.hash = hash;
                history.save();
                //balance = parseFloat(balance) - parseFloat(amount);
                return res.send({
                    success: true,
                })
            })
            .on('receipt', receipt => {
                // we should persist these to keep a papertrail.
                console.log('withdraw receipt', receipt);
            })
            .on('error', err => {
                console.log('withdraw err', err);
                if (!sent) return res.send({ status: false, msg: err.message });
            });
    });

    app.post('/api/web3/sendToken', async function(req, res, next) {
        const { body } = req;
        const { from_address, contract_address, to_address, amount, private_key } = body;

        var privateKeyStr = stripHexPrefix(private_key);
        const privateKey = Buffer.from(privateKeyStr, 'hex');
        var contract_buf;
        contractObj.map((contract, index) =>{
            if(contract.contact_address == contract_address){
                contract_buf = contract.obj;
            }
        });

        var amountFee = (web3.utils.toWei(amount.toString())).toString();
        console.log('amount - ' + amountFee)

        var txData = contract_buf.methods
        .transfer(to_address, "" + amountFee)
        .encodeABI();
        
        var nonce = await web3.eth
        .getTransactionCount(from_address)
        .catch(error =>
          res.send({
            status: false,
            msg: 'Error occurred in getting transaction count!'
          })
        );

        var gasPriceWeb3 = await web3.eth.getGasPrice();
        var gasPrice = new BigNumber(gasPriceGlobal);

        if (gasPrice.isLessThan(gasPriceWeb3)){
            gasPrice = gasPriceWeb3;
        }

        var txParams = {
            nonce: web3.utils.toHex(nonce),
            from: from_address,
            to: contract_buf._address,
            gasPrice: web3.utils.toHex(gasPrice),
            gasLimit: web3.utils.toHex(450000),
            value: '0x00',
            data: txData,
            chainId: 3
        };

        var tx = new Tx(txParams);
        tx.sign(privateKey);

        var serializedTx = tx.serialize();

        var sent = false;
        web3.eth
            .sendSignedTransaction(`0x${serializedTx.toString('hex')}`)
            .on('transactionHash', hash => {
                console.log(hash)
                var history = new History();
                history.address = from_address;
                history.hash = hash;
                history.save();
                //balance = parseFloat(balance) - parseFloat(amount);
                return res.send({
                    success: true,
                    hash: hash
                })
            })
            .on('receipt', receipt => {
                // we should persist these to keep a papertrail.
                console.log(receipt)
                return res.send({
                    success: true,
                    hash: receipt.transactionHash
                })
            })
            .on('error', err => {
                console.log(err)
                return res.send({
                    success: false,
                    hash: err
                })
            });
    })

    app.post("/api/web3/getTransactionHistory", (req, res, next) => {
        const { body } = req;
        const { address } = body;
        console.log(address);

        History.find({address: address}).sort({_id: -1}).exec(function(err, result) {
            if(err) {
                return res.send({
                    success: false,
                    err: err
                })
            }
            console.log(result)
            return res.send({
                success: true,
                history: result
            })
        })
    });
}

