var express = require('express');
var router = express.Router();
const fs = require('fs');
const nodemailer = require('nodemailer');
const request = require('request');
const crypto = require('crypto');
const auth = require('../config/auth');
const bip39 = require('bip39');
const web3 = require('web3');
const qr = require('qr-image');
const Tx = require('ethereumjs-tx');
const speakeasy = require('speakeasy');
const QRCode = require('qrcode');
const moment = require('moment');
const userServices = require("../services/userServices");
const userControllers = require('../controllers/userControllers');
const blockchainController = require('../controllers/blockchainController');
const blockchainServices = require("../services/blockchainServices");
const { calculateHours } = require('../helper/userHelper');
const { balanceMainBNB, coinBalanceBNB } = require('../helper/bscHelper');
const { balanceMainETH, coinBalanceETH } = require('../helper/ethHelper');
const { mail } = require('../helper/mailer');

const { Registration, Userwallet, Importwallet, Tokensettings, Tokendetails, OrderDetails, RefCode, FAQ, ContactInfo } = require('../models/contact');

var isUser = auth.isUser;

//************ to get user data on header using session **********//
router.use(userControllers.sessionHeader);


//***************** get  **************//
router.get('/', userControllers.landingPage);


//***************** get logout **************//
router.get('/Logout', userControllers.logout);


//***************** get signup **************//
router.get('/Signup', userControllers.signupPage);


//***************** get signup **************//
router.get('/login', userControllers.loginPage);


/***************** get forgot pass **************/
router.get('/Forgot-password', userControllers.forgotPage);


//***************** verify email **************// 
router.get('/Verify_account', userControllers.verifyPage);


//***************** post forgot pass **************//
router.post('/submit-forgot', userControllers.submitForgot);


//***************** post signup **************//
router.post('/submit_registration', userControllers.submitUser);


//***************** post login **************//
router.post('/submit-login', userControllers.userLogin);


//***************** post login **************//
router.post('/Verify_account', userControllers.verifyUser);


//***************** get create wallet **************//
router.get('/Create-wallet', isUser, blockchainController.createWallet);


/***************** get verfify key **************/
router.post('/Verify-key', isUser, blockchainController.verifyWallet);


//***************** post create wallet **************//
router.post('/submit-create-wallet', isUser, blockchainController.submitWallet);


//***************** get dashboard **************//
router.get('/dashboard', isUser, userControllers.dashboard);


//***************** get referral-table*************//
router.get('/referral-table', isUser, userControllers.referral);


//***************** post send artw **************//
router.post('/Submit-send-artw', isUser, blockchainController.sendCoin);


//***************** get verify tx **************//
router.get('/verify_2fa', blockchainController.verify2fa);


//***************** post verify tx **************//
router.post('/verify_tfa', blockchainController.send2fa);


//***************** get Wallet-success **************//
router.get('/Create-wallet-success', userControllers.walletSuccess);


router.get('/get-tx', userControllers.gettx);


router.post('/users-by-date', userControllers.gettxdate);


router.post('/refs-by-date', userControllers.getrefdate);


router.post('/get-email', userControllers.getrefemail);


router.get('/sale', function (req, res) {
  res.render('front/sale');
});


//***************** get Wallet-success **************//
router.get('/Create-wallet-dash', isUser, function (req, res) {
  res.render('front/create-wallet');
});


router.get('/comingsoon', function (req, res) {
  res.render('front/comingsoon');
});


router.get('/terms-conditions', function (req, res) {
  res.render('front/terms-condition');
});

router.get('/faq', async (req, res) => {
  let rates = await userServices.getRates();
  if (rates) {
      res.render('front/faq', {
          token_values: rates
      });
  }
  else {
      res.render('front/comingsoon');
  }
});

router.get('/blogs', async function (req, res) {
  let rates = await userServices.getRates();
  if (rates) {
      res.render('front/blogs', {
          token_values: rates
      });
  }
  else {
      res.render('front/comingsoon');
  }
});

router.get('/blog-detail', async function (req, res) {
  let rates = await userServices.getRates();
  if (rates) {
      res.render('front/blog-details', {
          token_values: rates
      });
  }
  else {
      res.render('front/comingsoon');
  }
});

router.get('/team-members', async function (req, res) {
  let rates = await userServices.getRates();
  if (rates) {
      res.render('front/team-members', {
          token_values: rates
      });
  }
  else {
      res.render('front/comingsoon');
  }
});

router.get('/crypto-guide', async function (req, res) {
  let rates = await userServices.getRates();
  if (rates) {
      res.render('front/crypto', {
          token_values: rates
      });
  }
  else {
      res.render('front/comingsoon');
  }
});

router.get('/privacy-policy', async function (req, res) {
  let rates = await userServices.getRates();
  if (rates) {
      res.render('front/privacy', {
          token_values: rates
      });
  }
  else {
      res.render('front/comingsoon');
  }
});

router.get('/cookie-policy', async function (req, res) {
  let rates = await userServices.getRates();
  if (rates) {
      res.render('front/cookie', {
          token_values: rates
      });
  }
  else {
      res.render('front/comingsoon');
  }
});

