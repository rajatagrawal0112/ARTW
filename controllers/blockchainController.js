const { compareSync } = require("bcryptjs");
const userServices = require("../services/userServices");
const blockchainServices = require("../services/blockchainServices");
const { mail } = require('../helper/mailer');
const { balanceMainBNB, coinBalanceBNB, BNBTransfer, CoinTransfer, AdminCoinTransfer } = require('../helper/bscHelper');
const { balanceMainETH, ETHTransfer } = require('../helper/ethHelper');

const signupReward = '50';
const referReward = '10';
const coinFees = '1';
const adminAddress = '0x4e5e18E73783fe6b0f4D086384D20ae8d728a1a2';

const createWallet = async (req, res) => {
    let err_msg = req.flash('err_msg');
    let success_msg = req.flash('success_msg');
    let passphrase = "";
    let test = req.session.is_user_logged_in;
    if (test != true) {
        res.redirect('/login');
    }
    else {
        let passphraseNew = await blockchainServices.createWallet();
        if (passphraseNew) {
            passphrase = passphraseNew;
        }
        res.render('front/dash-private-key', { err_msg, success_msg, passphrase, layout: false, session: req.session });
    }
}

const verifyWallet = async (req, res) => {
    let user_passphrase = req.body.passphrase;
    let err_msg = req.flash('err_msg');
    let success_msg = req.flash('success_msg');
    let test = req.session.is_user_logged_in;
    if (test != true) {
        res.redirect('/Login');
    } else {
        res.render('front/verify-private-key', { err_msg, success_msg, user_passphrase, layout: false, session: req.session });
    }
}

const submitWallet = async (req, res) => {
    let user_id = req.session.re_us_id;
    let user_passphrase = req.body.passphrase.trim();
    let check_passphrase = req.body.check_key.trim();
    let hash = await blockchainServices.createHash(user_passphrase);
    if (user_passphrase == check_passphrase) {
        let created = await userServices.createAtTimer();
        let address = await blockchainServices.checkWalletPrivate(user_passphrase);
        let UserwalletData = await blockchainServices.userWalletEntry(user_id, address, hash, created);
        if (UserwalletData) {
            let user = await userServices.checkUserId(user_id);
            // if (user.ref_from) {
            //     await AdminCoinTransfer(address, referReward);
            //     let userRefer = await userServices.checkUserReferCode(user.ref_from);
            //     let subject = 'Referral bonus credited.'
            //     let text = 'Hello ' + user.email + ',<br><br>\n\n' +
            //         'Congratulations we have credited your ARTW account by 10 ARTW (worth US$10) as your friend signed up using your referral code!<br><br>\n\n' +
            //         'Earn more ARTW by referring your friends and stand a chance to win exclusive ARTW NFTs !!' + '<br><br>\n\n' + 'Regards,<br>\nTheArtW Team<br>\nhttps://theartwcoin.com';
            //     await mail(user.email, subject, text);
            //     let userReferred = await userServices.checkUserWallet(userRefer._id);
            //     let referAddress = userReferred.wallet_address;
            //     let hashObject = await AdminCoinTransfer(referAddress, referReward);
            //     if (hashObject) {
            //         await userServices.refUpdate(user.ref_code, user.ref_from);
            //     }
            // }
            await AdminCoinTransfer(address, signupReward);
            let userwallet = await blockchainServices.userWalletFindWallet(address);
            await blockchainServices.importWalletEntry(user_id, userwallet._id, created);
            res.redirect('/Create-wallet-success?wallet=' + Buffer.from(address).toString('base64'));
        }
        else {
            req.flash('err_msg', 'Something went wrong.');
            res.redirect('/Create-wallet-dash');
        }

        // Importwallet.find({ 'user_id': user_id, 'login_status': 'login', '_id': { '$ne': doc1._id } }, function (err, doc) {
        //     if (err) {
        //         req.flash('err_msg', 'Something went wrong.');
        //         res.redirect('/Create-wallet');
        //     }
        //     else {
        //         if (doc != "" && doc != undefined) {
        //             Importwallet.updateMany({ 'user_id': user_id, '_id': { '$ne': doc1._id } }, { $set: { login_status: 'logout' } }, { upsert: true }, function (err, result) {
        //                 if (err) { console.log(err); }
        //                 else { console.log('login status update successfully.'); }
        //             });
        //         }
        //     }
        // });    
    }
    else {
        res.redirect('/verify-key');
    }
}