// router.get('/email', async function (req, res) {
//   await mail ('lokeshmaheshwari@questglt.com', 'test', 'text');
//   res.redirect('/');
// });

router.post('/contact_us', (req, res, next) => {
  var name = req.body.name.trim();
  var email = req.body.email.trim();
  // var number = req.body.number.trim();
  var message = req.body.message.trim();
  var created_at = new Date();
  var contact = new ContactInfo({
    name: name,
    email: email,
    // number: number,
    message: message,
    created_at: created_at
  })

  contact.save().then(conres => {
    req.flash('success', 'Message sent successfully.')
    res.redirect('/')
    // res.send({success:"true",failure:"false"});

  })
    .catch(err => {
      req.flash('error', 'Message not sent, please try again.')
      res.redirect('/');
      // res.send({success:"false",failure:"Message not sent, please try again."});
    })
});


router.post('/Wallet-logout', function (req, res) {
  var wallet_id = req.body.wallet_id.trim();
  var user_id = req.session.re_us_id;
  Importwallet.update({ '_id': wallet_id }, { $set: { login_status: 'logout' } }, { upsert: true }, function (err, response) {
    if (err) { console.log(err); res.send('error'); }
    else {
      // console.log(response.nModified); 
      if (response.nModified != "" && response.nModified > 0) {
        res.send('success');
      }
    }
  });
});


//***************** get recive-rowan **************//
router.get('/receive-artw', isUser, function (req, res) {
  err_msg = req.flash('err_msg');
  success_msg = req.flash('success_msg');
  var walletid = req.query.walletid;
  var test = req.session.is_user_logged_in;
  if (test != true) {
    res.redirect('/Login');
  } else {
    Userwallet.findOne({ '_id': walletid }, function (err, response) {
      if (err) { console.log('Something is worng to find login status.') }
      else {
        if (response != "" && response != undefined) {
          let walletdetails = response;
          let qr_txt = walletdetails.wallet_address;
          var qr_png = qr.imageSync(qr_txt, { type: 'png' })
          let qr_code_file_name = new Date().getTime() + '.png';
          fs.writeFileSync('./public/wallet_qr_image/' + qr_code_file_name, qr_png, (err) => {
            if (err) { console.log(err); }
          });
          res.render('front/receive', { err_msg, success_msg, walletdetails, qr_code_file_name, layout: false, session: req.session });
        }
      }
    });
  }
});


//***************** get import-wallet **************//
router.get('/Import-wallet', isUser, function (req, res) {
  err_msg = req.flash('err_msg');
  success_msg = req.flash('success_msg');
  var test = req.session.is_user_logged_in;
  if (test != true) {
    res.redirect('/login');
  } else {
    res.render('front/import-private-key', { err_msg, success_msg, layout: false, session: req.session, });
  }
});

/***************** post submit-create-wallet **************/
router.post('/submit-import', isUser, function (req, res) {
  var user_id = req.session.re_us_id;
  var Passphrase = req.body.Passphrase.trim();
  var hash1 = crypto.createHash('sha256').update(Passphrase).digest('base64');
  Userwallet.findOne({ 'passphrase': hash1 }, function (err, doc) {
    if (err) {
      console.log('Something went wrong.');
    }
    else {
      if (doc != "" && doc != undefined) {
        Importwallet.findOne({ 'wallet_id': doc._id, 'user_id': user_id }, function (err, doc1) {
          if (err) {
            console.log(err);
          }
          else {
            if (doc1 != "" && doc1 != undefined) {

              if (doc1.login_status == 'logout') {
                Importwallet.updateOne({ 'user_id': user_id, 'wallet_id': doc1.wallet_id }, { $set: { login_status: 'login' } }, { upsert: true }, function (err, result) {
                  if (err) { console.log(err); }
                  else {
                    console.log('login status update successfully.');
                    Importwallet.find({ 'user_id': user_id, 'login_status': 'login', '_id': { '$ne': doc1._id } }, function (err, doc4) {
                      if (err) { console.log('Something is worng to find login status.') }
                      else {
                        if (doc4 != "" && doc4 != undefined) {
                          Importwallet.updateMany({ 'user_id': user_id, '_id': { '$ne': doc1._id } }, { $set: { login_status: 'logout' } }, { upsert: true }, function (err, result) {
                            if (err) { console.log(err); }
                            else {
                              console.log('login status update successfully2.');
                            }
                          });
                        }
                      }
                    });

                    req.flash('success_msg', 'Your wallet is successfully Imported.');
                    res.redirect('/Import-wallet-success?wallet=' + Buffer.from(doc.wallet_address).toString('base64'));

                  }
                });
              }
              else {
                req.flash('success_msg', 'Your wallet is already Imported.');
                console.log('wallet is already login');
                res.redirect('/Import-wallet-success?wallet=' + Buffer.from(doc.wallet_address).toString('base64'))
              }

            }
            else {


              var indiaTime = new Date().toLocaleString("en-US", { timeZone: "Europe/London" });
              var indiaTime = new Date(indiaTime);
              var created_at = indiaTime.toLocaleString();



              var ImportwalletData1 = new Importwallet({
                user_id: user_id,
                wallet_id: doc._id,
                login_status: 'login',
                created_at: created_at,
                status: 'active',
                deleted: '0'
              });
              ImportwalletData1.save(function (err, doc2) {
                if (err) {
                  req.flash('err_msg', 'Something went wrong.');
                  res.redirect('/Create-wallet');
                } else {
                  Importwallet.find({ 'user_id': user_id, 'login_status': 'login', '_id': { '$ne': doc2._id } }, function (err, doc3) {
                    if (err) { console.log('Something is worng to find login status.') }
                    else {
                      if (doc3 != "" && doc3 != undefined) {
                        Importwallet.updateMany({ 'user_id': user_id, '_id': { '$ne': doc2._id } }, { $set: { login_status: 'logout' } }, { upsert: true }, function (err, result) {
                          if (err) { console.log(err); }
                          else { console.log('login status update successfully2.'); }
                        });
                      }
                    }
                  });

                  req.flash('success_msg', 'Your wallet is successfully Imported.');
                  console.log("wallet import successfully for this user");
                  res.redirect('/Import-wallet-success?wallet=' + Buffer.from(doc.wallet_address).toString('base64'));
                }
              });
            }
          }
        });
      }
      else {
        req.flash('err_msg', 'Please enter valid passphrase.');
        res.redirect('/Import-wallet');
      }
    }
  });
});

//***************** get Wallet-success **************//
router.get('/Import-wallet-success', isUser, function (req, res) {
  err_msg = req.flash('err_msg');
  success_msg = req.flash('success_msg');
  var wallet_address = "";

  var test = req.session.is_user_logged_in;
  if (test != true) {
    res.redirect('/Login');
  } else {
    if (req.query.wallet) {
      wallet_address = Buffer.from(req.query.wallet, 'base64').toString('ascii');

    } else {
      wallet_address = "";
    }

    res.render('front/wallet-import-success', { err_msg, success_msg, wallet_address, layout: false, session: req.session, });
  }
});



//***************** get profile **************//
router.get('/profile', isUser, function (req, res) {
  err_msg = req.flash('err_msg');
  success_msg = req.flash('success_msg');
  var test = req.session.is_user_logged_in;

  if (test != true) {
    res.redirect('/Login');
  } else {
    var user_id = req.session.re_us_id;
    Registration.findOne({ '_id': user_id }, function (err, result) {
      if (err) {
        console.log("Something went wrong");
      }
      else {
        // res.send(result);
        res.render('front/profile', { err_msg, success_msg, result, layout: false, session: req.session, });
      }
    });
  }
});


//***************** post update profile **************//
router.post('/update-profile', isUser, function (req, res) {
  let user_id = req.session.re_us_id;
  let name = req.body.name.trim();
  let email = req.body.email.trim();
  let mob = req.body.mob.trim();

  Registration.update({ _id: user_id }, { $set: { name: name, email: email, mobile_no: mob } }, { upsert: true }, function (err, result) {
    if (err) {
      console.log("Something went wrong");
      req.flash('err_msg', 'Something went wrong, please try again.');
      res.redirect('/profile')
    } else {
      req.flash('success_msg', 'Profile updated successfully.');
      res.redirect('/profile')
    }
  });
});


//***************** get changes password **************//
router.get('/change-password', isUser, function (req, res) {
  var test = req.session.is_user_logged_in;
  if (test != true) {
    res.redirect('/Login');
  } else {
    err_msg = req.flash('err_msg');
    success_msg = req.flash('success_msg');
    res.render('front/change_password', { err_msg, success_msg, layout: false, session: req.session, })
  }
});


//***************** post changes password **************//
router.post('/profile/submit-change-pass',isUser, function (req, res) {
  var user_id = req.session.re_us_id;
  var old_pass = req.body.old_pass;
  var mystr1 = userServices.createCipher(old_pass);
  const new_pass = req.body.new_pass;
  Registration.find({ '_id': user_id, 'password': mystr1 }, function (err, result) {
    if (err) {
      req.flash('err_msg', 'Something is worng');
      res.redirect('/change-password');
    } else {
      if (result.length > 0 && result.length == 1) {
        const newpassCipher =  userServices.createCipher(new_pass);
        if (mystr1 != newpassCipher) {
          // console.log(result);
          Registration.updateOne({ _id: user_id }, { $set: { password: newpassCipher } }, { upsert: true }, function (err) {
            if (err) {
              req.flash('err_msg', 'Something went wrong.');
              res.redirect('/change-password');
            } else {
              req.flash('success_msg', 'Password changed successfully.');
              res.redirect('/profile');
            }
          });
        }
        else {
          req.flash('err_msg', 'New password can not be same as current password.');
          res.redirect('/change-password');
        }
      }
      else {
        req.flash('err_msg', 'Please enter correct current password.');
        res.redirect('/change-password');
      }
    }
  });
});