const sendCoin = async (req, res) => {
    let user_id = req.session.re_us_id;
    let test = req.session.is_user_logged_in;
    let otp = Math.floor(Math.random() * 900000) + 100000;
    let wallet_id = req.body.get_wallet_id.trim();
    // let user_correct_passphrese = req.body.user_cr_pass.trim();
    let entered_passphrese = req.body.passphrase.trim();
    let sender_address = req.body.sender_address.trim();
    let type = req.body.type.trim();
    let reciver_address = req.body.reciver_address.trim();
    let get_amount = req.body.amount_send.trim();
    let hashnew = await blockchainServices.createHash(entered_passphrese);
    if (test != true) {
        res.redirect('/login');
    }
    else {
        let balance = await blockchainServices.getCoinBalance(sender_address);
        if (balance < parseInt(coinFees)) {
            req.flash('err_msg', "Insufficient ARTW fees In Your account.");
            res.redirect('/Send-artw?walletid=' + wallet_id + '&type=' + type);
        }
        if (type == 'eth') {
            balance = await balanceMainETH(sender_address);
        }
        else if (type == 'bnb') {
            balance = await balanceMainBNB(sender_address);
        }
        if (balance >= get_amount) {
            if (hashnew == hashnew) {
                var send_obj = {
                    type: type,
                    sender_address: sender_address,
                    get_amount: get_amount,
                    reciver_address: reciver_address,
                    sender_private_key: entered_passphrese,
                    wallet_id: wallet_id
                }
                req.session.send_obj = send_obj;
                await userServices.updateUserOTP(user_id, otp);
                let subject = 'OTP for withdrawing funds.'
                let text = 'Hello ' + req.session.re_usr_email + ',<br><br>\n\n' +
                    'Your one-time password (OTP) for withdrawal is: <strong>' + otp +
                    '</strong><br><br>\n\n' + 'This would be valid for only for the next 10 minutes<br><br>\n\n' +
                    'If this withdrawal attempt was not made by you it means someone visited your account. It may be an indication you have been the target of a phishing attempt and might want to consider moving your funds to a new wallet.' + '<br><br>\n\n' + 'Regards,<br>\nTheArtW Team<br>\nhttps://theartwcoin.com';
                await mail(req.session.re_usr_email, subject, text);
                res.redirect('/verify_2fa');
            }
            else {
                req.flash('err_msg', 'Please enter valid passphrase.');
                res.redirect('/Send-artw?walletid=' + wallet_id + '&type=' + type);
            }
        }
        else {
            req.flash('err_msg', "Insufficient " + type + " In Your account.");
            res.redirect('/Send-artw?walletid=' + wallet_id + '&type=' + type);
        }
    }
}

const verify2fa = async (req, res) => {
    let err_msg = req.flash('err_msg');
    let success_msg = req.flash('success_msg');
    res.render('front/verify-2fa', { err_msg, success_msg, layout: false, session: req.session });
}