//***************** get Send-rowan **************//
router.get('/Send-artw', isUser, async function (req, res) {
  let err_msg = req.flash('err_msg');
  let success_msg = req.flash('success_msg');
  let walletid = req.query.walletid;
  let type = req.query.type;
  let test = req.session.is_user_logged_in;

  let rates = await userServices.getRates();
  let usdValue = rates.usdValue;
  let etherValue = rates.etherValue;
  let bnbValue = rates.bnbValue;
  let value;

  if (test != true) {
    res.redirect('/login');
  } else {
    const walletdetails = await Userwallet.findOne({ '_id': walletid });

    if (walletdetails) {
      let coinbalance

      if (type == 'eth') {
        coinbalance = await balanceMainETH(walletdetails.wallet_address);
        value = 1 / etherValue;
      }
      else if (type == 'bnb') {
        coinbalance = await balanceMainBNB(walletdetails.wallet_address);
        value = 1 / bnbValue;
      }
      else if (type == 'artw') {
        coinbalance = await coinBalanceBNB(walletdetails.wallet_address);
        value = 1 / usdValue;
      }
      value = Math.round(value * 100)/100;
      res.render('front/send-artw', { err_msg, success_msg, walletdetails, layout: false, session: req.session, coinbalance, type, walletid, value });
    }
    else {
      console.log("somethig went wrong with login status")
    }


  }
});


router.get('/create-2fa', function (req, res) {
  err_msg = req.flash('err_msg');
  success_msg = req.flash('success_msg');
  var test = req.session.is_user_logged_in;
  console.log(test)
  secret_code = req.body.secret_code;
  dataURL = req.body.dataURL;
  res.render('front/create-2fa', { err_msg, success_msg, layout: false, session: req.session, secret_code, dataURL });
});



router.post('/submit_create_2fa', function (req, res) {
  var user_token = req.body.authcode;
  var secret_code = req.body.secret_code;
  var dataURL = req.body.dataURL;
  console.log("-----------req.body ", req.body);
  var verified = speakeasy.totp.verify({
    secret: secret_code,
    encoding: 'base32',
    token: user_token
  });
  console.log("============verified ", verified);
  if (verified == false) {
    console.log("if");
    err_msg = 'The Verification code is  incorrect.';
    success_msg = '';
    res.render('front/create-2fa', { err_msg, success_msg, layout: false, session: req.session, secret_code, dataURL })
  }
  else {
    Registration.update({ _id: req.session.re_us_id }, {
      $set: {
        dataURL: dataURL,
        qr_secret: secret_code,
        qr_status: 'pending',
      }
    }).then(doc => {
      console.log("-----------doc ", doc);
      console.log("-----------req.session.send_obj ", req.session.send_obj);

      var user_id = req.session.re_us_id;
      var send_obj = req.session.send_obj;
      var sender_address = send_obj.sender_address;
      var get_amount = send_obj.get_amount;
      var reciver_address = send_obj.reciver_address;
      var privateKey = Buffer.from(send_obj.sender_private_key, 'hex');
      var wallet_id = send_obj.wallet_id;
      console.log('9')
      var user1 = tokenContractABI;
      var tokenContract = new web3js.eth.Contract(user1, "0xb1b370178BfCe52Db662fbEF0AF0EE7DDB2f5719");
      web3js.eth.getTransactionCount(sender_address).then(function (v) {
        console.log("Count: " + v);
        count = v;
        var amount = get_amount;
        var array_donation = [];
        var rawTransaction = {
          "from": sender_address,
          "gasPrice": '0x0',
          "gasLimit": web3js.utils.toHex(4600000),
          "to": '0xb1b370178BfCe52Db662fbEF0AF0EE7DDB2f5719',
          "value": "0x0",
          "data": tokenContract.methods.transferAndDonateTo(reciver_address, amount * Math.pow(10, 7), array_donation, '0x5Cb3c2f2fD2502723841728C9771bB4E41A156eE').encodeABI(),
          "nonce": web3js.utils.toHex(count)
        }
        // console.log(rawTransaction);
        var transaction = new Tx(rawTransaction);
        transaction.sign(privateKey);
        web3js.eth.sendSignedTransaction('0x' + transaction.serialize().toString('hex'), (err, hash) => {
          if (err) {
            console.log('10')
            console.log(hash);
            req.flash('err_msg', "Insufficient funds In Your account.");
            res.redirect('/Send-artw?walletid=' + wallet_id);
          }
          else {
            console.log('11')
            var created_at = new Date();
            Tokendetails.count(function (err, respcount) {
              var count_val = parseFloat(respcount) + parseFloat(1);
              var TokendetailsData = new Tokendetails({
                auto: count_val,
                user_id: user_id,
                wallet_id: wallet_id,
                sender_wallet_address: sender_address,
                receiver_wallet_address: reciver_address,
                hash: hash,
                amount: get_amount,
                payment_status: 'pending',
                created_at: created_at,
                status: 'active',
                token_type: 'ARTW',
                transaction_type: 'Send'
              });
              TokendetailsData.save(function (err, doc) {
                if (err) {
                  console.log('token data is not save.');
                } else {
                  var test = "";
                  var requestLoop = setInterval(function () {
                    check_tx_status(doc.hash, doc._id, function (err, respo, next) {
                      console.log('fri' + respo);
                      if (respo == "tx success") {
                        clearInterval(requestLoop); // stop the interval
                        req.flash('success_msg', 'Your transaction in done.');
                        res.redirect('/Transaction-history');
                      }
                      else {
                        console.log(respo + "inside else");
                      }
                    });
                  }, 100);
                }
              });
            });
          }
        }).on('transactionHash');
      });

    })
      .catch(err => {
        console.log(err);
      })
  }
});


router.get('/verify_2fa', function (req, res) {
  err_msg = req.flash('err_msg');
  success_msg = req.flash('success_msg');
  res.render('front/verify-2fa', { err_msg, success_msg, layout: false, session: req.session, })
});


router.get('/verify_secret', function (req, res) {
  err_msg = req.flash('err_msg');
  success_msg = req.flash('success_msg');
  res.render('front/verify-secret', { err_msg, success_msg, layout: false, session: req.session, })
});


//***************** get Transaction-history **************//
router.get('/Transaction-history', isUser, function (req, res) {
  err_msg = req.flash('err_msg');
  success_msg = req.flash('success_msg');
  var user_id = req.session.re_us_id;
  var test = req.session.is_user_logged_in;
  if (test != true) {
    res.redirect('/login');
  } else {

    var user_id = req.session.re_us_id;
    Importwallet.findOne({ 'user_id': user_id, 'login_status': 'login' }, function (err, loginwallet) {
      if (err) {
        console.log("Something went wrong");
      }
      else {



        Tokendetails.find({ 'payment_status': 'pending' }, async function (err, response) {
          if (response != "" && response != null && response != undefined) {
            for (var i = 0; i < response.length; i++) {
              console.log(response.length);
              await blockchainServices.checkTxStatus(response);
            }
          }
          else {
            console.log('no record found.');
          }

        });


        //***************** get update ransaction status **************//





        if (loginwallet != "" && loginwallet != null && loginwallet != undefined) {
          Userwallet.findOne({ '_id': loginwallet.wallet_id }, function (err, addresponse) {
            if (err) { console.log('Something is worng to Token details.') }
            else {
              var user_wallet = addresponse.wallet_address;

              Tokendetails.find({ $or: [{ 'receiver_wallet_address': addresponse.wallet_address }, { 'sender_wallet_address': addresponse.wallet_address }] }).sort([['auto', -1]]).exec(function (err, response) {

                if (err) { console.log('Something is worng to Token details.') }
                else {
                  
                  var all_transaction = response;
                  res.render('front/transaction-table', { err_msg, success_msg, user_wallet, all_transaction, address: addresponse.wallet_address, layout: false, session: req.session, moment });

                }
              });
            }
          });

        } else {
          var user_wallet = "";
          var all_transaction = "";
          res.render('front/transaction-table', { err_msg, success_msg, user_wallet, all_transaction, layout: false, session: req.session, moment });
        }
      }
    });
  }
});


router.get('/buy', isUser, async function (req, res) {
  error = req.flash('err_msg');
  success = req.flash('success_msg');
  var test = req.session.is_user_logged_in;
  if (test != true) {
    res.redirect('/Login');
  } else {
    var user_id = req.session.re_us_id;
    let btcresult = await Tokensettings.findOne()
    var btc = btcresult.btcValue;
    var eth = btcresult.etherValue;
    Importwallet.findOne({ 'user_id': user_id, 'login_status': 'login' }, function (err, loginwallet) {
      if (err) {
        console.log("Something went wrong");
      }
      else {
        if (loginwallet != "" && loginwallet != undefined) {
          Userwallet.findOne({ '_id': loginwallet.wallet_id }, function (err, result) {
            if (err) { console.log("Something went wrong"); }
            else {
              wallet_details = result;
              import_wallet_id = loginwallet._id;
              let wallet_creation = result.created_at;
              let indiaTime = new Date().toLocaleString("en-US", { timeZone: "Europe/London" });
              indiaTime = new Date(indiaTime);
              let today = indiaTime.toLocaleString();
              let wallet_time_difference = calculateHours(new Date(wallet_creation), new Date(today));
              let rown_bal = coinBalanceBNB(wallet_details.wallet_address);
              res.render('front/token', { error, success, wallet_details, btc, eth, import_wallet_id, rown_bal, layout: false, session: req.session, crypto })
            }
          });
        }
        else {
          req.flash('err_msg', 'Sorry!, please import or create a wallet first.');
          res.redirect('/dashboard');
        }
      }
    })
  }
});


router.get('/buy_bitcoin', isUser, function (req, res) {
  error = req.flash('err_msg');
  success = req.flash('success_msg');
  var user_id = req.session.re_us_id;
  Tokensettings.findOne().then(btcresult => {
    var rwn = btcresult.btcValue;
    Importwallet.findOne({ 'user_id': user_id, 'login_status': 'login' }, function (err, loginwallet) {
      if (err) {
        console.log("Something went wrong");
      }
      else {
        if (loginwallet != "" && loginwallet != undefined) {
          Userwallet.findOne({ '_id': loginwallet.wallet_id }, function (err, result) {
            if (err) { console.log("Something went wrong"); }
            else {
              var wallet_address = result.wallet_address;
              res.render('front/buy-bitcoin', { error, success, wallet_address, user_id, rwn });
            }
          })
        }
      }
    })
  })
});