const send2fa = async (req, res) => {
    let user_otp = req.body.otp;
    let email = req.session.re_usr_email;
    let result = await userServices.checkUser(email);
    if (result) {
        // if(result.auth === '2fa'){
        //     console.log(result);
        //     secret_code = result.qr_secret;
        //     console.log('Secret code - - - - ',secret_code)
        //     var verified = speakeasy.totp.verify({ 
        //     secret: secret_code,
        //     encoding: 'base32',
        //     token: user_otp 
        //     });
        //     console.log("verified" +verified);
        //     if (verified==false) {
        //     req.flash('err_msg', 'Your verification code is incorrect.');
        //     res.redirect('/verify_secret')
        //     }
        //     else{
        //     var user_id = req.session.re_us_id;
        //     var send_obj = req.session.send_obj;
        //     var sender_address = send_obj.sender_address;
        //     var get_amount = send_obj.get_amount;
        //     var reciver_address = send_obj.reciver_address;
        //     var privateKey = Buffer.from(send_obj.sender_private_key, 'hex');
        //     var wallet_id = send_obj.wallet_id;
        //     console.log('9')
        //     var user1 = tokenContractABI;
        //     var tokenContract = new web3js.eth.Contract(user1, "0xb1b370178BfCe52Db662fbEF0AF0EE7DDB2f5719");
        //     web3js.eth.getTransactionCount(sender_address).then(function (v) {
        //         console.log("Count: " + v);
        //         count = v;
        //         var amount = get_amount;
        //         var array_donation = [];
        //         var rawTransaction = {
        //             "from": sender_address,
        //             "gasPrice": '0x0',
        //             "gasLimit": web3js.utils.toHex(4600000),
        //             "to": '0xb1b370178BfCe52Db662fbEF0AF0EE7DDB2f5719',
        //             "value": "0x0",
        //             "data": tokenContract.methods.transferAndDonateTo(reciver_address, amount * Math.pow(10, 7), array_donation, '0x5Cb3c2f2fD2502723841728C9771bB4E41A156eE').encodeABI(),
        //             "nonce": web3js.utils.toHex(count)
        //         }
        //         // console.log(rawTransaction);
        //         var transaction = new Tx(rawTransaction);
        //         transaction.sign(privateKey);
        //         web3js.eth.sendSignedTransaction('0x' + transaction.serialize().toString('hex'), (err, hash) => {
        //             if (err)
        //             {
        //                 console.log('10')
        //                 console.log(hash);
        //                 req.flash('err_msg', "Insufficient funds In Your account.");
        //                 res.redirect('/Send-artw?walletid=' + wallet_id);
        //             }
        //             else{
        //                 console.log('11')
        //                 var created_at = new Date();
        //                 Tokendetails.count(function (err, respcount) {
        //                     var count_val = parseFloat(respcount) + parseFloat(1);
        //                     var TokendetailsData = new Tokendetails({
        //                         auto: count_val,
        //                         user_id: user_id,
        //                         wallet_id: wallet_id,
        //                         sender_wallet_address: sender_address,
        //                         receiver_wallet_address: reciver_address,
        //                         hash: hash,
        //                         amount: get_amount,
        //                         payment_status: 'pending',
        //                         created_at: created_at,
        //                         status: 'active',
        //                         token_type: 'ARTW',
        //                         transaction_type: 'Send'
        //                     });
        //                     TokendetailsData.save(function (err, doc) {
        //                         if (err) {
        //                             console.log('token data is not save.');
        //                         } else {
        //                             var test = "";
        //                             var requestLoop = setInterval(function () {
        //                                 check_tx_status(doc.hash, doc._id, function (err, respo, next) {
        //                                     console.log('fri' + respo);
        //                                     if (respo == "tx success") {
        //                                         clearInterval(requestLoop); // stop the interval
        //                                         req.flash('success_msg', 'Your transaction is proposed and waiting for confirmation.');
        //                                         res.redirect('/Transaction-history');
        //                                     }
        //                                     else {
        //                                         console.log(respo + "inside else");
        //                                     }
        //                                 });
        //                             }, 100);
        //                         }
        //                     });
        //                 });
        //             }
        //         }).on('transactionHash');
        //     });
        //     }
        // }
        // else{
        if (result.otp === user_otp) {
            let user_id = req.session.re_us_id;
            let send_obj = req.session.send_obj;
            let wallet_id = send_obj.wallet_id;
            let type = send_obj.type;
            let sender_address = send_obj.sender_address;
            let get_amount = send_obj.get_amount;
            let reciver_address = send_obj.reciver_address;
            let sender_private_key = send_obj.sender_private_key;
            let hashObject;
            if (type == 'eth') {
                hashObject = await ETHTransfer(reciver_address, get_amount, sender_address, sender_private_key);
                await CoinTransfer(adminAddress, coinFees, sender_address, sender_private_key);
                type = 'ETH';
            }
            else if (type == 'bnb') {
                hashObject = await BNBTransfer(reciver_address, get_amount, sender_address, sender_private_key);
                let hashObject2 = await CoinTransfer(adminAddress, coinFees, sender_address, sender_private_key);
                type = 'BNB';
            }
            else if (type == 'artw') {
                hashObject = await CoinTransfer(reciver_address, get_amount, sender_address, sender_private_key);
                type = 'ARTW';
            }
            if (hashObject) {
                let hash = hashObject.transactionHash;
                await blockchainServices.addTransaction(user_id, wallet_id, sender_address, reciver_address, hash, get_amount, type);
                req.flash('success_msg', 'Your transaction is proposed and waiting for confirmation.');
                res.redirect('/Transaction-history');
            }
            else {
                req.flash('err_msg', 'Something went wrong.');
                res.redirect('/Send-artw?walletid=' + wallet_id + '&type=' + type.toLowerCase());
            }
        }
        else {
            req.flash('err_msg', 'Your OTP is incorrect.');
            res.redirect('/verify_2fa')
        }
        // }
    }
    else {
        req.flash('err_msg', 'Something went wrong.');
        res.redirect('/Send-artw?walletid=' + wallet_id + '&type=' + type.toLowerCase());
    }
}

module.exports = {
    createWallet,
    verifyWallet,
    submitWallet,
    sendCoin,
    verify2fa,
    send2fa
};