router.get('/buy_ethereum', isUser, function (req, res) {
  // var error ="";
  // var success = "";
  error = req.flash('err_msg');
  success = req.flash('success_msg');
  var user_id = req.session.re_us_id;
  Tokensettings.findOne().then(btcresult => {
    var rwn = btcresult.etherValue;
    Importwallet.findOne({ 'user_id': user_id, 'login_status': 'login' }, function (err, loginwallet) {
      if (err) {
        console.log("Something went wrong");
      }
      else {
        if (loginwallet != "" && loginwallet != undefined) {
          Userwallet.findOne({ '_id': loginwallet.wallet_id }, function (err, result) {
            if (err) { console.log("Something went wrong"); }
            else {
              var wallet_address = result.wallet_address;
              res.render('front/buy-ethereum', { error, success, wallet_address, user_id, rwn });
            }
          })
        }
      }
    })
  })
});


router.get('/buy_ripple', isUser, function (req, res) {
  error = req.flash('err_msg');
  success = req.flash('success_msg');
  var user_id = req.session.re_us_id;
  Tokensettings.findOne().then(btcresult => {
    var rwn = btcresult.xrpValue;
    Importwallet.findOne({ 'user_id': user_id, 'login_status': 'login' }, function (err, loginwallet) {
      if (err) {
        console.log("Something went wrong");
      }
      else {
        if (loginwallet != "" && loginwallet != undefined) {
          Userwallet.findOne({ '_id': loginwallet.wallet_id }, function (err, result) {
            if (err) { console.log("Something went wrong"); }
            else {
              var wallet_address = result.wallet_address;
              res.render('front/buy-ripple', { error, success, wallet_address, user_id, rwn });
            }
          })
        }
      }
    })
  })
});


router.get('/buy_litecoin', isUser, function (req, res) {
  error = req.flash('err_msg');
  success = req.flash('success_msg');
  var user_id = req.session.re_us_id;
  Tokensettings.findOne().then(btcresult => {
    var rwn = btcresult.ltcValue;
    Importwallet.findOne({ 'user_id': user_id, 'login_status': 'login' }, function (err, loginwallet) {
      if (err) {
        console.log("Something went wrong");
      }
      else {
        if (loginwallet != "" && loginwallet != undefined) {
          Userwallet.findOne({ '_id': loginwallet.wallet_id }, function (err, result) {
            if (err) { console.log("Something went wrong"); }
            else {
              var wallet_address = result.wallet_address;
              res.render('front/buy-litecoin', { error, success, wallet_address, user_id, rwn });
            }
          })
        }
      }
    })
  })
});


router.get('/buy_dash', isUser, function (req, res) {
  error = req.flash('err_msg');
  success = req.flash('success_msg');
  var user_id = req.session.re_us_id;
  Tokensettings.findOne().then(btcresult => {
    var rwn = btcresult.dashValue;
    Importwallet.findOne({ 'user_id': user_id, 'login_status': 'login' }, function (err, loginwallet) {
      if (err) {
        console.log("Something went wrong");
      }
      else {
        if (loginwallet != "" && loginwallet != undefined) {
          Userwallet.findOne({ '_id': loginwallet.wallet_id }, function (err, result) {
            if (err) { console.log("Something went wrong"); }
            else {
              var wallet_address = result.wallet_address;
              res.render('front/buy-dash', { error, success, wallet_address, user_id, rwn });
            }
          })
        }
      }
    })
  })
});



router.post('/BTC', isUser, async (req, res) => {
  // const form = formidable({ multiples: true });
  // form.parse(req, async (err, fields, files) => {
  // if (err) {
  //   next(err);
  //   return;
  // }
  var imageFile = req.files;
  console.log("fields========== ", req.body);
  var image;
  if (!imageFile) {
    image = ""
  } else {
    image = req.files.image.name;
  }
  var user_id = req.body.user_id;
  var rwn_count = req.body.artw;
  var rowan_rate = await Tokensettings.findOne({});
  var rate_per_rwn = rowan_rate.btcValue;
  console.log("------------BTC ", rate_per_rwn);
  var total_amnt = (rwn_count) * (rate_per_rwn);
  console.log("-----------Total amount ", total_amnt);
  console.log(total_amnt);
  var sender_wallet_address = req.body.bit_wallet_address;
  var trnsaction_Id = req.body.transaction_id;
  var rwn_wallet_address = req.body.wallet_address;
  var payment_type = "BTC";
  var created_at = new Date();
  const order = new OrderDetails({
    user_id: user_id,
    rwn_count: rwn_count,
    rate_per_rwn: rate_per_rwn,
    total_amnt: total_amnt,
    trnsaction_Id: trnsaction_Id,
    rwn_wallet_address: rwn_wallet_address,
    sender_wallet_address: sender_wallet_address,
    image: image,
    payment_type: payment_type,
    created_at: created_at
  })
  order.save().then(result => {
    // var imgpath = 'public/tx_proof/'+ image;
    // let testFile = fs.readFileSync(req.files.image.path);
    // let testBuffer = new Buffer(testFile);
    // fs.writeFile(imgpath, testBuffer, function (err) {
    //   if (err) return console.log(err);
    //   console.log('Hello World > helloworld.txt');
    // });
    req.flash("success_msg", "Thankyou!, Request has been sent successfully and you will get the ARTW in your account after your payment verification.");
    res.redirect('/buy');
  })
    .catch(err => {
      console.log("error", err);
      req.flash("err_msg", "Sorry!, we were unable to send your data, please try one more time.");
      res.redirect('/buy');
    })
  // })    
})



router.post('/ETH', isUser, async function (req, res) {
  // const form = formidable({ multiples: true });
  // form.parse(req, (err, fields, files) => {
  //     if (err) {
  //       console.log("------------err---------- ",err);
  //     }
  console.log("Hello from ETH");
  console.log("fields========== ", req.body);
  var user_id = req.body.user_id;
  var rwn_count = req.body.artweth;
  Tokensettings.findOne({}).then(rowan_rate => {
    var rate_per_rwn = rowan_rate.etherValue;
    // var rate_per_rwn = req.body.rate_per_rowan;
    console.log("------------ETH ", rate_per_rwn);
    var total_amnt = (rwn_count) * (rate_per_rwn);
    console.log("-----------Total amount ", total_amnt);
    console.log(total_amnt);
    var sender_wallet_address = req.body.eth_wallet_address_eth;
    var trnsaction_Id = req.body.transaction_id;
    var rwn_wallet_address = req.body.wallet_address;
    var imageFile = req.files;
    var image;
    if (!imageFile) {
      image = ""
    } else {
      image = req.files.image.name;
    }
    var payment_type = "ETH";
    var created_at = new Date();

    const order = new OrderDetails({
      user_id: user_id,
      rwn_count: rwn_count,
      rate_per_rwn: rate_per_rwn,
      total_amnt: total_amnt,
      trnsaction_Id: trnsaction_Id,
      rwn_wallet_address: rwn_wallet_address,
      sender_wallet_address: sender_wallet_address,
      image: image,
      payment_type: payment_type,
      created_at: created_at
    })
    order.save()
      .then(result => {
        // var imgpath = 'public/tx_proof/'+ image;
        // let testFile = fs.readFileSync(req.files.image.path);
        // let testBuffer = new Buffer(testFile);
        // fs.writeFile(imgpath, testBuffer, function (err) {
        // if (err) return console.log(err);
        // console.log('Hello World > helloworld.txt');
        // });
        req.flash("success_msg", "Thankyou!, Request has been sent successfully and you will get the ARTW in your account after your payment verification.");
        res.redirect('/buy');
      })
      .catch(err => {
        console.log("-----------err--------------- ", err);
        req.flash("err_msg", "Sorry!, we were unable to send your data, please try one more time.");
        res.redirect('/buy');
      })
  }).catch(err1 => {

  })

  // })    
})



router.post('/XRP', isUser, async (req, res) => {
  // const form = formidable({ multiples: true });
  // form.parse(req, async (err, fields, files) => {
  // if (err) {
  //   next(err);
  //   return;
  // }
  var imageFile = req.files;
  console.log("fields========== ", req.body);
  var image;
  if (!imageFile) {
    image = ""
  } else {
    image = req.files.image.name;
  }
  var user_id = req.body.user_id;
  var rwn_count = req.body.rowan;
  var rowan_rate = await Tokensettings.findOne({});
  var rate_per_rwn = rowan_rate.xrpValue;
  console.log("------------XRP ", rate_per_rwn);
  var total_amnt = (rwn_count) * (rate_per_rwn);
  console.log("-----------Total amount ", total_amnt);
  console.log(total_amnt);
  var sender_wallet_address = req.body.bit_wallet_address;
  var trnsaction_Id = req.body.transaction_id;
  var rwn_wallet_address = req.body.wallet_address;
  var payment_type = "XRP";
  var created_at = new Date();
  const order = new OrderDetails({
    user_id: user_id,
    rwn_count: rwn_count,
    rate_per_rwn: rate_per_rwn,
    total_amnt: total_amnt,
    trnsaction_Id: trnsaction_Id,
    rwn_wallet_address: rwn_wallet_address,
    sender_wallet_address: sender_wallet_address,
    image: image,
    payment_type: payment_type,
    created_at: created_at
  })
  order.save().then(result => {
    // var imgpath = 'public/tx_proof/'+ image;
    // let testFile = fs.readFileSync(req.files.image.path);
    // let testBuffer = new Buffer(testFile);
    // fs.writeFile(imgpath, testBuffer, function (err) {
    //   if (err) return console.log(err);
    //   console.log('Hello World > helloworld.txt');
    // });
    req.flash("success_msg", "Thankyou!, Request has been sent successfully and you will get the ARTW in your account after your payment verification.");
    res.redirect('/buy_ripple');
  })
    .catch(err => {
      console.log("error", err);
      req.flash("err_msg", "Sorry!, we were unable to send your data, please try one more time.");
      res.redirect('/buy_ripple');
    })
  // })    
})

router.post('/LTC', isUser, async (req, res) => {
  // const form = formidable({ multiples: true });
  // form.parse(req, async (err, fields, files) => {
  // if (err) {
  //   next(err);
  //   return;
  // }
  var imageFile = req.files;
  console.log("fields========== ", req.body);
  var image;
  if (!imageFile) {
    image = ""
  } else {
    image = req.files.image.name;
  }
  var user_id = req.body.user_id;
  var rwn_count = req.body.rowan;
  var rowan_rate = await Tokensettings.findOne({});
  var rate_per_rwn = rowan_rate.ltcValue;
  console.log("------------LTC ", rate_per_rwn);
  var total_amnt = (rwn_count) * (rate_per_rwn);
  console.log("-----------Total amount ", total_amnt);
  console.log(total_amnt);
  var sender_wallet_address = req.body.bit_wallet_address;
  var trnsaction_Id = req.body.transaction_id;
  var rwn_wallet_address = req.body.wallet_address;
  var payment_type = "LTC";
  var created_at = new Date();
  const order = new OrderDetails({
    user_id: user_id,
    rwn_count: rwn_count,
    rate_per_rwn: rate_per_rwn,
    total_amnt: total_amnt,
    trnsaction_Id: trnsaction_Id,
    rwn_wallet_address: rwn_wallet_address,
    sender_wallet_address: sender_wallet_address,
    image: image,
    payment_type: payment_type,
    created_at: created_at
  })
  order.save().then(result => {
    // var imgpath = 'public/tx_proof/'+ image;
    // let testFile = fs.readFileSync(req.files.image.path);
    // let testBuffer = new Buffer(testFile);
    // fs.writeFile(imgpath, testBuffer, function (err) {
    //   if (err) return console.log(err);
    //   console.log('Hello World > helloworld.txt');
    // });
    req.flash("success_msg", "Thankyou!, Request has been sent successfully and you will get the ARTW in your account after your payment verification.");
    res.redirect('/buy_litecoin');
  })
    .catch(err => {
      console.log("error", err);
      req.flash("err_msg", "Sorry!, we were unable to send your data, please try one more time.");
      res.redirect('/buy_litecoin');
    })
  // })    
})

router.post('/Dash', isUser, async (req, res) => {
  // const form = formidable({ multiples: true });
  // form.parse(req, async (err, fields, files) => {
  // if (err) {
  //   next(err);
  //   return;
  // }
  var imageFile = req.files;
  console.log("fields========== ", req.body);
  var image;
  if (!imageFile) {
    image = ""
  } else {
    image = req.files.image.name;
  }
  var user_id = req.body.user_id;
  var rwn_count = req.body.rowan;
  var rowan_rate = await Tokensettings.findOne({});
  var rate_per_rwn = rowan_rate.dashValue;
  console.log("------------Dash ", rate_per_rwn);
  var total_amnt = (rwn_count) * (rate_per_rwn);
  console.log("-----------Total amount ", total_amnt);
  console.log(total_amnt);
  var sender_wallet_address = req.body.bit_wallet_address;
  var trnsaction_Id = req.body.transaction_id;
  var rwn_wallet_address = req.body.wallet_address;
  var payment_type = "DASH";
  var created_at = new Date();
  const order = new OrderDetails({
    user_id: user_id,
    rwn_count: rwn_count,
    rate_per_rwn: rate_per_rwn,
    total_amnt: total_amnt,
    trnsaction_Id: trnsaction_Id,
    rwn_wallet_address: rwn_wallet_address,
    sender_wallet_address: sender_wallet_address,
    image: image,
    payment_type: payment_type,
    created_at: created_at
  })
  order.save().then(result => {
    // var imgpath = 'public/tx_proof/'+ image;
    // let testFile = fs.readFileSync(req.files.image.path);
    // let testBuffer = new Buffer(testFile);
    // fs.writeFile(imgpath, testBuffer, function (err) {
    //   if (err) return console.log(err);
    //   console.log('Hello World > helloworld.txt');
    // });
    req.flash("success_msg", "Thankyou!, Request has been sent successfully and you will get the ARTW in your account after your payment verification.");
    res.redirect('/buy_dash');
  })
    .catch(err => {
      console.log("error", err);
      req.flash("err_msg", "Sorry!, we were unable to send your data, please try one more time.");
      res.redirect('/buy_dash');
    })
  // })    
})

router.post('/verification_type', async function (req, res) {
  let wallet_id = req.body.wallet_id;
  let userUpdate = await Registration.findOne({ _id: wallet_id });
  res.send(userUpdate);
})


router.post('/change_verification_type', async function (req, res) {
  let user_id = req.body.user_id;
  let factor = req.body.factor;
  await Registration.updateOne({ _id: user_id }, { $set: { auth: factor } });
  let userValue = await Registration.findOne({ _id: user_id });
  res.send(userValue);
})



module.exports = router;
